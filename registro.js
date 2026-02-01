// --- DENTRO DE TU DOCUMENT LISTENER DE REGISTRO ---

try {
  // A. Crear el usuario en Authentication
  const { data, error: authError } = await _supabase.auth.signUp({
    email: `${rfc}@proveedor.com`,
    password: password,
  });

  if (authError) throw authError;

  // B. Insertar en tabla proveedores
  const { error: dbError } = await _supabase.from("proveedores").insert([
    {
      id: data.user.id,
      rfc: rfc,
      correo_contacto: correoReal,
      tipo_persona: tipoPersona,
    },
  ]);

  if (dbError) throw dbError;

  // === CAMBIO AQUÍ: INTEGRACIÓN CON EL DISEÑO ===

  // 1. Cerramos el modal de registro
  $("#ModalRegistro").modal("hide");

  // 2. Limpiamos el formulario
  form.reset();

  // 3. EN LUGAR DE ALERT, DISPARAMOS EL MODAL DE ÉXITO
  // Asegúrate de tener el HTML del modal de éxito en tu index
  $("#modalExito").modal("show");
} catch (err) {
  // Para errores, también podrías usar un modal rojo en lugar de alert
  alert("Error: " + err.message);
  console.error(err);
}
