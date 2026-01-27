// La URL de tu proyecto
const supabaseUrl = "https://maopuzbvXucsarrydmte.supabase.co";

// La Anon Key que copiaste (la que empieza con ey...)
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hb3B1emJ2eHVjc2FycnlkbXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTkzNjIsImV4cCI6MjA4NTAzNTM2Mn0.eti3v7QDnbUjpgn4RlSpWKDjODdXQkdhtdi59oX7Uu4";

// Conexión inicial
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Este mensaje DEBE aparecer en tu consola de Chrome
console.log("¡Conexión establecida con SIPRO!");
