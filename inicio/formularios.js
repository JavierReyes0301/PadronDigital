/**
 * LÓGICA DE REGISTRO DE PROVEEDORES - VERSIÓN INTEGRAL PRO
 * Incluye: Datos Generales, Domicilio, Adicionales, Giros y Modal de Confirmación.
 * Optimizado contra errores de DOM Null y unificado estéticamente.
 */

let PROVEEDOR_ID = null;
let USER_DATA = {};
let lineasSeleccionadas = []; // Variable global para manejar los giros

// Función auxiliar segura para obtener valores del DOM sin romper el script
const obtenerValorInput = (id) => {
  const elemento = document.getElementById(id);
  return elemento ? elemento.value.trim() : "";
};

// Función auxiliar para lanzar alertas institucionales uniformes
function AlertaFormulario(titulo, mensaje, icono = "info") {
  if (window.Swal) {
    return Swal.fire({
      title: titulo.toUpperCase(),
      text: mensaje,
      icon: icono,
      customClass: { popup: "modal-institucional-admin" },
      confirmButtonText: "ACEPTAR",
      confirmButtonColor: "#ab0a3d",
    });
  }
  return alert(`${titulo}: ${mensaje}`);
}

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Navegación Inicial
  const urlParams = new URLSearchParams(window.location.search);
  const seccionInicial = urlParams.get("sec") || "seccion-bienvenida";
  if (typeof window.gestionarVisibilidadSeccion === "function") {
    window.gestionarVisibilidadSeccion(seccionInicial, false);
  }

  // 2. Delegación de Eventos para Candados
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("candado-editar")) {
      const input = e.target.previousElementSibling;
      if (input && input.disabled) {
        input.disabled = false;
        input.focus();
        e.target.className =
          "fas fa-lock-open candado-editar ml-2 text-success";
      } else if (input) {
        input.disabled = true;
        e.target.className = "fas fa-lock candado-editar ml-2 text-danger";
      }
    }
  });

  // 3. Inicio de Sesión y Carga Asíncrona
  setTimeout(async () => {
    if (!window.clientSupa) return;
    const {
      data: { session },
    } = await window.clientSupa.auth.getSession();
    if (session) {
      PROVEEDOR_ID = session.user.id;
      // Cargar catálogos concurrentes para ahorrar tiempo
      await Promise.all([cargarEstados(), cargarAnios()]);
      configurarEscuchadores();
      await inicializarPagina();
    }
  }, 400);
});

// --- 1. CARGA INICIAL DE DATOS ---

async function inicializarPagina() {
  try {
    // A. Obtener Identidad (Usuarios)
    const { data: usuario } = await window.clientSupa
      .from("usuarios")
      .select("rfc, correo, tipo_persona")
      .eq("id", PROVEEDOR_ID)
      .single();

    if (usuario) {
      USER_DATA = usuario;
      USER_DATA.tipo_persona = usuario.tipo_persona
        ? usuario.tipo_persona.toUpperCase().trim()
        : "";

      const elRfc = document.getElementById("info-rfc");
      const elCorreo = document.getElementById("info-correo");
      const elTipo = document.getElementById("info-tipo-persona");

      if (elRfc) elRfc.innerText = usuario.rfc || "---";
      if (elCorreo) elCorreo.innerText = usuario.correo || "---";
      if (elTipo) elTipo.innerText = USER_DATA.tipo_persona || "---";

      actualizarInterfazDocumentos();
    }

    // B. Obtener Expediente (Proveedores)
    const { data: prov } = await window.clientSupa
      .from("proveedores")
      .select("*")
      .eq("id", PROVEEDOR_ID)
      .maybeSingle();

    if (prov) {
      const elFolio = document.getElementById("folio-expediente");
      if (elFolio && prov.folio) {
        elFolio.innerText = prov.folio;
        elFolio.className = "text-success font-weight-bold";
      }

      // Mapeo masivo de campos asistido
      const campos = {
        num_acta: prov.num_acta,
        poder_notarial: prov.poder_notarial,
        nombre_comercial: prov.nombre_comercial,
        rep_nombre: prov.rep_nombre,
        rep_paterno: prov.rep_paterno,
        rep_materno: prov.rep_materno,
        num_identificacion: prov.num_identificacion,
        localidad: prov.localidad,
        vialidad: prov.vialidad,
        num_ext: prov.num_ext,
        num_int: prov.num_int,
        colonia: prov.colonia,
        cp: prov.cp,
        "input-telefono": prov.telefono,
        select_tipo_doc: prov.tipo_identificacion,
        "select-estado": prov.estado,
        "select-anio": prov.anio_inicio,
        "select-capacidad": prov.capacidad_crediticia,
        "select-empleados": prov.num_empleados,
      };

      for (const [id, valor] of Object.entries(campos)) {
        const el = document.getElementById(id);
        if (el && valor) {
          el.value = valor;
          if (id === "select-estado") {
            await cargarMunicipios(valor);
            const munEl = document.getElementById("select-municipio");
            if (munEl) munEl.value = prov.municipio || "";
          }
        }
      }
      actualizarInterfazDocumentos();
      await cargarGirosGuardados();
    }
  } catch (e) {
    console.error("Error en inicializarPagina:", e);
  }
}

