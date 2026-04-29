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
 * Carga los giros y líneas para que los selectores del buscador funcionen
 */
async function cargarGirosParaFiltros() {
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

    const selectGiro = document.getElementById("SelectGiro");
    Object.keys(mapaDatosGiros).forEach((id) => {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = `Giro ${id}: ${mapaDatosGiros[id].nombre}`;
      selectGiro.appendChild(opt);
    });
  } catch (err) {
    console.error("Error cargando filtros:", err.message);
  }
}

/**
 * Actualiza el select de líneas según el giro seleccionado
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
  lineas.forEach((l) => {
    const opt = document.createElement("option");
    opt.value = l.nombre;
    opt.textContent = `${l.nombre} - ${l.desc}`;
    selectLinea.appendChild(opt);
  });
  selectLinea.disabled = false;
}

/**
 * Función principal de Consulta (Botón BUSCAR)
 */
async function Consultar() {
  const contenedor = document.getElementById("contenedor-resultados");
  contenedor.innerHTML =
    '<div class="text-center my-5"><div class="spinner-border spinner-personalizado" role="status"></div><p class="mt-2" style="color: #ab0a3d; font-weight: bold;">BUSCANDO...</p></div>';

  // Captura de valores
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
    // Iniciamos la query a la tabla de proveedores (ajusta el nombre de la tabla si es distinto)
    let query = window.clientSupa.from("proveedores").select("*");

    // Aplicación dinámica de filtros
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

    const { data, error } = await query.limit(100); // Límite de seguridad

    if (error) throw error;

    renderizarResultados(data);
  } catch (err) {
    contenedor.innerHTML = `<div class="alert alert-danger">Error al consultar: ${err.message}</div>`;
  }
}

/**
 * Genera la tabla de resultados visuales
 */
function renderizarResultados(registros) {
  const contenedor = document.getElementById("contenedor-resultados");

  if (registros.length === 0) {
    contenedor.innerHTML =
      '<div class="alert alert-warning text-center">No se encontraron registros con los criterios seleccionados.</div>';
    return;
  }

  let html = `
        <div class="card shadow">
            <div class="card-header bg-dark text-white">Resultados Encontrados (${registros.length})</div>
            <div class="table-responsive">
                <table class="table table-hover table-striped mb-0">
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
    html += `
            <tr>
                <td><strong>${reg.folio || "N/A"}</strong></td>
                <td>${reg.rfc}</td>
                <td>${reg.razon_social || reg.nombre_comercial}</td>
                <td>${reg.anio_registro || "-"}</td>
                <td><span class="badge ${reg.estatus === "ACTIVO" ? "badge-success" : "badge-secondary"}">${reg.estatus || "REGISTRADO"}</span></td>
            </tr>
        `;
  });

  html += `</tbody></table></div></div>`;
  contenedor.innerHTML = html;
}
