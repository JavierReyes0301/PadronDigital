/**
 * LÓGICA DE REGISTRO DE PROVEEDORES
 * Basada estrictamente en los IDs de tu HTML
 */
let PROVEEDOR_ID = null;

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Forzar espera de la sesión
    const { data: { session }, error: authError } = await window.clientSupa.auth.getSession();
    
    if (session) {
        PROVEEDOR_ID = session.user.id;
        console.log("🟢 Sesión activa:", PROVEEDOR_ID);
        
        // Ejecutar carga completa
        await inicializarPagina();
    } else {
        console.error("🔴 No hay sesión activa. Los datos no se cargarán.");
        document.getElementById("info-rfc").innerText = "Error: Sin Sesión";
    }
    
    configurarEscuchadores();
});

async function inicializarPagina() {
    console.log("🔄 Sincronizando datos del usuario...");

    try {
        // 1. CARGAMOS PRIMERO DE 'usuarios' (La tabla de tu registro inicial)
        const { data: usuario, error: errU } = await window.clientSupa
            .from("usuarios")
            .select("rfc, tipo_persona, correo")
            .eq("id", PROVEEDOR_ID)
            .single();

        if (usuario) {
            // Inyectamos los datos en los SPAN del HTML (Imagen 1)
            const rfcSpan = document.getElementById("info-rfc");
            const correoSpan = document.getElementById("info-correo");
            const tipoSpan = document.getElementById("info-tipo-persona");

            if (rfcSpan) rfcSpan.innerText = usuario.rfc || "No disponible";
            if (correoSpan) correoSpan.innerText = usuario.correo || "No disponible";
            if (tipoSpan) tipoSpan.innerText = usuario.tipo_persona || "No disponible";
            
            gestionarCamposTipoPersona(usuario.tipo_persona);
        }

        // 2. CARGAMOS DE 'proveedores' (Los datos que el usuario ya guardó antes)
        const { data: prov, error: errP } = await window.clientSupa
            .from("proveedores")
            .select("*")
            .eq("id", PROVEEDOR_ID)
            .single();

        if (prov) {
            // Rellenamos el folio y los inputs del formulario
            const folioSpan = document.getElementById("folio-expediente");
            if (folioSpan && prov.folio) folioSpan.innerText = `EXP-${prov.folio}`;

            // Rellenar inputs (IDs exactos de tu HTML)
            const campos = ['num_acta', 'poder_notarial', 'nombre_comercial', 'rep_nombre', 'rep_paterno', 'rep_materno', 'num_identificacion'];
            campos.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = prov[id] || "";
            });

            // Ajustamos selects
            if (document.getElementById("tipo_representante")) document.getElementById("tipo_representante").value = prov.tipo_representante || "Representante Legal";
            if (document.getElementById("select_tipo_doc")) {
                document.getElementById("select_tipo_doc").value = prov.tipo_identificacion || "ID";
                ajustarLabelIdentificacion(); // Para cambiar "Clave de Elector" a "Pasaporte", etc.
            }
        }
    } catch (e) {
        console.error("Error en la carga inicial:", e);
    }
}

// --- FUNCIONES AUXILIARES ---

function gestionarCamposTipoPersona(tipo) {
    const contenedorPoder = document.getElementById("contenedor-poder-notarial");
    const labelActa = document.getElementById("label-acta");
    
    // Normalizamos el tipo de persona para evitar errores de mayúsculas/minúsculas
    const tipoNormalizado = tipo ? tipo.toUpperCase() : "";

    if (tipoNormalizado.includes("MORAL")) {
        if (contenedorPoder) contenedorPoder.style.display = "flex";
        if (labelActa) labelActa.innerHTML = '<span class="text-danger">*</span> Acta Constitutiva:';
    } else {
        if (contenedorPoder) contenedorPoder.style.display = "none";
        if (labelActa) labelActa.innerHTML = '<span class="text-danger">*</span> Acta de Nacimiento:';
    }
}

function ajustarLabelIdentificacion() {
    const tipo = document.getElementById("select_tipo_doc").value;
    const label = document.getElementById("label-identificacion");
    const etiquetas = { 
        ID: "Clave de Elector:", 
        PASAPORTE: "Número de Pasaporte:", 
        CEDULA: "Cédula Profesional:" 
    };
    if (label) label.innerText = etiquetas[tipo] || "Dato de Identificación:";
}

async function guardarGenerales() {
    // Validamos campo obligatorio antes de guardar
    const numActa = document.getElementById("num_acta").value.trim();
    if (!numActa) {
        alert("⚠️ El número de acta es obligatorio.");
        return;
    }

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
        updated_at: new Date()
    };

    const { error } = await window.clientSupa.from("proveedores").upsert(payload);
    
    if (error) alert("Error al guardar: " + error.message);
    else alert("✅ Datos guardados con éxito.");
}

function configurarEscuchadores() {
    // Aquí puedes agregar más lógica de UI si es necesario
}

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
