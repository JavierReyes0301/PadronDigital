/* 1. Al cargar la página, llenar el select de Giros */
document.addEventListener("DOMContentLoaded", function () {
  const selectGiro = document.getElementById("SelectGiro");

  // Verificamos si el select existe en la página actual antes de intentar llenarlo
  if (selectGiro) {
    for (const id in datosCompletos) {
      let opt = document.createElement("option");
      opt.value = id;
      opt.text = `Giro ${id}: ${datosCompletos[id].nombre}`;
      selectGiro.add(opt);
    }
  }
});

/* 2. Función para actualizar las líneas según el giro elegido */
function actualizarLineas() {
  const giroId = document.getElementById("SelectGiro").value;
  const lineaSelect = document.getElementById("LineaSel");

  if (!lineaSelect) return; // Seguridad por si no existe el select de líneas

  lineaSelect.innerHTML = '<option value="0">Seleccione una línea...</option>';

  if (giroId !== "0" && datosCompletos[giroId]) {
    lineaSelect.disabled = false;
    datosCompletos[giroId].lineas.forEach((linea) => {
      let opt = document.createElement("option");
      opt.value = linea;
      opt.text = linea;
      lineaSelect.add(opt);
    });
  } else {
    lineaSelect.disabled = true;
  }
}

/* 3. Funciones adicionales (Modal y Buscar) */
function abrirEmergente() {
  const modal = document.getElementById("ContenedorEmergente");
  if (modal) modal.style.display = "block";
}

function cerrarEmergente() {
  const modal = document.getElementById("ContenedorEmergente");
  if (modal) modal.style.display = "none";
}

// ESTA ES LA FUNCIÓN QUE CAMBIAMOS PARA QUE SEA UNIVERSAL
function Consultar() {
  // Buscamos el formulario que esté presente en la página actual
  const formulario = document.querySelector("form");

  if (formulario) {
    alert("Iniciando búsqueda...");
    formulario.submit();
  } else {
    console.error("No se encontró ningún formulario para enviar.");
  }
}
