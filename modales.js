// Archivo: modales.js
// Contiene la estructura de los modales para el Padrón de Proveedores

const modalesPadron = `
 <div id="ContenedorEmergente" class="mi-overlay-unico" style="display:none;">
      <div class="mi-modal-caja">
        <div class="mi-modal-header" style="background: #ab0a3d; padding: 20px; text-align: center; position: relative;">
          <span class="mi-cerrar" onclick="cerrarEmergente()" style="position: absolute; top: 10px; right: 15px; color: white; font-size: 28px; cursor: pointer;">&times;</span>
          <svg width="60" fill="white" viewBox="0 0 512 512" style="margin: 0 auto; display: block;">
            <path d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z"></path>
          </svg>
        </div>
        <div class="mi-modal-body" style="padding: 30px;">
          <form id="FormaLogin">
            <label style="font-weight: bold; color: #333; display: block; margin-bottom: 5px;">RFC / Usuario:</label>
            <input type="text" style="text-transform: uppercase;" name="rfc" class="mi-input-azul" placeholder="USUARIO" required />
            <label style="font-weight: bold; color: #333; margin-top: 15px; display: block; margin-bottom: 5px;">Contraseña:</label>
            <input type="password" name="Password" class="mi-input-azul" placeholder="********" required />
            <button type="submit" class="mi-btn-guinda" style="width: 100%; background: #ab0a3d; color: white; padding: 12px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; margin-top: 20px;">INICIAR SESIÓN</button>
          </form>
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
                                        <input type="radio" name="tipo-persona" value="Física"> Física
                                    </label>
                                    <label class="mb-0 cursor-pointer">
                                        <input type="radio" name="tipo-persona" value="Moral"> Moral
                                    </label>
                                </div>
                            </div>

                            <div class="form-group mb-4">
                                <label class="reg-label">RFC:</label>
                                <input type="text" class="form-control reg-input-custom" name="rfc" placeholder="RFC CON HOMOCLAVE">
                            </div>

                            <div class="form-group mb-4">
                                <label class="reg-label">Correo Electrónico:</label>
                                <input type="email" class="form-control reg-input-custom" name="correo" placeholder="ejemplo@correo.com">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="form-group mb-4">
                                <label class="reg-label">Contraseña:</label>
                                <input type="password" class="form-control reg-input-custom" name="pwd" placeholder="Mínimo 8 caracteres">
                            </div>

                            <div class="form-group mb-4">
                                <label class="reg-label">Confirmar Contraseña:</label>
                                <input type="password" class="form-control reg-input-custom" name="confirmar-pwd">
                            </div>
                        </div>
                    </div>

                    <div class="reg-aviso-box">
    <p class="reg-aviso-texto">
        <strong>Aviso de Privacidad:</strong> Sus datos serán protegidos de acuerdo a la Ley General de Protección de Datos Personales. El registro constituye una fuente de acceso público conforme a la normatividad vigente.
    </p>
    
    <label class="reg-label-check" style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-weight: 700;">
        <input type="checkbox" name="acepta-aviso" id="acepta-aviso" required style="transform: scale(1.3); margin-top: 4px;">
        <span>Acepto el aviso de privacidad y autorizo la publicación de mis datos.</span>
    </label>
</div>

<div style="text-align: center; margin-top: 30px;">
   <button type="submit" class="btn-continuar-img1">
    CONTINUAR REGISTRO
</button>
</div>
                </form>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modalRequisitos" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h2 class="modal-title">REQUISITOS</h2>
      </div>

      <div class="modal-body">
        <div class="row">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-6">
                <h4 class="req-subtitle">Documentación Personal</h4>
                <ul class="req-list">
                  <li>Acta de nacimiento (Persona Física).</li>
                  <li>Cédula de Clave Única de Registro de Población CURP (Persona Física).</li>
                  <li>Acta constitutiva y sus modificaciones, así como el instrumento notarial en el cual conste la representación legal (Persona Moral).</li>
                  <li>Identificación oficial con fotografía.</li>
                  <li>Comprobante de domicilio.</li>
                  <li>Currículum Vitae.</li>
                  <li>Reporte fotográfico del domicilio fiscal.</li>
                </ul>
              </div>

              <div class="col-md-6">
                <h4 class="req-subtitle">Documentación Fiscal</h4>
                <ul class="req-list">
                  <li>Comprobante de pago de derechos.</li>
                  <li>Constancia de Situación Fiscal.</li>
                  <li>Opinión de cumplimiento SAT.</li>
                  <li>Constancia de no adeudo de contribuciones municipales expedida por la Tesorería Municipal del Honorable Ayuntamiento de Atlixco.</li>
                  <li>Declaración anual de impuestos.</li>
                  <li>Ultimas tres declaraciones parciales de impuestos.</li>
                </ul>
              </div>
            </div>

            <div class="req-formatos-box">
              <h4 class="formatos-title">Formatos Proporcionados por el Municipio</h4>
              <ul class="formatos-list">
                <li>Solicitud de registro/revalidación.</li>
                <li>Carta bajo protesta de decir verdad de no estar impedido para contratar conforme al artículo 77 de la Ley de Adquisiciones, y de no estar en el supuesto del artículo 69-B del Código Fiscal de la Federación.</li>
                <li>Carta de manifiesto bajo protesta de decir verdad de no estar inhabilitado para participar en procedimientos de adjudicación.</li>
                <li>Carta de manifiesto bajo protesta de decir verdad de no desempeñar empleo, cargo o comisión en el servicio público o, en su caso, de no incurrir en un conflicto de interés con la Administración Pública Municipal.</li>
                <li>Carta bajo protesta de decir verdad de encontrarse al corriente de las obligaciones fiscales.</li>
              </ul>
            </div>

            <div class="req-footer">
              <a href="Img/REQUISITOS.pdf" download class="btn-descarga-pdf">
                <i class="fas fa-file-pdf"></i> DESCARGAR PDF OFICIAL
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="modalFormatos" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h2 class="modal-title">FORMATOS</h2>
      </div>

      <div class="modal-body">
        <p class="formatos-intro">
          Seleccione el formato correspondiente para su descarga. Todos
          los documentos deben ser requisitados y firmados.
        </p>

        <div class="list-group">
          <div class="formato-item">
            <div class="formato-texto">
              <h5 class="formato-nombre">Solicitud de registro / revalidación.</h5>
            </div>
            <a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20I%20-%20IA.docx" download class="btn-anexo">ANEXO I</a>
          </div>

          <div class="formato-item">
            <div class="formato-texto">
              <h5 class="formato-nombre">Carta bajo protesta de decir verdad de no estar impedido para contratar (Art. 77 Ley de Adquisiciones y Art. 69-B CFF).</h5>
            </div>
            <a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20II.docx" download class="btn-anexo">ANEXO II</a>
          </div>

          <div class="formato-item">
            <div class="formato-texto">
              <h5 class="formato-nombre">Carta de manifiesto bajo protesta de decir verdad de no estar inhabilitado para procedimientos de adjudicación.</h5>
            </div>
            <a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20III.docx" download class="btn-anexo">ANEXO III</a>
          </div>

          <div class="formato-item">
            <div class="formato-texto">
              <h5 class="formato-nombre">Carta de manifiesto de no desempeñar cargo público o incurrir en conflicto de interés con la Administración Pública Municipal.</h5>
            </div>
            <a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20IV.docx" download class="btn-anexo">ANEXO IV</a>
          </div>

          <div class="formato-item border-none">
            <div class="formato-texto">
              <h5 class="formato-nombre">Carta bajo protesta de decir verdad de encontrarse al corriente de las obligaciones fiscales.</h5>
            </div>
            <a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20IV.docx" download class="btn-anexo">ANEXO V</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="ModalPreguntas" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h2 class="modal-title">PREGUNTAS FRECUENTES</h2>
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

// Inyectar los modales al body
document.body.insertAdjacentHTML("beforeend", modalesPadron);

// Usamos delegación de eventos para evitar errores de carga
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

    try {
      // A. Crear el usuario en Authentication
      const { data, error: authError } = await _supabase.auth.signUp({
        email: `${rfc}@proveedor.com`,
        password: password,
      });

      if (authError) throw authError;

      // B. Insertar manualmente en la tabla proveedores
      // Esto reemplaza al Trigger que te fallaba
      const { error: dbError } = await _supabase.from("proveedores").insert([
        {
          id: data.user.id,
          rfc: rfc,
          correo_contacto: correoReal,
          tipo_persona: tipoPersona,
        },
      ]);

      if (dbError) throw dbError;

      alert("¡Registro exitoso! Los datos se guardaron en el padrón.");
      $("#ModalRegistro").modal("hide");
      form.reset();
    } catch (err) {
      alert("Error: " + err.message);
      console.error(err);
    }
  }
});
