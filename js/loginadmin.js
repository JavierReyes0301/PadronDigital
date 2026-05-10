/**
 * LOGINADMIN.JS - Versión con diseño institucional idéntico al proveedor
 */

(function () {
  const inyectarEstilosInstitucionales = () => {
    if (document.getElementById("estilos-admin-custom")) return;
    const style = document.createElement("style");
    style.id = "estilos-admin-custom";
    style.innerHTML = `
      /* Contenedor principal del modal */
      .modal-caja-login-admin {
        border-radius: 25px !important;
        overflow: hidden !important;
        border: none !important;
        padding: 0 !important;
      }

      /* Cabecera Guinda */
      .modal-header-login-admin {
        background: #ab0a3d !important; /* El guinda de tu imagen */
        color: white !important;
        padding: 20px !important;
        text-align: center !important;
        position: relative;
      }

      .modal-header-login-admin h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        text-transform: uppercase;
      }

      /* Inputs con fondo azulado claro */
      .input-institucional-admin {
        width: 100%;
        padding: 12px 15px;
        margin-top: 8px;
        border: 1px solid #d1d9e6;
        border-radius: 10px;
        background-color: #f0f5ff !important; /* El color azulado de la imagen */
        font-size: 1rem;
        box-sizing: border-box;
      }

      /* Etiquetas */
      .label-admin {
        display: block;
        font-weight: 700;
        color: #333;
        margin-top: 15px;
        text-align: left;
      }

      /* Botón Iniciar Sesión */
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
      }

      .swal2-actions { margin-top: 0 !important; }
      .swal2-html-container { margin: 0 !important; padding: 0 !important; }
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

async function abrirLoginAdmin() {
  const { value: formValues } = await Swal.fire({
    showConfirmButton: false, // Ocultamos botones por defecto de Swal para usar el nuestro
    showCloseButton: true,
    customClass: {
      popup: "modal-caja-login-admin",
      closeButton: "boton-cerrar-custom",
    },
    html: `
      <div class="modal-header-login-admin">
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

// Función auxiliar para capturar los datos del formulario HTML personalizado
function confirmarLoginAdmin() {
  const user = document.getElementById("admin-user").value;
  const pass = document.getElementById("admin-pass").value;

  if (!user || !pass) {
    Swal.showValidationMessage("Por favor llene todos los campos");
    return;
  }

  // Cerramos el modal de diseño y ejecutamos la autenticación
  Swal.close();
  ejecutarAuthAdmin(user, pass);
}

async function ejecutarAuthAdmin(email, password) {
  try {
    Swal.fire({
      title: "Verificando...",
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

    Swal.fire({
      title: "¡Bienvenido!",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => (window.location.href = "admin_panel.html"));
  } catch (err) {
    Swal.fire("Acceso Denegado", err.message, "error");
  }
}
