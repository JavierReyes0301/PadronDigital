/**
 * LÓGICA DEL PANEL DE ADMINISTRACIÓN
 */

document.addEventListener("DOMContentLoaded", async () => {
  if (window.clientSupa) {
    await cargarDashboardAdmin();
    configurarFiltrosAdmin();
  }
});

// --- 1. CARGA DE DATOS MAESTRA ---
async function cargarDashboardAdmin() {
  try {
    console.log("📊 Cargando datos de administración...");

    // Traemos todos los proveedores con sus datos básicos
    const { data: proveedores, error } = await window.clientSupa
      .from("proveedores")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    renderizarMetricas(proveedores);
    renderizarTablaProveedores(proveedores);
  } catch (e) {
    console.error("Error Admin:", e.message);
  }
}

// --- 2. RENDERIZADO DE MÉTRICAS ---
function renderizarMetricas(provs) {
  document.getElementById("count-total").innerText = provs.length;
  document.getElementById("count-pendientes").innerText = provs.filter(
    (p) => p.estatus === "PENDIENTE" || !p.estatus,
  ).length;
  document.getElementById("count-validados").innerText = provs.filter(
    (p) => p.estatus === "VALIDADO",
  ).length;
  document.getElementById("count-rechazados").innerText = provs.filter(
    (p) => p.estatus === "RECHAZADO",
  ).length;
}

// --- 3. RENDERIZADO DE TABLA ---
function renderizarTablaProveedores(provs) {
  const tbody = document.getElementById("tabla-proveedores-admin");
  tbody.innerHTML = "";

  provs.forEach((p) => {
    const tr = document.createElement("tr");

    // Determinar color de badge por estatus
    let badgeClass = "badge-secondary";
    if (p.estatus === "VALIDADO") badgeClass = "badge-success";
    if (p.estatus === "RECHAZADO") badgeClass = "badge-danger";
    if (p.estatus === "PENDIENTE") badgeClass = "badge-warning";

    tr.innerHTML = `
            <td><b>${p.rfc || "S/N"}</b></td>
            <td>${p.nombre_comercial || "Sin Nombre"}</td>
            <td>${p.tipo_persona || "---"}</td>
            <td><span class="text-primary">${p.folio || "N/A"}</span></td>
            <td><span class="badge ${badgeClass}">${p.estatus || "PENDIENTE"}</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="verExpedienteAdmin('${p.id}')">
                    <i class="fas fa-eye"></i> Revisar
                </button>
                <button class="btn btn-sm btn-success" onclick="cambiarEstatusProv('${p.id}', 'VALIDADO')">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="cambiarEstatusProv('${p.id}', 'RECHAZADO')">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

// --- 4. ACCIONES DE ADMINISTRADOR ---

// Cambiar estatus rápidamente (Aprobar/Rechazar)
async function cambiarEstatusProv(id, nuevoEstatus) {
  const confirmacion = confirm(
    `¿Estás seguro de cambiar el estatus a ${nuevoEstatus}?`,
  );
  if (!confirmacion) return;

  try {
    const { error } = await window.clientSupa
      .from("proveedores")
      .update({
        estatus: nuevoEstatus,
        revisado_por: "ADMIN_ACTUAL", // Aquí podrías poner el ID del admin logueado
        fecha_revision: new Date(),
      })
      .eq("id", id);

    if (error) throw error;

    alert(`✅ Proveedor actualizado a ${nuevoEstatus}`);
    await cargarDashboardAdmin(); // Recargar datos
  } catch (e) {
    alert("Error al actualizar estatus: " + e.message);
  }
}

// Función para abrir la vista detallada (puedes redirigir o abrir un modal)
function verExpedienteAdmin(id) {
  // Ejemplo: Redirigir a una página de revisión detallada
  window.location.href = `revisar_proveedor.html?id=${id}`;
}

// --- 5. FILTROS ---
function configurarFiltrosAdmin() {
  const inputBusqueda = document.getElementById("busqueda-admin");
  inputBusqueda.addEventListener("keyup", (e) => {
    const texto = e.target.value.toLowerCase();
    const filas = document.querySelectorAll("#tabla-proveedores-admin tr");

    filas.forEach((fila) => {
      const contenido = fila.innerText.toLowerCase();
      fila.style.display = contenido.includes(texto) ? "" : "none";
    });
  });
}
