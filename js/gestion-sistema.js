/**
 * js/gestion-sistema.js
 * Lógica para el catálogo dinámico de giros y líneas comerciales.
 */

let mapaDatos = {};

/**
 * Extrae números de strings para ordenamiento lógico (ej. "G10" -> 10)
 */
function extraerNumero(texto) {
  if (!texto) return 0;
  return parseInt(texto.toString().replace(/\D/g, ""), 10) || 0;
}

/**
 * Carga inicial de datos desde Supabase
 */
async function cargarDatosSupabase() {
  try {
    // Verificamos disponibilidad del cliente global configurado en conexion-supabase.js
    if (!window.clientSupa) {
      console.warn("⏳ Reintentando conexión con base de datos...");
      setTimeout(cargarDatosSupabase, 500);
      return;
    }

    const { data, error } = await window.clientSupa
      .from("giros_lineas")
      .select("id_giro, nombre_giro, linea, descripcion")
      .order("id_giro", { ascending: true });

    if (error) throw error;

    // Procesamiento: Agrupamos líneas bajo su respectivo giro
    mapaDatos = {};
    data.forEach((fila) => {
      if (!mapaDatos[fila.id_giro]) {
        mapaDatos[fila.id_giro] = {
          nombre: fila.nombre_giro,
          lineas: [],
        };
      }

      // Evitar duplicados de líneas en el mismo giro
      const existe = mapaDatos[fila.id_giro].lineas.some(
        (l) => l.nombre === fila.linea,
      );
      if (!existe) {
        mapaDatos[fila.id_giro].lineas.push({
          nombre: fila.linea,
          desc: fila.descripcion || "Sin descripción detallada",
        });
      }
    });

    // Actualización de la interfaz
    llenarSelectGiros();
    dibujarTablasCatalogo();
    inicializarBuscador();

    console.log("✅ Sistema de catálogo listo.");
  } catch (err) {
    console.error("❌ Error en gestión de datos:", err.message);
  }
}

/**
 * Renderiza las tablas de catálogo en el HTML
 */
function dibujarTablasCatalogo() {
  const contenedor = document.getElementById("contenedor-tablas");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  const fragmento = document.createDocumentFragment();

  // Ordenar IDs numéricamente
  const idsOrdenados = Object.keys(mapaDatos).sort(
    (a, b) => extraerNumero(a) - extraerNumero(b),
  );

  idsOrdenados.forEach((id) => {
    const giro = mapaDatos[id];
    const seccionGiro = document.createElement("div");
    seccionGiro.className =
      "seccion-contenedor-giro my-4 p-3 shadow-sm bg-white rounded border mx-auto";
    seccionGiro.style.maxWidth = "1000px";

    const idLimpio = id.toString().replace(/\D/g, "");

    let html = `
      <h5 class="mt-1 text-center" style="color: #ab0a3d; border-bottom: 2px solid #bc955c; padding-bottom: 10px; font-weight: 700;">
        GIRO ${idLimpio}: ${giro.nombre.toUpperCase()}
      </h5>
      <div class="table-responsive">
        <table class="table table-sm table-hover table-bordered mt-2" style="font-size: 0.9rem;">
          <thead style="background-color: #ab0a3d; color: white;">
            <tr>
              <th class="text-center" style="width: 15%; border-color: #bc955c;">Línea</th>
              <th class="text-center" style="border-color: #bc955c;">Descripción de Actividades</th>
            </tr>
          </thead>
          <tbody>
    `;

    // Ordenar líneas numéricamente
    const lineasOrdenadas = [...giro.lineas].sort(
      (a, b) => extraerNumero(a.nombre) - extraerNumero(b.nombre),
    );

    lineasOrdenadas.forEach((item) => {
      html += `
        <tr>
          <td class="text-center align-middle"><strong>${item.nombre}</strong></td>
          <td class="align-middle px-3">${item.desc}</td>
        </tr>
      `;
    });

    html += `</tbody></table></div>`;
    seccionGiro.innerHTML = html;
    fragmento.appendChild(seccionGiro);
  });

  contenedor.appendChild(fragmento);
}

/**
 * Filtro dinámico de búsqueda
 */
function inicializarBuscador() {
  const input = document.getElementById("inputBuscador");
  if (!input) return;

  // Estilización del componente de búsqueda
  const inputGroup = input.closest(".input-group");
  if (inputGroup) {
    const icon = inputGroup.querySelector(".input-group-text");
    if (icon) {
      icon.style.cssText =
        "background-color: #ab0a3d; color: white; border-color: #bc955c;";
    }
    input.style.borderColor = "#bc955c";
  }

  // Evento 'input' para respuesta inmediata
  input.addEventListener("input", function () {
    const filtro = this.value.toLowerCase().trim();
    const secciones = document.querySelectorAll(".seccion-contenedor-giro");

    secciones.forEach((seccion) => {
      const filas = seccion.querySelectorAll("tbody tr");
      let tieneCoincidencia = false;

      filas.forEach((fila) => {
        const coinciden = fila.textContent.toLowerCase().includes(filtro);
        fila.style.display = coinciden ? "" : "none";
        if (coinciden) tieneCoincidencia = true;
      });

      // Mostrar/Ocultar la sección completa (Giro) si no hay líneas que coincidan
      seccion.style.display = filtro === "" || tieneCoincidencia ? "" : "none";
    });
  });
}

/**
 * Lógica para los selectores dependientes (Giro -> Línea)
 */
function llenarSelectGiros() {
  const selectGiro = document.getElementById("SelectGiro");
  if (!selectGiro) return;

  selectGiro.innerHTML =
    '<option value="0" selected disabled>-- Seleccione un Giro --</option>';

  const idsOrdenados = Object.keys(mapaDatos).sort(
    (a, b) => extraerNumero(a) - extraerNumero(b),
  );

  idsOrdenados.forEach((id) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = `Giro ${id}: ${mapaDatos[id].nombre}`;
    selectGiro.appendChild(opt);
  });

  // Escuchador para actualizar el segundo select
  selectGiro.addEventListener("change", actualizarLineas);
}

function actualizarLineas() {
  const giroId = document.getElementById("SelectGiro").value;
  const selectLinea = document.getElementById("LineaSel");
  if (!selectLinea || giroId === "0") return;

  const lineasDisponibles = [...mapaDatos[giroId].lineas].sort(
    (a, b) => extraerNumero(a.nombre) - extraerNumero(b.nombre),
  );

  selectLinea.innerHTML =
    '<option value="0" selected disabled>-- Seleccione una Línea --</option>';
  lineasDisponibles.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item.nombre;
    opt.textContent = `${item.nombre} - ${item.desc}`;
    selectLinea.appendChild(opt);
  });

  selectLinea.disabled = false;
}

// Arranque
document.addEventListener("DOMContentLoaded", cargarDatosSupabase);
