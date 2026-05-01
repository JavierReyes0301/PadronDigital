// js/gestion-historial.js

let mapaDatosGiros = {};

/**
 * Inicialización al cargar el DOM
 */
document.addEventListener("DOMContentLoaded", async () => {
  await cargarGirosParaFiltros();

  // Forzar que los inputs de texto siempre sean mayúsculas
  document.querySelectorAll(".InputMayus").forEach((input) => {
    input.addEventListener("input", (e) => {
      e.target.value = e.target.value.toUpperCase();
    });
  });
});

/**
 * Función auxiliar para extraer el número de una cadena (ej. "Giro 10" -> 10)
 */
function extraerNumero(texto) {
  return parseInt(texto.replace(/\D/g, "")) || 0;
}

/**
 * Carga los giros y líneas con orden numérico consecutivo
 */
async function cargarGirosParaFiltros() {
  const selectGiro = document.getElementById("SelectGiro");

  try {
    const { data, error } = await window.clientSupa
      .from("giros_lineas")
      .select("id_giro, nombre_giro, linea, descripcion");

    if (error) throw error;

    mapaDatosGiros = {};
    data.forEach((fila) => {
      if (!mapaDatosGiros[fila.id_giro]) {
        mapaDatosGiros[fila.id_giro] = { nombre: fila.nombre_giro, lineas: [] };
      }
      mapaDatosGiros[fila.id_giro].lineas.push({
        nombre: fila.linea,
        desc: fila.descripcion,
      });
    });

    // Ordenar IDs de giros de forma numérica (1, 2, 10, 19...)
    const idsOrdenados = Object.keys(mapaDatosGiros).sort((a, b) => {
      return extraerNumero(a) - extraerNumero(b);
    });

    idsOrdenados.forEach((id) => {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = `${id} ${mapaDatosGiros[id].nombre}`;
      selectGiro.appendChild(opt);
    });
  } catch (err) {
    manejarError(err, "contenedor-resultados");
  }
}

/**
 * Actualiza el select de líneas según el giro seleccionado (con orden L1, L2...)
 */
function actualizarLineas() {
  const giroId = document.getElementById("SelectGiro").value;
  const selectLinea = document.getElementById("LineaSel");

  selectLinea.innerHTML = '<option value="0">Seleccione...</option>';

  if (giroId === "0") {
    selectLinea.disabled = true;
    return;
  }

  const lineas = mapaDatosGiros[giroId].lineas;

  // Ordenar líneas numéricamente
  const lineasOrdenadas = lineas.sort((a, b) => {
    return extraerNumero(a.nombre) - extraerNumero(b.nombre);
  });

  lineasOrdenadas.forEach((l) => {
    const opt = document.createElement("option");
    opt.value = l.nombre;
    opt.textContent = `${l.nombre} - ${l.desc}`;
    selectLinea.appendChild(opt);
  });
  selectLinea.disabled = false;
}

/**
 * Traduce los errores técnicos de Supabase a mensajes en español
 */
function manejarError(err, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  let mensaje = "Ocurrió un error inesperado.";

  const msg = err.message.toLowerCase();
  if (msg.includes("column"))
    mensaje = "Error: Una de las columnas consultadas no existe.";
  else if (msg.includes("relation") || msg.includes("find the table"))
    mensaje = "Error: No se pudo conectar con la tabla de datos en Supabase.";
  else if (msg.includes("network"))
    mensaje = "Error de red: Verifique su conexión.";
  else mensaje = `Error: ${err.message}`;

  contenedor.innerHTML = `<div class="alert alert-danger">${mensaje}</div>`;
  console.error("Detalle técnico:", err);
}

/**
 * Función principal de Consulta (Botón BUSCAR)
 */
async function Consultar() {
  const contenedor = document.getElementById("contenedor-resultados");
  contenedor.innerHTML = `
    <div class="text-center my-5">
      <div class="spinner-border" style="color: #ab0a3d;" role="status"></div>
      <p class="mt-2" style="color: #ab0a3d; font-weight: bold;">BUSCANDO EN HISTORIAL...</p>
    </div>`;

  const filtros = {
    anio: document.getElementById("Anio").value,
    folio: document.getElementById("Folio").value.trim(),
    rfc: document.getElementById("RFC").value.trim(),
    razon: document.getElementById("RazonSocial").value.trim(),
    comercial: document.getElementById("NombreComercial").value.trim(),
    giro: document.getElementById("SelectGiro").value,
    linea: document.getElementById("LineaSel").value,
  };

  try {
    // IMPORTANTE: Asegúrate de que el nombre de la tabla sea el correcto en Supabase
    let query = window.clientSupa.from("proveedores").select("*");

    if (filtros.anio !== "0") query = query.eq("anio_registro", filtros.anio);
    if (filtros.folio !== "")
      query = query.ilike("folio", `%${filtros.folio}%`);
    if (filtros.rfc !== "") query = query.ilike("rfc", `%${filtros.rfc}%`);
    if (filtros.razon !== "")
      query = query.ilike("razon_social", `%${filtros.razon}%`);
    if (filtros.comercial !== "")
      query = query.ilike("nombre_comercial", `%${filtros.comercial}%`);

    if (filtros.giro !== "0") query = query.eq("id_giro", filtros.giro);
    if (filtros.linea !== "0") query = query.eq("linea", filtros.linea);

    const { data, error } = await query.limit(200);

    if (error) throw error;

    renderizarResultados(data);
  } catch (err) {
    manejarError(err, "contenedor-resultados");
  }
}

/**
 * Genera la tabla de resultados visuales
 */
function renderizarResultados(registros) {
  const contenedor = document.getElementById("contenedor-resultados");

  if (registros.length === 0) {
    contenedor.innerHTML = `
      <div class="alert alert-warning text-center">
        No se encontraron registros históricos con los criterios seleccionados.
      </div>`;
    return;
  }

  let html = `
    <div class="card shadow border-0">
      <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <span>Resultados Históricos</span>
        <span class="badge badge-light text-dark">${registros.length} registros</span>
      </div>
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead style="background-color: #ab0a3d; color: white;">
            <tr>
              <th>Folio</th>
              <th>RFC</th>
              <th>Razón Social / Nombre</th>
              <th>Año</th>
              <th>Estatus</th>
            </tr>
          </thead>
          <tbody>
  `;

  registros.forEach((reg) => {
    const badgeClass =
      reg.estatus === "VALIDADO" || reg.estatus === "ACTIVO"
        ? "badge-success"
        : "badge-secondary";
    html += `
      <tr>
        <td><strong class="text-secondary">${reg.folio || "N/A"}</strong></td>
        <td>${reg.rfc}</td>
        <td>${reg.razon_social || reg.nombre_comercial}</td>
        <td><span class="badge badge-outline-dark">${reg.anio_registro || "-"}</span></td>
        <td><span class="badge ${badgeClass}">${reg.estatus || "REGISTRADO"}</span></td>
      </tr>
    `;
  });

  html += `</tbody></table></div></div>`;
  contenedor.innerHTML = html;
}
