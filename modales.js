// Archivo: modales.js
// Contiene la estructura de los modales para el Padrón de Proveedores

const modalesPadron = `
<div id="ContenedorEmergente" class="modal fade" role="dialog" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border-radius: 12px; overflow: hidden; border: none;">
          <div class="modal-header" style="background: #ab0a3d; padding: 20px; text-align: center; position: relative; display: block;">
            <button type="button" class="close" data-dismiss="modal" style="position: absolute; top: 10px; right: 15px; color: white; font-size: 28px; opacity: 1;">&times;</button>
            <svg width="60" fill="white" viewBox="0 0 512 512" style="margin: 0 auto; display: block;">
              <path d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z"></path>
            </svg>
          </div>
          <div class="modal-body" style="padding: 30px;">
            <form id="FormaLogin">
              <label style="font-weight: bold; color: #333; display: block; margin-bottom: 5px;">RFC / Usuario:</label>
              <input type="text" style="text-transform: uppercase;" name="rfc" class="form-control mb-3" placeholder="USUARIO" required />
              <label style="font-weight: bold; color: #333; display: block; margin-bottom: 5px;">Contraseña:</label>
              <input type="password" name="Password" class="form-control mb-3" placeholder="********" required />
              <button type="submit" style="width: 100%; background: #ab0a3d; color: white; padding: 12px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">INICIAR SESIÓN</button>
            </form>
          </div>
        </div>
      </div>
    </div>

<div class="modal fade" id="ModalRegistro" role="dialog" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content reg-content">
            <div class="modal-header reg-header">
                <h2 class="reg-title text-center w-100">Registro al Padrón de Proveedores</h2>
                <button type="button" class="close reg-close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body reg-body">
                <h4 class="reg-subtitle">Capture los siguientes datos para iniciar su proceso:</h4>
                <form id="FormRegistro">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group mb-4">
                                <label class="reg-label">Tipo de Persona:</label>
                                <div class="d-flex gap-4 p-2 bg-light rounded">
                                    <label class="mr-3 mb-0 cursor-pointer">
                                        <input type="radio" name="tipo-persona" value="Física" required> Física
                                    </label>
                                    <label class="mb-0 cursor-pointer">
                                        <input type="radio" name="tipo-persona" value="Moral"> Moral
                                    </label>
                                </div>
                            </div>
                            <div class="form-group mb-4">
                                <label class="reg-label">RFC:</label>
                                <input type="text" class="form-control reg-input-custom" name="rfc" placeholder="RFC CON HOMOCLAVE" required>
                            </div>
                            <div class="form-group mb-4">
                                <label class="reg-label">Correo Electrónico:</label>
                                <input type="email" class="form-control reg-input-custom" name="correo" placeholder="ejemplo@correo.com" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group mb-4">
                                <label class="reg-label">Contraseña:</label>
                                <input type="password" class="form-control reg-input-custom" name="pwd" placeholder="Mínimo 8 caracteres" required>
                            </div>
                            <div class="form-group mb-4">
                                <label class="reg-label">Confirmar Contraseña:</label>
                                <input type="password" class="form-control reg-input-custom" name="confirmar-pwd" required>
                            </div>
                        </div>
                    </div>
                    <div class="reg-aviso-box">
                        <p class="reg-aviso-texto">
                            <strong>Aviso de Privacidad:</strong> Sus datos serán protegidos de acuerdo a la Ley General de Protección de Datos Personales.
                        </p>
                        <label class="reg-label-check" style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-weight: 700;">
                            <input type="checkbox" name="acepta-aviso" id="acepta-aviso" required style="transform: scale(1.3); margin-top: 4px;">
                            <span>Acepto el aviso de privacidad y autorizo la publicación de mis datos.</span>
                        </label>
                    </div>
                    <div style="text-align: center; margin-top: 30px;">
                       <button type="submit" class="btn-continuar-img1">CONTINUAR REGISTRO</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modalExito" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content" style="border-radius: 15px; border: none; text-align: center; padding: 30px;">
            <div class="modal-body">
                <i class="fas fa-check-circle" style="font-size: 50px; color: #28a745; margin-bottom: 20px;"></i>
                <h3 style="font-weight: bold;">¡REGISTRO EXITOSO!</h3>
                <p>Sus datos se guardaron correctamente en el padrón.</p>
                <button type="button" class="btn" style="background: #ab0a3d; color: white; font-weight: bold; padding: 10px 30px;" data-dismiss="modal">CERRAR</button>
            </div>
        </div>
    </div>
</div>

`;

// 1. INYECTAR LOS MODALES AL BODY AUTOMÁTICAMENTE
document.body.insertAdjacentHTML("beforeend", modalesPadron);

// 2. FUNCIÓN PARA VALIDAR RFC
function validarRFC(rfc) {
  const regexRFC =
    /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
  return regexRFC.test(rfc);
}

// 3. FUNCIÓN MAESTRA DE MODALES
function gestionarModal(idModal, accion = "show") {
  const el = document.getElementById(idModal);
  if (el) {
    $(el).modal(accion);
  } else {
    console.error(`El modal "${idModal}" no existe.`);
  }
}

// 4. LÓGICA DE REGISTRO CON SUPABASE
document.addEventListener("submit", async (e) => {
  if (e.target && e.target.id === "FormRegistro") {
    e.preventDefault();
    const form = e.target;

    // Captura de datos
    const rfc = form
      .querySelector('input[name="rfc"]')
      .value.trim()
      .toUpperCase();
    const correoReal = form.querySelector('input[name="correo"]').value.trim();
    const tipoPersona = form.querySelector(
      'input[name="tipo-persona"]:checked',
    )?.value;
    const password = form.querySelector('input[name="pwd"]').value;
    const confirmPassword = form.querySelector(
      'input[name="confirmar-pwd"]',
    ).value;
    const btnSubmit = form.querySelector('button[type="submit"]');

    // --- VALIDACIONES ---
    if (!validarRFC(rfc)) {
      alert("El formato del RFC no es válido.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> PROCESANDO...';

      // A. Registro en Auth
      const { data, error: authError } = await _supabase.auth.signUp({
        email: `${rfc}@proveedor.com`,
        password: password,
      });

      if (authError) throw authError;

      // B. Registro en Base de Datos
      const { error: dbError } = await _supabase.from("proveedores").insert([
        {
          id: data.user.id,
          rfc: rfc,
          correo_contacto: correoReal,
          tipo_persona: tipoPersona,
        },
      ]);

      if (dbError) throw dbError;

      // ÉXITO
      gestionarModal("ModalRegistro", "hide");
      form.reset();
      gestionarModal("modalExito", "show");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = "CONTINUAR REGISTRO";
    }
  }
});
