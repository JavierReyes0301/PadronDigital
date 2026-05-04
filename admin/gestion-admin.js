/* ============================================================
   LÓGICA DEL ADMINISTRADOR
   ============================================================ */

async function consultarProveedores() {
  const { data, error } = await supabase
    .from("expedientes_proveedores") // Nombre de tu tabla principal
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener proveedores:", error.message);
    return;
  }

  const tbody = document.getElementById("lista-proveedores-body");
  tbody.innerHTML = "";

  data.forEach((p) => {
    const nombreMostrar =
      p.tipo_persona === "MORAL"
        ? p.razon_social
        : `${p.nombre} ${p.apellido_p}`;

    tbody.innerHTML += `
            <tr>
                <td><span class="badge badge-info">${p.folio}</span></td>
                <td>${p.rfc}</td>
                <td>${nombreMostrar}</td>
                <td>${p.tipo_persona}</td>
                <td>${p.telefono || "N/A"}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-primary" onclick='verDetalleProveedor(${JSON.stringify(p)})'>
                        <i class="fas fa-eye"></i> Ver Detalle
                    </button>
                </td>
            </tr>
        `;
  });
}

async function verDetalleProveedor(p) {
  const modalBody = document.getElementById("detalle-proveedor-content");

  // Generar enlaces a documentos en el Storage de Supabase
  // Nota: El bucket debe llamarse 'expedientes'
  const docs = ["csf", "acta", "domicilio", "ine"];
  let htmlDocs = "";

  for (const doc of docs) {
    // Obtenemos la URL pública o firmada
    const { data } = supabase.storage
      .from("expedientes")
      .getPublicUrl(`${p.rfc}/${doc}.pdf`);

    htmlDocs += `
            <div class="col-md-3 mb-3">
                <div class="card p-2 text-center border-secondary">
                    <i class="fas fa-file-pdf fa-2x text-danger mb-2"></i>
                    <small class="d-block font-weight-bold text-uppercase">${doc.replace("_", " ")}</small>
                    <a href="${data.publicUrl}" target="_blank" class="btn btn-xs btn-outline-primary mt-2">Abrir</a>
                    <a href="${data.publicUrl}" download class="btn btn-xs btn-outline-success mt-1">Descargar</a>
                </div>
            </div>`;
  }

  modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6><strong>Datos Generales</strong></h6>
                <p><b>Folio:</b> ${p.folio}<br><b>RFC:</b> ${p.rfc}<br><b>Tipo:</b> ${p.tipo_persona}</p>
            </div>
            <div class="col-md-6">
                <h6><strong>Datos de Contacto</strong></h6>
                <p><b>Email:</b> ${p.email}<br><b>Teléfono:</b> ${p.telefono}</p>
            </div>
            <hr class="w-100">
            <div class="col-md-12 mb-3">
                <h6><strong>Documentación Adjunta</strong></h6>
                <div class="row">${htmlDocs}</div>
            </div>
        </div>
    `;

  $("#modalDetalle").modal("show");
}

// Inicializar al cargar
document.addEventListener("DOMContentLoaded", consultarProveedores);

// Variable global para mantener el ID del proveedor seleccionado en el modal
let proveedorSeleccionadoId = null;

async function verDetalleProveedor(p) {
  proveedorSeleccionadoId = p.id; // Guardamos el ID para usarlo al enviar observaciones
  const modalBody = document.getElementById("detalle-proveedor-content");

  // ... (Tu lógica anterior para generar el HTML de datos y documentos) ...

  // Al abrir el modal, cargamos las observaciones actuales si existen
  document.getElementById("txt-observaciones-admin").value =
    p.observaciones || "";

  $("#modalDetalle").modal("show");
}

async function enviarObservaciones() {
  const obs = document.getElementById("txt-observaciones-admin").value;

  if (!obs.trim()) {
    alert("Por favor redacte una observación antes de enviar.");
    return;
  }

  const { data, error } = await supabase
    .from("expedientes_proveedores")
    .update({
      observaciones: obs,
      estatus: "CON_OBSERVACIONES", // Cambiamos el estado para alertar al usuario
    })
    .eq("id", proveedorSeleccionadoId);

  if (error) {
    alert("Error al enviar observaciones: " + error.message);
  } else {
    alert("Observaciones enviadas correctamente al usuario.");
    $("#modalDetalle").modal("hide");
    consultarProveedores(); // Refrescar tabla principal
  }
}
async function cargarEstadoPerfil() {
  const userRfc = userData.rfc; // Tomado de tu sesión o contexto actual

  const { data, error } = await supabase
    .from("expedientes_proveedores")
    .select("observaciones, estatus")
    .eq("rfc", userRfc)
    .single();

  const contenedorObs = document.getElementById("Observaciones");

  if (data && data.observaciones) {
    contenedorObs.innerHTML = `
            <div class="alert alert-warning border-left-warning shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                Notas de Revisión (Administración)
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                ${data.observaciones}
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-exclamation-triangle fa-2x text-warning"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
  } else {
    contenedorObs.innerHTML = `<p class="text-muted">Sin observaciones pendientes por el momento.</p>`;
  }
}