// --- 2. LÓGICA DE GIROS Y MODAL ---

async function cargarGirosGuardados() {
  const { data } = await window.clientSupa
    .from("proveedor_giros")
    .select("*")
    .eq("proveedor_id", PROVEEDOR_ID);
  if (data) {
    lineasSeleccionadas = data;
    renderizarListaLineas();
  }
}

function confirmarSeleccionModal() {
  const checkboxes = document.querySelectorAll(
    '#modalGiros input[type="checkbox"]:checked',
  );
  lineasSeleccionadas = [];
  checkboxes.forEach((cb) => {
    lineasSeleccionadas.push({
      giro_id: cb.dataset.giroId,
      giro_nombre: cb.dataset.giroNom,
      linea_id: cb.dataset.lineaId,
      linea_nombre: cb.dataset.lineaNom,
    });
  });
  renderizarListaLineas();
  if (window.jQuery) {
    $("#modalGiros").modal("hide");
  }
}

function renderizarListaLineas() {
  const contenedor =
    document.getElementById("lista-lineas-seleccionadas") ||
    document.getElementById("lista-seleccionados");
  if (!contenedor) return;

  contenedor.innerHTML =
    lineasSeleccionadas.length === 0
      ? '<li class="list-group-item text-muted">Ninguna línea seleccionada</li>'
      : lineasSeleccionadas
          .map(
            (l) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <div><small class="text-primary">${l.giro_nombre}</small><br><b>${l.linea_nombre}</b></div>
        </li>
    `,
          )
          .join("");
}

// --- 3. FUNCIONES DE GUARDADO SEGURO ---

async function guardarGenerales() {
  if (window.Swal) Swal.showLoading();

  const payload = {
    id: PROVEEDOR_ID,
    rfc: USER_DATA.rfc,
    correo: USER_DATA.correo,
    tipo_persona: USER_DATA.tipo_persona,
    num_acta: obtenerValorInput("num_acta"),
    poder_notarial: obtenerValorInput("poder_notarial"),
    nombre_comercial: obtenerValorInput("nombre_comercial"),
    rep_nombre: obtenerValorInput("rep_nombre"),
    rep_paterno: obtenerValorInput("rep_paterno"),
    rep_materno: obtenerValorInput("rep_materno"),
    tipo_identificacion: obtenerValorInput("select_tipo_doc"),
    num_identificacion: obtenerValorInput("num_identificacion"),
    updated_at: new Date().toISOString(),
  };

  const { error } = await window.clientSupa.from("proveedores").upsert(payload);

  if (!error) {
    AlertaFormulario(
      "Éxito",
      "Datos Generales guardados correctamente.",
      "success",
    );
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
  } else {
    AlertaFormulario(
      "Error",
      "No se guardaron los Datos Generales: " + error.message,
      "error",
    );
  }
}

async function guardarDomicilio() {
  if (window.Swal) Swal.showLoading();

  const payload = {
    id: PROVEEDOR_ID,
    rfc: USER_DATA.rfc,
    correo: USER_DATA.correo,
    tipo_persona: USER_DATA.tipo_persona,
    estado: obtenerValorInput("select-estado"),
    municipio: obtenerValorInput("select-municipio"),
    localidad: obtenerValorInput("localidad"),
    vialidad: obtenerValorInput("vialidad"),
    num_ext: obtenerValorInput("num_ext"),
    num_int: obtenerValorInput("num_int"),
    colonia: obtenerValorInput("colonia"),
    cp: obtenerValorInput("cp"),
    updated_at: new Date().toISOString(),
  };

  const { error } = await window.clientSupa.from("proveedores").upsert(payload);

  if (!error) {
    AlertaFormulario("Éxito", "Domicilio guardado con éxito.", "success");
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
  } else {
    AlertaFormulario(
      "Error",
      "No se guardó el Domicilio: " + error.message,
      "error",
    );
  }
}

async function guardarAdicionales() {
  if (!lineasSeleccionadas || lineasSeleccionadas.length === 0) {
    return AlertaFormulario(
      "Atención",
      "Selecciona al menos un giro comercial antes de guardar.",
      "warning",
    );
  }

  if (window.Swal) Swal.showLoading();

  const payload = {
    id: PROVEEDOR_ID,
    rfc: USER_DATA.rfc,
    correo: USER_DATA.correo,
    tipo_persona: USER_DATA.tipo_persona,
    telefono: obtenerValorInput("input-telefono"),
    capacidad_crediticia: obtenerValorInput("select-capacidad"),
    num_empleados: obtenerValorInput("select-empleados"),
    anio_inicio: obtenerValorInput("select-anio"),
    updated_at: new Date().toISOString(),
  };

  // 1. Guardar metadatos del proveedor
  const { error: errorProv } = await window.clientSupa
    .from("proveedores")
    .upsert(payload);
  if (errorProv) {
    return AlertaFormulario(
      "Error",
      "Error al guardar adicionales: " + errorProv.message,
      "error",
    );
  }

  // 2. Limpiar asociaciones de giros previos
  const { error: errorDel } = await window.clientSupa
    .from("proveedor_giros")
    .delete()
    .eq("proveedor_id", PROVEEDOR_ID);
  if (errorDel) {
    return AlertaFormulario(
      "Error",
      "Error al actualizar líneas comerciales: " + errorDel.message,
      "error",
    );
  }

  // 3. Registrar los giros actuales masivamente
  const girosInsert = lineasSeleccionadas.map((l) => ({
    proveedor_id: PROVEEDOR_ID,
    giro_id: l.giro_id,
    giro_nombre: l.giro_nombre,
    linea_id: l.linea_id,
    linea_nombre: l.linea_nombre,
  }));

  const { error: errorIns } = await window.clientSupa
    .from("proveedor_giros")
    .insert(girosInsert);

  if (errorIns) {
    return AlertaFormulario(
      "Error",
      "Error al registrar giros: " + errorIns.message,
      "error",
    );
  }

  AlertaFormulario(
    "Éxito",
    "Datos Adicionales y Giros guardados correctamente.",
    "success",
  );
  bloquearSeccionYPestaña(
    ["input-telefono", "select-capacidad", "select-empleados", "select-anio"],
    "#Adicionales",
  );
}

// --- 4. UTILIDADES DE INTERFAZ ---

function actualizarInterfazDocumentos() {
  const tipo = USER_DATA.tipo_persona;
  const esMoral = tipo === "MORAL";

  const lblActaGen = document.getElementById("label-acta");
  const lblActaFin = document.getElementById("label-acta-texto");

  if (lblActaGen)
    lblActaGen.innerHTML = esMoral
      ? '<span class="text-danger">*</span> Acta Constitutiva:'
      : '<span class="text-danger">*</span> Acta de Nacimiento:';
  if (lblActaFin)
    lblActaFin.innerText = esMoral
      ? "Adjuntar Acta Constitutiva:"
      : "Adjuntar Acta de Nacimiento:";

  const cPoderGen = document.getElementById("contenedor-poder-notarial");
  const cPoderFin = document.getElementById("seccion-poder-notarial");
  if (cPoderGen) cPoderGen.style.display = esMoral ? "flex" : "none";
  if (cPoderFin) cPoderFin.style.display = esMoral ? "flex" : "none";

  const selDoc = document.getElementById("select_tipo_doc");
  if (selDoc && selDoc.selectedIndex !== -1) {
    const txt = selDoc.options[selDoc.selectedIndex].text;
    const lIdGen = document.getElementById("label-identificacion");
    const lIdFin = document.getElementById("label-identificacion-texto");
    if (lIdGen) lIdGen.innerText = `Número de ${txt}:`;
    if (lIdFin) lIdFin.innerText = `Adjuntar ${txt}:`;
  }
}

// --- 5. CATÁLOGOS ---

async function cargarEstados() {
  const { data } = await window.clientSupa
    .from("estados_mexico")
    .select("id, nombre")
    .order("nombre");
  const sel = document.getElementById("select-estado");
  if (sel && data) {
    sel.innerHTML = '<option value="">Seleccione Estado...</option>';
    data.forEach((d) => sel.add(new Option(d.nombre, d.id)));
  }
}

async function cargarMunicipios(id) {
  const { data } = await window.clientSupa
    .from("municipios")
    .select("nombre")
    .eq("estado_id", id)
    .order("nombre");
  const sel = document.getElementById("select-municipio");
  if (sel && data) {
    sel.innerHTML = '<option value="">Seleccione Municipio...</option>';
    sel.disabled = false;
    data.forEach((d) => sel.add(new Option(d.nombre, d.nombre)));
  }
}

async function cargarAnios() {
  // Nota: Se lee desde la tabla 'años' configurada en Supabase
  const { data } = await window.clientSupa
    .from("años")
    .select("año")
    .order("año", { ascending: false });
  const sel = document.getElementById("select-anio");
  if (sel && data) {
    sel.innerHTML = '<option value="">Año...</option>';
    data.forEach((d) => sel.add(new Option(d.año, d.año)));
  }
}

function configurarEscuchadores() {
  document
    .getElementById("select-estado")
    ?.addEventListener("change", (e) => cargarMunicipios(e.target.value));
  document
    .getElementById("select_tipo_doc")
    ?.addEventListener("change", actualizarInterfazDocumentos);
}

function bloquearSeccionYPestaña(camposIds, idTab) {
  const icono =
    document.querySelector(`a[href="${idTab}"] i.fa-circle`) ||
    document.querySelector(`a[href="${idTab}"] i.fa-check-circle`);
  if (icono) icono.className = "fas fa-check-circle mr-1 text-success";

  camposIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.disabled = true;
      if (!el.nextElementSibling?.classList.contains("candado-editar")) {
        const can = document.createElement("i");
        can.className = "fas fa-lock candado-editar ml-2 text-danger";
        can.style.cursor = "pointer";
        el.parentElement.style.display = "flex";
        el.parentElement.style.alignItems = "center";
        el.parentElement.appendChild(can);
      }
    }
  });
}
