/**
 * LÓGICA DE REGISTRO DE PROVEEDORES
 * Incluye: Datos Generales, Domicilio, Adicionales (Años), y Carga de Documentos.
 */

let PROVEEDOR_ID = null;
let USER_DATA = {}; // Almacena RFC, Correo y Tipo de Persona para evitar errores de BD

document.addEventListener("DOMContentLoaded", async () => {
  // Retraso de seguridad para asegurar la carga de la conexión Supabase
  setTimeout(async () => {
    if (!window.clientSupa) return;

    const {
      data: { session },
    } = await window.clientSupa.auth.getSession();

    if (session) {
      PROVEEDOR_ID = session.user.id;
      console.log("🟢 Sesión confirmada:", PROVEEDOR_ID);

      // 1. CARGA DE CATÁLOGOS INICIALES
      await cargarEstados();
      await cargarAnios(); // Carga desde la tabla 'años'
      configurarEscuchadores();
      await inicializarPagina();
    }
  }, 400);
});

// --- 1. INICIALIZACIÓN DE DATOS ---

async function inicializarPagina() {
  try {
    // A. Obtener datos de identidad (Obligatorios para Upsert)
    const { data: usuario } = await window.clientSupa
      .from("usuarios")
      .select("rfc, correo, tipo_persona")
      .eq("id", PROVEEDOR_ID)
      .single();

    if (usuario) {
      USER_DATA = usuario;
      document.getElementById("info-rfc").innerText = usuario.rfc || "---";
      document.getElementById("info-correo").innerText =
        usuario.correo || "---";
      document.getElementById("info-tipo-persona").innerText =
        usuario.tipo_persona || "---";
    }

    // B. Obtener expediente del proveedor
    let { data: prov } = await window.clientSupa
      .from("proveedores")
      .select("*")
      .eq("id", PROVEEDOR_ID)
      .maybeSingle();

    if (prov) {
      // Rellenar inputs de texto
      const campos = [
        "num_acta",
        "poder_notarial",
        "nombre_comercial",
        "rep_nombre",
        "rep_paterno",
        "rep_materno",
        "num_identificacion",
        "localidad",
        "vialidad",
        "num_ext",
        "num_int",
        "colonia",
        "cp",
        "input-telefono",
      ];

      campos.forEach((id) => {
        const el = document.getElementById(id);
        if (el)
          el.value = prov[id === "input-telefono" ? "telefono" : id] || "";
      });

      // Rehidratar selectores de ubicación
      if (prov.estado) {
        document.getElementById("select-estado").value = prov.estado;
        await cargarMunicipios(prov.estado);
        if (prov.municipio) {
          document.getElementById("select-municipio").value = prov.municipio;
        }
      }

      // Rehidratar selectores adicionales
      if (prov.anio_inicio)
        document.getElementById("select-anio").value = prov.anio_inicio;
      if (prov.capacidad_crediticia)
        document.getElementById("select-capacidad").value =
          prov.capacidad_crediticia;
      if (prov.num_empleados)
        document.getElementById("select-empleados").value = prov.num_empleados;
    }
  } catch (e) {
    console.error("❌ Error en inicialización:", e.message);
  }
}

// --- 2. CARGA DE CATÁLOGOS (API) ---

async function cargarAnios() {
  const selectAnio = document.getElementById("select-anio");
  if (!selectAnio) return;

  const { data, error } = await window.clientSupa
    .from("años") //
    .select("año")
    .order("año", { ascending: false });

  if (error) return console.error("❌ Error años:", error.message);

  selectAnio.innerHTML = '<option value="">SELECCIONE EL AÑO...</option>';
  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.año;
    option.text = item.año;
    selectAnio.appendChild(option);
  });
}

async function cargarEstados() {
  const { data, error } = await window.clientSupa
    .from("estados_mexico")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  if (error) return;
  const selectEstado = document.getElementById("select-estado");
  if (!selectEstado) return;

  selectEstado.innerHTML = '<option value="">SELECCIONE EL ESTADO...</option>';
  data.forEach((est) => {
    const option = document.createElement("option");
    option.value = est.id;
    option.text = est.nombre.toUpperCase();
    selectEstado.appendChild(option);
  });
}

async function cargarMunicipios(estadoId) {
  const selectMun = document.getElementById("select-municipio");
  if (!selectMun) return;

  const { data, error } = await window.clientSupa
    .from("municipios")
    .select("nombre")
    .eq("estado_id", estadoId)
    .order("nombre", { ascending: true });

  if (error) return;

  selectMun.innerHTML = '<option value="">SELECCIONE EL MUNICIPIO...</option>';
  selectMun.disabled = false;
  data.forEach((mun) => {
    const option = document.createElement("option");
    option.value = mun.nombre;
    option.text = mun.nombre.toUpperCase();
    selectMun.appendChild(option);
  });
}

// --- 3. FUNCIONES DE GUARDADO (UPSERT) ---

