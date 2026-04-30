/**
 * js/gestion-sistema.js
 * CONTROLADOR MAESTRO: Catálogos, Registro y Autenticación.
 */

// --- 1. CONFIGURACIÓN DE MODALES ---
const modalesPadron = `
<div class="modal fade" id="ModalLogin" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-caja-login">
            <div class="modal-header-login">
                <h2 style="margin:0;">Inicio de Sesión</h2>
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
                    <button type="submit" id="btnSubmitLogin" class="btn-registro-continuar" style="width:100%; margin-top:10px;">INICIAR SESIÓN</button>
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
                <h2 style="margin:0;">Registro al Padrón de Proveedores</h2>
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
                        <p class="texto-aviso"><strong>Aviso de Privacidad:</strong> Sus datos serán protegidos de acuerdo a la Ley.</p>
                        <div class="contenedor-check">
                            <input type="checkbox" id="checkAviso" required> 
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

<!-- Modal de Bienvenida (Éxito) -->
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
                <p id="txtRFCBienvenida" style="font-size: 1.2rem; color: #666;"></p>
                <button id="btnAccesarInicio" class="btn-registro-continuar" style="width: 100%;">ACCESAR</button>
            </div>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML("beforeend", modalesPadron);

// --- 2. GESTIÓN DE CATÁLOGOS ---
let mapaDatos = {};

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
  Object.keys(mapaDatos).forEach((id) => {
    const giro = mapaDatos[id];
    const seccion = document.createElement("div");
    seccion.className =
      "seccion-contenedor-giro my-4 p-3 shadow-sm bg-white rounded border";
    seccion.innerHTML = `
            <h5 class="text-center" style="color: #ab0a3d;">GIRO ${id}: ${giro.nombre.toUpperCase()}</h5>
            <div class="table-responsive">
                <table class="table table-sm table-hover table-bordered">
                    <thead style="background-color: #ab0a3d; color: white;">
                        <tr><th>Línea</th><th>Descripción</th></tr>
                    </thead>
                    <tbody>
                        ${giro.lineas.map((l) => `<tr><td><strong>${l.nombre}</strong></td><td>${l.desc}</td></tr>`).join("")}
                    </tbody>
                </table>
            </div>`;
    contenedor.appendChild(seccion);
  });
}

// --- 3. PROCESAMIENTO DE FORMULARIOS (LOGIN) ---
document.addEventListener("submit", async (e) => {
  if (e.target.id === "FormaLogin") {
    e.preventDefault();
    const form = e.target;
    const btn = document.getElementById("btnSubmitLogin");
    const formData = new FormData(form);
    const datos = Object.fromEntries(formData.entries());

    try {
      if (btn) {
        btn.disabled = true;
        btn.innerText = "VALIDANDO...";
      }

      const { data, error } = await window.clientSupa.auth.signInWithPassword({
        email: datos.correo_login.trim().toLowerCase(),
        password: datos.password_login,
      });

      if (error) throw error;

      // Ocultar login y mostrar bienvenida
      $("#ModalLogin").modal("hide");

      // Esperar a que el modal se cierre para mostrar el siguiente (evita conflictos de scroll)
      $("#ModalLogin").one("hidden.bs.modal", () => {
        const txtRFC = document.getElementById("txtRFCBienvenida");
        if (txtRFC) {
          txtRFC.innerText = data.user.user_metadata.rfc || "Usuario";
        }

        $("#ModalBienvenida").modal("show");

        document.getElementById("btnAccesarInicio").onclick = () => {
          const esNuevo =
            new Date() - new Date(data.user.created_at) < 86400000;
          const parametroU = esNuevo ? "n" : "r";

          // Redirección segura
          const url = new URL(
            "inicio/inicio.html",
            window.location.origin + window.location.pathname,
          );
          url.searchParams.set("u", parametroU);
          window.location.assign(url.href);
        };
      });
    } catch (err) {
      alert("Acceso denegado: " + err.message);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerText = "INICIAR SESIÓN";
      }
    }
  }
});

// --- 4. AYUDANTES DE APERTURA (GLOBALES) ---
window.abrirRegistro = () => $("#ModalRegistro").modal("show");
window.abrirLogin = () => $("#ModalLogin").modal("show");
window.abrirRequisitos = () => $("#modalRequisitos").modal("show");
window.abrirFormatos = () => $("#modalFormatos").modal("show");
window.abrirPreguntas = () => $("#ModalPreguntas").modal("show");

// Inicialización
document.addEventListener("DOMContentLoaded", cargarDatosSupabase);
