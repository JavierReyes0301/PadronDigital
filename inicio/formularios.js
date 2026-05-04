/**
 * LÓGICA DE REGISTRO DE PROVEEDORES
 * Sistema: Padrón de Proveedores
 * Versión Final Unificada: Selectores Dinámicos + Storage + Guardado por Secciones
 */

let PROVEEDOR_ID = null;

document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 Iniciando sistema de formularios...");

  // 1. Pequeño retraso de seguridad para asegurar que Supabase (clientSupa) esté inicializado
  setTimeout(async () => {
    if (!window.clientSupa) {
      console.error(
        "❌ Error: No se detectó la instancia de Supabase en 'window.clientSupa'.",
      );
      return;
    }

    const {
      data: { session },
      error: sessionError,
    } = await window.clientSupa.auth.getSession();

    if (sessionError || !session) {
      console.error("🔴 Sin sesión activa.");
      const infoRfc = document.getElementById("info-rfc");
      if (infoRfc) infoRfc.innerText = "Error: Sin Sesión";
      return;
    }

    PROVEEDOR_ID = session.user.id;
    console.log("🟢 Sesión confirmada:", PROVEEDOR_ID);

    // ORDEN DE EJECUCIÓN CRÍTICO:
    // 1. Cargar el catálogo de estados (necesario para el paso 3)
    await cargarEstados();
    // 2. Activar los eventos (el listener del cambio de estado)
    configurarEscuchadores();
    // 3. Rellenar la página con los datos de la DB
    await inicializarPagina();
  }, 400);
});

// --- 1. SINCRONIZACIÓN Y CARGA DE DATOS ---

async function inicializarPagina() {
  console.log("🔄 Sincronizando expediente del proveedor...");
  try {
    // A. Obtener datos base del usuario (usuarios)
    const { data: usuario, error: errU } = await window.clientSupa
      .from("usuarios")
      .select("rfc, tipo_persona, correo")
      .eq("id", PROVEEDOR_ID)
      .single();

    if (errU || !usuario) return console.error("❌ No existe usuario base.");

    document.getElementById("info-rfc").innerText = usuario.rfc || "---";
    document.getElementById("info-correo").innerText = usuario.correo || "---";
    document.getElementById("info-tipo-persona").innerText =
      usuario.tipo_persona || "---";

    if (typeof gestionarCamposTipoPersona === "function") {
      gestionarCamposTipoPersona(usuario.tipo_persona);
    }

    // B. Buscar o crear registro en tabla 'proveedores'
    let { data: prov } = await window.clientSupa
      .from("proveedores")
      .select("*")
      .eq("id", PROVEEDOR_ID)
      .maybeSingle();

    if (!prov) {
      const { data: nuevoProv } = await window.clientSupa
        .from("proveedores")
        .insert([
          {
            id: PROVEEDOR_ID,
            rfc: usuario.rfc,
            correo: usuario.correo,
            tipo_persona: usuario.tipo_persona,
          },
        ])
        .select()
        .single();
      prov = nuevoProv;
    }

    // C. Rellenar formulario con datos guardados
    if (prov) {
      // Folio
      const folioSpan = document.getElementById("folio-expediente");
      if (folioSpan && prov.folio) {
        folioSpan.innerText = `EXP-${prov.folio}`;
        folioSpan.className = "badge badge-success p-2";
      }

      // Mapeo masivo de inputs (Generales, Domicilio y Adicionales)
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

      // Rehidratar Selectores de Domicilio (PASO CLAVE)
      if (prov.estado) {
        const selectEstado = document.getElementById("select-estado");
        selectEstado.value = prov.estado;

        // Forzamos la carga de municipios del estado guardado
        await cargarMunicipios(prov.estado);

        if (prov.municipio) {
          const selectMun = document.getElementById("select-municipio");
          selectMun.value = prov.municipio;
        }
      }
    }
  } catch (e) {
    console.error("❌ Error en inicialización:", e.message);
  }
}

// --- 2. GESTIÓN DE CATÁLOGOS DINÁMICOS ---

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

// --- 3. FUNCIONES DE GUARDADO (ACCIONADAS POR TUS BOTONES) ---

async function guardarGenerales() {
  const payload = {
    id: PROVEEDOR_ID,
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

async function guardarAdcionales() {
  const payload = {
    id: PROVEEDOR_ID,
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

// --- 4. STORAGE Y REVISIÓN ---

async function SolicitudRevisionn() {
  const archivos = [
    { name: "csf", el: document.getElementById("file-csf") },
    { name: "acta", el: document.getElementById("file-acta") },
    { name: "domicilio", el: document.getElementById("file-domicilio") },
    { name: "ine", el: document.getElementById("file-ine") },
  ];
  for (const arc of archivos) {
    if (arc.el && arc.el.files[0]) {
      const file = arc.el.files[0];
      const path = `${PROVEEDOR_ID}/${arc.name}.pdf`;
      await window.clientSupa.storage
        .from("expedientes")
        .upload(path, file, { upsert: true });
    }
  }
  await window.clientSupa
    .from("proveedores")
    .update({ estatus: "EN REVISIÓN" })
    .eq("id", PROVEEDOR_ID);
  alert("🚀 Expediente enviado a revisión.");
}

// --- 5. ESCUCHADORES DE EVENTOS ---

function configurarEscuchadores() {
  const selectEstado = document.getElementById("select-estado");
  if (selectEstado) {
    selectEstado.addEventListener("change", async (e) => {
      const idEstado = e.target.value;
      const selectMun = document.getElementById("select-municipio");
      if (idEstado) {
        await cargarMunicipios(idEstado);
      } else {
        selectMun.innerHTML =
          '<option value="">SELECCIONE EL MUNICIPIO...</option>';
        selectMun.disabled = true;
      }
    });
  }

  const selectDoc = document.getElementById("select_tipo_doc");
  if (selectDoc) {
    selectDoc.addEventListener("change", () => {
      if (typeof ajustarLabelIdentificacion === "function")
        ajustarLabelIdentificacion();
    });
  }
}
