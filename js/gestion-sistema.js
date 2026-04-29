// js/gestion-sistema.js

// 1. Variable global para almacenar los datos procesados de Supabase
let mapaDatos = {};

/**
 * Función ayudante para extraer números de strings y permitir ordenamiento lógico
 */
function extraerNumero(texto) {
  return parseInt(texto.toString().replace(/\D/g, "")) || 0;
}

/**
 * Función principal para descargar y procesar los datos
 */
async function cargarDatosSupabase() {
  try {
    if (!window.clientSupa) {
      console.warn("⏳ Esperando a que 'window.clientSupa' esté disponible...");
      setTimeout(cargarDatosSupabase, 500);
      return;
    }

    console.log("Consultando base de datos...");

    const { data, error } = await window.clientSupa
      .from("giros_lineas")
      .select("id_giro, nombre_giro, linea, descripcion")
      .order("id_giro", { ascending: true });

    if (error) {
      console.error("❌ Error de Supabase:", error.message);
      return;
    }

    mapaDatos = {};
    data.forEach((fila) => {
      if (!mapaDatos[fila.id_giro]) {
        mapaDatos[fila.id_giro] = {
          nombre: fila.nombre_giro,
          lineas: [],
        };
      }

      const existe = mapaDatos[fila.id_giro].lineas.some(
        (l) => l.nombre === fila.linea,
      );
      if (!existe) {
        mapaDatos[fila.id_giro].lineas.push({
          nombre: fila.linea,
          desc: fila.descripcion || "Sin descripción",
        });
      }
    });

    // Renderizado de componentes
    llenarSelectGiros();
    dibujarTablasCatalogo();

    // INICIALIZACIÓN DEL BUSCADOR: Se ejecuta solo después de que el HTML existe
    inicializarBuscador();

    console.log("✅ Datos cargados y sistema actualizado");
  } catch (err) {
    console.error("❌ Error crítico en el script de gestión:", err.message);
  }
}

/**
 * Dibuja las tablas en el contenedor principal
 */
function dibujarTablasCatalogo() {
  const contenedor = document.getElementById("contenedor-tablas");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  const fragmento = document.createDocumentFragment();

  const idsOrdenados = Object.keys(mapaDatos).sort(
    (a, b) => extraerNumero(a) - extraerNumero(b),
  );

  idsOrdenados.forEach((id) => {
    const giro = mapaDatos[id];
    const seccionGiro = document.createElement("div");

    // Clase para identificar la sección completa durante la búsqueda
    seccionGiro.className =
      "seccion-contenedor-giro my-3 p-2 shadow-sm bg-white rounded border mx-auto";
    seccionGiro.style.maxWidth = "95%";

    const idSoloNumero = id.toString().replace(/\D/g, "");

    let html = `
      <h5 class="mt-1 text-center" style="color: #ab0a3d; border-bottom: 2px solid #bc955c; padding-bottom: 8px; font-weight: bold; font-size: 1.1rem;">
        G${idSoloNumero} ${giro.nombre}
      </h5>
      <table class="table table-sm table-striped table-bordered mt-2" style="font-size: 0.85rem;">
        <thead>
          <tr style="background-color: #ab0a3d; color: white;">
            <th class="text-center" style="width: 12%; border: 1px solid #bc955c;">Línea</th>
            <th class="text-center" style="border: 1px solid #bc955c;">Descripción</th>
          </tr>
        </thead>
        <tbody>
    `;

    const lineasOrdenadas = [...giro.lineas].sort(
      (a, b) => extraerNumero(a.nombre) - extraerNumero(b.nombre),
    );

    lineasOrdenadas.forEach((item) => {
      html += `
        <tr>
          <td class="text-center" style="vertical-align: middle;"><strong>${item.nombre}</strong></td>
          <td style="vertical-align: middle; padding-left: 10px;">${item.desc}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    seccionGiro.innerHTML = html;
    fragmento.appendChild(seccionGiro);
  });

  contenedor.appendChild(fragmento);
}

/**
 * Lógica del Buscador Dinámico con adecuaciones visuales
 */
function inicializarBuscador() {
  const input = document.getElementById("inputBuscador");
  if (!input) return;

  // Aplicar estilos de la marca directamente al input para asegurar consistencia
  const inputGroup = input.closest(".input-group");
  if (inputGroup) {
    const iconContainer = inputGroup.querySelector(".input-group-text");
    if (iconContainer) {
      iconContainer.style.backgroundColor = "#ab0a3d";
      iconContainer.style.color = "white";
      iconContainer.style.borderColor = "#bc955c";
    }
    input.style.borderColor = "#bc955c";
    input.style.fontFamily = "'Montserrat', sans-serif";
  }

  input.addEventListener("keyup", function () {
    const filtro = this.value.toLowerCase().trim();
    const seccionesGiro = document.querySelectorAll(".seccion-contenedor-giro");

    seccionesGiro.forEach((seccion) => {
      const filas = seccion.querySelectorAll("tbody tr");
      let tieneCoincidencia = false;

      filas.forEach((fila) => {
        const textoFila = fila.textContent.toLowerCase();
        if (textoFila.includes(filtro)) {
          fila.style.display = "";
          tieneCoincidencia = true;
        } else {
          fila.style.display = "none";
        }
      });

      // Si el filtro está vacío mostrar todo, si no, ocultar secciones sin coincidencias
      if (filtro === "") {
        seccion.style.display = "";
      } else {
        seccion.style.display = tieneCoincidencia ? "" : "none";
      }
    });
  });
}

/**
 * Funciones para los menús desplegables (Selects)
 */
function llenarSelectGiros() {
  const selectGiro = document.getElementById("SelectGiro");
  if (!selectGiro) return;
  selectGiro.innerHTML = '<option value="0">-- Seleccione un Giro --</option>';

  const idsOrdenados = Object.keys(mapaDatos).sort(
    (a, b) => extraerNumero(a) - extraerNumero(b),
  );

  idsOrdenados.forEach((id) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = `Giro ${id}: ${mapaDatos[id].nombre}`;
    selectGiro.appendChild(opt);
  });
}

function actualizarLineas() {
  const giroId = document.getElementById("SelectGiro").value;
  const selectLinea = document.getElementById("LineaSel");
  if (!selectLinea || giroId === "0") return;

  const lineasDisponibles = [...mapaDatos[giroId].lineas].sort(
    (a, b) => extraerNumero(a.nombre) - extraerNumero(b.nombre),
  );

  selectLinea.innerHTML =
    '<option value="0">-- Seleccione una Línea --</option>';
  lineasDisponibles.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item.nombre;
    opt.textContent = `${item.nombre} - ${item.desc}`;
    selectLinea.appendChild(opt);
  });
  selectLinea.disabled = false;
}

// INICIO AUTOMÁTICO AL CARGAR EL DOM
document.addEventListener("DOMContentLoaded", cargarDatosSupabase);
