/**
 * js/conexion-supabase.js
 * Configuración centralizada de Base de Datos, Autenticación e Inyección Autónoma de Librerías.
 */
const supabaseUrl = "https://maopuzbvxucsarrydmte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hb3B1emJ2eHVjc2FycnlkbXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTkzNjIsImV4cCI6MjA4NTAzNTM2Mn0.eti3v7QDnbUjpgn4RlSpWKDjODdXQkdhtdi59oX7Uu4";

/**
 * FUNCIÓN AVANZADA: Inyecta scripts al DOM mediante promesas
 * Evita que el sistema colapse si el HTML no tiene los CDNs instalados.
 */
function cargarScriptDinamicamente(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Falló la descarga de: ${url}`));
    document.head.appendChild(script);
  });
}

/**
 * ORQUESTADOR ASÍNCRONO DEL SISTEMA
 * Valida la existencia de infraestructura antes de inicializar los clientes de red.
 */
async function arrancarInfraestructura() {
  try {
    // 1. VALIDACIÓN COLECTIVA DE DEPENDENCIAS CRÍTICAS
    const tareasDeCarga = [];

    if (typeof supabase === "undefined") {
      console.log("ℹ️ Supabase no detectado en el HTML. Descargando núcleo...");
      tareasDeCarga.push(
        cargarScriptDinamicamente(
          "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
        ),
      );
    }

    if (typeof Swal === "undefined") {
      console.log(
        "ℹ️ SweetAlert2 no detectado en el HTML. Descargando interfaz de alertas...",
      );
      tareasDeCarga.push(
        cargarScriptDinamicamente(
          "https://cdn.jsdelivr.net/npm/sweetalert2@11",
        ),
      );
    }

    // Esperar a que los scripts faltantes terminen de descargarse en paralelo
    if (tareasDeCarga.length > 0) {
      await Promise.all(tareasDeCarga);
      console.log(
        "⚡ Respaldo de infraestructura completado de forma dinámica.",
      );
    }

    // 2. CONFIGURACIÓN Y CREACIÓN DEL CLIENTE SUPABASE
    const options = {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: window.sessionStorage,
        detectSessionInUrl: true,
      },
    };

    const instanciaSupa = supabase.createClient(
      supabaseUrl,
      supabaseKey,
      options,
    );

    // Asignación global obligatoria para el resto de tus archivos (formularios.js, etc.)
    window.clientSupa = instanciaSupa;
    console.log("🟢 Supabase: Cliente inicializado correctamente.");

    // 3. ESCUCHADOR DE CAMBIOS DE SESIÓN
    window.clientSupa.auth.onAuthStateChange((event, session) => {
      console.log("⚡ Supabase Evento detectado:", event);

      // Sincronización dinámica de menús sin importar el nombre de la función en tu layout
      const funcActualizar =
        window.renderizarMenu || window.actualizarMenuUsuario;

      if (typeof funcActualizar === "function") {
        console.log("🔄 Actualizando interfaz de usuario...");
        funcActualizar();
      } else {
        console.warn(
          "⚠️ Advertencia: No se encontró la función para redibujar el menú (renderizarMenu).",
        );
      }
    });
  } catch (error) {
    // 4. GESTIÓN DE ERROR CRÍTICO EN CASO DE FALLO DE CONEXIÓN O RED CDN
    console.error(
      "🔴 Infraestructura: Error de carga en las librerías externas.",
      error,
    );

    const nav = document.getElementById("nav-placeholder");
    if (nav) {
      nav.insertAdjacentHTML(
        "afterbegin",
        ` <div class="alert alert-danger text-center mb-0" style="z-index: 9999; position: relative;"> 
            <strong>Error de Conexión:</strong> Los servicios de base de datos e interfaz no están disponibles temporalmente. 
            <button onclick="location.reload()" class="btn btn-sm btn-outline-danger ml-2">Reintentar</button> 
          </div> `,
      );
    }
  }
}

// Ejecutar inicialización autónoma al cargar este script
arrancarInfraestructura();

/**
 * GESTIÓN DE RECAPTCHA
 */
window.onloadCallback = function () {
  console.log("🔵 reCAPTCHA: Listo para validación.");
};
