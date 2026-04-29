/**
 * js/gestion-sistema.js
 * CONTROLADOR MAESTRO: Catálogos, Registro y Autenticación.
 */

// --- 1. CONFIGURACIÓN DE MODALES ---
// He restaurado todo el HTML para que los modales existan físicamente en tu página
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
                        <input type="checkbox" id="checkAviso"> 
                        <label for="checkAviso">Acepto el aviso de privacidad.</label>
                    </div>
                    <div class="footer-registro-fuera" style="display: flex; justify-content: center; margin-top: 20px;">
                        <button type="submit" class="btn-registro-continuar">Continuar Registro</button>
                    </div>
                </form> 
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="ModalBienvenida" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered" style="max-width: 400px;">
        <div class="modal-content text-center" style="border-radius: 20px; padding: 30px;">
            <h1 style="font-weight: 800; color: #323232;">¡Bienvenido!</h1>
            <p id="txtRFCBienvenida" style="font-size: 1.3rem; color: #666;"></p>
            <button id="btnAccesarInicio" class="btn-sitio" style="width: 100%; background-color: #ab0a3d !important; color: white; padding: 15px; border-radius: 8px; border: none;">ACCESAR</button>
        </div>
    </div>
</div>
`;

// Inyección de los modales en el DOM
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
      return alert("Acepte el aviso de privacidad.");
    if (datos.pwd.length < 8) return alert("Mínimo 8 caracteres.");
    if (datos.pwd !== datos["confirm-pwd"])
      return alert("Las contraseñas no coinciden.");

    try {
      btn.disabled = true;
      btn.innerText = "PROCESANDO...";

      const { data, error } = await window.clientSupa.auth.signUp({
        email: datos.correo.toLowerCase().trim(),
        password: datos.pwd,
        options: {
          data: { rfc: rfcLimpio, tipo_persona: datos["tipo-persona"] },
        },
      });

      if (error) throw error;
      alert("¡Registro exitoso! Revise su correo.");
      $("#ModalRegistro").modal("hide");
    } catch (err) {
      // Manejo del error de token o errores comunes
      if (err.message && err.message.includes("changedAccessToken")) {
        alert("¡Registro exitoso! Revise su correo.");
        $("#ModalRegistro").modal("hide");
      } else {
        alert("Error: " + err.message);
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
      btn.disabled = false;
    }
  }
});

// Ayudantes de apertura
window.abrirRegistro = () => $("#ModalRegistro").modal("show");
window.abrirLogin = () => $("#ModalLogin").modal("show");

document.addEventListener("DOMContentLoaded", cargarDatosSupabase);
