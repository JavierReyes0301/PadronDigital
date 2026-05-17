/**
 * LÓGICA DEL PANEL DE ADMINISTRACIÓN COMPLETA - CORREGIDA
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Verificamos sesión antes de cargar nada
  if (window.clientSupa) {
    const {
      data: { session },
    } = await window.clientSupa.auth.getSession();

    if (!session) {
      window.location.href = "index.html";
      return;
    }

    // --- VINCULACIÓN DE EVENTOS DE INTERFAZ ---

    // 1. Botón Cerrar Sesión (Busca el botón con clase btn-logout o ID)
    const btnLogout =
      document.querySelector(".btn-logout") ||
      document.getElementById("btn-logout");
    if (btnLogout) {
      btnLogout.onclick = cerrarSesionAdmin;
    }

    // 2. Botón Flotante Secreto para Gestión de Admins
    const btnSecreto = document.querySelector(".btn-float-secret");
    if (btnSecreto) {
      btnSecreto.onclick = abrirGestionAdmins;
    }

    // 3. Carga inicial de datos
    await cargarDashboardAdmin();
    configurarFiltrosAdmin();
  }
});

// --- 1. CARGA Y RENDERIZADO DE DATOS ---

async function cargarDashboardAdmin() {
  try {
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

function renderizarMetricas(provs) {
  // Actualiza los números en las tarjetas blancas con borde guinda
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

function renderizarTablaProveedores(provs) {
  const tbody = document.getElementById("tabla-proveedores-admin");
  if (!tbody) return;
  tbody.innerHTML = "";

  provs.forEach((p) => {
    // Clases de bootstrap para los badges de estatus
    let badgeClass = "badge-warning";
    if (p.estatus === "VALIDADO") badgeClass = "badge-success";
    if (p.estatus === "RECHAZADO") badgeClass = "badge-danger";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><b>${p.rfc || "S/N"}</b></td>
      <td>${p.nombre_comercial || "Sin Nombre"}</td>
      <td>${p.tipo_persona || "---"}</td>
      <td><span style="color: #ab0a3d; font-weight: 700;">${p.folio || "N/A"}</span></td>
      <td><span class="badge ${badgeClass}">${p.estatus || "PENDIENTE"}</span></td>
      <td>
        <button class="btn btn-sm btn-info btn-admin-action" title="Ver" onclick="verExpedienteAdmin('${p.id}')">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn btn-sm btn-success btn-admin-action" title="Validar" onclick="cambiarEstatusProv('${p.id}', 'VALIDADO')">
          <i class="fas fa-check"></i>
        </button>
        <button class="btn btn-sm btn-danger btn-admin-action" title="Rechazar" onclick="cambiarEstatusProv('${p.id}', 'RECHAZADO')">
          <i class="fas fa-times"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// --- 2. GESTIÓN DE SESIÓN Y SEGURIDAD ---

async function cerrarSesionAdmin() {
  const result = await Swal.fire({
    title: "¿Cerrar Sesión?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ab0a3d",
    confirmButtonText: "Sí, salir",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    const { error } = await window.clientSupa.auth.signOut();
    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      window.location.href = "index.html";
    }
  }
}

// --- 3. GESTIÓN DE NUEVOS ADMINISTRADORES ---

async function abrirGestionAdmins() {
  const { value: formValues } = await Swal.fire({
    title: "GESTIÓN DE ADMINISTRADORES",
    html: `
      <div style="background:#ab0a3d; color:white; padding:10px; margin-bottom:20px; border-radius: 8px;">
        <h5 class="m-0">ALTA DE NUEVO USUARIO</h5>
      </div>
      <div style="padding:0 10px; text-align:left;">
        <label style="color:#323232; font-weight:700;">Correo Electrónico:</label>
        <input type="email" id="swal-new-email" class="form-control mb-3" style="border: 2px solid #f0f5ff;" placeholder="admin@correo.com">
        <label style="color:#323232; font-weight:700;">Contraseña Temporal:</label>
        <input type="password" id="swal-new-pass" class="form-control" style="border: 2px solid #f0f5ff;" placeholder="********">
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "REGISTRAR ADMIN",
    confirmButtonColor: "#ab0a3d",
    preConfirm: () => {
      const email = document.getElementById("swal-new-email").value;
      const pass = document.getElementById("swal-new-pass").value;
      if (!email || !pass) {
        Swal.showValidationMessage("Por favor llena todos los campos");
      }
      return { email, pass };
    },
  });

  if (formValues) {
    ejecutarAltaAdmin(formValues.email, formValues.pass);
  }
}

async function ejecutarAltaAdmin(email, pass) {
  try {
    Swal.fire({ title: "Procesando...", didOpen: () => Swal.showLoading() });

    // 1. Registro en Auth (usamos metadata para el rol)
    const { data, error } = await window.clientSupa.auth.signUp({
      email,
      password: pass,
      options: {
        data: { rol: "ADMIN" },
      },
    });

    if (error) throw error;

    // 2. Registro en tabla 'usuarios' para control interno
    const { error: dbError } = await window.clientSupa.from("usuarios").upsert({
      id: data.user.id,
      email: email,
      rol: "ADMIN",
    });

    if (dbError) throw dbError;

    Swal.fire(
      "Éxito",
      "Nuevo administrador registrado correctamente.",
      "success",
    );
  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
}

// --- 4. ACCIONES DE TRÁMITES ---

async function cambiarEstatusProv(id, nuevoEstatus) {
  const color = nuevoEstatus === "VALIDADO" ? "#28a745" : "#ab0a3d";

  const { isConfirmed } = await Swal.fire({
    title: "¿Confirmar cambio?",
    text: `El proveedor pasará a estatus: ${nuevoEstatus}`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: color,
    confirmButtonText: "Confirmar",
  });

  if (isConfirmed) {
    try {
      const { error } = await window.clientSupa
        .from("proveedores")
        .update({
          estatus: nuevoEstatus,
          fecha_revision: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      Swal.fire({
        title: "Actualizado",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      await cargarDashboardAdmin(); // Recarga los datos
    } catch (e) {
      Swal.fire("Error", e.message, "error");
    }
  }
}

function verExpedienteAdmin(id) {
  window.location.href = `revisar_proveedor.html?id=${id}`;
}

function configurarFiltrosAdmin() {
  const inputBusqueda = document.getElementById("busqueda-admin");
  if (!inputBusqueda) return;

  inputBusqueda.addEventListener("keyup", (e) => {
    const texto = e.target.value.toLowerCase();
    const filas = document.querySelectorAll("#tabla-proveedores-admin tr");
    filas.forEach((f) => {
      f.style.display = f.innerText.toLowerCase().includes(texto) ? "" : "none";
    });
  });
}
