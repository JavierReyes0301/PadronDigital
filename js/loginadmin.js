/**
 * LOGINADMIN.JS - Gestión de acceso oculto para administradores
 * Versión optimizada para Menús Dinámicos (SPA)
 */

(function () {
  // 1. FUNCIÓN PARA VINCULAR EVENTOS AL ENLACE
  const vincularAccesoAdmin = () => {
    const brandLink = document.getElementById("link-admin-secret");

    if (brandLink && !brandLink.dataset.adminViculado) {
      console.log("✅ Acceso administrativo vinculado correctamente.");

      // Marcamos como vinculado para no repetir el proceso
      brandLink.dataset.adminViculado = "true";

      // DOBLE CLIC para el Admin
      brandLink.addEventListener("dblclick", (e) => {
        e.preventDefault();
        abrirLoginAdmin();
      });

      // CLIC NORMAL para usuario común (Navegación estándar)
      brandLink.addEventListener("click", (e) => {
        // Solo actúa si es un clic simple (detail === 1)
        if (e.detail === 1) {
          window.location.hash = "inicio";
        }
      });
    }
  };

  // 2. OBSERVADOR: Vigila si el menú se crea dinámicamente
  const observer = new MutationObserver((mutations) => {
    vincularAccesoAdmin();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Ejecución inicial por si ya existe
  document.addEventListener("DOMContentLoaded", vincularAccesoAdmin);
})();

// --- LÓGICA DE LOGIN ---

async function abrirLoginAdmin() {
  // Verificamos si SweetAlert está disponible
  if (typeof Swal === "undefined") {
    console.error("SweetAlert2 no cargado.");
    alert("Error: No se pudo cargar el módulo de inicio de sesión.");
    return;
  }

  const { value: formValues } = await Swal.fire({
    title: "Acceso Administrativo",
    icon: "lock",
    html: `
            <div class="text-left" style="text-align: left;">
                <label><b>Correo Electrónico:</b></label>
                <input type="email" id="admin-user" class="swal2-input" placeholder="admin@ejemplo.com">
                <label class="mt-2"><b>Contraseña:</b></label>
                <input type="password" id="admin-pass" class="swal2-input" placeholder="••••••••">
            </div>
        `,
    showCancelButton: true,
    confirmButtonText: "Iniciar Sesión",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#2c3e50",
    focusConfirm: false,
    preConfirm: () => {
      const user = document.getElementById("admin-user").value;
      const pass = document.getElementById("admin-pass").value;
      if (!user || !pass) {
        Swal.showValidationMessage("Por favor llene todos los campos");
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
      title: "Verificando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // 1. Intentar Login en Supabase
    const { data, error } = await window.clientSupa.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw new Error("Credenciales inválidas");

    // 2. Verificar el rol en la tabla 'usuarios'
    const { data: perfil, error: errorPerfil } = await window.clientSupa
      .from("usuarios")
      .select("rol")
      .eq("id", data.user.id)
      .single();

    if (errorPerfil || !perfil || perfil.rol !== "ADMIN") {
      await window.clientSupa.auth.signOut();
      throw new Error("No tienes permisos de administrador");
    }

    // 3. Redirigir si es Admin
    Swal.fire({
      title: "¡Bienvenido!",
      text: "Accediendo al panel de control...",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "admin_panel.html";
    });
  } catch (err) {
    Swal.fire("Acceso Denegado", err.message, "error");
  }
}
