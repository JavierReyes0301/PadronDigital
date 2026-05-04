/**
 * LÓGICA DE REGISTRO DE PROVEEDORES - VERSIÓN TOTAL
 * Incluye: Selectores, Guardado por secciones (RFC/Correo/TipoPersona) y Storage
 */

let PROVEEDOR_ID = null;
let USER_DATA = {}; // Almacena datos críticos para evitar errores de BD

document.addEventListener("DOMContentLoaded", async () => {
  setTimeout(async () => {
    if (!window.clientSupa) return;

    const {
      data: { session },
    } = await window.clientSupa.auth.getSession();

    if (session) {
      PROVEEDOR_ID = session.user.id;
      console.log("🟢 Sesión confirmada:", PROVEEDOR_ID);

      await cargarEstados();
      configurarEscuchadores();
      await inicializarPagina();
    }
  }, 400);
});

// --- 1. INICIALIZACIÓN ---

async function inicializarPagina() {
  try {
    const { data: usuario } = await window.clientSupa
      .from("usuarios")
      .select("rfc, correo, tipo_persona")
      .eq("id", PROVEEDOR_ID)
      .single();

    if (usuario) {
      USER_DATA = usuario; // Datos obligatorios capturados
      document.getElementById("info-rfc").innerText = usuario.rfc || "---";
      document.getElementById("info-correo").innerText =
        usuario.correo || "---";
      document.getElementById("info-tipo-persona").innerText =
        usuario.tipo_persona || "---";
    }

    let { data: prov } = await window.clientSupa
      .from("proveedores")
      .select("*")
      .eq("id", PROVEEDOR_ID)
      .maybeSingle();

    if (prov) {
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

      if (prov.estado) {
        document.getElementById("select-estado").value = prov.estado;
        await cargarMunicipios(prov.estado);
        if (prov.municipio) {
          document.getElementById("select-municipio").value = prov.municipio;
        }
      }
    }
  } catch (e) {
    console.error("❌ Error en inicialización:", e.message);
  }
}

// --- 2. FUNCIONES DE GUARDADO (DATOS) ---

async function guardarGenerales() {
  const payload = {
    id: PROVEEDOR_ID,
    rfc: USER_DATA.rfc,
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

// --- 3. CARGA DE DOCUMENTOS (STORAGE) ---

async function SolicitudRevisionn() {
  const archivos = [
    { name: "csf", el: document.getElementById("file-csf") },
    { name: "acta", el: document.getElementById("file-acta") },
    { name: "domicilio", el: document.getElementById("file-domicilio") },
    { name: "ine", el: document.getElementById("file-ine") },
  ];

  console.log("📤 Subiendo archivos al servidor...");

  for (const arc of archivos) {
    if (arc.el && arc.el.files[0]) {
      const file = arc.el.files[0];
      const path = `${PROVEEDOR_ID}/${arc.name}.pdf`;

      const { error: uploadError } = await window.clientSupa.storage
        .from("expedientes")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        console.error(`❌ Error subiendo ${arc.name}:`, uploadError.message);
      }
    }
  }

  // Actualizamos estatus para que el administrador lo revise
  await window.clientSupa
    .from("proveedores")
    .update({ estatus: "EN REVISIÓN" })
    .eq("id", PROVEEDOR_ID);

  alert("🚀 Expediente y archivos enviados a revisión.");
}

// --- 4. CATÁLOGOS Y EVENTOS ---

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
