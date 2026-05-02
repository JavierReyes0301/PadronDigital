document.addEventListener("DOMContentLoaded", async function () {
  // --- 0. CONFIGURACIÓN DE ESTILOS ---
  const headContenido = `
    <style>
      .mi-navbar .mi-menu svg { width: 1.2rem !important; height: 1.2rem !important; margin-right: 8px; fill: currentColor; vertical-align: middle; flex-shrink: 0; }
      .menu-guinda-compacto { background-color: #ab0a3d; border: 1px solid #ffd700; }
      .menu-guinda-compacto .dropdown-item { color: white; font-weight: 600; font-size: 0.85rem; }
      .menu-guinda-compacto .dropdown-item:hover { background-color: #323232; color: #ffd700; }
      .mi-footer { background-color: #ab0a3d; padding: 20px 0; border-top: 1px solid #e0e0e0; color: white; font-weight: 700; text-transform: uppercase; }
      /* Bloqueo de doble sección: por defecto ocultas, JS decide cuál activar */
      .contenido-seccion { display: none !important; }
      .contenido-seccion.activa { display: block !important; }
    </style>
  `;
  document.head.insertAdjacentHTML("beforeend", headContenido);

  const ICONOS = {
    inicio:
      '<svg viewBox="0 0 576 512"><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg>',
    user: '<svg viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>',
  };

  const esPaginaInicio = window.location.pathname.includes("inicio.html");
  const prefijoURL = esPaginaInicio ? "index.html" : "";

  // --- 1. FUNCIÓN QUE DIBUJA EL MENÚ ---
  async function renderizarMenu() {
    const navPlaceholder = document.getElementById("nav-placeholder");
    if (!navPlaceholder) return;

    let itemUsuario = `<li><a href="#" data-toggle="modal" data-target="#ModalLogin" class="nav-link-item">${ICONOS.user} Acceder</a></li>`;

    if (window.clientSupa) {
      const {
        data: { session },
      } = await window.clientSupa.auth.getSession();
      if (session) {
        const accionEstado = esPaginaInicio
          ? "gestionarVisibilidadSeccion('estado-perfil');"
          : "window.location.href='inicio.html';";
        const accionActualizar = esPaginaInicio
          ? "gestionarVisibilidadSeccion('actualizar-datos');"
          : "window.location.href='inicio.html';";

        itemUsuario = `
          <li class="nav-item dropdown">
            <a class="nav-link-item dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true">
              ${ICONOS.user} MI CUENTA
            </a>
            <div class="dropdown-menu dropdown-menu-right menu-guinda-compacto">
              <a class="dropdown-item" href="javascript:void(0);" onclick="${accionEstado}">ESTADO DE PERFIL</a>
              <a class="dropdown-item" href="javascript:void(0);" onclick="${accionActualizar}">ACTUALIZAR DATOS</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="javascript:void(0);" onclick="cerrarSesion();">CERRAR SESIÓN</a>
            </div>
          </li>`;
      }
    }

    navPlaceholder.innerHTML = `
      <nav class="mi-navbar">
        <div class="mi-container">
          <a href="${prefijoURL}#inicio" class="mi-brand">Padrón de Proveedores</a>
          <button class="menu-toggle" id="btn-toggle"><span class="bar"></span><span class="bar"></span><span class="bar"></span></button>
          <ul class="mi-menu" id="nav-menu">
            <li><a href="${prefijoURL}#inicio" class="nav-link-item">Inicio</a></li>
            ${itemUsuario}
          </ul>
        </div>
      </nav>`;

    // Re-vincular eventos
    const btn = document.getElementById("btn-toggle");
    if (btn)
      btn.onclick = () => {
        document.getElementById("nav-menu").classList.toggle("active");
        btn.classList.toggle("open");
      };
    if (typeof $ !== "undefined") $(".dropdown-toggle").dropdown();
  }

  // --- 2. EL CAMBIO AUTOMÁTICO (ESCUCHADOR) ---
  if (window.clientSupa) {
    window.clientSupa.auth.onAuthStateChange((event) => {
      renderizarMenu(); // Redibuja el menú automáticamente al loguear/desloguear
      if (event === "SIGNED_IN" && esPaginaInicio) {
        if (typeof gestionarEstadoYSecciones === "function")
          gestionarEstadoYSecciones();
      }
    });
  }

  // --- 3. EJECUCIÓN ---
  await renderizarMenu();

  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = `<footer class="mi-footer"><div class="container-fluid"><p class="mb-0 text-center">© 2026 H. Ayuntamiento de Atlixco.</p></div></footer>`;
  }
});

// --- FUNCIONES GLOBALES (SIN CAMBIOS EN TU LÓGICA) ---
window.esUsuarioNuevo = true;

function gestionarVisibilidadSeccion(idObjetivo) {
  if (window.esUsuarioNuevo === true && idObjetivo === "estado-perfil") {
    alert("Atención: Primero debes completar la captura de tus datos.");
    return;
  }
  const secciones = document.querySelectorAll(".contenido-seccion");
  secciones.forEach((sec) => {
    sec.classList.remove("activa");
    sec.style.setProperty("display", "none", "important");
  });
  const seccionAMostrar = document.getElementById(idObjetivo);
  if (seccionAMostrar) {
    seccionAMostrar.classList.add("activa");
    seccionAMostrar.style.setProperty("display", "block", "important");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
