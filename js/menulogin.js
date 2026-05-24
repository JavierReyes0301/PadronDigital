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

// Auxiliar para cerrar modales manualmente en Vanilla JS si Bootstrap falla
function cerrarModalManual(idModal) {
  if (window.jQuery && $(`#${idModal}`).length) {
    $(`#${idModal}`).modal("hide");
  } else {
    const modal = document.getElementById(idModal);
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
      const backdrop = document.getElementById("custom-modal-backdrop");
      if (backdrop) backdrop.remove();
    }
  }
}

// Auxiliar para abrir modales manualmente en Vanilla JS si Bootstrap falla
function abrirModalManual(idModal) {
  if (window.jQuery) {
    $(`#${idModal}`).modal("show");
  } else {
    const modalEl = document.getElementById(idModal);
    if (modalEl) {
      modalEl.classList.add("show");
      modalEl.style.display = "block";
      document.body.classList.add("modal-open");
      let backdrop = document.getElementById("custom-modal-backdrop");
      if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop fade show";
        backdrop.id = "custom-modal-backdrop";
        document.body.appendChild(backdrop);
      }
    }
  }
}

// --- 2. INYECCIÓN DE MODALES ---
function asegurarModalesEnBody() {
  const pathActual = window.location.pathname;
  const enSubcarpeta =
    pathActual.includes("/inicio/") || pathActual.includes("/paginas/");
  const rutaRestaurar = enSubcarpeta ? "../restaurar.html" : "restaurar.html";

  if (!document.getElementById("ModalLogin")) {
    const modalLoginHTML = `
      <div class="modal fade" id="ModalLogin" tabindex="-1" role="dialog" aria-hidden="true" style="background: rgba(0,0,0,0.5);">
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
      </div>`;
    document.body.insertAdjacentHTML("beforeend", modalLoginHTML);
    configurarEventoSubmitLogin();
  }

  if (!document.getElementById("ModalLoginAdmin")) {
    const modalAdminHTML = `
      <div class="modal fade" id="ModalLoginAdmin" tabindex="-1" role="dialog" aria-hidden="true" style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content modal-caja-login">
                  <div class="modal-header-login">
                      <h2>Acceso Administrativo</h2>
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                  </div>
                  <div class="modal-body" style="padding: 30px;">
                      <form id="FormaLoginAdmin">
                          <div class="form-group-custom">
                              <label>Correo Electrónico:</label>
                              <input type="email" name="correo_admin" id="admin-user" class="input-institucional" placeholder="admin@correo.com" required />
                          </div>
                          <div class="form-group-custom">
                              <label>Contraseña:</label>
                              <input type="password" name="password_admin" id="admin-pass" class="input-institucional" placeholder="********" required />
                          </div>
                          <button type="submit" id="btn-submit-admin" class="btn-registro-continuar" style="width:100%; margin-top:10px;">INICIAR SESIÓN PANEL</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>`;
    document.body.insertAdjacentHTML("beforeend", modalAdminHTML);
    configurarEventoSubmitAdmin();
  }
}

// --- 3. PROCESOS DE AUTENTICACIÓN (SUBMITS) ---
function configurarEventoSubmitLogin() {
  const formaLogin = document.getElementById("FormaLogin");
  if (!formaLogin) return;

  formaLogin.onsubmit = async (e) => {
    e.preventDefault();
    const btnSubmit = document.getElementById("btn-submit-login");
    const email = formaLogin.correo_login.value;
    const password = formaLogin.password_login.value;

    try {
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerText = "VERIFICANDO...";
      }

      if (!window.clientSupa) {
        throw new Error(
          "El cliente de Supabase no se ha inicializado correctamente.",
        );
      }

      const { error } = await window.clientSupa.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      cerrarModalManual("ModalLogin");

      const enSubcarpeta =
        window.location.pathname.includes("/inicio/") ||
        window.location.pathname.includes("/paginas/");
      const baseDestino = enSubcarpeta ? "inicio.html" : "inicio/inicio.html";
      window.location.href = `${baseDestino}?sec=seccion-bienvenida`;
    } catch (err) {
      alert("Error de acceso: " + err.message);
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerText = "INICIAR SESIÓN";
      }
    }
  };
}

