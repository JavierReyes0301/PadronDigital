/**
 * LÓGICA DE REGISTRO DE PROVEEDORES - VERSIÓN INTEGRAL Y CORREGIDA
 */

let PROVEEDOR_ID = null;
let USER_DATA = {}; 
let girosSeleccionados = []; 

document.addEventListener("DOMContentLoaded", async () => {
  setTimeout(async () => {
    if (!window.clientSupa) return;

    const { data: { session } } = await window.clientSupa.auth.getSession();

    if (session) {
      PROVEEDOR_ID = session.user.id;
      console.log("🟢 Sesión confirmada:", PROVEEDOR_ID);

      // Carga de catálogos iniciales
      await cargarEstados().catch(e => console.error("Error estados:", e));
      await cargarAnios().catch(e => console.error("Error años:", e));
      await cargarCatalogoGiros().catch(e => console.warn("Giros no disponibles."));
      
      configurarEscuchadores();
      await inicializarPagina();
    }
  }, 400);
});

// --- 1. INICIALIZACIÓN DE DATOS ---

async function inicializarPagina() {
  try {
    const { data: usuario } = await window.clientSupa
      .from("usuarios")
      .select("rfc, correo, tipo_persona")
      .eq("id", PROVEEDOR_ID)
      .single();

    if (usuario) {
      USER_DATA = usuario;
      if(document.getElementById("info-rfc")) document.getElementById("info-rfc").innerText = usuario.rfc || "---";
      if(document.getElementById("info-correo")) document.getElementById("info-correo").innerText = usuario.correo || "---";
      if(document.getElementById("info-tipo-persona")) document.getElementById("info-tipo-persona").innerText = usuario.tipo_persona || "---";
    }

    let { data: prov } = await window.clientSupa
      .from("proveedores")
      .select("*")
      .eq("id", PROVEEDOR_ID)
      .maybeSingle();

    if (prov) {
      const campos = ["num_acta", "poder_notarial", "nombre_comercial", "rep_nombre", "rep_paterno", "rep_materno", "num_identificacion", "localidad", "vialidad", "num_ext", "num_int", "colonia", "cp", "input-telefono"];
      campos.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = prov[id === "input-telefono" ? "telefono" : id] || "";
      });

      if (prov.estado) {
        document.getElementById("select-estado").value = prov.estado;
        await cargarMunicipios(prov.estado);
        if (prov.municipio) document.getElementById("select-municipio").value = prov.municipio;
      }

      if (prov.anio_inicio) document.getElementById("select-anio").value = prov.anio_inicio;
      if (prov.capacidad_crediticia) document.getElementById("select-capacidad").value = prov.capacidad_crediticia;
      if (prov.num_empleados) document.getElementById("select-empleados").value = prov.num_empleados;
    }

    // Cargar giros guardados en tabla intermedia
    try {
        const { data: girosExistentes } = await window.clientSupa
            .from("proveedores_giros")
            .select("id_giro, giros_lineas(descripcion)")
            .eq("id_proveedor", PROVEEDOR_ID);

        if (girosExistentes) {
            girosExistentes.forEach(item => {
                if(item.giros_lineas) renderizarGiroEnTabla(item.id_giro, item.giros_lineas.descripcion);
            });
        }
    } catch (err) { console.warn("No se cargaron giros previos."); }

  } catch (e) { console.error("❌ Error inicialización:", e.message); }
}

// --- 2. FUNCIONES DE GUARDADO (TUS FUNCIONES ORIGINALES + GIROS) ---

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
    tipo_identificacion: document.getElementById("select_tipo_doc")?.value,
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
  try {
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

    // 1. Guardar en tabla proveedores
    const { error: errProv } = await window.clientSupa.from("proveedores").upsert(payload);
    if (errProv) throw errProv;

    // 2. Guardar Giros (Limpia e inserta en tabla intermedia)
    await window.clientSupa.from("proveedores_giros").delete().eq("id_proveedor", PROVEEDOR_ID);
    if (girosSeleccionados.length > 0) {
      const dataGiros = girosSeleccionados.map(gid => ({ id_proveedor: PROVEEDOR_ID, id_giro: parseInt(gid) }));
      const { error: errGiros } = await window.clientSupa.from("proveedores_giros").insert(dataGiros);
      if (errGiros) throw errGiros;
    }

    alert("✅ Datos Adicionales y Giros guardados.");
  } catch (e) { alert("Error: " + e.message); }
}

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
      await window.clientSupa.storage.from("expedientes").upload(path, file, { upsert: true });
    }
  }

  await window.clientSupa.from("proveedores").update({ estatus: "EN REVISIÓN" }).eq("id", PROVEEDOR_ID);
  alert("🚀 Expediente enviado a revisión.");
}

