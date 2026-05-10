/**
 * LOGINADMIN.JS - Gestión de acceso oculto para administradores
 * Diseño integrado con identidad institucional (Guinda)
 */

(function () {
  // INYECCIÓN DE ESTILOS PERSONALIZADOS
  const inyectarEstilos = () => {
    if (document.getElementById("estilos-admin-login")) return;
    const style = document.createElement("style");
    style.id = "estilos-admin-login";
    style.innerHTML = `
            .admin-modal-popup {
                border-radius: 15px !important;
                border-top: 5px solid #ab0a3d !important;
            }
            .admin-modal-title {
                color: #ab0a3d !important;
                font-family: 'Montserrat', sans-serif;
                font-weight: bold;
                text-transform: uppercase;
            }
            .admin-btn-confirm {
                background-color: #ab0a3d !important;
                color: white !important;
                padding: 10px 30px !important;
                border-radius: 8px !important;
                font-weight: bold;
                border: none;
                margin: 5px;
            }
            .admin-btn-cancel {
                background-color: #6c757d !important;
                color: white !important;
                padding: 10px 30px !important;
                border-radius: 8px !important;
                border: none;
                margin: 5px;
            }
            .swal2-input:focus {
                border-color: #ab0a3d !important;
                box-shadow: 0 0 5px rgba(171, 10, 61, 0.3) !important;
            }
        `;
    document.head.appendChild(style);
  };

  // 1. VINCULACIÓN DE EVENTOS
  const vincularAccesoAdmin = () => {
    const brandLink = document.getElementById("link-admin-secret");
    if (brandLink && !brandLink.dataset.adminViculado) {
      brandLink.dataset.adminViculado = "true";
      inyectarEstilos();

      brandLink.addEventListener("dblclick", (e) => {
        e.preventDefault();
        abrirLoginAdmin();
      });

      brandLink.addEventListener("click", (e) => {
        if (e.detail === 1) {
          window.location.hash = "inicio";
        }
      });
    }
  };

  const observer = new MutationObserver(() => vincularAccesoAdmin());
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", vincularAccesoAdmin);
})();

// --- LÓGICA DE LOGIN ---

async function abrirLoginAdmin() {
  if (typeof Swal === "undefined") {
    alert("Error: SweetAlert2 no está disponible.");
    return;
  }

  const { value: formValues } = await Swal.fire({
    title: "Acceso Administrativo",
    icon: "lock",
    iconColor: "#ab0a3d",
    customClass: {
      popup: "admin-modal-popup",
      title: "admin-modal-title",
      confirmButton: "admin-btn-confirm",
      cancelButton: "admin-btn-cancel",
    },
    buttonsStyling: false,
    html: `
            <div style="text-align: left; padding: 10px;">
                <label style="color: #555; font-size: 14px;"><b>Correo Electrónico:</b></label>
                <input type="email" id="admin-user" class="swal2-input" placeholder="ejemplo@correo.com" style="margin-top: 5px;">
                <br><br>
                <label style="color: #555; font-size: 14px;"><b>Contraseña:</b></label>
                <input type="password" id="admin-pass" class="swal2-input" placeholder="••••••••" style="margin-top: 5px;">
            </div>
        `,
    showCancelButton: true,
    confirmButtonText: '<i class="fas fa-sign-in-alt"></i> Entrar',
    cancelButtonText: "Cancelar",
    focusConfirm: false,
    preConfirm: () => {
      const user = document.getElementById("admin-user").value;
      const pass = document.getElementById("admin-pass").value;
      if (!user || !pass) {
        Swal.showValidationMessage("Por favor, ingrese sus credenciales");
        return false;
      }
      return { user, pass };
    },
  });

  if (formValues) {
    ejecutarAuthAdmin(formValues.user, formValues.pass);
  }
}

async function ejecutarAuthAdmin(email, password) {
  try {
    Swal.fire({
      title: "Verificando identidad...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // 1. Autenticación Supabase
    const { data, error } = await window.clientSupa.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw new Error("Credenciales inválidas o inexistentes");

    // 2. Validación de Rol
    const { data: perfil, error: errorPerfil } = await window.clientSupa
      .from("usuarios")
      .select("rol")
      .eq("id", data.user.id)
      .single();

    if (errorPerfil || !perfil || perfil.rol !== "ADMIN") {
      await window.clientSupa.auth.signOut();
      throw new Error("Su cuenta no tiene privilegios de administrador");
    }

    // 3. Éxito
    Swal.fire({
      title: "Acceso Concedido",
      text: "Cargando panel de administración...",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "admin_panel.html";
    });
  } catch (err) {
    Swal.fire({
      title: "Error de Acceso",
      text: err.message,
      icon: "error",
      confirmButtonColor: "#ab0a3d",
    });
  }
}
