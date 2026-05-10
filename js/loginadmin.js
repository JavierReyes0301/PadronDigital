/**
 * LOGINADMIN.JS - Gestión de acceso oculto para administradores
 */

document.addEventListener("DOMContentLoaded", () => {
  const brandLink = document.getElementById("link-admin-secret");

  if (brandLink) {
    // Usamos Doble Clic para evitar que usuarios comunes entren por error
    brandLink.addEventListener("dblclick", () => {
      abrirLoginAdmin();
    });

    // El clic sencillo sigue funcionando para llevar al inicio
    brandLink.addEventListener("click", (e) => {
      if (e.detail === 1) {
        // Si es solo un clic
        window.location.hash = "inicio";
      }
    });
  }
});

async function abrirLoginAdmin() {
  // Usamos SweetAlert2 para un diseño profesional y rápido
  const { value: formValues } = await Swal.fire({
    title: "Acceso Administrativo",
    icon: "lock",
    html: `
            <div class="text-left">
                <label>Correo Electrónico:</label>
                <input type="email" id="admin-user" class="swal2-input" placeholder="admin@ejemplo.com">
                <label class="mt-2">Contraseña:</label>
                <input type="password" id="admin-pass" class="swal2-input" placeholder="••••••••">
            </div>
        `,
    showCancelButton: true,
    confirmButtonText: "Iniciar Sesión",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#2c3e50",
    focusConfirm: false,
    preConfirm: () => {
      return {
        user: document.getElementById("admin-user").value,
        pass: document.getElementById("admin-pass").value,
      };
    },
  });

  if (formValues) {
    if (!formValues.user || !formValues.pass) {
      Swal.fire("Atención", "Todos los campos son obligatorios", "warning");
      return;
    }
    ejecutarAuthAdmin(formValues.user, formValues.pass);
  }
}

async function ejecutarAuthAdmin(email, password) {
  try {
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

    // 3. Si todo es correcto, redirigir
    Swal.fire({
      title: "¡Bienvenido!",
      text: "Accediendo al panel de control...",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "admin_panel.html"; // Nombre de tu página de admin
    });
  } catch (err) {
    Swal.fire("Acceso Denegado", err.message, "error");
  }
}
