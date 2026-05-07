/**
 * LÓGICA DE REGISTRO DE PROVEEDORES
 * Incluye: Datos Generales, Domicilio, Adicionales (Años), y Carga de Documentos con Folio.
 */

let PROVEEDOR_ID = null;
let USER_DATA = {};

document.addEventListener("DOMContentLoaded", async () => {
  // --- MEJORA DE NAVEGACIÓN FORZADA ---
  const urlParams = new URLSearchParams(window.location.search);
  const seccionInicial = urlParams.get("sec") || "seccion-bienvenida";

  if (typeof window.gestionarVisibilidadSeccion === "function") {
    window.gestionarVisibilidadSeccion(seccionInicial, false);
  }

  // --- DELEGACIÓN DE EVENTOS PARA LOS CANDADOS ---
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("candado-editar")) {
      const inputAsociado = event.target.previousElementSibling;

      if (inputAsociado && inputAsociado.disabled) {
        inputAsociado.disabled = false;
        inputAsociado.focus();
        event.target.className =
          "fas fa-lock-open candado-editar ml-2 text-success";
        event.target.title = "Campo editable";
      } else if (inputAsociado) {
        inputAsociado.disabled = true;
        event.target.className = "fas fa-lock candado-editar ml-2 text-danger";
        event.target.title = "Clic para editar";
      }
    }
  });

  setTimeout(async () => {
    if (!window.clientSupa) return;

    const {
      data: { session },
    } = await window.clientSupa.auth.getSession();

    if (session) {
      PROVEEDOR_ID = session.user.id;
      console.log("🟢 Sesión confirmada:", PROVEEDOR_ID);

      await cargarEstados();
      await cargarAnios();
      configurarEscuchadores();
      await inicializarPagina();
    }
  }, 400);
});

// --- 1. INICIALIZACIÓN DE DATOS ---

async function inicializarPagina() {
  console.log("🚀 Iniciando carga de datos...");
  try {
    // 1. Obtener datos de identidad de la tabla usuarios
    const { data: usuario, error: errorUsuario } = await window.clientSupa
      .from("usuarios")
      .select("rfc, correo, tipo_persona")
      .eq("id", PROVEEDOR_ID)
      .single();

    if (errorUsuario) throw errorUsuario;

    if (usuario) {
      USER_DATA = usuario;
      console.log("👤 Datos de usuario obtenidos:", USER_DATA.tipo_persona);

      document.getElementById("info-rfc").innerText = usuario.rfc || "---";
      document.getElementById("info-correo").innerText =
        usuario.correo || "---";
      document.getElementById("info-tipo-persona").innerText =
        usuario.tipo_persona || "---";

      // EJECUCIÓN INMEDIATA: Cambiamos la interfaz en cuanto sabemos el tipo de persona
      actualizarInterfazDocumentos();
    }

    // 2. Obtener expediente de la tabla proveedores
    let { data: prov, error: errorProv } = await window.clientSupa
      .from("proveedores")
      .select("*")
      .eq("id", PROVEEDOR_ID)
      .maybeSingle();

    if (prov) {
      console.log("📄 Expediente encontrado, rellenando campos...");

      // Lógica del Folio
      const elFolio = document.getElementById("folio-expediente");
      if (elFolio) {
        if (prov.folio) {
          elFolio.innerText = prov.folio;
          elFolio.classList.replace("text-danger", "text-success");
        } else {
          elFolio.innerText = "PENDIENTE DE ENVÍO";
        }
      }

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

      if (prov.tipo_identificacion) {
        const selDoc = document.getElementById("select_tipo_doc");
        if (selDoc) selDoc.value = prov.tipo_identificacion;
      }

      // Segunda llamada para asegurar que el nombre de la identificación sea el correcto
      actualizarInterfazDocumentos();

      // Cargar ubicación
      if (prov.estado) {
        document.getElementById("select-estado").value = prov.estado;
        await cargarMunicipios(prov.estado);
        if (prov.municipio) {
          document.getElementById("select-municipio").value = prov.municipio;
        }
      }

      if (prov.anio_inicio)
        document.getElementById("select-anio").value = prov.anio_inicio;
      if (prov.capacidad_crediticia)
        document.getElementById("select-capacidad").value =
          prov.capacidad_crediticia;
      if (prov.num_empleados)
        document.getElementById("select-empleados").value = prov.num_empleados;
    }

    console.log("✅ Inicialización completada con éxito.");
  } catch (e) {
    console.error("❌ Error crítico en inicializarPagina:", e.message);
  }
}

// --- 2. CONTROL DINÁMICO DE INTERFAZ DE DOCUMENTOS ---

// --- 2. CONTROL DINÁMICO DE INTERFAZ DE DOCUMENTOS ---

