/**
 * LOGINADMIN.JS - Versión Final Institucional
 * Control de acceso y anuncios con identidad visual unificada.
 */

(function () {
  const inyectarEstilosInstitucionales = () => {
    if (document.getElementById("estilos-admin-custom")) return;
    const style = document.createElement("style");
    style.id = "estilos-admin-custom";
    style.innerHTML = `
      /* --- MODALES Y ALERTAS --- */
      .modal-institucional-admin {
        border-radius: 25px !important;
        overflow: hidden !important;
        border: none !important;
        padding: 0 !important;
        font-family: 'Montserrat', sans-serif, Arial;
      }

      /* Cabecera Guinda */
      .modal-header-admin {
        background: #ab0a3d !important;
        color: white !important;
        padding: 20px !important;
        text-align: center !important;
      }

      .modal-header-admin h2 {
        margin: 0;
        font-size: 1.4rem;
        font-weight: 700;
        text-transform: uppercase;
      }

      /* --- ELEMENTOS DE FORMULARIO --- */
      .input-institucional-admin {
        width: 100%;
        padding: 12px 15px;
        margin-top: 8px;
        border: 1px solid #d1d9e6;
        border-radius: 10px;
        background-color: #f0f5ff !important;
        font-size: 1rem;
        box-sizing: border-box;
      }

      .label-admin {
        display: block;
        font-weight: 700;
        color: #333;
        margin-top: 15px;
        text-align: left;
      }

      /* Botón Estilo Institucional */
      .btn-admin-submit {
        background-color: #ab0a3d !important;
        color: white !important;
        width: 100%;
        padding: 12px;
        border-radius: 10px;
        border: none;
        font-weight: 700;
        font-size: 1.1rem;
        margin-top: 25px;
        cursor: pointer;
        text-transform: uppercase;
        transition: background 0.3s;
      }

      .btn-admin-submit:hover { background-color: #8a0831 !important; }

      /* --- AJUSTES GLOBALES DE SWEETALERT (ICONOS Y CARGA) --- */
      .swal2-styled.swal2-confirm {
        background-color: #ab0a3d !important;
        border-radius: 10px !important;
        padding: 10px 30px !important;
      }

      /* Color Guinda para Iconos de Éxito y Error */
      .swal2-icon.swal2-success { border-color: #ab0a3d !important; color: #ab0a3d !important; }
      .swal2-icon.swal2-success [class^='swal2-success-line'] { background-color: #ab0a3d !important; }
      .swal2-icon.swal2-success .swal2-success-ring { border: 4px solid rgba(171, 10, 61, 0.3) !important; }
      
      .swal2-icon.swal2-error { border-color: #ab0a3d !important; color: #ab0a3d !important; }
      .swal2-icon.swal2-error [class^='swal2-x-mark-line'] { background-color: #ab0a3d !important; }

      /* Ajuste de carga (Spinner) */
      .swal2-loader { border-color: #ab0a3d transparent #ab0a3d transparent !important; }
    `;
    document.head.appendChild(style);
  };

  const vincularAccesoAdmin = () => {
    const brandLink = document.getElementById("link-admin-secret");
    if (brandLink && !brandLink.dataset.adminViculado) {
      brandLink.dataset.adminViculado = "true";
      inyectarEstilosInstitucionales();
      brandLink.addEventListener("dblclick", (e) => {
        e.preventDefault();
        abrirLoginAdmin();
      });
      brandLink.addEventListener("click", (e) => {
        if (e.detail === 1) window.location.hash = "inicio";
      });
    }
  };

  const observer = new MutationObserver(() => vincularAccesoAdmin());
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", vincularAccesoAdmin);
})();

/**
 * Función para lanzar alertas con el diseño unificado
 */
function AlertaAdmin(titulo, mensaje, icono = "info") {
  return Swal.fire({
    title: titulo.toUpperCase(),
    text: mensaje,
    icon: icono,
    customClass: { popup: "modal-institucional-admin" },
    confirmButtonText: "ACEPTAR",
    buttonsStyling: true,
  });
}

async function abrirLoginAdmin() {
  const { value: formValues } = await Swal.fire({
    showConfirmButton: false,
    showCloseButton: true,
    customClass: { popup: "modal-institucional-admin" },
    html: `
      <div class="modal-header-admin">
          <h2>Acceso al Panel de Administración</h2>
      </div>
      <div style="padding: 30px;">
          <form id="FormaLoginAdmin">
              <div style="text-align: center;">
                  <label class="label-admin">Correo Electrónico:</label>
                  <input type="email" id="admin-user" class="input-institucional-admin" placeholder="ejemplo@correo.com">
                  
                  <label class="label-admin">Contraseña:</label>
                  <input type="password" id="admin-pass" class="input-institucional-admin" placeholder="********">
              </div>
              <button type="button" onclick="confirmarLoginAdmin()" class="btn-admin-submit">INICIAR SESIÓN</button>
          </form>
      </div>
    `,
  });
}

function confirmarLoginAdmin() {
  const user = document.getElementById("admin-user").value;
  const pass = document.getElementById("admin-pass").value;

  if (!user || !pass) {
    AlertaAdmin("Atención", "Por favor llene todos los campos", "warning");
    return;
  }
  Swal.close();
  ejecutarAuthAdmin(user, pass);
}

async function ejecutarAuthAdmin(email, password) {
  try {
    Swal.fire({
      title: "VERIFICANDO",
      customClass: { popup: "modal-institucional-admin" },
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    const { data, error } = await window.clientSupa.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error("Credenciales inválidas");

    const { data: perfil } = await window.clientSupa
      .from("usuarios")
      .select("rol")
      .eq("id", data.user.id)
      .single();

    if (!perfil || perfil.rol !== "ADMIN") {
      await window.clientSupa.auth.signOut();
      throw new Error("No tienes permisos de administrador");
    }

    // Éxito con estilo guinda
    AlertaAdmin(
      "¡Bienvenido!",
      "Accediendo al panel de administración...",
      "success",
    ).then(() => (window.location.href = "admin/admin_panel.html"));
  } catch (err) {
    AlertaAdmin("Acceso Denegado", err.message, "error");
  }
}