// --- 3. CARGA DE CATÁLOGOS ---

async function cargarEstados() {
  const { data, error } = await window.clientSupa.from("estados_mexico").select("id, nombre").order("nombre", { ascending: true });
  if (error) return;
  const selectEstado = document.getElementById("select-estado");
  if (!selectEstado) return;
  selectEstado.innerHTML = '<option value="">SELECCIONE EL ESTADO...</option>';
  data.forEach(est => {
    const opt = document.createElement("option");
    opt.value = est.id; opt.text = est.nombre.toUpperCase();
    selectEstado.appendChild(opt);
  });
}

async function cargarMunicipios(estadoId) {
  const selectMun = document.getElementById("select-municipio");
  if (!selectMun) return;
  const { data, error } = await window.clientSupa.from("municipios").select("nombre").eq("estado_id", estadoId).order("nombre", { ascending: true });
  if (error) return;
  selectMun.innerHTML = '<option value="">SELECCIONE EL MUNICIPIO...</option>';
  selectMun.disabled = false;
  data.forEach(mun => {
    const opt = document.createElement("option");
    opt.value = mun.nombre; opt.text = mun.nombre.toUpperCase();
    selectMun.appendChild(opt);
  });
}

async function cargarAnios() {
  const { data, error } = await window.clientSupa.from("años").select("año").order("año", { ascending: false });
  if (error) return;
  const selectAnio = document.getElementById("select-anio");
  if (!selectAnio) return;
  selectAnio.innerHTML = '<option value="">SELECCIONE EL AÑO...</option>';
  data.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.año; opt.text = item.año;
    selectAnio.appendChild(opt);
  });
}

async function cargarCatalogoGiros() {
    const select = document.getElementById("select-giros-lineas");
    if (!select) return;
    const { data, error } = await window.clientSupa.from("giros_lineas").select("id, descripcion").order("descripcion", { ascending: true });
    if (error) return;
    select.innerHTML = '<option value="">SELECCIONE EL GIRO...</option>';
    data.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g.id; opt.text = g.descripcion.toUpperCase();
        select.appendChild(opt);
    });
}

// --- 4. LÓGICA DE GIROS (TABLA VISUAL) ---

function agregarGiroALista() {
    const select = document.getElementById("select-giros-lineas");
    const id = select.value;
    const texto = select.options[select.selectedIndex].text;
    if (!id || girosSeleccionados.includes(id.toString())) return;
    renderizarGiroEnTabla(id, texto);
}

function renderizarGiroEnTabla(id, texto) {
    const tbody = document.getElementById("tbody-giros");
    if (!tbody) return;
    const rowVacia = document.getElementById("row-vacia");
    if (rowVacia) rowVacia.remove();

    if (!girosSeleccionados.includes(id.toString())) girosSeleccionados.push(id.toString());
    if (document.getElementById(`fila-giro-${id}`)) return;

    const tr = document.createElement("tr");
    tr.id = `fila-giro-${id}`;
    tr.innerHTML = `
        <td class="small">${texto}</td>
        <td class="text-center">
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarGiroDeLista('${id}')">
                <i class="fas fa-trash"></i>
            </button>
        </td>`;
    tbody.appendChild(tr);
}

function eliminarGiroDeLista(id) {
    girosSeleccionados = girosSeleccionados.filter(g => g !== id.toString());
    const fila = document.getElementById(`fila-giro-${id}`);
    if (fila) fila.remove();
}

function configurarEscuchadores() {
  const selectEstado = document.getElementById("select-estado");
  if (selectEstado) {
    selectEstado.addEventListener("change", async (e) => {
      const idEstado = e.target.value;
      if (idEstado) await cargarMunicipios(idEstado);
    });
  }
}