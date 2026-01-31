// Archivo: modales.js
// Contiene la estructura de los modales para el Padrón de Proveedores

const modalesPadron = `
<div
        class="modal fade"
        id="ModalRegistro"
        role="dialog"
        tabindex="-1"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div
            class="modal-content"
            style="
              border-radius: 12px;
              overflow: hidden;
              border: none;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            "
          >
            <div
              class="modal-header"
              style="
                background-color: #ab0a3d;
                color: white;
                padding: 25px 30px;
                border: none;
                position: relative;
              "
            >
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                style="
                  color: white;
                  opacity: 1;
                  font-size: 32px;
                  position: absolute;
                  right: 20px;
                  top: 15px;
                "
              >
                &times;
              </button>
              <h2
                style="
                  font-family: &quot;Montserrat&quot;, sans-serif;
                  font-weight: 800;
                  text-transform: uppercase;
                  margin: 0;
                  font-size: 1.5rem;
                  letter-spacing: 0.5px;
                "
              >
                Registro al Padrón de Proveedores
              </h2>
            </div>

            <div
              class="modal-body"
              style="
                padding: 40px;
                font-family: &quot;Montserrat&quot;, sans-serif;
                background-color: #ffffff;
              "
            >
              <h4
                style="
                  font-weight: 600;
                  color: #444;
                  margin-bottom: 25px;
                  border-left: 5px solid #ab0a3d;
                  padding-left: 15px;
                "
              >
                Capture los siguientes datos para iniciar su proceso:
              </h4>

              <form id="FormRegistro" autocomplete="on">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group" style="margin-bottom: 20px">
                      <label
                        style="
                          font-weight: 700;
                          color: #333;
                          display: block;
                          margin-bottom: 10px;
                        "
                        >Tipo de Persona:</label
                      >
                      <div
                        style="
                          display: flex;
                          gap: 20px;
                          align-items: center;
                          background: #f8f9fa;
                          padding: 10px;
                          border-radius: 5px;
                        "
                      >
                        <label
                          style="font-weight: 400; margin: 0; cursor: pointer"
                        >
                          <input
                            type="radio"
                            name="tipo-persona"
                            value="Física"
                            style="transform: scale(1.3); margin-right: 8px"
                          />
                          Física
                        </label>
                        <label
                          style="font-weight: 400; margin: 0; cursor: pointer"
                        >
                          <input
                            type="radio"
                            name="tipo-persona"
                            value="Moral"
                            style="transform: scale(1.3); margin-right: 8px"
                          />
                          Moral
                        </label>
                      </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 20px">
                      <label style="font-weight: 700; color: #333">RFC:</label>
                      <input
                        type="text"
                        class="form-control"
                        name="rfc"
                        placeholder="RFC con Homoclave"
                        style="
                          background-color: #eef4ff;
                          border: none;
                          height: 45px;
                          text-transform: uppercase;
                        "
                      />
                    </div>

                    <div class="form-group" style="margin-bottom: 20px">
                      <label style="font-weight: 700; color: #333"
                        >Correo Electrónico:</label
                      >
                      <input
                        type="email"
                        class="form-control"
                        name="correo"
                        placeholder="ejemplo@correo.com"
                        style="
                          background-color: #eef4ff;
                          border: none;
                          height: 45px;
                        "
                      />
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group" style="margin-bottom: 20px">
                      <label style="font-weight: 700; color: #333"
                        >Contraseña:</label
                      >
                      <input
                        type="password"
                        class="form-control"
                        name="pwd"
                        placeholder="Mínimo 8 caracteres"
                        style="
                          background-color: #eef4ff;
                          border: none;
                          height: 45px;
                        "
                      />
                    </div>

                    <div class="form-group" style="margin-bottom: 20px">
                      <label style="font-weight: 700; color: #333"
                        >Confirmar Contraseña:</label
                      >
                      <input
                        type="password"
                        class="form-control"
                        name="confirmar-pwd"
                        style="
                          background-color: #eef4ff;
                          border: none;
                          height: 45px;
                        "
                      />
                    </div>
                  </div>
                </div>

                <div
                  style="
                    background: #fdf2f5;
                    border: 1px solid #f9d6de;
                    padding: 20px;
                    border-radius: 8px;
                    margin-top: 10px;
                  "
                >
                  <p
                    style="
                      font-size: 0.85rem;
                      color: #666;
                      line-height: 1.4;
                      margin-bottom: 15px;
                      text-align: justify;
                    "
                  >
                    <strong>Aviso de Privacidad:</strong> Sus datos serán
                    protegidos de acuerdo a la Ley General de Protección de
                    Datos Personales. El registro constituye una fuente de
                    acceso público conforme a la normatividad vigente.
                  </p>
                  <label
                    style="
                      font-weight: 600;
                      color: #ab0a3d;
                      cursor: pointer;
                      font-size: 0.9rem;
                    "
                  >
                    <input
                      type="checkbox"
                      name="acepta-aviso"
                      required
                      style="margin-right: 8px; transform: scale(1.2)"
                    />
                    Acepto el aviso de privacidad y autorizo la publicación de
                    mis datos.
                  </label>
                </div>

                <div style="text-align: center; margin-top: 30px">
                  <button
                    type="submit"
                    class="btn"
                    style="
                      background-color: #ab0a3d;
                      color: white;
                      padding: 12px 60px;
                      font-weight: 700;
                      text-transform: uppercase;
                      border-radius: 5px;
                      border: none;
                      transition: 0.3s;
                      box-shadow: 0 4px 15px rgba(171, 10, 61, 0.2);
                    "
                  >
                    Continuar Registro
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="modalRequisitos"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div
            class="modal-content"
            style="
              border-radius: 12px;
              overflow: hidden;
              border: none;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            "
          >
            <div
              class="modal-header"
              style="
                background-color: #ab0a3d;
                color: white;
                padding: 25px 30px;
                border: none;
                position: relative;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                style="
                  position: absolute;
                  right: 20px;
                  top: 15px;
                  color: white;
                  opacity: 1;
                  font-size: 32px;
                  border: none;
                  background: none;
                  cursor: pointer;
                "
              >
                &times;
              </button>
              <h2
                style="
                  margin: 0;
                  font-family: &quot;Montserrat&quot;, sans-serif;
                  font-weight: 800;
                  text-transform: uppercase;
                  font-size: 1.5rem;
                  letter-spacing: 0.5px;
                "
              >
                REQUISITOS
              </h2>
            </div>

            <div
              class="modal-body"
              style="
                padding: 40px;
                font-family: &quot;Montserrat&quot;, sans-serif;
                background-color: #ffffff;
              "
            >
              <div class="row">
                <div class="col-md-12">
                  <div class="row">
                    <div class="col-md-6">
                      <h4
                        style="
                          font-weight: 700;
                          color: #333;
                          font-size: 1.1rem;
                          margin-bottom: 15px;
                        "
                      >
                        Documentación Personal
                      </h4>
                      <ul
                        style="
                          font-size: 0.9rem;
                          line-height: 1.8;
                          color: #444;
                          padding-left: 20px;
                          list-style-type: square;
                        "
                      >
                        <li>Acta de nacimiento (Persona Física).</li>
                        <li>
                          Cédula de Clave Única de Registro de Población CURP
                          (Persona Física).
                        </li>
                        <li>
                          Acta constitutiva y sus modificaciones, así como el
                          instrumento notarial en el cual conste la
                          representación legal (Persona Moral).
                        </li>
                        <li>Identificación oficial con fotografía.</li>
                        <li>Comprobante de domicilio.</li>
                        <li>Currículum Vitae.</li>
                        <li>Reporte fotográfico del domicilio fiscal.</li>
                      </ul>
                    </div>

                    <div class="col-md-6">
                      <h4
                        style="
                          font-weight: 700;
                          color: #333;
                          font-size: 1.1rem;
                          margin-bottom: 15px;
                        "
                      >
                        Documentación Fiscal
                      </h4>
                      <ul
                        style="
                          font-size: 0.9rem;
                          line-height: 1.8;
                          color: #444;
                          padding-left: 20px;
                          list-style-type: square;
                          text-align: justify;
                        "
                      >
                        <li>Comprobante de pago de derechos.</li>
                        <li>Constancia de Situación Fiscal.</li>
                        <li>Opinión de cumplimiento SAT.</li>
                        <li>
                          Constancia de no adeudo de contribuciones municipales
                          expedida por la Tesorería Municipal del Honorable
                          Ayuntamiento de Atlixco.
                        </li>
                        <li>Declaración anual de impuestos.</li>
                        <li>
                          Ultimas tres declaraciones parciales de impuestos.
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div
                    style="
                      background-color: #fdf2f5;
                      padding: 25px;
                      border-radius: 8px;
                      margin-top: 25px;
                      border: 1px solid #f9d6de;
                    "
                  >
                    <h4
                      style="
                        font-weight: 700;
                        color: #ab0a3d;
                        font-size: 1.1rem;
                        margin-top: 0;
                        margin-bottom: 15px;
                      "
                    >
                      Formatos Proporcionados por el Municipio
                    </h4>
                    <ul
                      style="
                        font-size: 0.85rem;
                        color: #444;
                        padding-left: 20px;
                        margin-bottom: 0;
                        line-height: 1.7;
                        text-align: justify;
                      "
                    >
                      <li>Solicitud de registro/revalidación.</li>
                      <li>
                        Carta bajo protesta de decir verdad de no estar impedido
                        para contratar conforme al artículo 77 de la Ley de
                        Adquisiciones, y de no estar en el supuesto del artículo
                        69-B del Código Fiscal de la Federación.
                      </li>
                      <li>
                        Carta de manifiesto bajo protesta de decir verdad de no
                        estar inhabilitado para participar en procedimientos de
                        adjudicación.
                      </li>
                      <li>
                        Carta de manifiesto bajo protesta de decir verdad de no
                        desempeñar empleo, cargo o comisión en el servicio
                        público o, en su caso, de no incurrir en un conflicto de
                        interés con la Administración Pública Municipal.
                      </li>
                      <li>
                        Carta bajo protesta de decir verdad de encontrarse al
                        corriente de las obligaciones fiscales.
                      </li>
                    </ul>
                  </div>

                  <div style="text-align: center; margin-top: 35px">
                    <a
                      href="Img/REQUISITOS.pdf"
                      download
                      style="
                        display: inline-block;
                        background-color: #f4f4f4;
                        color: #ab0a3d;
                        padding: 12px 30px;
                        border-radius: 5px;
                        text-decoration: none;
                        font-weight: 700;
                        font-size: 0.9rem;
                        border: 1px solid #ab0a3d;
                        transition: 0.3s;
                      "
                    >
                      <i class="fas fa-file-pdf"></i> DESCARGAR PDF OFICIAL
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="modalFormatos"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div
            class="modal-content"
            style="
              border-radius: 12px;
              overflow: hidden;
              border: none;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            "
          >
            <div
              class="modal-header"
              style="
                background-color: #ab0a3d;
                color: white;
                padding: 35px 30px;
                border: none;
                position: relative;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                style="
                  position: absolute;
                  right: 20px;
                  top: 15px;
                  color: white;
                  opacity: 1;
                  font-size: 32px;
                  border: none;
                  background: none;
                  cursor: pointer;
                "
              >
                &times;
              </button>

              <h2
                style="
                  margin: 0;
                  font-family: &quot;Montserrat&quot;, sans-serif;
                  font-weight: 800;
                  text-transform: uppercase;
                  font-size: 1.7rem;
                  letter-spacing: 1px;
                "
              >
                FORMATOS
              </h2>
            </div>

            <div
              class="modal-body"
              style="
                padding: 40px;
                font-family: &quot;Montserrat&quot;, sans-serif;
                background-color: #ffffff;
              "
            >
              <p
                style="
                  margin-bottom: 30px;
                  color: #555;
                  font-size: 1rem;
                  text-align: justify;
                  border-left: 5px solid #ab0a3d;
                  padding-left: 15px;
                  line-height: 1.6;
                "
              >
                Seleccione el formato correspondiente para su descarga. Todos
                los documentos deben ser requisitados y firmados.
              </p>

              <div class="list-group">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 0;
                    border-bottom: 1px solid #eee;
                  "
                >
                  <div style="padding-right: 25px; text-align: justify">
                    <h5
                      style="
                        margin: 0;
                        font-weight: 700;
                        color: #333;
                        font-size: 1rem;
                        line-height: 1.5;
                      "
                    >
                      Solicitud de registro / revalidación.
                    </h5>
                  </div>
                  <a
                    href="Img/ANEXO I - IA.docx"
                    download
                    style="
                      white-space: nowrap;
                      background-color: #ab0a3d;
                      color: white;
                      padding: 12px 25px;
                      border-radius: 5px;
                      text-decoration: none;
                      font-weight: 700;
                      font-size: 0.85rem;
                      border: 1px solid #ab0a3d;
                      transition: 0.3s;
                      min-width: 140px;
                      text-align: center;
                      display: inline-block;
                    "
                  >
                    ANEXO I
                  </a>
                </div>

                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 0;
                    border-bottom: 1px solid #eee;
                  "
                >
                  <div style="padding-right: 25px; text-align: justify">
                    <h5
                      style="
                        margin: 0;
                        font-weight: 700;
                        color: #333;
                        font-size: 1rem;
                        line-height: 1.5;
                      "
                    >
                      Carta bajo protesta de decir verdad de no estar impedido
                      para contratar (Art. 77 Ley de Adquisiciones y Art. 69-B
                      CFF).
                    </h5>
                  </div>
                  <a
                    href="Img/ANEXO II.docx"
                    download
                    style="
                      white-space: nowrap;
                      background-color: #ab0a3d;
                      color: white;
                      padding: 12px 25px;
                      border-radius: 5px;
                      text-decoration: none;
                      font-weight: 700;
                      font-size: 0.85rem;
                      border: 1px solid #ab0a3d;
                      transition: 0.3s;
                      min-width: 140px;
                      text-align: center;
                      display: inline-block;
                    "
                  >
                    ANEXO II
                  </a>
                </div>

                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 0;
                    border-bottom: 1px solid #eee;
                  "
                >
                  <div style="padding-right: 25px; text-align: justify">
                    <h5
                      style="
                        margin: 0;
                        font-weight: 700;
                        color: #333;
                        font-size: 1rem;
                        line-height: 1.5;
                      "
                    >
                      Carta de manifiesto bajo protesta de decir verdad de no
                      estar inhabilitado para procedimientos de adjudicación.
                    </h5>
                  </div>
                  <a
                    href="Img/ANEXO III.docx"
                    download
                    style="
                      white-space: nowrap;
                      background-color: #ab0a3d;
                      color: white;
                      padding: 12px 25px;
                      border-radius: 5px;
                      text-decoration: none;
                      font-weight: 700;
                      font-size: 0.85rem;
                      border: 1px solid #ab0a3d;
                      transition: 0.3s;
                      min-width: 140px;
                      text-align: center;
                      display: inline-block;
                    "
                  >
                    ANEXO III
                  </a>
                </div>

                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 0;
                    border-bottom: 1px solid #eee;
                  "
                >
                  <div style="padding-right: 25px; text-align: justify">
                    <h5
                      style="
                        margin: 0;
                        font-weight: 700;
                        color: #333;
                        font-size: 1rem;
                        line-height: 1.5;
                      "
                    >
                      Carta de manifiesto de no desempeñar cargo público o
                      incurrir en conflicto de interés con la Administración
                      Pública Municipal.
                    </h5>
                  </div>
                  <a
                    href="Img/ANEXO IV.docx"
                    download
                    style="
                      white-space: nowrap;
                      background-color: #ab0a3d;
                      color: white;
                      padding: 12px 25px;
                      border-radius: 5px;
                      text-decoration: none;
                      font-weight: 700;
                      font-size: 0.85rem;
                      border: 1px solid #ab0a3d;
                      transition: 0.3s;
                      min-width: 140px;
                      text-align: center;
                      display: inline-block;
                    "
                  >
                    ANEXO IV
                  </a>
                </div>

                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 0;
                    border-bottom: none;
                  "
                >
                  <div style="padding-right: 25px; text-align: justify">
                    <h5
                      style="
                        margin: 0;
                        font-weight: 700;
                        color: #333;
                        font-size: 1rem;
                        line-height: 1.5;
                      "
                    >
                      Carta bajo protesta de decir verdad de encontrarse al
                      corriente de las obligaciones fiscales.
                    </h5>
                  </div>
                  <a
                    href="Img/ANEXO V.docx"
                    download
                    style="
                      white-space: nowrap;
                      background-color: #ab0a3d;
                      color: white;
                      padding: 12px 25px;
                      border-radius: 5px;
                      text-decoration: none;
                      font-weight: 700;
                      font-size: 0.85rem;
                      border: 1px solid #ab0a3d;
                      transition: 0.3s;
                      min-width: 140px;
                      text-align: center;
                      display: inline-block;
                    "
                  >
                    ANEXO V
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="ModalPreguntas"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div
            class="modal-content"
            style="
              border-radius: 12px;
              overflow: hidden;
              border: none;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            "
          >
            <div
              class="modal-header"
              style="
                background-color: #ab0a3d;
                color: white;
                padding: 35px 30px;
                border: none;
                position: relative;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                style="
                  position: absolute;
                  right: 20px;
                  top: 15px;
                  color: white;
                  opacity: 1;
                  font-size: 32px;
                  border: none;
                  background: none;
                  cursor: pointer;
                "
              >
                &times;
              </button>

              <h2
                style="
                  margin: 0;
                  font-family: &quot;Montserrat&quot;, sans-serif;
                  font-weight: 800;
                  text-transform: uppercase;
                  font-size: 1.7rem;
                  letter-spacing: 1px;
                "
              >
                PREGUNTAS FRECUENTES
              </h2>
            </div>

            <div
              class="modal-body"
              style="
                padding: 40px;
                font-family: &quot;Montserrat&quot;, sans-serif;
                background-color: #ffffff;
                max-height: 70vh;
                overflow-y: auto;
              "
            >
              <div class="faq-container">
                <div
                  style="
                    margin-bottom: 25px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 15px;
                  "
                >
                  <h4
                    style="
                      color: #ab0a3d;
                      font-weight: 700;
                      font-size: 1.1rem;
                      margin-bottom: 10px;
                    "
                  >
                    1. ¿Cuál es el dato que debo ingresar como usuario para
                    iniciar sesión?
                  </h4>
                  <p style="margin-left: 20px; color: #555; line-height: 1.6">
                    El RFC de la persona física o moral.
                  </p>
                </div>

                <div
                  style="
                    margin-bottom: 25px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 15px;
                  "
                >
                  <h4
                    style="
                      color: #ab0a3d;
                      font-weight: 700;
                      font-size: 1.1rem;
                      margin-bottom: 10px;
                    "
                  >
                    2. ¿Cómo puedo recuperar mi contraseña?
                  </h4>
                  <p style="margin-left: 20px; color: #555; line-height: 1.6">
                    En su cuenta, presione el botón
                    <strong>“¿Olvidaste tu contraseña?”</strong>.
                  </p>
                </div>

                <div
                  style="
                    margin-bottom: 25px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 15px;
                  "
                >
                  <h4
                    style="
                      color: #ab0a3d;
                      font-weight: 700;
                      font-size: 1.1rem;
                      margin-bottom: 10px;
                    "
                  >
                    3. Si no tengo acceso al correo registrado, ¿cómo puedo
                    cambiarlo?
                  </h4>
                  <p
                    style="
                      margin-left: 20px;
                      color: #555;
                      line-height: 1.6;
                      text-align: justify;
                    "
                  >
                    Debe enviar una solicitud al correo institucional, dirigida
                    a la <strong>Contraloría Municipal</strong>, exponiendo el
                    motivo del cambio e indicando el nuevo correo. La solicitud
                    debe estar firmada por el representante legal y adjuntar:
                  </p>
                  <div
                    style="
                      margin-left: 40px;
                      margin-top: 10px;
                      font-size: 0.95rem;
                      color: #555;
                    "
                  >
                    <p>
                      <strong>Persona Moral:</strong> Acta Constitutiva, Poder
                      Notarial, Constancia de Situación Fiscal (vigencia 30
                      días), Comprobante de Domicilio (vigencia 3 meses) e INE
                      vigente.
                    </p>
                    <p>
                      <strong>Persona Física:</strong> Acta de Nacimiento,
                      Constancia de Situación Fiscal (vigencia 30 días),
                      Comprobante de Domicilio (vigencia 3 meses) e INE vigente.
                    </p>
                  </div>
                </div>

                <div
                  style="
                    margin-bottom: 25px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 15px;
                  "
                >
                  <h4
                    style="
                      color: #ab0a3d;
                      font-weight: 700;
                      font-size: 1.1rem;
                      margin-bottom: 10px;
                    "
                  >
                    4. ¿En qué tiempo obtengo respuesta a mi solicitud?
                  </h4>
                  <p style="margin-left: 20px; color: #555; line-height: 1.6">
                    De <strong>1 a 3 días hábiles</strong>. En caso de
                    observaciones, el tiempo se reinicia al momento de
                    solventarlas.
                  </p>
                </div>

                <div
                  style="
                    margin-bottom: 25px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 15px;
                  "
                >
                  <h4
                    style="
                      color: #ab0a3d;
                      font-weight: 700;
                      font-size: 1.1rem;
                      margin-bottom: 10px;
                    "
                  >
                    5. ¿Que pasa si no atiendo las observaciones en el tiempo
                    establecido?
                  </h4>
                  <p style="margin-left: 20px; color: #555; line-height: 1.6">
                    En caso de no atender las observaciones, el trámite se
                    cancela y debes volver a iniciarlo.
                  </p>
                </div>

                <div
                  style="
                    margin-bottom: 25px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 15px;
                  "
                >
                  <h4
                    style="
                      color: #ab0a3d;
                      font-weight: 700;
                      font-size: 1.1rem;
                      margin-bottom: 10px;
                    "
                  >
                    6. ¿Cómo puedo verificar si mi registro está vigente?
                  </h4>
                  <p style="margin-left: 20px; color: #555; line-height: 1.6">
                    Ingrese a
                    <a
                      href="http://127.0.0.1:5501/index.html"
                      target="_blank"
                      style="color: #ab0a3d"
                      >proveedores.atlixco.mx</a
                    >
                    y en el apartado de Consultar, haga clic en
                    <strong>"Padrón 2026"</strong>.
                  </p>
                </div>

                <div
                  style="
                    margin-bottom: 25px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 15px;
                  "
                >
                  <h4
                    style="
                      color: #ab0a3d;
                      font-weight: 700;
                      font-size: 1.1rem;
                      margin-bottom: 10px;
                    "
                  >
                    7. ¿En qué se basan para rechazar los giros y líneas
                    seleccionados?
                  </h4>
                  <p
                    style="
                      margin-left: 20px;
                      color: #555;
                      line-height: 1.6;
                      text-align: justify;
                    "
                  >
                    Se basan estrictamente en las
                    <strong>actividades económicas</strong> registradas en su
                    Constancia de Situación Fiscal (SAT).
                  </p>
                  <div
                    style="
                      margin-left: 40px;
                      margin-top: 10px;
                      font-size: 0.85rem;
                      color: #777;
                      background: #f9f9f9;
                      padding: 15px;
                      border-radius: 8px;
                    "
                  >
                    <strong>FUNDAMENTO LEGAL:</strong><br />
                    Código Fiscal de la Federación, Art. 17-D y 27.<br />
                    Reglamento del CFF, Art. 29 y 30.
                  </div>
                </div>

                <div style="margin-bottom: 15px">
                  <h4
                    style="
                      color: #ab0a3d;
                      font-weight: 700;
                      font-size: 1.1rem;
                      margin-bottom: 5px;
                    "
                  >
                    8. ¿Cuál es la vigencia de mi registro?
                  </h4>
                  <p
                    style="margin-left: 20px; color: #555; margin-bottom: 15px"
                  >
                    De la fecha de inscripción al 31 de diciembre del año en
                    curso.
                  </p>

                  <h4
                    style="
                      color: #ab0a3d;
                      font-weight: 700;
                      font-size: 1.1rem;
                      margin-bottom: 5px;
                    "
                  >
                    9. ¿Cuándo puedo renovar mi registro?
                  </h4>
                  <p
                    style="margin-left: 20px; color: #555; margin-bottom: 15px"
                  >
                    A partir del 1 de enero del siguiente año.
                  </p>

                  <h4
                    style="
                      color: #ab0a3d;
                      font-weight: 700;
                      font-size: 1.1rem;
                      margin-bottom: 5px;
                    "
                  >
                    10. ¿Puedo modificar mi registro ya estando empadronado?
                  </h4>
                  <p
                    style="margin-left: 20px; color: #555; margin-bottom: 15px"
                  >
                    Sí, en la opción:
                    <strong>Mi cuenta / Actualizar datos</strong>.
                  </p>

                  <h4
                    style="
                      color: #ab0a3d;
                      font-weight: 700;
                      font-size: 1.1rem;
                      margin-bottom: 5px;
                    "
                  >
                    11. ¿Cómo imprimo mi cédula de inscripción?
                  </h4>
                  <p style="margin-left: 20px; color: #555">
                    En la opción:
                    <strong>Mi cuenta / Estado de su perfil</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
`;

