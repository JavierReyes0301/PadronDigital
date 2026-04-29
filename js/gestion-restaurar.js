// js/gestion-restaurar.js

/**
 * Valida si el formato de correo es correcto para habilitar el botón
 */
function Revisar() {
  const correo = document.getElementById("CorreoUsuario").value.trim();
  const boton = document.getElementById("BotonRestaurar");
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  boton.disabled = !regex.test(correo);
}

/**
 * Envía el correo de recuperación usando Supabase Auth
 */
async function enviarRecuperacion() {
  const correo = document.getElementById("CorreoUsuario").value.trim();
  const boton = document.getElementById("BotonRestaurar");
  const originalContent = boton.innerHTML;

  // Feedback visual en el botón (Consistencia)
  boton.disabled = true;
  boton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ENVIANDO...`;

  try {
    const { error } = await window.clientSupa.auth.resetPasswordForEmail(
      correo,
      {
        redirectTo: "https://padron.digital/actualizar-password.html",
      },
    );

    if (error) throw error;

    // Mostrar Modal de éxito (ya lo tienes en tu HTML)
    $("#modalExito").modal("show");
  } catch (err) {
    alert("Error: " + err.message);
    boton.disabled = false;
    boton.innerHTML = originalContent;
  }
}

// Asignar el evento al botón cuando cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("BotonRestaurar").onclick = enviarRecuperacion;
});
