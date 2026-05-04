/**
 * LÓGICA INTEGRADA DE REGISTRO DE PROVEEDORES
 * Módulos: Generales, Domicilio, Adicionales (Giros/Años) y Documentación.
 */

let PROVEEDOR_ID = null;
let USER_DATA = {};
let girosSeleccionados = []; // Manejo de selección múltiple

document.addEventListener("DOMContentLoaded", async () => {
  // Retraso para asegurar que Supabase esté inicializado
  setTimeout(async () => {
    if (!window.clientSupa) return;

    const {
      data: { session },
    } = await window.clientSupa.auth.getSession();

    if (session) {
      PROVEEDOR_ID = session.user.id;
      console.log("🟢 Sesión confirmada:", PROVEEDOR_ID);

      // Carga de catálogos y datos iniciales
      await cargarEstados();
      await cargarAnios();
      await cargarCatalogoGiros();
      configurarEscuchadores();
      await inicializarPagina();
    }
  }, 400);
});

// --- 1. CARGA DE CATÁLOGOS Y DATOS ---

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
      // Rellenar campos de texto y selectores (Lógica existente)
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

    // Cargar giros guardados
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

// --- 2. LÓGICA DE GIROS (SELECCIÓN MÚLTIPLE) ---

function agregarGiroALista() {
  const select = document.getElementById("select-giros-lineas");
  const id = select.value;
  const texto = select.options[select.selectedIndex].text;
  if (!id || girosSeleccionados.includes(id.toString())) return;
  renderizarGiroEnTabla(id, texto);
}

function renderizarGiroEnTabla(id, texto) {
  const tbody = document.getElementById("tbody-giros");
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
  document.getElementById(`fila-giro-${id}`).remove();
}

// --- 3. GUARDADO DE DATOS ADICIONALES ---

async function guardarAdicionales() {
  const btn = document.getElementById("BtnAdicionales");
  btn.disabled = true;
  try {
    const payloadProv = {
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
      .upsert(payloadProv);
    if (errProv) throw errProv;

    // Guardar relación de giros (Limpia e inserta)
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
    alert("✅ Datos y Giros guardados con éxito.");
  } catch (e) {
    alert("Error: " + e.message);
  } finally {
    btn.disabled = false;
  }
}

// --- 4. CARGA DE ARCHIVOS (FINALIZAR) ---

function actualizarEstadoArchivo(id) {
  const input = document.getElementById(`file-${id}`);
  const status = document.getElementById(`status-${id}`);
  if (input.files && input.files[0]) {
    status.innerText = input.files[0].name;
    status.classList.replace("text-muted", "text-success");
  }
}

async function SolicitudRevisionn() {
  const btn = document.getElementById("BtnRevision");
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo...';

  const archivos = [
    { id: "csf", label: "Constancia de Situación Fiscal" },
    { id: "acta", label: "Acta de Nacimiento" },
    { id: "domicilio", label: "Comprobante de Domicilio" },
    { id: "ine", label: "Identificación" },
  ];

  try {
    for (const arc of archivos) {
      const file = document.getElementById(`file-${arc.id}`).files[0];
      if (file) {
        const path = `${PROVEEDOR_ID}/${arc.id}.pdf`;
        const { error } = await window.clientSupa.storage
          .from("expedientes")
          .upload(path, file, { upsert: true });
        if (error) throw new Error(`Error en ${arc.label}: ${error.message}`);
      }
    }

    await window.clientSupa
      .from("proveedores")
      .update({ estatus: "EN REVISIÓN" })
      .eq("id", PROVEEDOR_ID);
    alert("🚀 Expediente enviado a revisión.");
    location.reload();
  } catch (e) {
    alert(e.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML =
      '<i class="fas fa-edit fa-lg mr-2"></i> Enviar Solicitud a Revisión';
  }
}
