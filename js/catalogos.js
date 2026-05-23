// js/gestion-catalogos.js

let mapaDatos = {};

/**
 * Extrae el número de una cadena (ej. "L1" -> 1, "Giro 10" -> 10)
 * para permitir un ordenamiento numérico real.
 */
function extraerNumero(texto) {
  if (!texto) return 0;
  // Buscamos solo los dígitos en la cadena
  const coincidencia = texto.toString().match(/\d+/);
  return coincidencia ? parseInt(coincidencia[0], 10) : 0;
}

/**
 * Carga inicial desde Supabase
 */
async function cargarDatosSupabase() {
  const contenedor = document.getElementById("contenedor-tablas");

  try {
    if (!window.clientSupa) {
      return setTimeout(cargarDatosSupabase, 500);
    }

    const { data, error } = await window.clientSupa
      .from("giros_lineas")
      .select("id_giro, nombre_giro, linea, descripcion");

    if (error) throw error;

    mapaDatos = {};
    data.forEach((fila) => {
      if (!mapaDatos[fila.id_giro]) {
        mapaDatos[fila.id_giro] = { nombre: fila.nombre_giro, lineas: [] };
      }
      mapaDatos[fila.id_giro].lineas.push({
        nombre: fila.linea,
        desc: fila.descripcion || "Sin descripción",
      });
    });

    dibujarTablasCatalogo();
  } catch (err) {
    console.error("Error cargando catálogos:", err.message);
    if (contenedor) {
      contenedor.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
    }
  }
}

/**
 * Renderiza las tablas con orden consecutivo (1, 2, 3...)
 */
function dibujarTablasCatalogo(filtro = "") {
  const contenedor = document.getElementById("contenedor-tablas");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  const busqueda = filtro.toLowerCase().trim();

  // 1. Ordenar los IDs de los Giros numéricamente
  const idsOrdenados = Object.keys(mapaDatos).sort(
    (a, b) => extraerNumero(a) - extraerNumero(b),
  );

  idsOrdenados.forEach((id) => {
    const giro = mapaDatos[id];

    // 2. Ordenar las Líneas dentro de este giro numéricamente (L1, L2, L3...)
    const lineasOrdenadasConsecutivas = giro.lineas.sort(
      (a, b) => extraerNumero(a.nombre) - extraerNumero(b.nombre),
    );

    // Lógica de filtrado
    const coincideGiro =
      id.toLowerCase().includes(busqueda) ||
      giro.nombre.toLowerCase().includes(busqueda);
    const lineasFiltradas = lineasOrdenadasConsecutivas.filter(
      (l) =>
        l.nombre.toLowerCase().includes(busqueda) ||
        l.desc.toLowerCase().includes(busqueda),
    );

    if (!coincideGiro && lineasFiltradas.length === 0) return;

    const seccion = document.createElement("div");
    seccion.className =
      "seccion-contenedor-giro my-4 p-3 shadow-sm bg-white rounded border";

    const lineasAMostrar = coincideGiro
      ? lineasOrdenadasConsecutivas
      : lineasFiltradas;

    seccion.innerHTML = `
            <h5 class="text-center" style="color: #ab0a3d; font-weight: bold;">
                GIRO ${id.replace(/\D/g, "")}: ${giro.nombre.toUpperCase()}
            </h5>
            <div class="table-responsive">
                <table class="table table-sm table-hover table-bordered mb-0">
                    <thead style="background-color: #ab0a3d; color: white;">
                        <tr>
                            <th style="width: 20%;">Línea</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lineasAMostrar
                          .map(
                            (l) => `
                            <tr>
                                <td class="text-center"><strong>${l.nombre}</strong></td>
                                <td>${l.desc}</td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        `;
    contenedor.appendChild(seccion);
  });

  if (contenedor.innerHTML === "") {
    contenedor.innerHTML = `<div class="text-center p-5 text-muted">No se encontraron resultados para "${filtro}"</div>`;
  }
}

/**
 * Event Listeners
 */
document.addEventListener("DOMContentLoaded", () => {
  cargarDatosSupabase();
  const buscador = document.getElementById("inputBuscador");
  if (buscador) {
    buscador.addEventListener("input", (e) =>
      dibujarTablasCatalogo(e.target.value),
    );
  }
});
