/**
 * js/conexion-supabase.js
 * Configuración central de base de datos y autenticación.
 */

const supabaseUrl = "https://maopuzbvxucsarrydmte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hb3B1emJ2eHVjc2FycnlkbXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTkzNjIsImV4cCI6MjA4NTAzNTM2Mn0.eti3v7QDnbUjpgn4RlSpWKDjODdXQkdhtdi59oX7Uu4";

// 1. VALIDACIÓN Y CREACIÓN DEL CLIENTE
if (typeof supabase !== "undefined") {
  // CONFIGURACIÓN CORREGIDA:
  // Eliminamos la persistencia automática para evitar el error de "object is not extensible"
  const options = {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  };

  const instanciaSupa = supabase.createClient(
    supabaseUrl,
    supabaseKey,
    options,
  );

  // 2. ASIGNACIÓN DE LA INSTANCIA
  // IMPORTANTE: Eliminamos Object.freeze() porque impedía que la librería funcionara correctamente
  window.clientSupa = instanciaSupa;

  console.log("🟢 Supabase: Cliente inicializado correctamente.");
} else {
  // 3. GESTIÓN DE ERROR CRÍTICO
  console.error("🔴 Supabase: Error de carga en la librería externa.");

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
 */
window.onloadCallback = function () {
  console.log("🔵 reCAPTCHA: Listo para validación.");
};

// Se eliminó el evento beforeunload que forzaba el signOut,
// permitiendo que el flujo de registro e inicio de sesión sea continuo.
