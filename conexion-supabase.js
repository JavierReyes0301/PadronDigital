// conexion-supabase.js

// 1. CONFIGURACIÓN DE CREDENCIALES
const supabaseUrl = "https://maopuzbvxucsarrydmte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hb3B1emJ2eHVjc2FycnlkbXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTkzNjIsImV4cCI6MjA4NTAzNTM2Mn0.eti3v7QDnbUjpgn4RlSpWKDjODdXQkdhtdi59oX7Uu4";

/**
 * ADECUACIÓN DE SEGURIDAD:
 * Validamos que la librería de Supabase esté cargada antes de intentar usarla.
 * Esto evita el error "supabase is not defined" si el CDN falla.
 */
if (typeof supabase !== "undefined") {
  // Inicializamos el cliente y lo exponemos globalmente para gestion-sistema.js y modales.js
  window.clientSupa = supabase.createClient(supabaseUrl, supabaseKey);
  console.log("🟢 Conexión de Supabase vinculada a window.clientSupa!");
} else {
  console.error(
    "🔴 Error crítico: La librería de Supabase (CDN) no se ha cargado correctamente.",
  );
}

/**
 * ADECUACIÓN PARA RECAPTCHA:
 * Definimos la función que Google busca al cargar el script en el Index.
 * Esto elimina el error "onloadCallback is not defined".
 */
window.onloadCallback = function () {
  console.log("🔵 reCAPTCHA cargado correctamente en la interfaz.");
};

/**
 * TIP DE PROGRAMACIÓN (JS/Python):
 * Al usar window.clientSupa, estamos creando una variable global.
 * En proyectos más grandes (o en Python con módulos), es mejor usar 'export'
 * para controlar qué archivos tienen acceso a la conexión y evitar conflictos.
 */
