(function () {
  // --- 1. ICONOS SVG COMPACTOS ---
  const ICONOS = {
    inicio:
      '<svg viewBox="0 0 576 512"><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg>',
    registro:
      '<svg viewBox="0 0 512 512"><path d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"></path></svg>',
    consultar:
      '<svg viewBox="0 0 512 512"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>',
    atencion:
      '<svg viewBox="0 0 512 512"><path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>',
    marco:
      '<svg viewBox="0 0 512 512"><path d="M504.971 199.362l-22.627-22.627c-9.373-9.373-24.569-9.373-33.941 0l-5.657 5.657-115.705-115.705 5.657-5.657c9.373-9.373 9.373-24.569 0-33.941L312.638 7.029c-9.373-9.373-24.569-9.373-33.941 0L154.246 131.48c-9.373 131.48-9.373 24.569 0 33.941l22.627 22.627c9.373 9.373 24.569 9.373 33.941 0l5.657-5.657 39.598 39.598-81.04 81.04-5.657-5.657c-12.497-12.497-32.758-12.497-45.255 0L9.373 412.118c-12.497 12.497-12.497 32.758 0 45.255l45.255 45.255c12.497 12.497 32.758 12.497 45.255 0l114.745-114.745c12.497-12.497 12.497-32.758 0-45.255l-5.657-5.657 81.04-81.04 39.598 39.598-5.657 5.657c9.373 9.373 24.569 9.373 33.941 0l22.627-22.627c9.373-9.373 9.373-24.569 0-33.941l-5.657-5.657 115.705 115.705 5.657-5.657c0 0 9.372-9.372 0-33.941z"></path></svg>',
    user: '<svg viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>',
  };

  let estadoSesionActual = null;
  let estaRenderizandoMenu = false;

  // --- 2. INYECCIÓN DINÁMICA DE TODOS LOS MODALES ---
  function asegurarTodosLosModalesEnBody() {
    if (document.getElementById("ModalRegistro")) return;

    const pathActual = window.location.pathname;
    const enSubcarpeta =
      pathActual.includes("/inicio/") || pathActual.includes("/paginas/");
    const rutaRestaurar = enSubcarpeta ? "../restaurar.html" : "restaurar.html";

    const modalesHTML = `
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
                            <button type="submit" id="btn-submit-login" class="btn-registro-continuar" style="width:100%; margin-top:10px;">INICIAR SESIÓN</button>
                        </form>
                        <div style="text-align:center; margin-top:20px;">
                            <a href="${rutaRestaurar}" style="font-size:0.9rem; color:#ab0a3d; font-weight:700; text-decoration:none;">¿Olvidó su contraseña?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="ModalLoginAdmin" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal-caja-login">
                    <div class="modal-header-login">
                        <h2>Panel de Administración</h2>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body" style="padding: 30px;">
                        <form id="FormaLoginAdmin">
                            <div class="form-group-custom">
                                <label>Correo Electrónico:</label>
                                <input type="email" id="admin-user" name="correo_admin" class="input-institucional" placeholder="ejemplo@correo.com" required />
                            </div>
                            <div class="form-group-custom">
                                <label>Contraseña:</label>
                                <input type="password" id="admin-pass" name="password_admin" class="input-institucional" placeholder="********" required />
                            </div>
                            <button type="submit" id="btn-submit-admin" class="btn-registro-continuar" style="width:100%; margin-top:10px;">INICIAR SESIÓN ADMIN</button>
                        </form>
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
                                            <label class="mr-4 mb-0"><input type="radio" name="tipo_persona" value="Fisica" required> Física</label>
                                            <label class="mb-0"><input type="radio" name="tipo_persona" value="Moral"> Moral</label>
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
                <h2 class="modal-title">Requisitos</h2>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
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
                  <div class="item-anexo"><h5 class="nombre-anexo">Solicitud de registro / revalidación.</h5><a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20I%20-%20IA.docx" download class="btn-anexo">ANEXO I</a></div>
                  <div class="item-anexo"><h5 class="nombre-anexo">Carta bajo protesta de decir verdad de no estar impedido para contratar (Art. 77 Ley de Adquisiciones y Art. 69-B CFF).</h5><a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20II.docx" download class="btn-anexo">ANEXO II</a></div>
                  <div class="item-anexo"><h5 class="nombre-anexo">Carta de manifiesto bajo protesta de decir verdad de no estar inhabilitado para procedimientos de adjudicación.</h5><a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20III.docx" download class="btn-anexo">ANEXO III</a></div>
                  <div class="item-anexo"><h5 class="nombre-anexo">Carta de manifiesto de no desempeñar cargo público o incurrir en conflicto de interés con la Administración Pública Municipal.</h5><a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20IV.docx" download class="btn-anexo">ANEXO IV</a></div>
                  <div class="item-anexo no-border"><h5 class="nombre-anexo">Carta bajo protesta de decir verdad de encontrarse al corriente de las obligaciones fiscales.</h5><a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20V.docx" download class="btn-anexo">ANEXO V</a></div>
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

    document.body.insertAdjacentHTML("beforeend", modalesHTML);
  }

  // --- VARIABLES DE CONTROL DE FLUJO (Asegurar Ámbito) ---
  let estadoSesionActual = "SIN_SESION";

  // --- 3. RENDERIZADO DEL MENÚ NAVBAR ---
  async function renderizarMenu() {
    if (estaRenderizandoMenu) return;
    estaRenderizandoMenu = true;

    const navPlaceholder = document.getElementById("nav-placeholder");
    if (!navPlaceholder) {
      estaRenderizandoMenu = false;
      return;
    }

    const pathActual = window.location.pathname;
    const esPaginaInicio = pathActual.includes("/inicio/inicio.html");
    const baseRaiz = esPaginaInicio ? "../index.html" : "index.html";

    let itemUsuarioHTML = `<li><a href="#" data-toggle="modal" data-target="#ModalLogin" class="nav-link-item">${ICONOS.user} Acceder</a></li>`;
    let tieneSesion = false;

    try {
      if (window.clientSupa) {
        const { data: { session }, error } = await window.clientSupa.auth.getSession();
        if (error) throw error;

        if (session) {
          tieneSesion = true;
          itemUsuarioHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link-item dropdown-toggle" href="javascript:void(0);" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    ${ICONOS.user} MI CUENTA
                </a>
                <div class="dropdown-menu dropdown-menu-right menu-guinda-compacto" aria-labelledby="navbarDropdown">
                    <a class="dropdown-item nav-action-link" href="javascript:void(0);" data-sec="seccion-bienvenida"><i class="fas fa-home"></i> INICIO</a>
                    <a class="dropdown-item nav-action-link" href="javascript:void(0);" data-sec="estado-perfil"><i class="fas fa-info-circle"></i> ESTADO DE PERFIL</a>
                    <a class="dropdown-item nav-action-link" href="javascript:void(0);" data-sec="actualizar-datos"><i class="fas fa-edit"></i> ACTUALIZAR DATOS</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="javascript:void(0);" id="btn-logout"><i class="fas fa-external-link-alt"></i> CERRAR SESIÓN</a>
                </div>
            </li>`;
        }
      }
    } catch (e) {
      console.error("Error validando sesión en menú:", e);
    }

    estadoSesionActual = tieneSesion ? "CON_SESION" : "SIN_SESION";

    navPlaceholder.innerHTML = `
        <nav class="mi-navbar">
            <div class="mi-container">
                <a href="javascript:void(0)" id="link-admin-secret" class="mi-brand">PADRÓN DE PROVEEDORES</a>
                <button class="menu-toggle" id="btn-toggle"><span class="bar"></span><span class="bar"></span><span class="bar"></span></button>
                <ul class="mi-menu" id="nav-menu">
                    <li><a href="${baseRaiz}#inicio" class="nav-link-item">${ICONOS.inicio}Inicio</a></li>
                    <li><a href="${baseRaiz}#registro" class="nav-link-item">${ICONOS.registro}Registro</a></li>
                    <li><a href="${baseRaiz}#consultar" class="nav-link-item">${ICONOS.consultar}Consultar</a></li>
                    <li><a href="${baseRaiz}#atencion-aclaraciones" class="nav-link-item">${ICONOS.atencion}Atención</a></li>
                    <li><a href="${baseRaiz}#marco" class="nav-link-item">${ICONOS.marco}Marco Legal</a></li>
                    ${itemUsuarioHTML}
                </ul>
            </div>
        </nav>`;

    document.dispatchEvent(new CustomEvent("navbarCargada"));
    vincularAccesoAdmin(); 
    estaRenderizandoMenu = false;
  }
  window.renderizarMenu = renderizarMenu;

  // --- 4. CONFIGURACIÓN E INICIALIZACIÓN ---
  document.addEventListener("DOMContentLoaded", async function () {
    const headContenido = `
        <style>
            html, body { height: 100%; margin: 0; }
            body { display: flex; flex-direction: column; }
            #nav-placeholder { flex-shrink: 0; }
            main, .container, #contenedor-principal-inicio { flex: 1 0 auto; }
            #footer-placeholder { flex-shrink: 0; }
            .mi-navbar .mi-menu svg { width: 1.2rem !important; height: 1.2rem !important; margin-right: 8px; fill: currentColor; vertical-align: middle; flex-shrink: 0; }
            .menu-guinda-compacto { background-color: #ab0a3d; border: 1px solid #ffd700; z-index: 9999; }
            .menu-guinda-compacto .dropdown-item { color: white; font-weight: 600; font-size: 0.85rem; padding: 10px 20px; }
            .menu-guinda-compacto .dropdown-item:hover { background-color: #323232; color: #ffd700; }
            .mi-footer { background-color: #ab0a3d; padding: 20px 0; color: white; text-align: center; text-transform: uppercase; font-weight: 700; width: 100%; }
            .contenido-seccion { display: none; }
            .contenido-seccion.activa { display: block !important; }
            
            .modal-institucional-admin { border-radius: 25px !important; overflow: hidden !important; border: none !important; padding: 0 !important; font-family: 'Montserrat', sans-serif, Arial; }
            .swal2-styled.swal2-confirm { background-color: #ab0a3d !important; border-radius: 10px !important; padding: 10px 30px !important; }
            .swal2-icon.swal2-success { border-color: #ab0a3d !important; color: #ab0a3d !important; }
            .swal2-icon.swal2-success [class^='swal2-success-line'] { background-color: #ab0a3d !important; }
            .swal2-icon.swal2-success .swal2-success-ring { border: 4px solid rgba(171, 10, 61, 0.3) !important; }
            .swal2-icon.swal2-error { border-color: #ab0a3d !important; color: #ab0a3d !important; }
            .swal2-icon.swal2-error [class^='swal2-x-mark-line'] { background-color: #ab0a3d !important; }
            .swal2-loader { border-color: #ab0a3d transparent #ab0a3d transparent !important; }
        </style>`;
    document.head.insertAdjacentHTML("beforeend", headContenido);

    asegurarTodosLosModalesEnBody();
    await renderizarMenu();

    if (window.clientSupa) {
      window.clientSupa.auth.onAuthStateChange(async (event, session) => {
        const estadoObjetivo = session ? "CON_SESION" : "SIN_SESION";
        if (
          (event === "SIGNED_IN" || event === "SIGNED_OUT") &&
          estadoObjetivo !== estadoSesionActual
        ) {
          await renderizarMenu();
        }
      });
    }

    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = `<footer class="mi-footer">© 2026 H. Ayuntamiento. Todos los derechos reservados.</footer>`;
    }
  });

  // --- 5. ATENCION DE ACCESO ADMIN: CONTROL + ALT + DOBLE CLIC ---
  const vincularAccesoAdmin = () => {
    const brandLink = document.getElementById("link-admin-secret");
    if (brandLink && !brandLink.dataset.adminVinculado) {
      brandLink.dataset.adminVinculado = "true";

      brandLink.addEventListener("dblclick", (e) => {
        if (e.ctrlKey && e.altKey) {
          e.preventDefault();
          window.abrirLoginAdmin();
        }
      });

      brandLink.addEventListener("click", (e) => {
        if (e.ctrlKey && e.altKey) {
          e.preventDefault();
        }
      });
    }
  };

  const observer = new MutationObserver(() => vincularAccesoAdmin());
  observer.observe(document.body, { childList: true, subtree: true });

  // --- 6. CONTROLADOR CRÍTICO: DELEGACIÓN GLOBAL DE EVENTOS ---
  document.addEventListener("click", function (e) {
    const triggerModal = e.target.closest('[data-toggle="modal"]');
    if (triggerModal) {
      // Dejar que Bootstrap maneje el modal de forma nativa. Solo intervenimos si jQuery no responde automáticamente.
      const targetId = triggerModal.getAttribute("data-target");
      if (window.jQuery && typeof $.fn.modal === 'function') {
        const modalElement = $(targetId);
        if (modalElement.length && !modalElement.hasClass('show')) {
          e.preventDefault();
          modalElement.modal("show");
        }
      } else {
        console.warn(`Librerías de Bootstrap/jQuery no detectadas para inicializar: ${targetId}`);
      }
      return;
    }

    const linkAccion = e.target.closest(".nav-action-link");
    if (linkAccion) {
      e.preventDefault();
      const idObjetivo = linkAccion.getAttribute("data-sec");
      const pathActual = window.location.pathname;
      const esPaginaInicio = pathActual.includes("/inicio/inicio.html");

      if (esPaginaInicio) {
        window.gestionarVisibilidadSeccion(idObjetivo);
      } else {
        const enSubcarpeta = pathActual.includes("/inicio/") || pathActual.includes("/paginas/");
        const baseInicio = enSubcarpeta ? "inicio.html" : "inicio/inicio.html";
        window.location.href = `${baseInicio}?sec=${idObjetivo}`;
      }
      return;
    }

    if (e.target.closest("#btn-logout")) {
      e.preventDefault();
      window.cerrarSesion();
      return;
    }

    if (e.target.closest("#btn-toggle")) {
      const btnToggle = document.getElementById("btn-toggle");
      const navMenu = document.getElementById("nav-menu");
      if (btnToggle && navMenu) {
        navMenu.classList.toggle("active");
        btnToggle.classList.toggle("open");
      }
      return;
    }
  });

  // --- 7. PROCESAMIENTO DE SUBMITS (Formularios dinámicos) ---
  document.addEventListener("submit", async (e) => {
    const targetId = e.target.id;
    if (!["FormaLogin", "FormRegistro", "FormaLoginAdmin"].includes(targetId)) return;
    e.preventDefault();

    const btnSubmit = e.target.querySelector('button[type="submit"]');
    const formData = new FormData(e.target);
    const datos = Object.fromEntries(formData);

    // CONTROL DE ACCESO USUARIOS (FormaLogin)
    if (targetId === "FormaLogin") {
      try {
        if (btnSubmit) {
          btnSubmit.disabled = true;
          btnSubmit.innerText = "VERIFICANDO...";
        }
        const { error } = await window.clientSupa.auth.signInWithPassword({
          email: datos.correo_login.toLowerCase().trim(),
          password: datos.password_login,
        });
        if (error) throw error;

        if (window.jQuery) {
          const mLogin = $("#ModalLogin").length ? $("#ModalLogin") : $("#modalLogin");
          mLogin.modal("hide");
        }

        const enSubcarpeta = window.location.pathname.includes("/inicio/") || window.location.pathname.includes("/paginas/");
        const baseDestino = enSubcarpeta ? "inicio.html" : "inicio/inicio.html";
        window.location.href = `${baseDestino}?sec=seccion-bienvenida`;
      } catch (err) {
        alert("Error de acceso: " + err.message);
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerText = "INICIAR SESIÓN";
        }
      }
    }

    // CONTROL DE ACCESO ADMIN (FormaLoginAdmin)
    if (targetId === "FormaLoginAdmin") {
      const adminUser = document.getElementById("admin-user")?.value;
      const adminPass = document.getElementById("admin-pass")?.value;

      if (!adminUser || !adminPass) {
        window.AlertaAdmin("Atención", "Por favor llene todos los campos", "warning");
        return;
      }

      try {
        if (btnSubmit) {
          btnSubmit.disabled = true;
          btnSubmit.innerText = "VERIFICANDO...";
        }

        if (window.Swal) {
          Swal.fire({
            title: "VERIFICANDO",
            customClass: { popup: "modal-institucional-admin" },
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false,
          });
        }

        const { data, error: authError } = await window.clientSupa.auth.signInWithPassword({
          email: adminUser.toLowerCase().trim(),
          password: adminPass,
        });
        if (authError) throw new Error("Credenciales inválidas");

        const { data: perfil, error: dbError } = await window.clientSupa
          .from("usuarios")
          .select("rol")
          .eq("id", data.user.id)
          .single();

        if (dbError || !perfil || perfil.rol !== "ADMIN") {
          await window.clientSupa.auth.signOut();
          throw new Error("No tienes permisos de administrador");
        }

        if (window.jQuery) {
          const mAdmin = $("#ModalLoginAdmin").length ? $("#ModalLoginAdmin") : $("#modalLoginAdmin");
          mAdmin.modal("hide");
        }

        window.AlertaAdmin("¡Bienvenido!", "Accediendo al panel de administración...", "success")
          .then(() => {
            window.location.href = "admin/admin_panel.html";
          });
      } catch (err) {
        if (window.Swal) Swal.close();
        window.AlertaAdmin("Acceso Denegado", err.message, "error");
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerText = "INICIAR SESIÓN ADMIN";
        }
      }
    }

    // REGISTRO DE NUEVO PROVEEDOR (FormRegistro)
    if (targetId === "FormRegistro") {
      const rfcLimpio = datos.rfc?.trim().toUpperCase().replace(/[^A-Z0-9]/g, "") || "";

      if (!document.getElementById("checkAviso")?.checked) {
        return alert("Debe aceptar el aviso de privacidad.");
      }
      if (!datos.pwd || datos.pwd.length < 8) {
        return alert("La contraseña debe tener al menos 8 caracteres.");
      }
      if (datos.pwd !== datos["confirm-pwd"]) {
        return alert("Las contraseñas no coinciden.");
      }

      try {
        if (btnSubmit) {
          btnSubmit.disabled = true;
          btnSubmit.innerText = "PROCESANDO...";
        }

        const { error } = await window.clientSupa.auth.signUp({
          email: datos.correo.toLowerCase().trim(),
          password: datos.pwd,
          options: {
            data: { rfc: rfcLimpio, tipo_persona: datos.tipo_persona },
          },
        });
        if (error) throw error;

        alert("¡Registro enviado! Por favor, revise su correo para confirmar su cuenta.");
        if (window.jQuery) {
          const mReg = $("#ModalRegistro").length ? $("#ModalRegistro") : $("#modalRegistro");
          mReg.modal("hide");
        }
        e.target.reset();
      } catch (err) {
        if (err.message && err.message.includes("changedAccessToken")) {
          alert("¡Registro completado! Revise su correo.");
          if (window.jQuery) {
            const mReg = $("#ModalRegistro").length ? $("#ModalRegistro") : $("#modalRegistro");
            mReg.modal("hide");
          }
          e.target.reset();
        } else {
          alert("Error: " + (err.message || "Error desconocido"));
        }
      } finaly {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerText = "CONTINUAR REGISTRO";
        }
      }
    }
  });

  // --- 8. AYUDANTES GLOBALES Y MANEJO DE MODALES ---
  window.gestionarVisibilidadSeccion = function (idObjetivo, addToHistory = true) {
    const secciones = document.querySelectorAll(".contenido-seccion");
    secciones.forEach((sec) => { sec.style.display = "none"; });

    const seccionAMostrar = document.getElementById(idObjetivo);
    if (seccionAMostrar) {
      seccionAMostrar.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (addToHistory) {
        history.pushState({ id: idObjetivo }, "", `?sec=${idObjetivo}`);
      }
    }
  };

  window.cerrarSesion = async function () {
    if (window.clientSupa) {
      try {
        await window.clientSupa.auth.signOut();
      } catch (e) {
        console.error("Error al cerrar sesión:", e);
      } finally {
        const enSubcarpeta = window.location.pathname.includes("/inicio/") || window.location.pathname.includes("/paginas/");
        window.location.href = enSubcarpeta ? "../index.html" : "index.html";
      }
    }
  };

  window.AlertaAdmin = function (titulo, mensaje, icono = "info") {
    if (window.Swal) {
      return Swal.fire({
        title: titulo.toUpperCase(),
        text: mensaje,
        icon: icono,
        customClass: { popup: "modal-institucional-admin" },
        confirmButtonText: "ACEPTAR",
        buttonsStyling: true,
      });
    } else {
      alert(`${titulo}: ${mensaje}`);
      return Promise.resolve();
    }
  };

  // Manejo de modales flexible (Acepta variaciones de ID en mayúsculas/minúsculas)
  window.abrirRegistro = () => { if (window.jQuery) ($("#ModalRegistro").length ? $("#ModalRegistro") : $("#modalRegistro")).modal("show"); };
  window.abrirLogin = () => { if (window.jQuery) ($("#ModalLogin").length ? $("#ModalLogin") : $("#modalLogin")).modal("show"); };
  window.abrirLoginAdmin = () => { if (window.jQuery) ($("#ModalLoginAdmin").length ? $("#ModalLoginAdmin") : $("#modalLoginAdmin")).modal("show"); };
  window.abrirRequisitos = () => { if (window.jQuery) ($("#modalRequisitos").length ? $("#modalRequisitos") : $("#modalRequisitos")).modal("show"); };
  window.abrirFormatos = () => { if (window.jQuery) ($("#modalFormatos").length ? $("#modalFormatos") : $("#modalFormatos")).modal("show"); };
  window.abrirPreguntas = () => { if (window.jQuery) ($("#ModalPreguntas").length ? $("#ModalPreguntas") : $("#modalPreguntas")).modal("show"); };
})();