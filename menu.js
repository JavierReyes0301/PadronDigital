document.addEventListener("DOMContentLoaded", function () {
  // --- 0. INYECCIÓN DE RECURSOS Y AJUSTES DE ESPACIO ---
  const headContenido = `
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
    <style>
      /* Elimina el hueco entre el navbar y el contenido */
      body { 
        margin: 0 !important; 
        padding: 0 !important; 
      }
      #nav-placeholder { 
        margin-bottom: 0 !important; 
        padding-bottom: 0 !important;
      }
      .mi-navbar { 
        margin-bottom: 0 !important; 
      }
      /* Ajuste para que los títulos de sección suban */
      section { 
        padding-top: 20px !important; 
        margin-top: 0 !important; 
      }
      /* Si usas contenedores de Bootstrap con mucho margen */
      .mt-5, .py-5 { 
        margin-top: 1rem !important; 
        padding-top: 1rem !important; 
      }
    </style>
  `;
  document.head.insertAdjacentHTML("beforeend", headContenido);

  // --- 1. HTML DEL NAVBAR Y MODAL ---
  const navbarHTML = `
    <nav class="mi-navbar">
      <div class="mi-container">
        <a href="index.html" class="mi-brand">Padrón de Proveedores</a>
        <button class="menu-toggle" id="btn-toggle">
          <span class="bar"></span><span class="bar"></span><span class="bar"></span>
        </button>
        <ul class="mi-menu" id="nav-menu">
          <li>
            <a href="index.html#inicio" class="nav-link-item">
              <svg viewBox="0 0 576 512"><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg>
              Inicio
            </a>
          </li>
          <li>
            <a href="index.html#registro" class="nav-link-item">
              <svg viewBox="0 0 512 512"><path d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"></path></svg>
              Registro
            </a>
          </li>
          <li>
            <a href="index.html#consultar" class="nav-link-item">
              <svg viewBox="0 0 512 512"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>
              Consultar
            </a>
          </li>
          <li>
            <a href="index.html#marco" class="nav-link-item">
              <svg viewBox="0 0 512 512"><path d="M504.971 199.362l-22.627-22.627c-9.373-9.373-24.569-9.373-33.941 0l-5.657 5.657-115.705-115.705 5.657-5.657c9.373-9.373 9.373-24.569 0-33.941L312.638 7.029c-9.373-9.373-24.569-9.373-33.941 0L154.246 131.48c-9.373 9.373-9.373 24.569 0 33.941l22.627 22.627c9.373 9.373 24.569 9.373 33.941 0l5.657-5.657 39.598 39.598-81.04 81.04-5.657-5.657c-12.497-12.497-32.758-12.497-45.255 0L9.373 412.118c-12.497 12.497-12.497 32.758 0 45.255l45.255 45.255c12.497 12.497 32.758 12.497 45.255 0l114.745-114.745c12.497-12.497 12.497-32.758 0-45.255l-5.657-5.657 81.04-81.04 39.598 39.598-5.657 5.657c9.373 9.373 24.569 9.373 33.941 0l22.627-22.627c9.373-9.373 9.373-24.569 0-33.941l-5.657-5.657 115.705 115.705 5.657-5.657c9.372-9.372 9.372-24.568 0-33.941z"></path></svg>
              Marco Legal
            </a>
          </li>
          <li><a href="javascript:void(0);" onclick="abrirEmergente()" style="cursor: pointer">Iniciar Sesión</a></li>
        </ul>
      </div>
    </nav>

    <div id="ContenedorEmergente" class="mi-overlay-unico">
      <div class="mi-modal-caja">
        <div class="mi-modal-header">
          <span class="mi-cerrar" onclick="cerrarEmergente()">&times;</span>
          <svg width="60" fill="white" viewBox="0 0 512 512"><path d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z"></path></svg>
        </div>
        <div class="mi-modal-body">
          <form action="sesion.php" method="POST" id="FormaLogin">
            <label style="font-weight: bold; color: #333">Usuario:</label>
            <input type="text" name="Correo" class="mi-input-azul" placeholder="Usuario" />
            <label style="font-weight: bold; color: #333">Contraseña:</label>
            <input type="password" name="Password" class="mi-input-azul" placeholder="********" />
            <button type="submit" class="mi-btn-guinda">INICIAR SESIÓN</button>
          </form>
          <div style="text-align: right; margin-top: 15px">
            <a href="restaurar.html#Restaurar" style="color: #666; font-size: 13px; text-decoration: none; font-family: sans-serif;">
              <small>¿Olvidó su contraseña?</small>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  // --- 2. HTML DEL FOOTER ---
  const footerHTML = `
    <footer style="background-color: #ab0a3d; color: white; padding: 10px 0; font-family: 'Montserrat', sans-serif;">
      <div class="container" style="text-align: center">
        <p style="font-size: 0.7rem; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; opacity: 0.9;">
          &copy; 2026 H. Ayuntamiento del Municipio de Atlixco
        </p>
      </div>
    </footer>
  `;

  // --- 3. INYECCIÓN ---
  const navPlaceholder = document.getElementById("nav-placeholder");
  if (navPlaceholder) {
    navPlaceholder.innerHTML = navbarHTML;
  }

  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = footerHTML;
  }

  // --- 4. LÓGICA DE INTERACCIÓN ---
  const btnToggle = document.getElementById("btn-toggle");
  const navMenu = document.getElementById("nav-menu");
  if (btnToggle && navMenu) {
    btnToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      btnToggle.classList.toggle("open");
    });
  }

  // Scroll Spy (Iconos Amarillos)
  const secciones = document.querySelectorAll("section[id]");
  const enlacesMenu = document.querySelectorAll(".nav-link-item");
  if (secciones.length > 0 && enlacesMenu.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            enlacesMenu.forEach((enlace) => {
              enlace.classList.remove("seccion-activa");
              const href = enlace.getAttribute("href");
              if (href && href.includes(entry.target.id)) {
                enlace.classList.add("seccion-activa");
              }
            });
          }
        });
      },
      { threshold: 0.6 },
    );
    secciones.forEach((s) => observer.observe(s));
  }
});

// FUNCIONES GLOBALES
function abrirEmergente() {
  const modal = document.getElementById("ContenedorEmergente");
  if (modal) modal.style.display = "block";
}
function cerrarEmergente() {
  const modal = document.getElementById("ContenedorEmergente");
  if (modal) modal.style.display = "none";
}
