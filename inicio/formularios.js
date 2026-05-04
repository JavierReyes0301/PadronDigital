/**
 * LÓGICA INTEGRAL PARA EL PADRÓN DE PROVEEDORES
 * Conexión optimizada con window.clientSupa
 */

let PROVEEDOR_ID = null; // Se obtendrá de la sesión activa

// 1. INICIALIZACIÓN Y CARGA DE DATOS
document.addEventListener("DOMContentLoaded", async () => {
  // Verificar sesión y obtener ID del usuario
  const {
    data: { session },
  } = await window.clientSupa.auth.getSession();

  if (session) {
    PROVEEDOR_ID = session.user.id;
    console.log("👤 Usuario autenticado:", PROVEEDOR_ID);
    inicializarPagina();
  } else {
    console.error("🔴 No se detectó sesión activa. Redirigiendo...");
    // window.location.href = 'login.html';
  }

  configurarEscuchadores();
});

async function inicializarPagina() {
  // Cargar años dinámicamente
  const selectAnio = document.getElementById("select-anio");
  const anioActual = new Date().getFullYear();
  for (let i = anioActual; i >= 1970; i--) {
    selectAnio.add(new Option(i, i));
  }

  // CARGA REAL: Obtener datos base de la tabla proveedores o perfil
  const { data, error } = await window.clientSupa
    .from("proveedores")
    .select("rfc, correo, tipo_persona")
    .eq("id", PROVEEDOR_ID)
    .single();

  if (data) {
    document.getElementById("info-rfc").innerText = data.rfc || "No registrado";
    document.getElementById("info-correo").innerText =
      data.correo || "No registrado";
    document.getElementById("info-tipo-persona").innerText =
      data.tipo_persona || "PERSONA FÍSICA";
    gestionarCamposTipoPersona(data.tipo_persona);
  }
}

// 2. LÓGICA DINÁMICA DE LA INTERFAZ (UI)
function gestionarCamposTipoPersona(tipo) {
  const contenedorPoder = document.getElementById("contenedor-poder-notarial");
  const labelActa = document.getElementById("label-acta");
  if (tipo === "PERSONA MORAL") {
    contenedorPoder.style.display = "flex";
    labelActa.innerHTML =
      '<span class="text-danger">*</span> Acta Constitutiva:';
  } else {
    contenedorPoder.style.display = "none";
    labelActa.innerHTML =
      '<span class="text-danger">*</span> Acta de Nacimiento:';
  }
}

function ajustarLabelIdentificacion() {
  const tipo = document.getElementById("select_tipo_doc").value;
  const label = document.getElementById("label-identificacion");
  const input = document.getElementById("num_identificacion");
  const etiquetas = {
    ID: "Clave de Elector:",
    PASAPORTE: "Número de Pasaporte:",
    CEDULA: "Cédula Profesional:",
  };
  label.innerText = etiquetas[tipo] || "Dato de Identificación:";
}

function actualizarEstadoArchivo(tipo) {
  const fileInput = document.getElementById(`file-${tipo}`);
  const statusSpan = document.getElementById(`status-${tipo}`);
  if (fileInput.files.length > 0) {
    statusSpan.innerText = fileInput.files[0].name;
    statusSpan.classList.replace("text-muted", "text-success");
    statusSpan.classList.add("font-weight-bold");
  }
}

// 3. FUNCIONES DE GUARDADO (CONEXIÓN REAL A SUPABASE)

async function guardarGenerales() {
  const payload = {
    id: PROVEEDOR_ID,
    num_acta: document.getElementById("num_acta").value,
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
  else alert("✅ Datos Generales sincronizados.");
}

async function guardarDomicilio() {
  const payload = {
    id: PROVEEDOR_ID,
    estado: document.getElementById("select-estado").value,
    municipio: document.getElementById("select-municipio").value,
    localidad: document.getElementById("select-localidad").value,
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
  // Nombre corregido para tu HTML
  const payload = {
    id: PROVEEDOR_ID,
    telefono: document.getElementById("input-telefono").value,
    capacidad_crediticia: document.getElementById("select-capacidad").value,
    num_empleados: document.getElementById("select-empleados").value,
    anio_inicio: document.getElementById("select-anio").value,
  };

  const { error } = await window.clientSupa.from("proveedores").upsert(payload);
  if (error) alert("Error: " + error.message);
  else alert("✅ Información adicional guardada.");
}

// 4. ENVÍO FINAL Y CARGA DE ARCHIVOS
async function SolicitudRevisionn() {
  const rfc = document.getElementById("info-rfc").innerText;
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

      if (uploadError) {
        alert(`Error en archivo ${item.id}: ` + uploadError.message);
        return;
      }
    }
  }

  // Actualizar estatus a PENDIENTE
  await window.clientSupa
    .from("proveedores")
    .update({ estatus: "PENDIENTE" })
    .eq("id", PROVEEDOR_ID);
  alert("🚀 Expediente enviado a revisión con éxito.");
}

function configurarEscuchadores() {
  const selectEstado = document.getElementById("select-estado");
  const selectMunicipio = document.getElementById("select-municipio");
  selectEstado.addEventListener("change", () => {
    selectMunicipio.disabled = selectEstado.value === "";
  });
}
