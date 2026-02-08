/**
 * ==========================================
 * 1. CONFIGURACIÓN DE SELECTS DINÁMICOS
 * ==========================================
 */
const configurarSelectsUbicacion = () => {
  const selectEstado = document.getElementById("select-estado");
  const selectMunicipio = document.getElementById("select-municipio");

  if (selectEstado && selectMunicipio) {
    selectEstado.addEventListener("change", async (e) => {
      const estadoId = e.target.value;
      if (!estadoId) return;

      selectMunicipio.innerHTML =
        '<option value="">Cargando municipios...</option>';

      const { data, error } = await window.clientSupa
        .from("municipios")
        .select("id, nombre")
        .eq("estado_id", estadoId)
        .order("nombre", { ascending: true });

      if (data) {
        selectMunicipio.innerHTML =
          '<option value="">Selecciona un municipio</option>';
        data.forEach((muni) => {
          const option = new Option(muni.nombre, muni.id);
          selectMunicipio.add(option);
        });
      }
    });
  }
};

/**
 * ==========================================
 * 2. LÓGICA DE DESBLOQUEO UNIVERSAL
 * ==========================================
 */
function toggleDesbloqueo(id) {
  const el = document.getElementById(id);
  const parent = el?.closest(".form-group-custom") || el?.parentElement;
  const lockIcon = parent?.querySelector(".fa-lock");
  const unlockIcon = parent?.querySelector(".fa-lock-open");

  if (el) {
    el.readOnly = false;
    el.disabled = false;
    el.style.pointerEvents = "auto";
    el.style.backgroundColor = "moccasin";
    el.focus();

    if (lockIcon) lockIcon.classList.add("d-none");
    if (unlockIcon) unlockIcon.classList.remove("d-none");
  }
}

/**
 * ==========================================
 * 3. NAVEGACIÓN Y FLUJO (TABS)
 * ==========================================
 */
function navegarAPestana(targetHash) {
  const tabLink = document.querySelector(`.nav-link[href="${targetHash}"]`);
  if (tabLink) {
    $(tabLink).removeClass("disabled-tab disabled").css({
      "pointer-events": "auto",
      opacity: "1",
    });
    $(tabLink).tab("show");
    window.location.hash = targetHash;
  }
}

function iniciarActualizacion() {
  navegarAPestana("#Generales");
}

/**
 * ==========================================
 * 4. GESTIÓN DE INDICADORES (FUNCIÓN MAESTRA)
 * ==========================================
 */
function vincularIndicador(idInput, idIcono) {
  const input = document.getElementById(idInput);
  const icono = document.getElementById(idIcono);

  if (input && icono) {
    input.addEventListener("input", () => {
      if (input.value.trim().length > 0) {
        icono.className = "fas fa-check-circle color-guinda";
      } else {
        icono.className = "far fa-circle";
      }
    });
  }
}

/**
 * ==========================================
 * 5. GESTIÓN DE ESTATUS E INSTRUCCIONES
 * ==========================================
 */
async function gestionarInstruccionesVisuales() {
  const divNuevo = document.getElementById("instruccionesNuevo");
  const divRegistrado = document.getElementById("instruccionesRegistrado");
  const params = new URLSearchParams(window.location.search);
  const modoURL = params.get("u");

  if (modoURL === "n") {
    if (divNuevo) divNuevo.style.display = "block";
    if (divRegistrado) divRegistrado.style.display = "none";
  } else {
    if (divNuevo) divNuevo.style.display = "none";
    if (divRegistrado) divRegistrado.style.display = "block";
  }

  try {
    const {
      data: { user },
    } = await window.clientSupa.auth.getUser();
    if (user) {
      const { data: perfil } = await window.clientSupa
        .from("proveedores")
        .select("estatus")
        .eq("id_auth", user.id)
        .maybeSingle();

      if (
        perfil &&
        (perfil.estatus === "Registrado" || perfil.estatus === "Validado")
      ) {
        if (divNuevo) divNuevo.style.display = "none";
        if (divRegistrado) divRegistrado.style.display = "block";
      }
    }
  } catch (err) {
    console.error("Error validando estatus:", err);
  }
}

/**
 * ==========================================
 * 6. INICIALIZACIÓN GLOBAL (ÚNICA)
 * ==========================================
 */
document.addEventListener("DOMContentLoaded", () => {
  // Lógica de carga inicial
  configurarSelectsUbicacion();
  gestionarInstruccionesVisuales();

  // Mapeo de Indicadores (Checks de progreso)
  vincularIndicador("txtRFC", "icono-rfc");
  vincularIndicador("txtRazonSocial", "icono-razon");
  vincularIndicador("txtCalle", "icono-calle");
  vincularIndicador("txtNumExt", "icono-num");
  vincularIndicador("select-estado", "icono-estado");

  // Activar tab si viene en el Hash
  if (window.location.hash) {
    $(`.nav-tabs a[href="${window.location.hash}"]`).tab("show");
  }

  // Formateo automático de inputs
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", function () {
      if (this.type !== "password" && this.type !== "email") {
        this.value = this.value.toUpperCase();
      }
    });
  });

  // Tooltips y Popovers
  if (typeof $ !== "undefined") {
    $('[data-toggle="popover"]').popover({ trigger: "hover", html: true });
    $('[data-toggle="tooltip"]').tooltip();
  }
});