function actualizarInterfazDocumentos() {
  const tipoPersona = USER_DATA.tipo_persona;
  console.log("🔄 Actualizando interfaz para:", tipoPersona);

  // 1. Obtener el nombre del documento de identificación
  const selectDoc = document.getElementById("select_tipo_doc");
  const nombreDoc =
    selectDoc && selectDoc.value !== ""
      ? selectDoc.options[selectDoc.selectedIndex].text
      : "Identificación Oficial";

  // 2. Referencias de la sección DATOS GENERALES (Mapeado a tu HTML real)
  const labelActaGen = document.getElementById("label-acta");
  const seccionPoderGen = document.getElementById("contenedor-poder-notarial");
  const labelNumIdentificacion = document.getElementById(
    "label-identificacion",
  );

  // 3. Referencias de la sección FINALIZAR CAPTURA (Mapeado a tu HTML real)
  const labelActaFin = document.getElementById("label-acta-texto");
  const seccionPoderFin = document.getElementById("seccion-poder-notarial");
  const labelIneFin = document.getElementById("label-identificacion-texto");

  // --- LÓGICA PARA PERSONA MORAL ---
  if (tipoPersona === "MORAL") {
    // Cambiar textos a "Acta Constitutiva" respetando el asterisco rojo de obligatorio
    if (labelActaGen)
      labelActaGen.innerHTML =
        '<span class="text-danger">*</span> Acta Constitutiva:';
    if (labelActaFin) labelActaFin.innerText = "Adjuntar Acta Constitutiva:";

    // Mostrar campos de Poder Notarial
    if (seccionPoderGen) seccionPoderGen.style.display = "flex";
    if (seccionPoderFin) seccionPoderFin.style.display = "flex";
  }
  // --- LÓGICA PARA PERSONA FÍSICA ---
  else {
    // Cambiar textos a "Acta de Nacimiento" respetando el asterisco rojo
    if (labelActaGen)
      labelActaGen.innerHTML =
        '<span class="text-danger">*</span> Acta de Nacimiento:';
    if (labelActaFin) labelActaFin.innerText = "Adjuntar Acta de Nacimiento:";

    // Ocultar campos de Poder Notarial
    if (seccionPoderGen) seccionPoderGen.style.display = "none";
    if (seccionPoderFin) seccionPoderFin.style.display = "none";
  }

  // --- LÓGICA PARA NOMBRES DE IDENTIFICACIÓN ---
  // Actualiza "Número de Documento" en la pestaña 1
  if (labelNumIdentificacion) {
    labelNumIdentificacion.innerText = `Número de ${nombreDoc}:`;
  }
  // Actualiza "Adjuntar Identificación Oficial" en la pestaña final
  if (labelIneFin) {
    labelIneFin.innerText = `Adjuntar ${nombreDoc}:`;
  }
}

// --- 3. CARGA DE CATÁLOGOS ---

async function cargarAnios() {
  const selectAnio = document.getElementById("select-anio");
  if (!selectAnio) return;
  const { data, error } = await window.clientSupa
    .from("años")
    .select("año")
    .order("año", { ascending: false });
  if (error) return;
  selectAnio.innerHTML = '<option value="">Seleccione el Año...</option>';
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
  selectEstado.innerHTML = '<option value="">Seleccione el Estado...</option>';
  data.forEach((est) => {
    const option = document.createElement("option");
    option.value = est.id;
    option.text = est.nombre;
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
  selectMun.innerHTML = '<option value="">Seleccione el Municipio...</option>';
  selectMun.disabled = false;
  data.forEach((mun) => {
    const option = document.createElement("option");
    option.value = mun.nombre;
    option.text = mun.nombre;
    selectMun.appendChild(option);
  });
}

// --- 4. FUNCIONES DE GUARDADO ---

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

  if (error) {
    alert("Error: " + error.message);
  } else {
    alert("✅ Datos Generales guardados.");
    // Al guardar, refrescamos la interfaz de documentos por si cambió el select
    actualizarInterfazDocumentos();
    bloquearSeccionYPestaña(
      [
        "num_acta",
        "poder_notarial",
        "nombre_comercial",
        "rep_nombre",
        "rep_paterno",
        "rep_materno",
        "select_tipo_doc",
        "num_identificacion",
      ],
      "#Generales",
    );
  }
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

  if (error) {
    alert("Error: " + error.message);
  } else {
    alert("✅ Domicilio guardado con éxito.");
    bloquearSeccionYPestaña(
      [
        "select-estado",
        "select-municipio",
        "localidad",
        "vialidad",
        "num_ext",
        "num_int",
        "colonia",
        "cp",
      ],
      "#Domicilio",
    );
  }
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

  if (error) {
    alert("Error: " + error.message);
  } else {
    alert("✅ Datos Adicionales guardados.");
    bloquearSeccionYPestaña(
      ["input-telefono", "select-capacidad", "select-empleados", "select-anio"],
      "#Adicionales",
    );
  }
}

// --- 5. EVENTOS ---

function configurarEscuchadores() {
  const selectEstado = document.getElementById("select-estado");
  if (selectEstado) {
    selectEstado.addEventListener("change", async (e) => {
      const idEstado = e.target.value;
      if (idEstado) await cargarMunicipios(idEstado);
      else {
        const selMun = document.getElementById("select-municipio");
        if (selMun) {
          selMun.innerHTML =
            '<option value="">Seleccione el Municipio...</option>';
          selMun.disabled = true;
        }
      }
    });
  }

  // Escuchar cambios en el select de tipo de documento para actualizar la pestaña Finalizar en tiempo real
  const selectDoc = document.getElementById("select_tipo_doc");
  if (selectDoc) {
    selectDoc.addEventListener("change", actualizarInterfazDocumentos);
  }
}

// --- 6. UTILIDADES DE INTERFAZ ---

function bloquearSeccionYPestaña(camposIds, idTab) {
  const iconoPestaña =
    document.querySelector(`a[href="${idTab}"] i.fa-circle`) ||
    document.querySelector(`a[href="${idTab}"] i.fa-check-circle`);

  if (iconoPestaña) {
    iconoPestaña.className = "fas fa-check-circle mr-1 text-success";
  }

  camposIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.disabled = true;
      if (
        !el.nextElementSibling ||
        !el.nextElementSibling.classList.contains("candado-editar")
      ) {
        const candado = document.createElement("i");
        candado.className = "fas fa-lock candado-editar ml-2 text-danger";
        candado.style.cursor = "pointer";
        candado.title = "Clic para editar";

        if (el.parentElement) {
          el.parentElement.style.display = "flex";
          el.parentElement.style.alignItems = "center";
          el.parentElement.appendChild(candado);
        }
      }
    }
  });
}