function configurarEventoSubmitAdmin() {
  const formaAdmin = document.getElementById("FormaLoginAdmin");
  if (!formaAdmin) return;

  formaAdmin.onsubmit = async (e) => {
    e.preventDefault();
    const btnSubmit = document.getElementById("btn-submit-admin");
    const email = document.getElementById("admin-user").value;
    const password = document.getElementById("admin-pass").value;

    try {
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerText = "VALIDANDO ROL...";
      }

      if (!window.clientSupa) {
        throw new Error("El cliente de Supabase no está disponible.");
      }

      const { data, error } = await window.clientSupa.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error("Credenciales inválidas");

      const { data: perfil, error: errorPerfil } = await window.clientSupa
        .from("usuarios")
        .select("rol")
        .eq("id", data.user.id)
        .single();

      if (errorPerfil || !perfil || perfil.rol !== "ADMIN") {
        await window.clientSupa.auth.signOut();
        throw new Error("No cuentas con privilegios de Administrador.");
      }

      cerrarModalManual("ModalLoginAdmin");
      alert("¡Bienvenido al Panel de Control!");
      window.location.href = "admin/admin_panel.html";
    } catch (err) {
      alert("Acceso Denegado: " + err.message);
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerText = "INICIAR SESIÓN PANEL";
      }
    }
  };
}

