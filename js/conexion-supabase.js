/**
 * js/conexion-supabase.js
 * Configuración central de base de datos y autenticación.
 */

const supabaseUrl = "https://maopuzbvxucsarrydmte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hb3B1emJ2eHVjc2FycnlkbXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTkzNjIsImV4cCI6MjA4NTAzNTM2Mn0.eti3v7QDnbUjpgn4RlSpWKDjODdXQkdhtdi59oX7Uu4";

// 1. VALIDACIÓN Y CREACIÓN DEL CLIENTE
if (typeof supabase !== "undefined") {
  // Configuración avanzada para mantener la sesión activa
  const options = {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  };

  const instanciaSupa = supabase.createClient(
    supabaseUrl,
    supabaseKey,
    options,
  );

  // 2. PROTECCIÓN DE LA INSTANCIA
  // Congelamos el objeto para evitar manipulaciones externas en tiempo de ejecución.
  window.clientSupa = Object.freeze(instanciaSupa);

  console.log("🟢 Supabase: Cliente inicializado y protegido.");
} else {
  // 3. GESTIÓN DE ERROR CRÍTICO
  console.error("🔴 Supabase: Error de carga en la librería externa.");

  // Inyectamos un aviso visual si el placeholder del nav existe
  const nav = document.getElementById("nav-placeholder");
  if (nav) {
    nav.insertAdjacentHTML(
      "afterbegin",
      `
            <div class="alert alert-danger text-center mb-0" style="z-index: 9999; position: relative;">
                <strong>Error de Conexión:</strong> Los servicios de base de datos no están disponibles. 
                <button onclick="location.reload()" class="btn btn-sm btn-outline-danger ml-2">Reintentar</button>
            </div>
        `,
    );
  }
}

/**
 * GESTIÓN DE RECAPTCHA
 * Se mantiene como callback global para la API de Google.
 */
window.onloadCallback = function () {
  console.log("🔵 reCAPTCHA: Listo para validación.");
};
