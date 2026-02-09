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
 * 4. GESTIÓN DE INDICADORES
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
 * 5. GESTIÓN DE ESTATUS E INSTRUCCIONES (ACTUALIZADO)
 * ==========================================
 */
async function gestionarInstruccionesVisuales() {
  const divNuevo = document.getElementById("instruccionesNuevo");
  const divRegistrado = document.getElementById("instruccionesRegistrado");

  // 1. Obtenemos el parámetro 'u' de la URL (?u=n o ?u=r)
  const params = new URLSearchParams(window.location.search);
  let modoURL = params.get("u");

  try {
    const {
      data: { user },
    } = await window.clientSupa.auth.getUser();

    // Si no hay usuario, redirigir a seguridad
    if (!user) {
      window.location.href = "../index.html";
      return;
    }

    // 2. Verificación de respaldo en Base de Datos
    const { data: perfil } = await window.clientSupa
      .from("proveedores")
      .select("estatus")
      .eq("id_auth", user.id)
      .maybeSingle();

    // Si el estatus ya es avanzado, forzamos vista de "Registrado"
    if (
      perfil &&
      (perfil.estatus === "Registrado" || perfil.estatus === "Validado")
    ) {
      modoURL = "r";
    }
  } catch (err) {
    console.error("Error validando estatus:", err);
  }

  // 3. Aplicación visual de los bloques
  if (modoURL === "n") {
    if (divNuevo) divNuevo.style.display = "block";
    if (divRegistrado) divRegistrado.style.display = "none";
  } else {
    if (divNuevo) divNuevo.style.display = "none";
    if (divRegistrado) divRegistrado.style.display = "block";
  }
}

/**
 * ==========================================
 * 6. INICIALIZACIÓN GLOBAL
 * ==========================================
 */
document.addEventListener("DOMContentLoaded", () => {
  // Verificación de sesión e instrucciones
  gestionarInstruccionesVisuales();

  // Configuración de elementos
  configurarSelectsUbicacion();

  // Mapeo de Indicadores
  vincularIndicador("txtRFC", "icono-rfc");
  vincularIndicador("txtRazonSocial", "icono-razon");
  vincularIndicador("txtCalle", "icono-calle");
  vincularIndicador("txtNumExt", "icono-num");
  vincularIndicador("select-estado", "icono-estado");

  // Activar tab si viene en el Hash
  if (window.location.hash) {
    $(`.nav-tabs a[href="${window.location.hash}"]`).tab("show");
  }

  // Formateo automático de inputs a MAYÚSCULAS
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

/**
 * ==========================================
 * 7. SEGURIDAD Y SESIÓN
 * ==========================================
 */
async function enviarFormSeguro(idForma) {
  if (confirm("¿Está seguro que desea cerrar su sesión?")) {
    try {
      if (window.clientSupa) {
        await window.clientSupa.auth.signOut();
      }
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "../index.html";
    } catch (error) {
      console.error("Error al salir:", error);
      window.location.href = "../index.html";
    }
  }
}
