// js/app-captura.js

// 1. GESTIÓN DE NAVEGACIÓN ENTRE SECCIONES
function mostrarSeccion(nombreSeccion) {
  // Ocultar todas las secciones
  document
    .querySelectorAll(".seccion-captura")
    .forEach((sec) => sec.classList.add("d-none"));

  // Quitar 'active' de todas las pestañas
  document
    .querySelectorAll("#padrontabs .nav-link")
    .forEach((link) => link.classList.remove("active"));

  // Mostrar la sección solicitada
  document.getElementById(`sec-${nombreSeccion}`).classList.remove("d-none");

  // Activar la pestaña correspondiente
  document.getElementById(`tab-${nombreSeccion}`).classList.add("active");

  // Scroll al inicio de la página
  window.scrollTo(0, 0);
}

// 2. CARGA INICIAL Y PROTECCIÓN DE RUTA
document.addEventListener("DOMContentLoaded", async () => {
  // Verificar si hay usuario logueado
  const {
    data: { user },
  } = await window.clientSupa.auth.getUser();

  if (!user) {
    // Si no hay usuario, redirigir al login
    window.location.href = "index.html";
    return;
  }

  // Si hay usuario, cargar sus datos básicos en 'Datos Generales'
  const { data: perfil } = await window.clientSupa
    .from("usuarios")
    .select("*")
    .eq("id", user.id)
    .single();

  if (perfil) {
    document.getElementById("gen_rfc").value = perfil.rfc;
    document.getElementById("gen_tipo").value = perfil.tipo_persona;
    document.getElementById("gen_correo").value = perfil.correo;
  }

  // Cargar Catálogos Iniciales
  cargarEstados();
  cargarGiros();
});

// 3. LÓGICA DE DOMICILIO FISCAL (image_10.png)
async function cargarEstados() {
  const { data, error } = await window.clientSupa
    .from("estados_mexico")
    .select("id, nombre")
    .order("nombre");

  if (error) return console.error("Error cargando estados:", error);

  const selectEstado = document.getElementById("dom_estado");
  data.forEach((estado) => {
    const option = document.createElement("option");
    option.value = estado.id;
    option.textContent = estado.nombre;
    selectEstado.appendChild(option);
  });

  // Evento para cargar municipios cuando cambie el estado
  selectEstado.addEventListener("change", (e) =>
    cargarMunicipios(e.target.value),
  );
}

async function cargarMunicipios(estadoId) {
  const selectMunicipio = document.getElementById("dom_municipio");
  selectMunicipio.innerHTML =
    '<option value="">SELECCIONE EL MUNICIPIO...</option>'; // Limpiar
  selectMunicipio.disabled = true;

  if (!estadoId) return;

  const { data, error } = await window.clientSupa
    .from("municipios_mexico")
    .select("id, nombre")
    .eq("estado_id", estadoId) // Asumiendo que esta es la columna de relación
    .order("nombre");

  if (error) return console.error("Error cargando municipios:", error);

  data.forEach((muni) => {
    const option = document.createElement("option");
    option.value = muni.id;
    option.textContent = muni.nombre;
    selectMunicipio.appendChild(option);
  });
  selectMunicipio.disabled = false;
}

// 4. LÓGICA DE DATOS ADICIONALES (image_11.png)
async function cargarGiros() {
  // Asumiendo que en Datos Adicionales hay un <select id="adi_giros">
  const selectGiros = document.getElementById("adi_giros");
  if (!selectGiros) return;

  const { data, error } = await window.clientSupa
    .from("giros_lineas")
    .select("id, nombre") // Ajusta según tus columnas reales
    .order("nombre");

  if (error) return console.error("Error cargando giros:", error);

  data.forEach((giro) => {
    const option = document.createElement("option");
    option.value = giro.id;
    option.textContent = giro.nombre;
    selectGiros.appendChild(option);
  });
}

// 5. EJEMPLO DE GUARDADO DE DATOS (Sección Domicilio)
document
  .getElementById("formDomicilio")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const {
      data: { user },
    } = await window.clientSupa.auth.getUser();

    const datosDomicilio = {
      estado_id: document.getElementById("dom_estado").value,
      municipio_id: document.getElementById("dom_municipio").value,
      colonia: document.getElementById("dom_colonia").value,
      // ... demás campos del formulario ...
    };

    const { error } = await window.clientSupa
      .from("usuarios") // O la tabla donde guardes domicilios
      .update(datosDomicilio)
      .eq("id", user.id);

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      alert("Datos de domicilio guardados correctamente.");
      // Opcional: Avanzar automáticamente
      // mostrarSeccion('adicionales');
    }
  });
