// js/gestion-password.js

/**
 * Valida que las contraseñas sean iguales y tengan longitud mínima
 */
function validarPasswords() {
  const p1 = document.getElementById("Pass1").value;
  const p2 = document.getElementById("Pass2").value;
  const btn = document.getElementById("BotonGuardar");
  const errorMsg = document.getElementById("msg-error");

  if (p1.length >= 6 && p1 === p2) {
    btn.disabled = false;
    errorMsg.style.display = "none";
  } else {
    btn.disabled = true;
    if (p2.length > 0 && p1 !== p2) {
      errorMsg.style.display = "block";
    }
  }
}

/**
 * Envía la nueva contraseña a Supabase
 */
async function actualizarPassword() {
  const nuevaPass = document.getElementById("Pass1").value;
  const btn = document.getElementById("BotonGuardar");

  // Feedback visual consistente
  const textoOriginal = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> PROCESANDO...`;

  try {
    const { error } = await window.clientSupa.auth.updateUser({
      password: nuevaPass,
    });

    if (error) throw error;

    alert("¡Contraseña actualizada con éxito! Ahora puedes iniciar sesión.");
    window.location.href = "index.html";
  } catch (err) {
    alert("Error al actualizar: " + err.message);
    btn.disabled = false;
    btn.innerHTML = textoOriginal;
  }
}
