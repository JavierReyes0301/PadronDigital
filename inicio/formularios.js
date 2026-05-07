/**
 * LÓGICA DE REGISTRO DE PROVEEDORES
 * Incluye: Datos Generales, Domicilio, Adicionales (Años), y Carga de Documentos con Folio.
 */

let PROVEEDOR_ID = null;
let USER_DATA = {};

document.addEventListener("DOMContentLoaded", async () => {
  // --- 1. CONFIGURACIÓN DE NAVEGACIÓN Y UI ---
  const urlParams = new URLSearchParams(window.location.search);
  const seccionInicial = urlParams.get("sec") || "seccion-bienvenida";

  if (typeof window.gestionarVisibilidadSeccion === "function") {
    window.gestionarVisibilidadSeccion(seccionInicial, false);
  }

  // --- 2. DELEGACIÓN DE EVENTOS (CANDADOS DE EDICIÓN) ---
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

  // --- 3. VERIFICACIÓN DE SESIÓN E INICIO ---
  setTimeout(async () => {
    if (!window.clientSupa) {
      console.error("❌ Supabase client no encontrado.");
      return;
    }

    const {
      data: { session },
    } = await window.clientSupa.auth.getSession();

    if (session) {
      PROVEEDOR_ID = session.user.id;
      console.log("🟢 Sesión confirmada:", PROVEEDOR_ID);

      // Cargar catálogos primero
      await Promise.all([cargarEstados(), cargarAnios()]);

      // Configurar listeners de cambios
      configurarEscuchadores();

      // Cargar datos del usuario y expediente
      await inicializarPagina();
    } else {
      console.warn("⚠️ No hay sesión activa.");
    }
  }, 400);
});

// --- 1. INICIALIZACIÓN DE DATOS ---

async function inicializarPagina() {
  console.log("🚀 Iniciando carga de datos...");
  try {
    // A. Datos de la tabla 'usuarios' (Identidad)
    const { data: usuario, error: errorUsuario } = await window.clientSupa
      .from("usuarios")
      .select("rfc, correo, tipo_persona")
      .eq("id", PROVEEDOR_ID)
      .single();

    if (errorUsuario) throw errorUsuario;

    // DENTRO DE inicializarPagina
    if (usuario) {
      USER_DATA = usuario;
      // Forzamos mayúsculas para evitar errores de comparación
      USER_DATA.tipo_persona = usuario.tipo_persona
        ? usuario.tipo_persona.toUpperCase().trim()
        : "";

      document.getElementById("info-rfc").innerText = usuario.rfc || "---";
      document.getElementById("info-correo").innerText =
        usuario.correo || "---";
      document.getElementById("info-tipo-persona").innerText =
        USER_DATA.tipo_persona || "---";

      // ESTA LÍNEA ES VITAL: Ejecutar después de asignar USER_DATA
      actualizarInterfazDocumentos();
    }

    // B. Datos de la tabla 'proveedores' (Expediente)
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

      // Rellenar inputs de texto (Mapeo masivo)
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
        if (el) {
          const valorBase = id === "input-telefono" ? prov.telefono : prov[id];
          el.value = valorBase || "";
        }
      });

      // Sincronizar select de identificación
      if (prov.tipo_identificacion) {
        const selDoc = document.getElementById("select_tipo_doc");
        if (selDoc) {
          selDoc.value = prov.tipo_identificacion;
          // Refrescar nombres de etiquetas
          actualizarInterfazDocumentos();
        }
      }

      // Cargar ubicación (Estado y Municipio)
      if (prov.estado) {
        document.getElementById("select-estado").value = prov.estado;
        await cargarMunicipios(prov.estado);
        if (prov.municipio) {
          document.getElementById("select-municipio").value = prov.municipio;
        }
      }

      // Otros selectores
      if (prov.anio_inicio)
        document.getElementById("select-anio").value = prov.anio_inicio;
      if (prov.capacidad_crediticia)
        document.getElementById("select-capacidad").value =
          prov.capacidad_crediticia;
      if (prov.num_empleados)
        document.getElementById("select-empleados").value = prov.num_empleados;
    }

    console.log("✅ Inicialización completada.");
  } catch (e) {
    console.error("❌ Error en inicializarPagina:", e.message);
  }
}

