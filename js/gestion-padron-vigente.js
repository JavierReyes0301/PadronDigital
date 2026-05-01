// Obtiene el año actual del sistema automáticamente
const ANIO_ACTUAL = new Date().getFullYear();

// Mapa para guardar la relación entre Giros y sus Líneas
let mapaGirosVigentes = {};

document.addEventListener("DOMContentLoaded", async () => {
  actualizarTextosInterfaz();
  await inicializarFiltrosVigentes();
});

function actualizarTextosInterfaz() {
  const elementos = document.querySelectorAll(".anio-dinamico");
  elementos.forEach((el) => (el.textContent = ANIO_ACTUAL));
}

/**
 * Función auxiliar para extraer el número de una cadena (ej. "Giro 10" -> 10)
 */
function extraerNumero(texto) {
  return parseInt(texto.replace(/\D/g, "")) || 0;
}

/**
 * Carga los giros desde la base de datos y llena el primer select
 */
async function inicializarFiltrosVigentes() {
  const selectGiro = document.getElementById("SelectGiro");

  try {
    const { data, error } = await window.clientSupa
      .from("giros_lineas")
      .select("id_giro, nombre_giro, linea, descripcion");

    if (error) throw error;

    mapaGirosVigentes = {};

    // 1. Agrupamos los datos primero
    data.forEach((item) => {
      if (!mapaGirosVigentes[item.id_giro]) {
        mapaGirosVigentes[item.id_giro] = {
          nombre: item.nombre_giro,
          lineas: [],
        };
      }
      mapaGirosVigentes[item.id_giro].lineas.push({
        valor: item.linea,
        textoCompleto: `${item.linea} ${item.descripcion || ""}`,
      });
    });

    // 2. Ordenamos los IDs de los giros de forma numérica consecutiva
    const idsOrdenados = Object.keys(mapaGirosVigentes).sort((a, b) => {
      return extraerNumero(a) - extraerNumero(b);
    });

    // 3. Llenamos el select de Giros en el orden correcto
    idsOrdenados.forEach((id) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = `${id} ${mapaGirosVigentes[id].nombre}`;
      selectGiro.appendChild(option);
    });
  } catch (err) {
    manejarError(err, "contenedor-resultados-vigentes");
  }
}

/**
 * Llena el select de Líneas y las ordena consecutivamente (L1, L2, L3...)
 */
function actualizarLineas() {
  const idGiro = document.getElementById("SelectGiro").value;
  const selectLinea = document.getElementById("LineaSel");

  selectLinea.innerHTML =
    '<option value="0">-- Seleccione una Línea --</option>';

  if (idGiro === "0") {
    selectLinea.disabled = true;
    return;
  }

  const datosGiro = mapaGirosVigentes[idGiro];
  if (datosGiro && datosGiro.lineas) {
    // Ordenamos las líneas numéricamente antes de mostrarlas
    const lineasOrdenadas = datosGiro.lineas.sort((a, b) => {
      return extraerNumero(a.valor) - extraerNumero(b.valor);
    });

    lineasOrdenadas.forEach((lineaObj) => {
      const option = document.createElement("option");
      option.value = lineaObj.valor;
      option.textContent = lineaObj.textoCompleto;
      selectLinea.appendChild(option);
    });
    selectLinea.disabled = false;
  }
}

/**
 * Traduce los errores técnicos de Supabase a mensajes en español
 */
function manejarError(err, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  let mensaje = "Ocurrió un error inesperado.";

  // Traducción manual de errores comunes de Supabase/PostgreSQL
  if (err.message.includes("column"))
    mensaje = "Error: Una de las columnas consultadas no existe.";
  else if (
    err.message.includes("relation") ||
    err.message.includes("find the table")
  )
    mensaje =
      "Error: No se pudo conectar con la tabla de datos. Verifique la conexión.";
  else if (err.message.includes("network"))
    mensaje = "Error de red: Verifique su conexión a internet.";
  else mensaje = `Error: ${err.message}`;

  contenedor.innerHTML = `<div class="alert alert-danger">${mensaje}</div>`;
  console.error("Detalle técnico del error:", err);
}

/**
 * Ejecuta la consulta filtrada
 */
async function Consultar() {
  const contenedor = document.getElementById("contenedor-resultados-vigentes");

  contenedor.innerHTML = `
        <div class="text-center my-5">
            <div class="spinner-border" style="color: #ab0a3d;" role="status"></div>
            <p class="mt-2" style="color: #ab0a3d; font-weight: bold;">BUSCANDO...</p>
        </div>
    `;

  const params = {
    folio: document.getElementById("Folio").value.trim(),
    rfc: document.getElementById("RFC").value.trim().toUpperCase(),
    razon: document.getElementById("RazonSocial").value.trim().toUpperCase(),
    comercial: document
      .getElementById("NombreComercial")
      .value.trim()
      .toUpperCase(),
    giro: document.getElementById("SelectGiro").value,
    linea: document.getElementById("LineaSel").value,
  };

  try {
    let query = window.clientSupa
      .from("proveedores")
      .select("*")
      .eq("anio_registro", ANIO_ACTUAL)
      .eq("estatus", "VALIDADO");

    if (params.folio) query = query.ilike("folio", `%${params.folio}%`);
    if (params.rfc) query = query.ilike("rfc", `%${params.rfc}%`);
    if (params.razon) query = query.ilike("razon_social", `%${params.razon}%`);
    if (params.comercial)
      query = query.ilike("nombre_comercial", `%${params.comercial}%`);

    if (params.giro !== "0") query = query.eq("id_giro", params.giro);
    if (params.linea !== "0") query = query.eq("linea", params.linea);

    const { data, error } = await query;
    if (error) throw error;

    mostrarTablaVigente(data);
  } catch (err) {
    manejarError(err, "contenedor-resultados-vigentes");
  }
}

function mostrarTablaVigente(datos) {
  const contenedor = document.getElementById("contenedor-resultados-vigentes");

  if (datos.length === 0) {
    contenedor.innerHTML = `
            <div class="alert alert-info text-center">
                No hay proveedores validados para el ejercicio <b>${ANIO_ACTUAL}</b> con esos filtros.
            </div>`;
    return;
  }

  let html = `
        <h4 class="mb-3 text-secondary">Proveedores Vigentes ${ANIO_ACTUAL} (${datos.length})</h4>
        <div class="table-responsive shadow-sm border rounded">
            <table class="table table-striped table-hover bg-white mb-0">
                <thead style="background-color: #ab0a3d; color: white;">
                    <tr>
                        <th>Folio</th>
                        <th>RFC</th>
                        <th>Nombre / Razón Social</th>
                        <th>Giro Principal</th>
                        <th>Vigencia</th>
                    </tr>
                </thead>
                <tbody>
    `;

  datos.forEach((p) => {
    html += `
            <tr>
                <td><span class="badge badge-dark">${p.folio}</span></td>
                <td>${p.rfc}</td>
                <td>${p.razon_social || p.nombre_comercial}</td>
                <td>${p.linea}</td>
                <td><span class="text-success font-weight-bold">VIGENTE ${ANIO_ACTUAL}</span></td>
            </tr>
        `;
  });

  html += "</tbody></table></div>";
  contenedor.innerHTML = html;
}
