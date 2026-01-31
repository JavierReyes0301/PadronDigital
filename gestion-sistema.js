// 1. Variable global para almacenar los datos procesados de Supabase
let mapaDatos = {};

// 2. Función principal que descarga y procesa los datos
async function cargarDatosSupabase() {
  try {
    console.log("Consultando base de datos...");

    if (!window.clientSupa) {
      console.error("❌ Error: No se detectó la conexión a Supabase.");
      return;
    }

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

    llenarSelectGiros();
    dibujarTablasCatalogo();

    console.log("✅ Datos cargados y sistema actualizado");
  } catch (err) {
    console.error("❌ Error crítico en el script:", err.message);
  }
}

// 3. Función para dibujar las tablas en orden (G1, G2, G3...)
function dibujarTablasCatalogo() {
  const contenedor = document.getElementById("contenedor-tablas");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const idsOrdenados = Object.keys(mapaDatos).sort((a, b) => {
    const numA = parseInt(a.toString().replace(/\D/g, "")) || 0;
    const numB = parseInt(b.toString().replace(/\D/g, "")) || 0;
    return numA - numB;
  });

  idsOrdenados.forEach((id) => {
    const giro = mapaDatos[id];
    const seccionGiro = document.createElement("div");

    seccionGiro.className =
      "my-3 p-2 shadow-sm bg-white rounded border mx-auto";
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

    const lineasOrdenadas = [...giro.lineas].sort((a, b) => {
      const numA = parseInt(a.nombre.replace(/\D/g, "")) || 0;
      const numB = parseInt(b.nombre.replace(/\D/g, "")) || 0;
      return numA - numB;
    });

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
    contenedor.appendChild(seccionGiro);
  });
}

// 4. Funciones para los menús desplegables
function llenarSelectGiros() {
  const selectGiro = document.getElementById("SelectGiro");
  if (!selectGiro) return;
  selectGiro.innerHTML = '<option value="0">-- Seleccione un Giro --</option>';

  const idsOrdenados = Object.keys(mapaDatos).sort((a, b) => {
    const numA = parseInt(a.toString().replace(/\D/g, "")) || 0;
    const numB = parseInt(b.toString().replace(/\D/g, "")) || 0;
    return numA - numB;
  });

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

  const lineasDisponibles = [...mapaDatos[giroId].lineas].sort((a, b) => {
    const numA = parseInt(a.nombre.replace(/\D/g, "")) || 0;
    const numB = parseInt(b.nombre.replace(/\D/g, "")) || 0;
    return numA - numB;
  });

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

document.addEventListener("DOMContentLoaded", cargarDatosSupabase);
