const modalesPadron = `
<div class="modal fade" id="ModalLogin" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-caja-login">
            <div class="modal-header-login">
                <h2>Inicio de Sesión</h2>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body" style="padding: 30px;">
                <form id="FormaLogin">
                    <div class="form-group-custom">
                        <label>Correo Electrónico:</label>
                        <input type="email" name="correo_login" class="input-institucional" placeholder="ejemplo@correo.com" required />
                    </div>
                    <div class="form-group-custom">
                        <label>Contraseña:</label>
                        <input type="password" name="password_login" class="input-institucional" placeholder="********" required />
                    </div>
                    <button type="submit" class="btn-registro-continuar" style="width:100%; margin-top:10px;">INICIAR SESIÓN</button>
                </form>
                <div style="text-align:center; margin-top:20px;">
                    <a href="restaurar.html" style="font-size:0.9rem; color:#ab0a3d; font-weight:700; text-decoration:none;">¿Olvidó su contraseña?</a>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="ModalRegistro" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header-registro">
                <h2>Registro al Padrón de Proveedores</h2>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body" style="padding: 25px 40px;">
                <div id="instruccionesNuevoModal" style="display:none;" class="instruccion-registro">
                    <strong>¡Eres nuevo!</strong> Capture los siguientes datos para iniciar su proceso de registro:
                </div>
                <div id="instruccionesRegistradoModal" style="display:none;" class="instruccion-registro">
                    <strong>¡Bienvenido de nuevo!</strong> Inicie sesión para continuar con su trámite pendiente:
                </div>
                
                <form id="FormRegistro">
                    <div class="grid-registro">
                        <div class="columna-izq">
                            <div class="form-group-custom">
                                <label>Tipo de Persona:</label>
                                <div class="input-institucional d-flex align-items-center" style="background:#f8f9fa !important; border:1px solid #ddd !important; height:45px;">
                                    <label class="mr-4 mb-0"><input type="radio" name="tipo-persona" value="Fisica" required> Física</label>
                                    <label class="mb-0"><input type="radio" name="tipo-persona" value="Moral"> Moral</label>
                                </div>
                            </div>
                            <div class="form-group-custom">
                                <label>RFC:</label>
                                <input type="text" name="rfc" class="input-institucional" placeholder="RFC CON HOMOCLAVE" required>
                            </div>
                            <div class="form-group-custom">
                                <label>Correo Electrónico:</label>
                                <input type="email" name="correo" class="input-institucional" placeholder="ejemplo@correo.com" required>
                            </div>
                        </div>
                        
                        <div class="columna-der">
                            <div class="form-group-custom">
                                <label>Contraseña:</label>
                                <input type="password" name="pwd" class="input-institucional" placeholder="Mínimo 8 caracteres" required>
                            </div>
                            <div class="form-group-custom">
                                <label>Confirmar Contraseña:</label>
                                <input type="password" name="confirm-pwd" class="input-institucional" required>
                            </div>
                        </div>
                    </div>

                    <div class="caja-aviso">
                        <p class="texto-aviso">
                            <strong>Aviso de Privacidad:</strong> Sus datos serán protegidos de acuerdo a la Ley General de Protección de Datos Personales.
                        </p>
                        <div class="contenedor-check">
                            <input type="checkbox" id="checkAviso"> 
                            <label for="checkAviso" style="margin:0; cursor:pointer;">Acepto el aviso de privacidad.</label>
                        </div>
                    </div>

                    <div class="footer-registro-fuera" style="display: flex; justify-content: center; margin-top: 20px;">
                        <button type="submit" class="btn-registro-continuar">Continuar Registro</button>
                    </div>
                </form> 
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modalRequisitos" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header modal-header-registro">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h2 class="modal-title">Requisitos</h2>
      </div>
      
      <div class="modal-body body-requisitos">
        <div class="row">
          <div class="col-md-6">
            <h4 class="subtitulo-requisito">Documentación Personal</h4>
            <ul class="lista-requisitos">
              <li>Acta de nacimiento (Persona Física).</li>
              <li>CURP (Persona Física).</li>
              <li>Acta constitutiva y poderes (Persona Moral).</li>
              <li>Identificación oficial con fotografía.</li>
              <li>Comprobante de domicilio.</li>
              <li>Currículum Vitae.</li>
              <li>Reporte fotográfico del domicilio fiscal.</li>
            </ul>
          </div>
          <div class="col-md-6">
            <h4 class="subtitulo-requisito">Documentación Fiscal</h4>
            <ul class="lista-requisitos">
              <li>Comprobante de pago de derechos.</li>
              <li>Constancia de Situación Fiscal.</li>
              <li>Opinión de cumplimiento SAT.</li>
              <li>Constancia de no adeudo municipal.</li>
              <li>Declaración anual de impuestos.</li>
              <li>Últimas 3 declaraciones parciales.</li>
            </ul>
          </div>
        </div>

        <div class="caja-formatos-municipio">
          <h4 class="subtitulo-requisito">Formatos Proporcionados por el Municipio</h4>
          <ul class="lista-requisitos">
            <li>Solicitud de registro/revalidación.</li>
            <li>Carta de no impedimento (Art. 77).</li>
            <li>Carta de manifiesto de no inhabilitado.</li>
            <li>Carta de no conflicto de interés.</li>
            <li>Carta de cumplimiento fiscal.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="modalFormatos" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header-registro"> 
        <h2 class="modal-title">Formatos</h2>
        <button type="button" class="close" data-dismiss="modal">&times;</button>
      </div>
      <div class="modal-body" style="padding: 30px 40px;">
        <div class="instruccion-registro">
          Seleccione el formato correspondiente para su descarga. Todos los documentos deben ser requisitados y firmados.
        </div>
        
        <div class="contenedor-lista-anexos">
          <div class="item-anexo">
            <h5 class="nombre-anexo">Solicitud de registro / revalidación.</h5>
            <a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20I%20-%20IA.docx" download class="btn-anexo">ANEXO I</a>
          </div>
          
          <div class="item-anexo">
            <h5 class="nombre-anexo">Carta bajo protesta de decir verdad de no estar impedido para contratar (Art. 77 Ley de Adquisiciones y Art. 69-B CFF).</h5>
            <a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20II.docx" download class="btn-anexo">ANEXO II</a>
          </div>

          <div class="item-anexo">
            <h5 class="nombre-anexo">Carta de manifiesto bajo protesta de decir verdad de no estar inhabilitado para procedimientos de adjudicación.</h5>
            <a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20III.docx" download class="btn-anexo">ANEXO III</a>
          </div>

          <div class="item-anexo">
            <h5 class="nombre-anexo">Carta de manifiesto de no desempeñar cargo público o incurrir en conflicto de interés con la Administración Pública Municipal.</h5>
            <a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20IV.docx" download class="btn-anexo">ANEXO IV</a>
          </div>

          <div class="item-anexo no-border">
            <h5 class="nombre-anexo">Carta bajo protesta de decir verdad de encontrarse al corriente de las obligaciones fiscales.</h5>
            <a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20V.docx" download class="btn-anexo">ANEXO V</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="ModalPreguntas" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h2 class="modal-title">Preguntas Frecuentes</h2>
            </div>
            <div class="modal-body">
                <div class="faq-container">
                    <div class="faq-item">
                        <h4 class="faq-pregunta">1. ¿Cuál es el dato que debo ingresar como usuario para iniciar sesión?</h4>
                        <p class="faq-respuesta">El RFC de la persona física o moral.</p>
                    </div>
                    <div class="faq-item">
                        <h4 class="faq-pregunta">2. ¿Cómo puedo recuperar mi contraseña?</h4>
                        <p class="faq-respuesta">En su cuenta, presione el botón <strong>“¿Olvidaste tu contraseña?”</strong>.</p>
                    </div>
                    <div class="faq-item">
                        <h4 class="faq-pregunta">3. Si no tengo acceso al correo registrado, ¿cómo puedo cambiarlo?</h4>
                        <p class="faq-respuesta text-justify">
                            Debe enviar una solicitud al correo institucional, dirigida a la <strong>Contraloría Municipal</strong>, exponiendo el motivo del cambio e indicando el nuevo correo. La solicitud debe estar firmada por el representante legal y adjuntar:
                        </p>
                        <div class="faq-sub-list">
                            <p><strong>Persona Moral:</strong> Acta Constitutiva, Poder Notarial, Constancia de Situación Fiscal (vigencia 30 días), Comprobante de Domicilio (vigencia 3 meses) e INE vigente.</p>
                            <p><strong>Persona Física:</strong> Acta de Nacimiento, Constancia de Situación Fiscal (vigencia 30 días), Comprobante de Domicilio (vigencia 3 meses) e INE vigente.</p>
                        </div>
                    </div>
                    <div class="faq-item">
                        <h4 class="faq-pregunta">4. ¿En qué tiempo obtengo respuesta a mi solicitud?</h4>
                        <p class="faq-respuesta">De <strong>1 a 3 días hábiles</strong>. En caso de observaciones, el tiempo se reinicia al momento de solventarlas.</p>
                    </div>
                    <div class="faq-item">
                        <h4 class="faq-pregunta">7. ¿En qué se basan para rechazar los giros y líneas seleccionados?</h4>
                        <p class="faq-respuesta text-justify">
                            Se basan estrictamente en las <strong>actividades económicas</strong> registradas en su Constancia de Situación Fiscal (SAT).
                        </p>
                        <div class="faq-fundamento">
                            <strong>FUNDAMENTO LEGAL:</strong><br />
                            Código Fiscal de la Federación, Art. 17-D y 27.<br />
                            Reglamento del CFF, Art. 29 y 30.
                        </div>
                    </div>
                    <div class="faq-item no-border">
                        <h4 class="faq-pregunta">8. ¿Cuál es la vigencia de mi registro?</h4>
                        <p class="faq-respuesta">De la fecha de inscripción al 31 de diciembre del año en curso.</p>
                        <h4 class="faq-pregunta">9. ¿Cuándo puedo renovar mi registro?</h4>
                        <p class="faq-respuesta">A partir del 1 de enero del siguiente año.</p>
                        <h4 class="faq-pregunta">11. ¿Cómo imprimo mi cédula de inscripción?</h4>
                        <p class="faq-respuesta">En la opción: <strong>Mi cuenta / Estado de su perfil</strong>.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="ModalBienvenida" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered" style="max-width: 400px;">
        <div class="modal-content text-center" style="border-radius: 20px; padding: 30px; border: none; font-family: 'Montserrat', sans-serif;">
            <div class="modal-body">
                <div class="mb-4 d-flex justify-content-center">
                    <div style="width: 100px; height: 100px; border-radius: 50%; border: 4px solid #28a745; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-check" style="font-size: 50px; color: #28a745;"></i>
                    </div>
                </div>
                <h1 style="font-weight: 800; color: #323232; font-size: 1.8rem; margin-bottom: 5px;">¡Bienvenido!</h1>
                <p id="txtRFCBienvenida" style="font-size: 1.3rem; color: #666; font-weight: 500; margin-bottom: 30px;"></p>
                <button id="btnAccesarInicio" class="btn-sitio" 
                    style="width: 100%; background-color: #ab0a3d !important; color: #ffffff !important; font-weight: 700 !important; border: none; padding: 15px 0; border-radius: 8px;">
                    ACCESAR
                </button>
            </div>
        </div>
    </div>
</div>
`;

