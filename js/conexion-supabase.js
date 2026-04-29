// js/conexion-supabase.js

// 1. CONFIGURACIÓN DE CREDENCIALES
const supabaseUrl = "https://maopuzbvxucsarrydmte.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hb3B1emJ2eHVjc2FycnlkbXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTkzNjIsImV4cCI6MjA4NTAzNTM2Mn0.eti3v7QDnbUjpgn4RlSpWKDjODdXQkdhtdi59oX7Uu4";

/**
 * IMPLEMENTACIÓN INCISO A y B:
 * Validamos la carga de la librería y protegemos la conexión.
 */
if (typeof supabase !== "undefined") {
    
    // CREAMOS LA INSTANCIA (Variable interna temporal)
    const instanciaSupa = supabase.createClient(supabaseUrl, supabaseKey);

    // INCISO B: PROTECCIÓN CON Object.freeze
    // Esto evita que otros scripts o alguien desde la consola pueda modificar la conexión.
    window.clientSupa = Object.freeze(instanciaSupa);

    console.log("🟢 Conexión de Supabase vinculada y protegida en window.clientSupa!");

} else {
    // INCISO A: NOTIFICACIÓN VISUAL AL USUARIO
    // En lugar de solo un error en consola, avisamos al usuario que algo falló.
    console.error("🔴 Error crítico: La librería de Supabase no cargó.");
    alert("El sistema de base de datos no está disponible. Por favor, revisa tu conexión a internet y recarga la página.");
}

/**
 * ADECUACIÓN PARA RECAPTCHA
 */
window.onloadCallback = function () {
    console.log("🔵 reCAPTCHA cargado correctamente en la interfaz.");
};