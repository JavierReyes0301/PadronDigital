// js/gestion-padron-vigente.js

// Obtiene el año actual del sistema automáticamente
const ANIO_ACTUAL = new Date().getFullYear();

let mapaGirosVigentes = {};

document.addEventListener("DOMContentLoaded", async () => {
  // Actualizamos cualquier texto en el HTML que deba mostrar el año vigente
  actualizarTextosInterfaz();
  await inicializarFiltrosVigentes();
});

/**
 * Busca elementos con la clase 'anio-dinamico' y les pone el año actual
 */
function actualizarTextosInterfaz() {
  const elementos = document.querySelectorAll(".anio-dinamico");
  elementos.forEach((el) => (el.textContent = ANIO_ACTUAL));
}

// ... (Las funciones inicializarFiltrosVigentes y actualizarLineas se mantienen igual)

/**
 * Ejecuta la consulta filtrada siempre basada en el año actual del sistema
 */
async function Consultar() {
  const contenedor = document.getElementById("contenedor-resultados-vigentes");

  // Feedback visual consistente con el Historial
  contenedor.innerHTML = `
        <div class="text-center my-5">
            <div class="spinner-border spinner-personalizado" role="status"></div>
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
    // La clave aquí es el uso de ANIO_ACTUAL dinámico
    let query = window.clientSupa
      .from("proveedores")
      .select("*")
      .eq("anio_registro", ANIO_ACTUAL) // Se actualiza solo cada año
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
    contenedor.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
  }
}

function mostrarTablaVigente(datos) {
  const contenedor = document.getElementById("contenedor-resultados-vigentes");

  if (datos.length === 0) {
    contenedor.innerHTML = `
            <div class="alert alert-info text-center">
                No hay proveedores validados para el ejercicio <span class="anio-dinamico">${ANIO_ACTUAL}</span>.
            </div>`;
    return;
  }

  let html = `
        <h4 class="mb-3 text-secondary">Proveedores Vigentes <span class="anio-dinamico">${ANIO_ACTUAL}</span> (${datos.length})</h4>
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
