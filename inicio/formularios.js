/**
 * GESTIÓN DE FORMULARIOS Y ESTADOS DE PERFIL
 * Este archivo controla qué secciones se muestran según el estatus en Supabase.
 */

async function gestionarEstadoYSecciones() {
  try {
    // Obtenemos la sesión actual
    const {
      data: { session },
    } = await window.clientSupa.auth.getSession();

    if (!session) {
      console.log("No hay sesión activa.");
      return;
    }

    // Consultamos el estatus del perfil
    const { data: perfil, error } = await window.clientSupa
      .from("perfiles")
      .select("estatus")
      .eq("id", session.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 es "no se encontró registro"
      throw error;
    }

    // Lógica de visualización basada en el estatus
    // Si el perfil no existe o está pendiente, es "Usuario Nuevo" para la UI
    if (!perfil || perfil.estatus === "Pendiente") {
      window.esUsuarioNuevo = true;
      console.log("Perfil pendiente o nuevo: Redirigiendo a Actualizar Datos.");
      gestionarVisibilidadSeccion("actualizar-datos");
    } else {
      window.esUsuarioNuevo = false;
      console.log("Perfil validado: Redirigiendo a Estado de Perfil.");
      gestionarVisibilidadSeccion("estado-perfil");
    }
  } catch (error) {
    console.error("Error en la gestión de estados:", error.message);
  }
}

// Función para validar formularios antes de enviarlos (Mejora de UX)
function validarFormularioProveedor(idForm) {
  const form = document.getElementById(idForm);
  if (!form) return false;

  const inputs = form.querySelectorAll("input[required], select[required]");
  let valido = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("is-invalid");
      valido = false;
    } else {
      input.classList.remove("is-invalid");
    }
  });

  return valido;
}

// Inicialización automática si estamos en la página de inicio
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("inicio.html")) {
    gestionarEstadoYSecciones();
  }
});