// --- 2. CONTROL DINÁMICO DE INTERFAZ ---

function actualizarInterfazDocumentos() {
  // Verificamos qué trae la variable
  const tipo = USER_DATA.tipo_persona;
  console.log("Actualizando interfaz para tipo:", tipo);

  const esMoral = tipo === "MORAL";

  // 1. Manejo de Actas (Generales y Finalizar)
  const labelActaGen = document.getElementById("label-acta");
  const labelActaFin = document.getElementById("label-acta-texto");

  if (labelActaGen) {
    labelActaGen.innerHTML = esMoral
      ? '<span class="text-danger">*</span> Acta Constitutiva:'
      : '<span class="text-danger">*</span> Acta de Nacimiento:';
  }
  if (labelActaFin) {
    labelActaFin.innerText = esMoral
      ? "Adjuntar Acta Constitutiva:"
      : "Adjuntar Acta de Nacimiento:";
  }

  // 2. Manejo de Poder Notarial (Contenedores)
  const contPoderGen = document.getElementById("contenedor-poder-notarial");
  const contPoderFin = document.getElementById("seccion-poder-notarial");

  if (contPoderGen) {
    contPoderGen.style.setProperty(
      "display",
      esMoral ? "flex" : "none",
      "important",
    );
  }
  if (contPoderFin) {
    contPoderFin.style.setProperty(
      "display",
      esMoral ? "flex" : "none",
      "important",
    );
  }

  // 3. Texto de Identificación
  const selectDoc = document.getElementById("select_tipo_doc");
  if (selectDoc && selectDoc.selectedIndex !== -1) {
    const texto = selectDoc.options[selectDoc.selectedIndex].text;
    const lIdentGen = document.getElementById("label-identificacion");
    const lIdentFin = document.getElementById("label-identificacion-texto");

    if (lIdentGen) lIdentGen.innerText = `Número de ${texto}:`;
    if (lIdentFin) lIdentFin.innerText = `Adjuntar ${texto}:`;
  }
}

// --- 3. CATÁLOGOS ---

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
    let opt = new Option(item.año, item.año);
    selectAnio.add(opt);
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
    let opt = new Option(est.nombre, est.id);
    selectEstado.add(opt);
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
    let opt = new Option(mun.nombre, mun.nombre);
    selectMun.add(opt);
  });
}

// --- 4. FUNCIONES DE PERSISTENCIA (GUARDADO) ---

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
  // Cambio de estado -> Cargar municipios
  const selectEstado = document.getElementById("select-estado");
  if (selectEstado) {
    selectEstado.addEventListener("change", async (e) => {
      const idEstado = e.target.value;
      if (idEstado) {
        await cargarMunicipios(idEstado);
      } else {
        const selMun = document.getElementById("select-municipio");
        if (selMun) {
          selMun.innerHTML =
            '<option value="">Seleccione el Municipio...</option>';
          selMun.disabled = true;
        }
      }
    });
  }

  // Cambio de tipo de identificación -> Refrescar etiquetas
  const selectDoc = document.getElementById("select_tipo_doc");
  if (selectDoc) {
    selectDoc.addEventListener("change", actualizarInterfazDocumentos);
  }
}

// --- 6. UTILIDADES DE INTERFAZ ---

function bloquearSeccionYPestaña(camposIds, idTab) {
  // 1. Marcar pestaña como completada (Icono)
  const iconoPestaña =
    document.querySelector(`a[href="${idTab}"] i.fa-circle`) ||
    document.querySelector(`a[href="${idTab}"] i.fa-check-circle`);

  if (iconoPestaña) {
    iconoPestaña.className = "fas fa-check-circle mr-1 text-success";
  }

  // 2. Deshabilitar campos y agregar candado
  camposIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.disabled = true;
      // Evitar duplicar candados
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