async function guardarGenerales() {
  const payload = {
    id: PROVEEDOR_ID,
    rfc: USER_DATA.rfc, //
    correo: USER_DATA.correo,
    tipo_persona: USER_DATA.tipo_persona,
    num_acta: document.getElementById("num_acta").value,
    poder_notarial: document.getElementById("poder_notarial").value,
    nombre_comercial: document.getElementById("nombre_comercial").value,
    rep_nombre: document.getElementById("rep_nombre").value,
    rep_paterno: document.getElementById("rep_paterno").value,
    rep_materno: document.getElementById("rep_materno").value,
    tipo_identificacion: document.getElementById("select_tipo_doc").value,
    num_identificacion: document.getElementById("num_identificacion").value,
    updated_at: new Date(),
  };
  const { error } = await window.clientSupa.from("proveedores").upsert(payload);
  if (error) alert("Error: " + error.message);
  else alert("✅ Datos Generales guardados.");
}

async function guardarDomicilio() {
  const payload = {
    id: PROVEEDOR_ID,
    rfc: USER_DATA.rfc,
    correo: USER_DATA.correo,
    tipo_persona: USER_DATA.tipo_persona,
    estado: document.getElementById("select-estado").value,
    municipio: document.getElementById("select-municipio").value,
    localidad: document.getElementById("localidad").value,
    vialidad: document.getElementById("vialidad").value,
    num_ext: document.getElementById("num_ext").value,
    num_int: document.getElementById("num_int").value,
    colonia: document.getElementById("colonia").value,
    cp: document.getElementById("cp").value,
    updated_at: new Date(),
  };
  const { error } = await window.clientSupa.from("proveedores").upsert(payload);
  if (error) alert("Error: " + error.message);
  else alert("✅ Domicilio guardado con éxito.");
}

async function guardarAdicionales() {
  const payload = {
    id: PROVEEDOR_ID,
    rfc: USER_DATA.rfc,
    correo: USER_DATA.correo,
    tipo_persona: USER_DATA.tipo_persona,
    telefono: document.getElementById("input-telefono").value,
    capacidad_crediticia: document.getElementById("select-capacidad").value,
    num_empleados: document.getElementById("select-empleados").value,
    anio_inicio: document.getElementById("select-anio").value,
    updated_at: new Date(),
  };
  const { error } = await window.clientSupa.from("proveedores").upsert(payload);
  if (error) alert("Error: " + error.message);
  else alert("✅ Datos Adicionales guardados.");
}

// --- 4. CARGA DE DOCUMENTOS (STORAGE) ---

async function SolicitudRevisionn() {
  if (!PROVEEDOR_ID) return alert("Sesión no válida.");

  const archivos = [
    { id: "csf", label: "Constancia de Situación Fiscal" },
    { id: "acta", label: "Acta de Nacimiento" },
    { id: "domicilio", label: "Comprobante de Domicilio" },
    { id: "ine", label: "Identificación" },
  ];

  // Mostrar un indicador de carga (opcional)
  const btn = document.getElementById("BtnRevision");
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo archivos...';

  try {
    for (const arc of archivos) {
      const fileInput = document.getElementById(`file-${arc.id}`);
      const file = fileInput.files[0];

      if (file) {
        // Ruta: carpeta_proveedor_id/nombre_archivo.pdf
        const filePath = `${PROVEEDOR_ID}/${arc.id}.pdf`;

        const { error: uploadError } = await window.clientSupa.storage
          .from("expedientes")
          .upload(filePath, file, {
            upsert: true, // Si ya existe, lo reemplaza
            contentType: "application/pdf",
          });

        if (uploadError) {
          console.error(`Error subiendo ${arc.label}:`, uploadError.message);
          throw new Error(`No se pudo subir ${arc.label}`);
        }
      } else {
        // Validación: Si son obligatorios, lanzamos alerta
        throw new Error(`El archivo ${arc.label} es obligatorio.`);
      }
    }

    // Una vez subidos todos, actualizamos el estatus en la tabla 'proveedores'
    const { error: updateError } = await window.clientSupa
      .from("proveedores")
      .update({
        estatus: "EN REVISIÓN",
        fecha_solicitud: new Date(),
      })
      .eq("id", PROVEEDOR_ID);

    if (updateError) throw updateError;

    alert(
      "🚀 ¡Expediente enviado con éxito! Los documentos están en proceso de revisión.",
    );
    location.reload(); // Recargar para mostrar estatus actualizado
  } catch (error) {
    alert(error.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML =
      '<i class="fas fa-edit fa-lg mr-2"></i> Enviar Solicitud a Revisión';
  }
}
if (input.files[0].size > 2 * 1024 * 1024) {
  // Límite de 2MB
  alert("El archivo es demasiado pesado. El máximo es 2MB.");
  input.value = ""; // Limpiar input
  return;
}

// --- 5. EVENTOS ---

function configurarEscuchadores() {
  const selectEstado = document.getElementById("select-estado");
  if (selectEstado) {
    selectEstado.addEventListener("change", async (e) => {
      const idEstado = e.target.value;
      if (idEstado) await cargarMunicipios(idEstado);
      else {
        document.getElementById("select-municipio").innerHTML =
          '<option value="">SELECCIONE EL MUNICIPIO...</option>';
        document.getElementById("select-municipio").disabled = true;
      }
    });
  }
}
