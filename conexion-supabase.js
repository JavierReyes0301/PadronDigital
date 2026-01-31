// conexion-supabase.js
const supabaseUrl = "https://maopuzbvXucsarrydmte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hb3B1emJ2eHVjc2FycnlkbXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTkzNjIsImV4cCI6MjA4NTAzNTM2Mn0.eti3v7QDnbUjpgn4RlSpWKDjODdXQkdhtdi59oX7Uu4";

// Esto crea la conexión que usa el resto de tus archivos
window.clientSupa = supabase.createClient(supabaseUrl, supabaseKey);

console.log("¡Conexión de Supabase vinculada a window.clientSupa!");
