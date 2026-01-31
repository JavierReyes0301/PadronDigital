console.log("Iniciando registro.js...");

const formulario = document.getElementById("FormRegistro");

if (formulario) {
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Validar que la conexión exista antes de hacer nada
    if (!window.clientSupa) {
      alert(
        "Error crítico: La conexión 'clientSupa' no se ha detectado. Revisa el orden de tus scripts en el HTML.",
      );
      return;
    }

    const email = formulario["correo"].value;
    const password = formulario["pwd"].value;
    const rfc = formulario["rfc"].value;
    const tipoPersona = formulario["tipo-persona"].value;

    try {
      // USAMOS EL NOMBRE QUE YA TE FUNCIONA EN OTRAS HOJAS
      const { data: authData, error: authError } =
        await window.clientSupa.auth.signUp({
          email: email,
          password: password,
        });

      if (authError) throw authError;

      if (authData.user) {
        const { error: dbError } = await window.clientSupa
          .from("proveedores")
          .insert([
            {
              id: authData.user.id,
              tipo_persona: tipoPersona,
              rfc: rfc,
              correo: email,
            },
          ]);

        if (dbError) throw dbError;

        alert("¡Registro exitoso! Revisa tu correo de confirmación.");
        window.location.href = "inicio.html";
      }
    } catch (error) {
      // Este alert te dirá el error REAL de Supabase
      alert("Error: " + error.message);
    }
  });
}
