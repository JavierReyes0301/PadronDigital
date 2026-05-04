/**
 * LÓGICA DE REGISTRO DE PROVEEDORES
 * Optimizado para Supabase y manejo de UI
 */
let PROVEEDOR_ID = null;

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Validar sesión
  const {
    data: { session },
    error: authError,
  } = await window.clientSupa.auth.getSession();

  if (session) {
    PROVEEDOR_ID = session.user.id;
    console.log("🟢 Sesión activa:", PROVEEDOR_ID);
    await inicializarPagina();
  } else {
    console.error("🔴 Sin sesión activa.");
    const rfcSpan = document.getElementById("info-rfc");
    if (rfcSpan) rfcSpan.innerText = "Error: Sin Sesión";
  }
  configurarEscuchadores();
});

async function inicializarPagina() {
  console.log("🔄 Sincronizando datos...");
  try {
    // 1. OBTENER DATOS DE LA TABLA 'USUARIOS'
    const { data: usuario, error: errU } = await window.clientSupa
      .from("usuarios")
      .select("rfc, tipo_persona, correo")
      .eq("id", PROVEEDOR_ID)
      .single();

    if (usuario) {
      document.getElementById("info-rfc").innerText = usuario.rfc || "---";
      document.getElementById("info-correo").innerText =
        usuario.correo || "---";
      document.getElementById("info-tipo-persona").innerText =
        usuario.tipo_persona || "---";
      gestionarCamposTipoPersona(usuario.tipo_persona);
    } else {
      console.warn("⚠️ No se encontraron datos en la tabla usuarios.");
      return; // Si no hay usuario base, no podemos continuar
    }

    // 2. INTENTAR OBTENER DATOS DE 'PROVEEDORES'
    let { data: prov, error: errP } = await window.clientSupa
      .from("proveedores")
      .select("*")
      .eq("id", PROVEEDOR_ID)
      .maybeSingle(); // maybeSingle no lanza error si no encuentra nada

    // 🚀 SI NO EXISTE EN PROVEEDORES, LO CREAMOS EN ESTE MOMENTO
    if (!prov) {
      console.log("🆕 Creando registro automático en proveedores...");

      const { data: nuevoProv, error: errCrear } = await window.clientSupa
        .from("proveedores")
        .insert([
          {
            id: PROVEEDOR_ID,
            rfc: usuario.rfc,
            correo: usuario.correo,
            tipo_persona: usuario.tipo_persona,
            estatus: "BORRADOR",
          },
        ])
        .select()
        .single();

      if (errCrear) {
        console.error("❌ Error al crear proveedor:", errCrear.message);
        alert("Error al generar expediente. Contacte a soporte.");
      } else {
        prov = nuevoProv;
        console.log("✅ Expediente creado con éxito.");
      }
    }

    // 3. RELLENAR LA INTERFAZ CON LOS DATOS DE PROVEEDOR
    if (prov) {
      // Folio
      const folioSpan = document.getElementById("folio-expediente");
      if (folioSpan && prov.folio) {
        folioSpan.innerText = `EXP-${prov.folio}`;
        folioSpan.classList.remove("text-danger");
        folioSpan.style.color = "#28a745"; // Color verde éxito
      }

      // Llenar inputs Generales
      const campos = [
        "num_acta",
        "poder_notarial",
        "nombre_comercial",
        "rep_nombre",
        "rep_paterno",
        "rep_materno",
        "num_identificacion",
      ];
      campos.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = prov[id] || "";
      });

      // Selects
      if (document.getElementById("tipo_representante"))
        document.getElementById("tipo_representante").value =
          prov.tipo_representante || "Representante Legal";

      if (document.getElementById("select_tipo_doc")) {
        document.getElementById("select_tipo_doc").value =
          prov.tipo_identificacion || "ID";
        ajustarLabelIdentificacion();
      }

      // Llenar Domicilio
      if (document.getElementById("vialidad")) {
        document.getElementById("select-estado").value = prov.estado || "";
        document.getElementById("vialidad").value = prov.vialidad || "";
        document.getElementById("num_ext").value = prov.num_ext || "";
        document.getElementById("num_int").value = prov.num_int || "";
        document.getElementById("colonia").value = prov.colonia || "";
        document.getElementById("cp").value = prov.cp || "";

        // Disparar evento para habilitar municipios
        document
          .getElementById("select-estado")
          .dispatchEvent(new Event("change"));
        // Esperar un momento a que el DOM reaccione si es necesario o asignar directo:
        document.getElementById("select-municipio").value =
          prov.municipio || "";
      }

      // Llenar Adicionales
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
    console.error("❌ Error crítico en inicializarPagina:", e);
  }
}

// --- FUNCIONES DE UI ---

function gestionarCamposTipoPersona(tipo) {
  const contenedorPoder = document.getElementById("contenedor-poder-notarial");
  const labelActa = document.getElementById("label-acta");
  const esMoral = tipo?.toUpperCase().includes("MORAL");

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

// --- FUNCIONES DE GUARDADO ---

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
  else alert("✅ Datos Generales guardados.");
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
    updated_at: new Date(),
  };

  const { error } = await window.clientSupa.from("proveedores").upsert(payload);
  if (error) alert("Error: " + error.message);
  else alert("✅ Domicilio guardado.");
}

async function SolicitudRevisionn() {
  const rfc = document.getElementById("info-rfc").innerText;
  if (!rfc || rfc === "---") return alert("Error: RFC no disponible.");

  const archivos = [
    { name: "csf", el: document.getElementById("file-csf") },
    { name: "acta", el: document.getElementById("file-acta") },
    { name: "domicilio", el: document.getElementById("file-domicilio") },
    { name: "ine", el: document.getElementById("file-ine") },
  ];

  for (const arc of archivos) {
    if (arc.el && arc.el.files[0]) {
      const file = arc.el.files[0];
      const path = `${rfc}/${arc.name}.pdf`;
      const { error } = await window.clientSupa.storage
        .from("expedientes")
        .upload(path, file, { upsert: true });
      if (error) console.error(`Error subiendo ${arc.name}:`, error.message);
    }
  }

  await window.clientSupa
    .from("proveedores")
    .update({ estatus: "EN REVISIÓN" })
    .eq("id", PROVEEDOR_ID);
  alert("🚀 Expediente enviado a revisión.");
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
