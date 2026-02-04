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
                <div class="instruccion-registro">Capture los siguientes datos para iniciar su proceso:</div>
                
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
                            <strong>Aviso de Privacidad:</strong> Sus datos serán protegidos de acuerdo a la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados.
                        </p>
                        <div class="contenedor-check">
                            <input type="checkbox" id="checkAviso"> 
                            <label for="checkAviso" style="margin:0; cursor:pointer;">Acepto el aviso de privacidad y autorizo la publicación de mis datos.</label>
                        </div>
                    </div>

                    <div class="footer-registro-fuera" style="display: flex; justify-content: center; margin-top: 20px;">
                        <button type="submit" class="btn-registro-continuar">Continuar Registro</button>
                    </div>
                </form> </div>
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
`;
// 1. INYECCIÓN Y APERTURA (Garantiza que los botones funcionen)
document.body.insertAdjacentHTML("beforeend", modalesPadron);

window.abrirRegistro = () => $("#ModalRegistro").modal("show");
window.abrirLogin = () => $("#ModalLogin").modal("show");

$(document).on("click", '[data-toggle="modal"]', function () {
  $($(this).attr("data-target")).modal("show");
});

// --- MANEJO DE ENVÍO A SUPABASE AUTH ---
document.addEventListener("submit", async (e) => {
  if (e.target && e.target.id === "FormRegistro") {
    e.preventDefault();

    const formData = new FormData(e.target);
    const pass = formData.get("pwd");
    const rfc = formData.get("rfc").trim().toUpperCase();
    // IMPORTANTE: Aquí cambiamos el nombre para que coincida con tu SQL
    const tipoPersona = formData.get("tipo-persona");

    try {
      const btn = e.target.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerText = "Procesando...";

      const { data, error } = await window.clientSupa.auth.signUp({
        email: formData.get("correo").toLowerCase().trim(),
        password: pass,
        options: {
          data: {
            rfc: rfc,
            tipo_persona: tipoPersona, // <--- AQUÍ: Usamos guion bajo como en tu SQL
          },
        },
      });

      if (error) throw error;

      alert("¡Registro enviado! Revisa tu correo electrónico para confirmar.");
      $("#ModalRegistro").modal("hide");
      e.target.reset();
    } catch (err) {
      // Si esto falla ahora, es que el usuario ya existe o el RFC está repetido
      alert("Error: " + err.message);
    } finally {
      const btn = e.target.querySelector('button[type="submit"]');
      btn.disabled = false;
      btn.innerText = "Continuar Registro";
    }
  }
});

// 3. LOGICA DE LOGIN (Con la redirección que pediste)
document.addEventListener("submit", async (e) => {
  if (e.target && e.target.id === "FormaLogin") {
    e.preventDefault();
    const formData = new FormData(e.target);
    const btn = e.target.querySelector('button[type="submit"]');

    try {
      btn.disabled = true;
      btn.innerText = "Entrando...";

      const { data, error } = await window.clientSupa.auth.signInWithPassword({
        email: formData.get("correo_login").trim().toLowerCase(),
        password: formData.get("password_login"),
      });

      if (error) throw error;

      // Guardamos el email para usarlo en la página de inicio
      localStorage.setItem("userEmail", data.user.email);

      // Redirección a la carpeta específica
      window.location.assign("inicio/inicio.html");
    } catch (err) {
      alert(
        "Error: " +
          (err.message === "Invalid login credentials"
            ? "Datos incorrectos"
            : err.message),
      );
    } finally {
      btn.disabled = false;
      btn.innerText = "INICIAR SESIÓN";
    }
  }
});
