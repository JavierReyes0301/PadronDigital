/**
 * LÓGICA INTEGRAL PARA EL PADRÓN DE PROVEEDORES
 */
let PROVEEDOR_ID = null;

// 1. INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", async () => {
  const {
    data: { session },
  } = await window.clientSupa.auth.getSession();

  if (session) {
    PROVEEDOR_ID = session.user.id;
    console.log("👤 Usuario autenticado:", PROVEEDOR_ID);

    // Ejecutar carga de datos
    inicializarPagina();
  } else {
    console.error("🔴 No se detectó sesión activa.");
  }

  configurarEscuchadores();
});

async function inicializarPagina() {
  // A. Poblar select de años
  const selectAnio = document.getElementById("select-anio");
  if (selectAnio) {
    const actual = new Date().getFullYear();
    for (let i = actual; i >= 1970; i--) {
      selectAnio.add(new Option(i, i));
    }
  }

  // B. CARGA DE DATOS DESDE LA TABLA 'usuarios' (Para la Imagen 1)
  const { data: usuario, error: errUser } = await window.clientSupa
    .from("usuarios")
    .select("rfc, tipo_persona, correo")
    .eq("id", PROVEEDOR_ID)
    .single();

  if (usuario) {
    document.getElementById("info-rfc").innerText = usuario.rfc || "S/D";
    document.getElementById("info-correo").innerText = usuario.correo || "S/D";
    document.getElementById("info-tipo-persona").innerText =
      usuario.tipo_persona || "S/D";
    gestionarCamposTipoPersona(usuario.tipo_persona);
  }

  // C. CARGA DE DATOS DESDE LA TABLA 'proveedores' (Para llenar el formulario)
  const { data: prov } = await window.clientSupa
    .from("proveedores")
    .select("*")
    .eq("id", PROVEEDOR_ID)
    .single();

  if (prov) {
    // Llenar campos de texto automáticamente si ya existen
    if (document.getElementById("num_acta"))
      document.getElementById("num_acta").value = prov.num_acta || "";
    if (document.getElementById("nombre_comercial"))
      document.getElementById("nombre_comercial").value =
        prov.nombre_comercial || "";
    if (document.getElementById("rep_nombre"))
      document.getElementById("rep_nombre").value = prov.rep_nombre || "";
    // Agrega aquí los demás campos que quieras que se mantengan llenos al recargar
  }
}

// 2. LÓGICA DINÁMICA DE INTERFAZ
function gestionarCamposTipoPersona(tipo) {
  const contenedorPoder = document.getElementById("contenedor-poder-notarial");
  const labelActa = document.getElementById("label-acta");
  if (tipo === "Moral" || tipo === "PERSONA MORAL") {
    if (contenedorPoder) contenedorPoder.style.display = "flex";
    if (labelActa)
      labelActa.innerHTML =
        '<span class="text-danger">*</span> Acta Constitutiva:';
  } else {
    if (contenedorPoder) contenedorPoder.style.display = "none";
    if (labelActa)
      labelActa.innerHTML =
        '<span class="text-danger">*</span> Acta de Nacimiento:';
  }
}

function ajustarLabelIdentificacion() {
  const tipo = document.getElementById("select_tipo_doc").value;
  const label = document.getElementById("label-identificacion");
  const etiquetas = {
    ID: "Clave de Elector:",
    PASAPORTE: "Número de Pasaporte:",
    CEDULA: "Cédula Profesional:",
  };
  if (label) label.innerText = etiquetas[tipo] || "Dato de Identificación:";
}

function actualizarEstadoArchivo(tipo) {
  const fileInput = document.getElementById(`file-${tipo}`);
  const statusSpan = document.getElementById(`status-${tipo}`);
  if (fileInput && fileInput.files.length > 0) {
    statusSpan.innerText = fileInput.files[0].name;
    statusSpan.className = "text-success font-weight-bold";
  }
}

// 3. FUNCIONES DE GUARDADO (VALIDACIÓN INCLUIDA)

async function guardarGenerales() {
  // Validación simple
  const numActa = document.getElementById("num_acta").value.trim();
  if (!numActa) return alert("⚠️ El número de acta es obligatorio.");

  const payload = {
    id: PROVEEDOR_ID,
    num_acta: numActa,
    poder_notarial: document.getElementById("poder_notarial").value,
    nombre_comercial: document.getElementById("nombre_comercial").value,
    rep_nombre: document.getElementById("rep_nombre").value,
    rep_paterno: document.getElementById("rep_paterno").value,
    rep_materno: document.getElementById("rep_materno").value,
    tipo_representante: document.getElementById("tipo_representante").value,
    tipo_identificacion: document.getElementById("select_tipo_doc").value,
    num_identificacion: document.getElementById("num_identificacion").value,
    updated_at: new Date(),
  };

  const { error } = await window.clientSupa.from("proveedores").upsert(payload);
  if (error) alert("Error: " + error.message);
  else alert("✅ Datos Generales guardados correctamente.");
}

async function guardarDomicilio() {
  const payload = {
    id: PROVEEDOR_ID,
    estado: document.getElementById("select-estado").value,
    municipio: document.getElementById("select-municipio").value,
    vialidad: document.getElementById("vialidad").value,
    num_ext: document.getElementById("num_ext").value,
    num_int: document.getElementById("num_int").value,
    colonia: document.getElementById("colonia").value,
    cp: document.getElementById("cp").value,
  };

  const { error } = await window.clientSupa.from("proveedores").upsert(payload);
  if (error) alert("Error: " + error.message);
  else alert("✅ Domicilio guardado.");
}

async function guardarAdcionales() {
  const payload = {
    id: PROVEEDOR_ID,
    telefono: document.getElementById("input-telefono").value,
    capacidad_crediticia: document.getElementById("select-capacidad").value,
    num_empleados: document.getElementById("select-empleados").value,
    anio_inicio: document.getElementById("select-anio").value,
  };

  const { error } = await window.clientSupa.from("proveedores").upsert(payload);
  if (error) alert("Error: " + error.message);
  else alert("✅ Datos adicionales guardados.");
}

// 4. ARCHIVOS Y REVISIÓN
async function SolicitudRevisionn() {
  const rfc = document.getElementById("info-rfc").innerText;
  if (rfc === "Cargando..." || rfc === "S/D")
    return alert("Error: RFC no detectado.");

  const inputs = [
    { id: "csf", input: document.getElementById("file-csf") },
    { id: "acta", input: document.getElementById("file-acta") },
    { id: "domicilio", input: document.getElementById("file-domicilio") },
    { id: "ine", input: document.getElementById("file-ine") },
  ];

  for (const item of inputs) {
    if (item.input.files.length > 0) {
      const file = item.input.files[0];
      const filePath = `${rfc}/${item.id}.pdf`;

      const { error: uploadError } = await window.clientSupa.storage
        .from("expedientes")
        .upload(filePath, file, { upsert: true });

      if (uploadError)
        return alert(`Error en ${item.id}: ` + uploadError.message);
    }
  }

  await window.clientSupa
    .from("proveedores")
    .update({ estatus: "EN REVISIÓN" })
    .eq("id", PROVEEDOR_ID);
  alert("🚀 Expediente enviado a revisión con éxito.");
}

function configurarEscuchadores() {
  const selectEstado = document.getElementById("select-estado");
  if (selectEstado) {
    selectEstado.addEventListener("change", () => {
      const mun = document.getElementById("select-municipio");
      if (mun) mun.disabled = selectEstado.value === "";
    });
  }
}
