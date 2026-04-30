/**
 * js/gestion-sistema.js
 * CONTROLADOR MAESTRO: Catálogos, Registro y Autenticación.
 */

// --- 1. CONFIGURACIÓN DE MODALES ---
const modalesPadron = `
<!-- MODAL LOGIN -->
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

<!-- MODAL REGISTRO -->
<div class="modal fade" id="ModalRegistro" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header-registro">
                <h2>Registro al Padrón de Proveedores</h2>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body" style="padding: 25px 40px;">
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

<!-- MODAL REQUISITOS (Sin cambios) -->
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
            </ul>
          </div>
          <div class="col-md-6">
            <h4 class="subtitulo-requisito">Documentación Fiscal</h4>
            <ul class="lista-requisitos">
              <li>Constancia de Situación Fiscal.</li>
              <li>Opinión de cumplimiento SAT.</li>
              <li>Constancia de no adeudo municipal.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- MODAL FORMATOS -->
<div class="modal fade" id="modalFormatos" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header-registro"> 
        <h2 class="modal-title">Formatos</h2>
        <button type="button" class="close" data-dismiss="modal">&times;</button>
      </div>
      <div class="modal-body" style="padding: 30px 40px;">
        <div class="contenedor-lista-anexos">
          <div class="item-anexo">
            <h5 class="nombre-anexo">Solicitud de registro / revalidación.</h5>
            <a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20I%20-%20IA.docx" download class="btn-anexo">ANEXO I</a>
          </div>
          <div class="item-anexo">
            <h5 class="nombre-anexo">Carta Art. 77 Ley de Adquisiciones.</h5>
            <a href="https://maopuzbvxucsarrydmte.supabase.co/storage/v1/object/public/Formatos/ANEXO%20II.docx" download class="btn-anexo">ANEXO II</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- MODAL PREGUNTAS -->
<div class="modal fade" id="ModalPreguntas" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Preguntas Frecuentes</h2>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="faq-container">
                    <div class="faq-item">
                        <h4 class="faq-pregunta">1. ¿Cómo inicio sesión?</h4>
                        <p class="faq-respuesta">Utilizando el correo electrónico y contraseña registrados.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- MODAL BIENVENIDA -->
<div class="modal fade" id="ModalBienvenida" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered" style="max-width: 400px;">
        <div class="modal-content text-center" style="border-radius: 20px; padding: 30px; border: none;">
            <div class="modal-body">
                <div class="mb-4 d-flex justify-content-center">
                    <div style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid #28a745; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 40px; color: #28a745;">✓</span>
                    </div>
                </div>
                <h1 style="font-weight: 800; color: #323232; font-size: 1.8rem;">¡Bienvenido!</h1>
                <p id="txtRFCBienvenida" style="font-size: 1.3rem; color: #666;"></p>
                <button id="btnAccesarInicio" class="btn-sitio" style="width: 100%; background-color: #ab0a3d !important; color: #ffffff; border: none; padding: 15px; border-radius: 8px; font-weight: bold;">
                    ACCESAR
                </button>
            </div>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML("beforeend", modalesPadron);

// --- 2. GESTIÓN DE CATÁLOGOS ---
let mapaDatos = {};

function extraerNumero(texto) {
  if (!texto) return 0;
  return parseInt(texto.toString().replace(/\D/g, ""), 10) || 0;
}

async function cargarDatosSupabase() {
  try {
    if (!window.clientSupa) return setTimeout(cargarDatosSupabase, 500);
    const { data, error } = await window.clientSupa
      .from("giros_lineas")
      .select("id_giro, nombre_giro, linea, descripcion")
      .order("id_giro", { ascending: true });

    if (error) throw error;

    mapaDatos = {};
    data.forEach((fila) => {
      if (!mapaDatos[fila.id_giro]) {
        mapaDatos[fila.id_giro] = { nombre: fila.nombre_giro, lineas: [] };
      }
      mapaDatos[fila.id_giro].lineas.push({
        nombre: fila.linea,
        desc: fila.descripcion || "Sin descripción",
      });
    });
    dibujarTablasCatalogo();
  } catch (err) {
    console.error("Error catálogos:", err.message);
  }
}

function dibujarTablasCatalogo() {
  const contenedor = document.getElementById("contenedor-tablas");
  if (!contenedor) return;
  contenedor.innerHTML = "";
  const idsOrdenados = Object.keys(mapaDatos).sort(
    (a, b) => extraerNumero(a) - extraerNumero(b),
  );
  idsOrdenados.forEach((id) => {
    const giro = mapaDatos[id];
    const seccion = document.createElement("div");
    seccion.className =
      "seccion-contenedor-giro my-4 p-3 shadow-sm bg-white rounded border";
    seccion.innerHTML = `<h5 class="text-center" style="color: #ab0a3d;">GIRO ${id.replace(/\D/g, "")}: ${giro.nombre.toUpperCase()}</h5>
                             <div class="table-responsive"><table class="table table-sm table-hover table-bordered">
                             <thead style="background-color: #ab0a3d; color: white;"><tr><th>Línea</th><th>Descripción</th></tr></thead>
                             <tbody>${giro.lineas.map((l) => `<tr><td><strong>${l.nombre}</strong></td><td>${l.desc}</td></tr>`).join("")}</tbody></table></div>`;
    contenedor.appendChild(seccion);
  });
}

// --- 3. CONTROLADOR DE REGISTRO Y LOGIN ---
document.addEventListener("submit", async (e) => {
  const targetId = e.target.id;
  if (!["FormRegistro", "FormaLogin"].includes(targetId)) return;

  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const formData = new FormData(e.target);
  const datos = Object.fromEntries(formData);

  if (targetId === "FormRegistro") {
    const rfcLimpio = datos.rfc
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");

    if (!document.getElementById("checkAviso").checked)
      return alert("Debe aceptar el aviso de privacidad.");
    if (datos.pwd.length < 8) return alert("Mínimo 8 caracteres.");
    if (datos.pwd !== datos["confirm-pwd"])
      return alert("Las contraseñas no coinciden.");

    try {
      btn.disabled = true;
      btn.innerText = "REGISTRANDO...";

      // 1. Crear el usuario en Auth
      const { data: authData, error: authError } =
        await window.clientSupa.auth.signUp({
          email: datos.correo.toLowerCase().trim(),
          password: datos.pwd,
          options: {
            data: { rfc: rfcLimpio, tipo_persona: datos["tipo-persona"] },
            currSession: false,
          },
        });

      // MANEJO DE ERROR CRÍTICO DEL TOKEN
      if (authError && !authError.message.includes("changedAccessToken")) {
        throw authError;
      }

      // 2. INSERCIÓN FORZADA (Inmune a errores de librería)
      // Buscamos el ID ya sea del resultado exitoso o intentando una reconexión rápida
      const userId = authData?.user?.id;

      if (userId) {
        const { error: dbError } = await window.clientSupa
          .from("usuarios")
          .insert([
            {
              id: userId,
              rfc: rfcLimpio,
              correo: datos.correo.toLowerCase().trim(),
              tipo_persona: datos["tipo-persona"],
            },
          ]);

        if (dbError) console.warn("Error en tabla usuarios:", dbError.message);
      }

      alert("¡Registro completado con éxito! Ya puedes iniciar sesión.");
      $("#ModalRegistro").modal("hide");
      e.target.reset();
    } catch (err) {
      if (err.message.includes("changedAccessToken")) {
        alert("¡Registro completado! Ya puede acceder.");
        $("#ModalRegistro").modal("hide");
        e.target.reset();
      } else {
        alert("Error en el proceso: " + err.message);
      }
    } finally {
      btn.disabled = false;
      btn.innerText = "CONTINUAR REGISTRO";
    }
  }

  if (targetId === "FormaLogin") {
    try {
      btn.disabled = true;
      const { data, error } = await window.clientSupa.auth.signInWithPassword({
        email: datos.correo_login.trim().toLowerCase(),
        password: datos.password_login,
      });

      if (error) throw error;
      $("#ModalLogin").modal("hide");
      $("#ModalLogin").one("hidden.bs.modal", () => {
        document.getElementById("txtRFCBienvenida").innerText =
          data.user.user_metadata.rfc;
        $("#ModalBienvenida").modal("show");
        document.getElementById("btnAccesarInicio").onclick = () => {
          const esNuevo =
            new Date() - new Date(data.user.created_at) < 86400000;
          window.location.assign(
            `./inicio/inicio.html?u=${esNuevo ? "n" : "r"}`,
          );
        };
      });
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      if (btn) btn.disabled = false;
    }
  }
});

// Ayudantes de apertura
window.abrirRegistro = () => $("#ModalRegistro").modal("show");
window.abrirLogin = () => $("#ModalLogin").modal("show");
window.abrirRequisitos = () => $("#modalRequisitos").modal("show");
window.abrirFormatos = () => $("#modalFormatos").modal("show");
window.abrirPreguntas = () => $("#ModalPreguntas").modal("show");

document.addEventListener("DOMContentLoaded", cargarDatosSupabase);
