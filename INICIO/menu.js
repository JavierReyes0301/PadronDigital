document.addEventListener("DOMContentLoaded", function () {
  // --- 0. CONFIGURACIÓN DINÁMICA ---
  const baseRuta = "/index.html";
  const secciones = [
    {
      id: "inicio",
      label: "Inicio",
      svg: '<svg viewBox="0 0 576 512"><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg>',
    },
    {
      id: "registro",
      label: "Registro",
      svg: '<svg viewBox="0 0 512 512"><path d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"></path></svg>',
    },
    {
      id: "consultar",
      label: "Consultar",
      svg: '<svg viewBox="0 0 512 512"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>',
    },
    {
      id: "marco",
      label: "Marco Legal",
      svg: '<svg viewBox="0 0 512 512"><path d="M504.971 199.362l-22.627-22.627c-9.373-9.373-24.569-9.373-33.941 0l-5.657 5.657-115.705-115.705 5.657-5.657c9.373-9.373 9.373-24.569 0-33.941L312.638 7.029c-9.373-9.373-24.569-9.373-33.941 0L154.246 131.48c-9.373 9.373-9.373 24.569 0 33.941l22.627 22.627c9.373 9.373 24.569 9.373 33.941 0l5.657-5.657 39.598 39.598-81.04 81.04-5.657-5.657c-12.497-12.497-32.758-12.497-45.255 0L9.373 412.118c-12.497 12.497-12.497 32.758 0 45.255l45.255 45.255c12.497 12.497 32.758 12.497 45.255 0l114.745-114.745c12.497-12.497 12.497-32.758 0-45.255l-5.657-5.657 81.04-81.04 39.598 39.598-5.657 5.657c9.373 9.373 24.569 9.373 33.941 0l22.627-22.627c9.373-9.373 9.373-24.569 0-33.941l-5.657-5.657 115.705 115.705 5.657-5.657c9.372-9.372 9.372-24.568 0-33.941z"></path></svg>',
    },
  ];

  const seccionesHTML = secciones
    .map(
      (sec) => `
    <li>
      <a href="${baseRuta}#${sec.id}" class="nav-link-item" onclick="mostrarSeccionDirecto('${sec.id}')">
        ${sec.svg}
        ${sec.label}
      </a>
    </li>
  `,
    )
    .join("");

  // --- 1. INYECCIÓN DE ESTILOS Y FUENTES ---
  const headContenido = `
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
    <style>
      html, body { height: 100%; margin: 0; }
      body { display: flex; flex-direction: column; }
      .flex-grow-content { flex: 1 0 auto; }
      #nav-placeholder, #footer-placeholder { flex-shrink: 0; }

      /* Clase para ocultar secciones */
      .seccion-oculta { display: none !important; }

      .mi-navbar .mi-menu svg {
        width: 1.1em !important; 
        height: 1.1em !important;
        margin-right: 10px;
        fill: currentColor;
        vertical-align: middle;
      }
      .dropdown-item i { margin-right: 8px; width: 1.2em; text-align: center; }
    </style>
  `;
  document.head.insertAdjacentHTML("beforeend", headContenido);

  // --- 2. HTML DEL NAVBAR ---
  const navbarHTML = `
    <nav class="mi-navbar">
      <div class="mi-container">
        <a href="${baseRuta}" class="mi-brand">Padrón de Proveedores</a>
        <button class="menu-toggle" id="btn-toggle">
          <span class="bar"></span><span class="bar"></span><span class="bar"></span>
        </button>
        <ul class="mi-menu" id="nav-menu">
          ${seccionesHTML}
          <li class="nav-item dropdown">
            <a class="nav-link-item dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <svg viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
              Mi Cuenta
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" style="color: #323232 !important;" href="javascript:void(0);" onclick="enviarFormSeguro('FormaIndex');"><i class="fas fa-info-circle"></i> Estado de Perfil</a>
              <a class="dropdown-item" style="color: #323232 !important;" href="javascript:void(0);" onclick="enviarFormSeguro('FormaUpdate');"><i class="fas fa-edit"></i> Actualizar Datos</a>
              <a class="dropdown-item" style="color: #323232 !important;" href="javascript:void(0);" onclick="enviarFormSeguro('FormaConfig');"><i class="fas fa-cogs"></i> Configuración</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item text-danger" style="color: #ab0a3d !important;" href="javascript:void(0);" onclick="enviarFormSeguro('FormaSesion');"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  `;

  // --- 3. HTML DEL FOOTER ---
  const footerHTML = `
    <footer style="background-color: #ab0a3d; color: white; padding: 15px 0; font-family: 'Montserrat', sans-serif;">
      <div class="container" style="text-align: center">
        <p style="font-size: 0.75rem; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; opacity: 0.9;">
          &copy; 2026 H. Ayuntamiento del Municipio de Atlixco
        </p>
      </div>
    </footer>
  `;

  // --- 4. INYECCIÓN FINAL ---
  const navPlaceholder = document.getElementById("nav-placeholder");
  if (navPlaceholder) navPlaceholder.innerHTML = navbarHTML;

  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;

  // --- 5. INYECCIÓN DE FORMULARIOS GLOBALES ---
  const formulariosHTML = `
    <div id="global-forms" style="display:none;">
      <form name="FormaIndex" action="index.html#estado-perfil" method="GET"></form>
      <form name="FormaUpdate" action="index.html#registro" method="GET"></form>
      <form name="FormaConfig" action="configuracion.php" method="POST"></form>
      <form name="FormaSesion" action="php/logout.php" method="POST"></form>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", formulariosHTML);

  // Lógica del menú móvil (Toggle)
  const btnToggle = document.getElementById("btn-toggle");
  const navMenu = document.getElementById("nav-menu");
  if (btnToggle && navMenu) {
    btnToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      btnToggle.classList.toggle("open");
    });
  }
});

// --- FUNCIONES GLOBALES ---

function enviarFormSeguro(nombreForm) {
  // Mapeo de formularios a IDs de sección
  const mapaSecciones = {
    FormaIndex: "estado-perfil",
    FormaUpdate: "registro",
  };

  const idSeccion = mapaSecciones[nombreForm];

  if (idSeccion) {
    // Ocultar todas las secciones con clase 'contenido-seccion'
    document
      .querySelectorAll(".contenido-seccion")
      .forEach((s) => s.classList.add("seccion-oculta"));
    // Mostrar la elegida
    const destino = document.getElementById(idSeccion);
    if (destino) {
      destino.classList.remove("seccion-oculta");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return;
  }

  const formulario = document.forms[nombreForm];
  if (formulario) {
    formulario.submit();
  }
}

// Función auxiliar para los clics directos del menú superior
function mostrarSeccionDirecto(id) {
  document
    .querySelectorAll(".contenido-seccion")
    .forEach((s) => s.classList.add("seccion-oculta"));
  const destino = document.getElementById(id);
  if (destino) destino.classList.remove("seccion-oculta");
}

function abrirEmergente() {
  const modal = document.getElementById("ContenedorEmergente");
  if (modal) modal.style.display = "block";
}

function cerrarEmergente() {
  const modal = document.getElementById("ContenedorEmergente");
  if (modal) modal.style.display = "none";
}