// ... (Mantén tu variable const modalesPadron igual)

document.body.insertAdjacentHTML("beforeend", modalesPadron);

window.abrirRegistro = () => $("#ModalRegistro").modal("show");
window.abrirLogin = () => $("#ModalLogin").modal("show");

// Función para validar RFC en listas negras
async function validarListaNegra(rfc) {
  // Aquí podrías hacer un fetch a una API o una consulta a tu tabla en Supabase
  // Ejemplo: const { data } = await window.clientSupa.from('listas_negras').select().eq('rfc', rfc);

  // Simulación de validación
  console.log("Verificando RFC en listas negras:", rfc);
  return false; // Retorna true si está en lista negra, false si está limpio
}

// ==========================================
// 2. CONTROLADOR DE FORMULARIOS CONSOLIDADO
// ==========================================
document.addEventListener("submit", async (e) => {
  const targetId = e.target.id;

  // --- LÓGICA DE REGISTRO ---
  if (targetId === "FormRegistro") {
    e.preventDefault();

    // 1. Obtención de datos con desestructuración (Punto A)
    const formData = new FormData(e.target);
    const {
      rfc,
      correo,
      pwd,
      "tipo-persona": tipoPersona,
    } = Object.fromEntries(formData);
    const rfcLimpio = rfc.trim().toUpperCase();
    const btn = e.target.querySelector('button[type="submit"]');

    // 2. Validación de Contraseñas y Checkbox
    const checkbox = document.getElementById("checkAviso");
    if (!checkbox.checked) return alert("Debe aceptar el aviso de privacidad.");
    if (pwd !== formData.get("confirm-pwd"))
      return alert("Las contraseñas no coinciden.");

    // 3. Validación Regex
    const regexRFC =
      /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
    if (!regexRFC.test(rfcLimpio)) {
      alert("El formato del RFC es inválido.");
      return;
    }

    try {
      btn.disabled = true;
      btn.innerText = "PROCESANDO...";

      // 4. Verificación Silenciosa del SAT
      const estaEnListaNegra = await consultarListasNegrasSAT(rfcLimpio);

      if (estaEnListaNegra) {
        // REGISTRO DE ALERTA PARA EL ADMINISTRADOR (Punto 3)
        // Esto se guarda en Supabase sin que el usuario vea mensajes de error
        await window.clientSupa.from("alertas_padrón").insert([
          {
            rfc_sospechoso: rfcLimpio,
            correo_usuario: correo,
            motivo: "RFC detectado en Lista Negra SAT (Art. 69-B)",
          },
        ]);
      }

      // 5. Ejecución del Registro (Recuperado el mensaje de éxito)
      const { data, error } = await window.clientSupa.auth.signUp({
        email: correo.toLowerCase().trim(),
        password: pwd,
        options: {
          data: {
            rfc: rfcLimpio,
            tipo_persona: tipoPersona,
            lista_negra: estaEnListaNegra, // Guardamos el estado en la metadata
          },
        },
      });

      if (error) throw error;

      // MENSAJE DE ÉXITO (Recuperado)
      alert("¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.");
      $("#ModalRegistro").modal("hide");
      e.target.reset();
    } catch (err) {
      // Manejo de errores amigable (Punto B)
      const msg =
        err.message === "User already registered"
          ? "Este correo ya está registrado."
          : "Error: " + err.message;
      alert(msg);
    } finally {
      btn.disabled = false;
      btn.innerText = "CONTINUAR REGISTRO";
    }
  }

  // --- LÓGICA DE LOGIN ---
  if (targetId === "FormaLogin") {
    e.preventDefault();
    const formData = new FormData(e.target);
    // DESESTRUCTURACIÓN (Punto A)
    const { correo_login, password_login } = Object.fromEntries(formData);
    const btn = e.target.querySelector('button[type="submit"]');

    try {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> VERIFICANDO...';

      const { data, error } = await window.clientSupa.auth.signInWithPassword({
        email: correo_login.trim().toLowerCase(),
        password: password_login,
      });

      if (error) throw error;

      if (data.user) {
        localStorage.setItem("userEmail", data.user.email);
        const rfcUsuario = data.user.user_metadata?.rfc || "S/R";

        // Ajuste: Margen de 24 horas para ser considerado nuevo
        const fechaCreacion = new Date(data.user.created_at).getTime();
        const ahora = new Date().getTime();
        const esNuevo = ahora - fechaCreacion < 86400000;

        $("#ModalLogin").modal("hide");

        $("#ModalLogin").one("hidden.bs.modal", function () {
          const modalB = $("#ModalBienvenida");
          if (modalB.length > 0) {
            const txtRFC = document.getElementById("txtRFCBienvenida");
            if (txtRFC) txtRFC.innerText = rfcUsuario;
            modalB.modal("show");

            document.getElementById("btnAccesarInicio").onclick = function () {
              this.innerHTML =
                '<i class="fas fa-sync fa-spin"></i> ENTRANDO...';

              const modo = esNuevo ? "n" : "r";
              // Redirección Limpia: Sin Hash para carga normal
              window.location.assign(`./inicio/inicio.html?u=${modo}`);
            };
          } else {
            const modo = esNuevo ? "n" : "r";
            window.location.assign(`./inicio/inicio.html?u=${modo}`);
          }
        });
      }
    } catch (err) {
      // Manejo de errores más legible (Punto B)
      const mensajesError = {
        "Invalid login credentials": "Correo o contraseña incorrectos.",
        "Email not confirmed": "Por favor, verifica tu correo antes de entrar.",
      };

      alert("Error: " + (mensajesError[err.message] || err.message));

      btn.disabled = false;
      btn.innerText = "INICIAR SESIÓN";
    }
  }
});

// ==========================================
// 0. INTERCEPTOR DE SESIÓN GLOBAL (Punto 3)
// ==========================================
document.addEventListener(
  "click",
  async (e) => {
    // Detecta si el clic fue en un botón de Login o Registro
    const btnAcceso = e.target.closest(
      '[onclick*="abrirLogin"], [onclick*="abrirRegistro"], [data-target="#ModalLogin"]',
    );

    if (btnAcceso && window.clientSupa) {
      const {
        data: { session },
      } = await window.clientSupa.auth.getSession();

      if (session) {
        // Detenemos la apertura del modal
        e.preventDefault();
        e.stopImmediatePropagation();

        const rfc = session.user.user_metadata?.rfc || "usuario";
        if (confirm(`Sesión activa: ${rfc}.\n¿Ir al panel de control?`)) {
          window.location.assign("./inicio/inicio.html?u=r");
        }
      }
    }
  },
  true,
); // El 'true' permite capturar el evento antes que los otros scripts