// --- 4. RENDERIZADO DEL MENÚ NAVBAR ---
async function renderizarMenu() {
  if (estaRenderizandoMenu) return;
  estaRenderizandoMenu = true;

  const navPlaceholder = document.getElementById("nav-placeholder");
  if (!navPlaceholder) {
    estaRenderizandoMenu = false;
    return;
  }

  const pathActual = window.location.pathname;
  const esPaginaInicio = pathActual.includes("/inicio");
  const baseRaiz = esPaginaInicio ? "../index.html" : "index.html";

  let itemUsuarioHTML = `<li><a href="#" data-toggle="modal" data-target="#ModalLogin" class="nav-link-item">${ICONOS.user} Acceder</a></li>`;
  let tieneSesion = false;

  try {
    if (window.clientSupa) {
      const {
        data: { session },
      } = await window.clientSupa.auth.getSession();
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
  estaRenderizandoMenu = false;
}
window.renderizarMenu = renderizarMenu;

// --- 5. CONFIGURACIÓN E INICIALIZACIÓN INMUNE A LATENCIA ---
async function inicializarTodo() {
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
        /* Clases de apoyo para ejecución manual sin jQuery */
        .modal.show { display: block; opacity: 1; }
        .dropdown-menu.show { display: block !important; }
    </style>`;

  if (!document.getElementById("estilos-inyectados-menu")) {
    const styleEl = document.createElement("div");
    styleEl.id = "estilos-inyectados-menu";
    styleEl.innerHTML = headContenido;
    document.head.appendChild(styleEl);
  }

  asegurarModalesEnBody();
  await renderizarMenu();

  // Capturar parámetros de la URL de forma segura sin romper sintaxis
  const parametrosURL = new URLSearchParams(window.location.search);
  const seccionInicial = parametrosURL.get("sec");
  if (seccionInicial) {
    gestionarVisibilidadSeccion(seccionInicial, false);
  } else {
    gestionarVisibilidadSeccion("seccion-bienvenida", false);
  }

  // 🔴 AQUÍ SE ELIMINÓ EL BLOQUE DUPLICADO DE ONAUTHSTATECHANGE QUE CAUSABA EL CONFLICTO DE RENDERIZADO

  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = `<footer class="mi-footer">© 2026 H. Ayuntamiento. Todos los derechos reservados.</footer>`;
  }
}

// Inicialización segura del ciclo de vida
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarTodo);
} else {
  inicializarTodo();
}

// --- 6. DELEGACIÓN GLOBAL DE EVENTOS ---
document.addEventListener("click", function (e) {
  const dropdownBtn = e.target.closest('[data-toggle="dropdown"]');
  if (dropdownBtn && !window.jQuery) {
    e.preventDefault();
    const menu = dropdownBtn.parentElement.querySelector(".dropdown-menu");
    if (menu) {
      const estaMostrado = menu.classList.contains("show");
      document
        .querySelectorAll(".dropdown-menu.show")
        .forEach((m) => m.classList.remove("show"));
      if (!estaMostrado) menu.classList.add("show");
    }
    return;
  }

  if (
    !window.jQuery &&
    !e.target.closest('[data-toggle="dropdown"]') &&
    !e.target.closest(".dropdown-menu")
  ) {
    document
      .querySelectorAll(".dropdown-menu.show")
      .forEach((m) => m.classList.remove("show"));
  }

  const modalBtn = e.target.closest('[data-toggle="modal"]');
  if (modalBtn && !window.jQuery) {
    e.preventDefault();
    const targetId = modalBtn.getAttribute("data-target").replace("#", "");
    abrirModalManual(targetId);
    return;
  }

  const closeBtn =
    e.target.closest('[data-dismiss="modal"]') ||
    e.target.closest(".modal-backdrop");
  if (closeBtn && !window.jQuery) {
    e.preventDefault();
    const activeModal = document.querySelector(".modal.show");
    if (activeModal) cerrarModalManual(activeModal.id);
    return;
  }

  const linkAccion = e.target.closest(".nav-action-link");
  if (linkAccion) {
    e.preventDefault();
    const idObjetivo = linkAccion.getAttribute("data-sec");

    document
      .querySelectorAll(".dropdown-menu.show")
      .forEach((m) => m.classList.remove("show"));

    const esPaginaInicio = window.location.pathname.includes("/inicio");
    if (esPaginaInicio) {
      gestionarVisibilidadSeccion(idObjetivo);
    } else {
      const enSubcarpeta =
        window.location.pathname.includes("/inicio/") ||
        window.location.pathname.includes("/paginas/");
      const baseInicio = enSubcarpeta ? "inicio.html" : "inicio/inicio.html";
      window.location.href = `${baseInicio}?sec=${idObjetivo}`;
    }
    return;
  }

  if (e.target.closest("#link-admin-secret")) {
    window.location.hash = "inicio";
    return;
  }

  if (e.target.closest("#btn-logout")) {
    e.preventDefault();
    cerrarSesion();
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

// Atajo global para el panel de administración (Ctrl + Alt + A)
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.altKey && (e.key === "a" || e.key === "A")) {
    e.preventDefault();
    abrirModalManual("ModalLoginAdmin");
  }
});

// --- 7. FUNCIONES GLOBALES DE CONTROL ---
function gestionarVisibilidadSeccion(idObjetivo, addToHistory = true) {
  const secciones = document.querySelectorAll(".contenido-seccion");
  secciones.forEach((sec) => {
    sec.style.display = "none";
    sec.classList.remove("activa");
  });

  const seccionAMostrar = document.getElementById(idObjetivo);
  if (seccionAMostrar) {
    seccionAMostrar.style.display = "block";
    seccionAMostrar.classList.add("activa");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (addToHistory) {
      history.pushState({ id: idObjetivo }, "", `?sec=${idObjetivo}`);
    }
  }
}
window.gestionarVisibilidadSeccion = gestionarVisibilidadSeccion;

async function cerrarSesion() {
  if (window.clientSupa) {
    await window.clientSupa.auth.signOut();
    const enSubcarpeta =
      window.location.pathname.includes("/inicio/") ||
      window.location.pathname.includes("/paginas/");
    window.location.href = enSubcarpeta ? "../index.html" : "index.html";
  }
}
window.cerrarSesion = cerrarSesion;
