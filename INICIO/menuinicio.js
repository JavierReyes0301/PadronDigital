document.addEventListener("DOMContentLoaded", function () {
  // --- 0. INYECCIÓN DE RECURSOS ---
  const headContenido = `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
    <style>
      .mi-navbar .mi-menu svg { 
        width: 1.1em !important; 
        height: 1.1em !important; 
        margin-right: 8px; 
        fill: currentColor; 
        vertical-align: middle; 
      }
      /* Estilos específicos para el dropdown de Mi Cuenta */
      .menu-guinda-compacto { background-color: #ab0a3d !important; border: none; margin-top: 0; }
      .menu-guinda-compacto .dropdown-item { 
        color: white !important; display: flex; align-items: center; padding: 10px 20px; font-size: 0.9rem;
      }
      .menu-guinda-compacto .dropdown-item:hover { background-color: #8a0831 !important; }
      .menu-guinda-compacto .dropdown-item i { margin-right: 10px; width: 20px; text-align: center; }
      .dropdown-divider { border-top: 1px solid rgba(255,255,255,0.2); }
      
      /* Forzar visibilidad del dropdown cuando tiene la clase .show */
      .dropdown-menu.show { display: block !important; }
      .nav-item.dropdown { list-style: none; }

      #footer-placeholder { margin-top: auto; }
    </style>
  `;
  document.head.insertAdjacentHTML("beforeend", headContenido);

  // --- 1. ICONOS SVG ---
  const iconos = {
    inicio:
      '<svg viewBox="0 0 576 512"><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg>',
    registro:
      '<svg viewBox="0 0 512 512"><path d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"></path></svg>',
    consultar:
      '<svg viewBox="0 0 512 512"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>',
    atencion:
      '<svg viewBox="0 0 512 512"><path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>',
    marco:
      '<svg viewBox="0 0 512 512"><path d="M504.971 199.362l-22.627-22.627c-9.373-9.373-24.569-9.373-33.941 0l-5.657 5.657-115.705-115.705 5.657-5.657c9.373-9.373 9.373-24.569 0-33.941L312.638 7.029c-9.373-9.373-24.569-9.373-33.941 0L154.246 131.48c-9.373 131.48-9.373 24.569 0 33.941l22.627 22.627c9.373 9.373 24.569 9.373 33.941 0l5.657-5.657 39.598 39.598-81.04 81.04-5.657-5.657c-12.497-12.497-32.758-12.497-45.255 0L9.373 412.118c-12.497 12.497-12.497 32.758 0 45.255l45.255 45.255c12.497 12.497 32.758 12.497 45.255 0l114.745-114.745c12.497-12.497 12.497-32.758 0-45.255l-5.657-5.657 81.04-81.04 39.598 39.598-5.657 5.657c9.373 9.373 24.569 9.373 33.941 0l22.627-22.627c9.373-9.373 9.373-24.569 0-33.941l-5.657-5.657 115.705 115.705 5.657-5.657c9.372-9.372 9.372-24.568 0-33.941z"></path></svg>',
    user: '<svg viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>',
  };

  // --- 2. HTML NAVBAR (CORREGIDO PARA CARPETAS HIJAS) ---
  const navbarHTML = `
    <nav class="mi-navbar">
      <div class="mi-container">
        <a href="../index.html" class="mi-brand">Padrón de Proveedores</a>
        <button class="menu-toggle" id="btn-toggle">
          <span class="bar"></span><span class="bar"></span><span class="bar"></span>
        </button>
        <ul class="mi-menu" id="nav-menu">
          <li><a href="../index.html#inicio" class="nav-link-item">${iconos.inicio}Inicio</a></li>
          <li><a href="../index.html#registro" class="nav-link-item">${iconos.registro}Registro</a></li>
          <li><a href="../index.html#consultar" class="nav-link-item">${iconos.consultar}Consultar</a></li>
          <li><a href="../index.html#atencion-aclaraciones" class="nav-link-item">${iconos.atencion}Atención</a></li>
          <li><a href="../index.html#marco" class="nav-link-item">${iconos.marco}Marco Legal</a></li>
          
          <li class="nav-item dropdown">
            <a class="nav-link-item dropdown-toggle" href="javascript:void(0);" id="navbarDropdown" role="button">
              ${iconos.user} MI CUENTA
            </a>
            <div class="dropdown-menu dropdown-menu-right menu-guinda-compacto" id="dropdownMenuCuenta">
              <a class="dropdown-item" href="javascript:void(0);" onclick="enviarFormSeguro('FormaIndex');">
                <i class="fas fa-info-circle"></i> ESTADO DE PERFIL
              </a>
              <a class="dropdown-item" href="javascript:void(0);" onclick="enviarFormSeguro('FormaUpdate');">
                <i class="fas fa-edit"></i> ACTUALIZAR DATOS
              </a>
              <a class="dropdown-item" href="javascript:void(0);" onclick="enviarFormSeguro('FormaUpdateEmp');">
                <i class="fas fa-user-cog"></i> DATOS DE EMPRESA
              </a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="javascript:void(0);" onclick="enviarFormSeguro('FormaSesion');">
                <i class="fas fa-external-link-alt"></i> CERRAR SESIÓN
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  `;

  // --- 3. HTML FOOTER (FIJO) ---
  const footerHTML = `
    <footer style="background-color: #ab0a3d; color: white; padding: 10px 0; width: 100%;">
      <div class="mi-container" style="text-align: center">
        <p style="font-size: 0.7rem; margin: 0; text-transform: uppercase; font-weight: 600;">
          &copy; 2026 H. Ayuntamiento del Municipio de Atlixco
        </p>
      </div>
    </footer>
  `;

  // --- 4. INYECCIÓN ---
  const navPlaceholder = document.getElementById("nav-placeholder");
  if (navPlaceholder) navPlaceholder.innerHTML = navbarHTML;

  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;

  // --- 5. LÓGICA DE INTERACCIÓN (CORREGIDA) ---
  const btnToggle = document.getElementById("btn-toggle");
  const navMenu = document.getElementById("nav-menu");
  const dropdownBtn = document.getElementById("navbarDropdown");
  const dropdownMenu = document.getElementById("dropdownMenuCuenta");

  // Menú móvil
  if (btnToggle && navMenu) {
    btnToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      navMenu.classList.toggle("active");
      btnToggle.classList.toggle("open");
    });
  }

  // Lógica manual para el dropdown de "MI CUENTA"
  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdownMenu.classList.toggle("show");
    });
  }

  // Cerrar todo al hacer clic fuera
  document.addEventListener("click", () => {
    if (dropdownMenu) dropdownMenu.classList.remove("show");
    if (navMenu) {
      navMenu.classList.remove("active");
      if (btnToggle) btnToggle.classList.remove("open");
    }
  });

  // --- 6. LÓGICA SCROLLSPY ---
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;
    const isAtBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute("id");
      const navLink = document.querySelector(
        `.mi-menu a[href*="${sectionId}"]`,
      );

      if (navLink) {
        const isLast = sectionId === "marco";
        if (
          (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) ||
          (isAtBottom && isLast)
        ) {
          document
            .querySelectorAll(".nav-link-item")
            .forEach((el) => el.classList.remove("active-scroll"));
          navLink.classList.add("active-scroll");
        } else {
          navLink.classList.remove("active-scroll");
        }
      }
    });
  });
});
