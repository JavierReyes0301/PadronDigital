/**
 * LÓGICA INTEGRAL PARA EL PADRÓN DE PROVEEDORES
 * Conexión optimizada con window.clientSupa
 */

let PROVEEDOR_ID = null;

// 1. INICIALIZACIÓN AL CARGAR EL DOCUMENTO
document.addEventListener("DOMContentLoaded", async () => {
  // Verificar sesión activa
  const {
    data: { session },
  } = await window.clientSupa.auth.getSession();

  if (session) {
    PROVEEDOR_ID = session.user.id;
    console.log("👤 Usuario autenticado:", PROVEEDOR_ID);

    // Ejecutar la carga masiva de datos
    inicializarPagina();
  } else {
    console.error("🔴 No se detectó sesión activa.");
    // Opcional: window.location.href = 'login.html';
  }

  configurarEscuchadores();
});

// --- FUNCIÓN DE CARGA PRINCIPAL (SUSTITUIDA Y MEJORADA) ---
async function inicializarPagina() {
  console.log("🔄 Iniciando sincronización de datos...");

  // A. Poblar selector de años (si existe)
  const selectAnio = document.getElementById("select-anio");
  if (selectAnio && selectAnio.options.length <= 1) {
    const actual = new Date().getFullYear();
    for (let i = actual; i >= 1970; i--) {
      selectAnio.add(new Option(i, i));
    }
  }

  try {
    // B. CARGA DESDE LA TABLA 'usuarios' (Datos de Registro/Perfil)
    const { data: usuario, error: errUser } = await window.clientSupa
      .from("usuarios")
      .select("rfc, tipo_persona, correo")
      .eq("id", PROVEEDOR_ID)
      .single();

    if (usuario) {
      document.getElementById("info-rfc").innerText =
        usuario.rfc || "No registrado";
      document.getElementById("info-correo").innerText =
        usuario.correo || "No registrado";
      document.getElementById("info-tipo-persona").innerText =
        usuario.tipo_persona || "No registrado";

      // Ajustar interfaz según tipo de persona
      gestionarCamposTipoPersona(usuario.tipo_persona);
    }

    // C. CARGA DESDE LA TABLA 'proveedores' (Datos guardados en el formulario)
    const { data: prov, error: errProv } = await window.clientSupa
      .from("proveedores")
      .select("*")
      .eq("id", PROVEEDOR_ID)
      .single();

    if (prov) {
      console.log("📦 Datos de formulario encontrados:", prov);

      // Actualizar Folio si existe
      if (prov.folio) {
        document.getElementById("folio-expediente").innerText =
          `EXP-${prov.folio}`;
      }

      // --- LLENAR PESTAÑA GENERALES ---
      document.getElementById("num_acta").value = prov.num_acta || "";
      document.getElementById("poder_notarial").value =
        prov.poder_notarial || "";
      document.getElementById("nombre_comercial").value =
        prov.nombre_comercial || "";
      document.getElementById("rep_nombre").value = prov.rep_nombre || "";
      document.getElementById("rep_paterno").value = prov.rep_paterno || "";
      document.getElementById("rep_materno").value = prov.rep_materno || "";
      document.getElementById("tipo_representante").value =
        prov.tipo_representante || "Representante Legal";
      document.getElementById("select_tipo_doc").value =
        prov.tipo_identificacion || "ID";
      document.getElementById("num_identificacion").value =
        prov.num_identificacion || "";

      // Actualizar el label dinámico de identificación
      ajustarLabelIdentificacion();

      // --- LLENAR PESTAÑA DOMICILIO ---
      if (document.getElementById("vialidad")) {
        document.getElementById("select-estado").value = prov.estado || "";
        document.getElementById("vialidad").value = prov.vialidad || "";
        document.getElementById("num_ext").value = prov.num_ext || "";
        document.getElementById("num_int").value = prov.num_int || "";
        document.getElementById("colonia").value = prov.colonia || "";
        document.getElementById("cp").value = prov.cp || "";
        // Disparar evento para desbloquear municipio si hay estado
        document
          .getElementById("select-estado")
          .dispatchEvent(new Event("change"));
        document.getElementById("select-municipio").value =
          prov.municipio || "";
      }

      // --- LLENAR PESTAÑA ADICIONALES ---
      if (document.getElementById("input-telefono")) {
        document.getElementById("input-telefono").value = prov.telefono || "";
        document.getElementById("select-capacidad").value =
          prov.capacidad_crediticia || "";
        document.getElementById("select-empleados").value =
          prov.num_empleados || "";
        document.getElementById("select-anio").value = prov.anio_inicio || "";
      }
    }
  } catch (e) {
    console.error("❌ Error en inicializarPagina:", e);
  }
}

// 2. LÓGICA DINÁMICA DE INTERFAZ (UI)
function gestionarCamposTipoPersona(tipo) {
  const contenedorPoder = document.getElementById("contenedor-poder-notarial");
  const labelActa = document.getElementById("label-acta");
  const esMoral = tipo === "Moral" || tipo === "PERSONA MORAL";

  if (contenedorPoder)
    contenedorPoder.style.display = esMoral ? "flex" : "none";
  if (labelActa) {
    labelActa.innerHTML = esMoral
      ? '<span class="text-danger">*</span> Acta Constitutiva:'
      : '<span class="text-danger">*</span> Acta de Nacimiento:';
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

// 3. FUNCIONES DE GUARDADO (CON .UPSERT PARA EVITAR DUPLICADOS)

async function guardarGenerales() {
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

// 4. ARCHIVOS Y ENVÍO A REVISIÓN
async function SolicitudRevisionn() {
  const rfc = document.getElementById("info-rfc").innerText;
  if (rfc === "Cargando..." || rfc === "No registrado")
    return alert("Error: RFC no válido.");

  const inputs = [
    { id: "csf", input: document.getElementById("file-csf") },
    { id: "acta", input: document.getElementById("file-acta") },
    { id: "domicilio", input: document.getElementById("file-domicilio") },
    { id: "ine", input: document.getElementById("file-ine") },
  ];

  for (const item of inputs) {
    if (item.input && item.input.files.length > 0) {
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