// Inyectar los modales al body
document.body.insertAdjacentHTML("beforeend", modalesPadron);

// Usamos delegación de eventos para evitar errores de carga
document.addEventListener("submit", async (e) => {
  if (e.target && e.target.id === "FormRegistro") {
    e.preventDefault();
    const form = e.target;

    // Captura de datos
    const rfc = form
      .querySelector('input[name="rfc"]')
      .value.trim()
      .toUpperCase();
    const correoReal = form.querySelector('input[name="correo"]').value.trim();
    const tipoPersona = form.querySelector(
      'input[name="tipo-persona"]:checked',
    )?.value;
    const password = form.querySelector('input[name="pwd"]').value;

    try {
      // A. Crear el usuario en Authentication
      const { data, error: authError } = await _supabase.auth.signUp({
        email: `${rfc}@proveedor.com`,
        password: password,
      });

      if (authError) throw authError;

      // B. Insertar manualmente en la tabla proveedores
      // Esto reemplaza al Trigger que te fallaba
      const { error: dbError } = await _supabase.from("proveedores").insert([
        {
          id: data.user.id,
          rfc: rfc,
          correo_contacto: correoReal,
          tipo_persona: tipoPersona,
        },
      ]);

      if (dbError) throw dbError;

      alert("¡Registro exitoso! Los datos se guardaron en el padrón.");
      $("#ModalRegistro").modal("hide");
      form.reset();
    } catch (err) {
      alert("Error: " + err.message);
      console.error(err);
    }
  }
});
