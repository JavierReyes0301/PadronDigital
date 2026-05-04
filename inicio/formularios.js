/**
 * LÓGICA DE REGISTRO DE PROVEEDORES (Versión Integrada)
 */

let PROVEEDOR_ID = null;
let USER_DATA = {};
let girosSeleccionados = []; // Control de selección múltiple

document.addEventListener("DOMContentLoaded", async () => {
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
      await cargarAnios();
      await cargarCatalogoGiros(); // Nueva función para los giros
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
        if (prov.municipio)
          document.getElementById("select-municipio").value = prov.municipio;
      }

      if (prov.anio_inicio)
        document.getElementById("select-anio").value = prov.anio_inicio;
      if (prov.capacidad_crediticia)
        document.getElementById("select-capacidad").value =
          prov.capacidad_crediticia;
      if (prov.num_empleados)
        document.getElementById("select-empleados").value = prov.num_empleados;
    }

    // CARGAR GIROS YA GUARDADOS (Para evitar que el folio se trabe al recargar)
    const { data: girosExistentes } = await window.clientSupa
      .from("proveedores_giros")
      .select("id_giro, giros_lineas(descripcion)")
      .eq("id_proveedor", PROVEEDOR_ID);

    if (girosExistentes) {
      girosExistentes.forEach((item) =>
        renderizarGiroEnTabla(item.id_giro, item.giros_lineas.descripcion),
      );
    }
  } catch (e) {
    console.error("❌ Error en inicialización:", e.message);
  }
}

// --- 2. CARGA DE CATÁLOGOS ---

async function cargarCatalogoGiros() {
  const select = document.getElementById("select-giros-lineas");
  if (!select) return;

  const { data, error } = await window.clientSupa
    .from("giros_lineas")
    .select("id, descripcion")
    .order("descripcion", { ascending: true });

  if (error) return console.error("❌ Error giros:", error.message);

  select.innerHTML = '<option value="">SELECCIONE EL GIRO...</option>';
  data.forEach((g) => {
    const opt = document.createElement("option");
    opt.value = g.id;
    opt.text = g.descripcion.toUpperCase();
    select.appendChild(opt);
  });
}

// (Tus funciones cargarAnios, cargarEstados y cargarMunicipios se mantienen igual...)

// --- 3. LÓGICA DE GIROS (MÚLTIPLE) ---

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

  girosSeleccionados.push(id.toString());

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
  girosSeleccionados = girosSeleccionados.filter((g) => g !== id.toString());
  const fila = document.getElementById(`fila-giro-${id}`);
  if (fila) fila.remove();
}

// --- 4. FUNCIONES DE GUARDADO ---

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

    const { error: errProv } = await window.clientSupa
      .from("proveedores")
      .upsert(payload);
    if (errProv) throw errProv;

    // Guardar Giros en tabla intermedia
    await window.clientSupa
      .from("proveedores_giros")
      .delete()
      .eq("id_proveedor", PROVEEDOR_ID);
    if (girosSeleccionados.length > 0) {
      const dataGiros = girosSeleccionados.map((gid) => ({
        id_proveedor: PROVEEDOR_ID,
        id_giro: parseInt(gid),
      }));
      await window.clientSupa.from("proveedores_giros").insert(dataGiros);
    }

    alert("✅ Datos Adicionales y Giros guardados.");
  } catch (e) {
    alert("Error: " + e.message);
  }
}

// --- 5. DOCUMENTOS Y REVISIÓN ---

async function SolicitudRevisionn() {
  const btn = document.getElementById("BtnRevision");
  btn.disabled = true;
  btn.innerHTML = "Subiendo...";

  try {
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
    location.reload();
  } catch (e) {
    alert("Error al subir: " + e.message);
  } finally {
    btn.disabled = false;
  }
}
