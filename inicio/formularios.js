/**
 * ==========================================
 * 1. GESTIÓN DE ESTATUS E INICIO (CRÍTICO)
 * ==========================================
 */
async function gestionarEstadoYSecciones() {
  const divNuevo = document.getElementById("instruccionesNuevo");
  const divRegistrado = document.getElementById("instruccionesRegistrado");
  const seccionActualizar = document.getElementById("actualizar-datos");
  const seccionEstado = document.getElementById("estado-perfil");

  try {
    const {
      data: { user },
    } = await window.clientSupa.auth.getUser();

    if (!user) {
      window.location.href = "../index.html";
      return;
    }

    // Consultamos el perfil en la tabla proveedores
    const { data: perfil, error } = await window.clientSupa
      .from("proveedores")
      .select("estatus")
      .eq("id_auth", user.id)
      .maybeSingle();

    // Ocultamos todo por defecto usando la lógica de tu CSS
    [seccionActualizar, seccionEstado].forEach((s) => {
      if (s) s.style.setProperty("display", "none", "important");
    });

    // LÓGICA DE DECISIÓN: ¿A dónde va el usuario?
    if (!perfil || perfil.estatus === "Pendiente") {
      // USUARIO NUEVO O INCOMPLETO
      if (seccionActualizar) {
        seccionActualizar.style.setProperty("display", "flex", "important");
        seccionActualizar.classList.add("activa");
      }
      if (divNuevo) divNuevo.style.display = "block";
      if (divRegistrado) divRegistrado.style.display = "none";

      // Bloqueamos pestañas avanzadas de Actualizar Datos si es nuevo
      document
        .querySelectorAll("#actualizar-datos .nav-link")
        .forEach((tab, index) => {
          if (index > 0) tab.classList.add("disabled-tab");
        });
    } else {
      // USUARIO REGISTRADO / VALIDADO
      if (seccionEstado) {
        seccionEstado.style.setProperty("display", "flex", "important");
        seccionEstado.classList.add("activa");
      }
      if (divNuevo) divNuevo.style.display = "none";
      if (divRegistrado) divRegistrado.style.display = "block";
    }
  } catch (err) {
    console.error("Error validando estatus:", err);
  }
}

/**
 * ==========================================
 * 2. CONFIGURACIÓN DE SELECTS DINÁMICOS
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
 * 3. LÓGICA DE DESBLOQUEO Y NAVEGACIÓN
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

/**
 * ==========================================
 * 4. GESTIÓN DE INDICADORES (CHECKMARKS)
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
 * 5. INICIALIZACIÓN GLOBAL
 * ==========================================
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Decidir qué sección mostrar
  gestionarEstadoYSecciones();

  // 2. Configuración de Ubicación
  configurarSelectsUbicacion();

  // 3. Mapeo de Indicadores
  vincularIndicador("txtRFC", "icono-rfc");
  vincularIndicador("txtRazonSocial", "icono-razon");
  vincularIndicador("txtCalle", "icono-calle");
  vincularIndicador("txtNumExt", "icono-num");

  // 4. Mayúsculas automáticas (excepto email/pass)
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", function () {
      if (this.type !== "password" && this.type !== "email") {
        this.value = this.value.toUpperCase();
      }
    });
  });

  // 5. Hash Navigation
  if (window.location.hash) {
    $(`.nav-tabs a[href="${window.location.hash}"]`).tab("show");
  }
});

/**
 * ==========================================
 * 6. CIERRE DE SESIÓN
 * ==========================================
 */
async function cerrarSesion() {
  if (confirm("¿Está seguro que desea cerrar su sesión?")) {
    try {
      await window.clientSupa.auth.signOut();
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "../index.html";
    } catch (error) {
      console.error("Error al salir:", error);
      window.location.href = "../index.html";
    }
  }
}
