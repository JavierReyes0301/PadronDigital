// 1. FUNCIÓN PARA LEER EL EXCEL
async function leerExcel() {
  try {
    const respuesta = await fetch("Tablas.xlsx");
    if (!respuesta.ok) throw new Error("No se encontró el archivo Tablas.xlsx");

    const arrayBuffer = await respuesta.arrayBuffer();
    const libro = XLSX.read(arrayBuffer);
    const hoja = libro.Sheets[libro.SheetNames[0]];
    const datos = XLSX.utils.sheet_to_json(hoja, { header: 1 });

    const contenedor = document.getElementById("contenedor-tablas");
    let htmlFinal = "";
    let nombreGiroActual = "";
    let idGiroLimpio = "";

    datos.forEach((fila, indice) => {
      if (!fila || fila.length === 0) return;
      if (fila[0] === "Giro" || fila[1] === "Nombre" || fila[0] === "ID")
        return;

      if (fila[0] && fila[0].toString().includes("Giro")) {
        if (htmlFinal !== "") htmlFinal += `</tbody></table></div>`;
        idGiroLimpio = fila[0].toString().replace(/Giro\s+/i, "");
        nombreGiroActual = fila[1] || "";

        htmlFinal += `
                    <div class="catalogo-atli-v4">
        <div class="giro-header-v4">
            ${nombreGiroActual}
        </div>
        <table class="tabla-atli-v4 table table-bordered m-0">
            <thead>
                <tr>
                    <th class="col-giro">Giro</th>
                    <th class="col-linea">Línea</th>
                    <th>Descripción de Actividades</th>
                </tr>
            </thead>
            <tbody>`;
      }

      if (fila[2] || fila[3]) {
        htmlFinal += `
                    <tr>
                        <td class="text-center" style="font-weight: bold; color: #555;">${idGiroLimpio}</td>
                        <td class="text-center">${fila[2] || ""}</td>
                        <td style="text-align: justify; padding: 10px;">${fila[3] || ""}</td>
                    </tr>`;
      }
    });
    contenedor.innerHTML = htmlFinal + `</tbody></table></div>`;
  } catch (e) {
    console.error("Error cargando Excel:", e);
  }
}

// 2. FUNCIÓN PARA GENERAR EL PDF (CORREGIDA)
function generarPDF() {
  const elemento = document.getElementById("contenedor-tablas");

  if (!elemento || elemento.innerText.trim() === "") {
    alert("Los datos aún no cargan.");
    return;
  }

  const opciones = {
    margin: [10, 10, 10, 10],
    filename: "Catalogo_Giros_Atlixco.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    },
    jsPDF: { unit: "mm", format: "letter", orientation: "portrait" },
    pagebreak: {
      mode: ["avoid-all", "css", "legacy"],
      before: ".catalogo-atli-v4",
    },
  };

  html2pdf().set(opciones).from(elemento).save();
}

// 3. SE EJECUTA AL CARGAR LA WEB
document.addEventListener("DOMContentLoaded", leerExcel);
