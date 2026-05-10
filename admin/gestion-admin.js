/**
 * LÓGICA DEL PANEL DE ADMINISTRACIÓN COMPLETA
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
    await cargarDashboardAdmin();
    configurarFiltrosAdmin();
  }
});

// --- 1. CARGA DE DATOS ---
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
  tbody.innerHTML = "";

  provs.forEach((p) => {
    let badgeClass =
      p.estatus === "VALIDADO"
        ? "badge-success"
        : p.estatus === "RECHAZADO"
          ? "badge-danger"
          : "badge-warning";

    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td><b>${p.rfc || "S/N"}</b></td>
            <td>${p.nombre_comercial || "Sin Nombre"}</td>
            <td>${p.tipo_persona || "---"}</td>
            <td><span class="text-primary">${p.folio || "N/A"}</span></td>
            <td><span class="badge ${badgeClass}">${p.estatus || "PENDIENTE"}</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="verExpedienteAdmin('${p.id}')"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-success" onclick="cambiarEstatusProv('${p.id}', 'VALIDADO')"><i class="fas fa-check"></i></button>
                <button class="btn btn-sm btn-danger" onclick="cambiarEstatusProv('${p.id}', 'RECHAZADO')"><i class="fas fa-times"></i></button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

// --- 2. GESTIÓN DE NUEVOS ADMINISTRADORES (SECRETO) ---

async function abrirGestionAdmins() {
  const { value: formValues } = await Swal.fire({
    title: "GESTIÓN DE ADMINISTRADORES",
    customClass: { popup: "modal-institucional-admin" },
    html: `
      <div style="background:#ab0a3d; color:white; padding:10px; margin-bottom:20px;">
        <h5 class="m-0">ALTA DE NUEVO USUARIO</h5>
      </div>
      <div style="padding:0 20px 20px 20px; text-align:left;">
        <label><b>Correo Electrónico:</b></label>
        <input type="email" id="swal-new-email" class="input-institucional-admin" placeholder="admin@correo.com">
        <label class="mt-3"><b>Contraseña Temporal:</b></label>
        <input type="password" id="swal-new-pass" class="input-institucional-admin" placeholder="********">
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "REGISTRAR ADMIN",
    confirmButtonColor: "#ab0a3d",
    preConfirm: () => {
      return {
        email: document.getElementById("swal-new-email").value,
        pass: document.getElementById("swal-new-pass").value,
      };
    },
  });

  if (formValues) {
    ejecutarAltaAdmin(formValues.email, formValues.pass);
  }
}

async function ejecutarAltaAdmin(email, pass) {
  if (!email || !pass) return;

  try {
    Swal.fire({
      title: "Creando cuenta...",
      didOpen: () => Swal.showLoading(),
    });

    // 1. Registro en Supabase Auth
    const { data, error } = await window.clientSupa.auth.signUp({
      email,
      password: pass,
    });
    if (error) throw error;

    // 2. Asignar Rol ADMIN en la tabla usuarios
    const { error: dbError } = await window.clientSupa
      .from("usuarios")
      .update({ rol: "ADMIN" })
      .eq("id", data.user.id);

    if (dbError) throw dbError;

    Swal.fire(
      "Éxito",
      "Administrador creado. Debe confirmar su correo.",
      "success",
    );
  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
}

// --- 3. ACCIONES DE TABLA ---

async function cambiarEstatusProv(id, nuevoEstatus) {
  const { isConfirmed } = await Swal.fire({
    title: "¿Confirmar cambio?",
    text: `El proveedor pasará a estatus: ${nuevoEstatus}`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#ab0a3d",
  });

  if (isConfirmed) {
    try {
      const { error } = await window.clientSupa
        .from("proveedores")
        .update({ estatus: nuevoEstatus, fecha_revision: new Date() })
        .eq("id", id);

      if (error) throw error;
      Swal.fire("Actualizado", "", "success");
      cargarDashboardAdmin();
    } catch (e) {
      Swal.fire("Error", e.message, "error");
    }
  }
}

function verExpedienteAdmin(id) {
  window.location.href = `revisar_proveedor.html?id=${id}`;
}

function configurarFiltrosAdmin() {
  document.getElementById("busqueda-admin").addEventListener("keyup", (e) => {
    const texto = e.target.value.toLowerCase();
    const filas = document.querySelectorAll("#tabla-proveedores-admin tr");
    filas.forEach(
      (f) =>
        (f.style.display = f.innerText.toLowerCase().includes(texto)
          ? ""
          : "none"),
    );
  });
}
