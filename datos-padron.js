/* ============================================================
   BASE DE DATOS COMPLETA: GIROS Y LÍNEAS
   ============================================================ */
const datosCompletos = {
  1: {
    nombre: "AGROPECUARIA (COMPRA-VENTA)",
    lineas: [
      "Equipo y accesorios",
      "Maquinaria",
      "Fertilizantes",
      "Agroquímicos",
      "Plaguicidas e insecticidas",
      "Semillas y granos alimenticios",
    ],
  },
  2: {
    nombre: "AIRE ACONDICIONADO Y REFRIGERACIÓN (COMPRA-VENTA)",
    lineas: [
      "Accesorios y refacciones",
      "Acondicionadores de aire",
      "Equipos industriales de refrigeración",
      "Equipos industriales de ventilación",
    ],
  },
  3: {
    nombre: "EQUIPO PARA LA PREVENCIÓN DE SINIESTROS (COMPRA-VENTA)",
    lineas: [
      "Alarmas",
      "Detectores de humo y fuego",
      "Extinguidores",
      "Señalizaciones para inmuebles",
    ],
  },
  4: {
    nombre:
      "ABARROTES, ALIMENTOS Y PRODUCTOS VARIOS PARA EL CONSUMO (COMPRA-VENTA)",
    lineas: [
      "Alimentos y suplementos naturales",
      "Alimentos para animales y mascotas",
      "Abarrotes",
      "Bolsas, envases y utensilios desechables",
      "Carnes rojas",
      "Canastas navideñas",
      "Despensas",
      "Dulces típicos",
      "Huevo de gallina",
      "Agua purificada y hielo",
      "Frutas y verduras",
      "Lácteos y carnes frías",
      "Pan y pastelería",
      "Pescados y mariscos",
      "Vinos y licores",
      "Tortillas",
      "Productos de invernadero",
    ],
  },
  5: {
    nombre:
      "ARTÍCULOS DE PAPELERÍA, DE OFICINA, CONSUMIBLES Y LIBROS (COMPRA-VENTA)",
    lineas: [
      "Artículos de papelería y oficina",
      "Artículos y material didáctico",
      "Consumibles y accesorios para cómputo",
      "Libros, revistas y periódicos",
      "Formas continuas",
      "Ingeniería y dibujo",
    ],
  },
  6: {
    nombre: "EQUIPO DE CÓMPUTO, COMUNICACIONES Y ACCESORIOS (COMPRA-VENTA)",
    lineas: [
      "Equipo de cómputo y periféricos",
      "Equipo de telecomunicación",
      "Equipo de fotocopiado y accesorios",
      "Software y licencias",
    ],
  },
  7: {
    nombre:
      "EQUIPO MÉDICO, DE LABORATORIO, INSTRUMENTAL, MATERIAL DE CURACIÓN Y MEDICAMENTOS (COMPRA-VENTA)",
    lineas: [
      "Equipo médico y dental",
      "Instrumental médico",
      "Material de curación",
      "Medicamentos y productos farmacéuticos",
      "Equipo de laboratorio",
      "Muebles para consultorio",
    ],
  },
  8: {
    nombre:
      "MAQUINARIA, EQUIPO, ACCESORIOS Y REFACCIONES AGROPECUARIOS, INDUSTRIALES Y PARA LA CONSTRUCCIÓN (COMPRA-VENTA)",
    lineas: [
      "Maquinaria pesada",
      "Equipo agropecuario",
      "Maquinaria para construcción",
      "Refacciones y accesorios",
      "Herramientas industriales",
    ],
  },
  9: {
    nombre:
      "VEHÍCULOS TERRESTRES, AEROPORTUARIOS Y MARÍTIMOS, REFACCIONES Y ACCESORIOS (COMPRA-VENTA)",
    lineas: [
      "Automóviles y camiones",
      "Llantas y cámaras",
      "Refacciones y accesorios automotrices",
      "Equipo aeroportuario",
      "Embarcaciones y equipo marítimo",
    ],
  },
  10: {
    nombre: "MATERIAL ELÉCTRICO Y ELECTRÓNICO (COMPRA-VENTA)",
    lineas: [
      "Material eléctrico",
      "Componentes electrónicos",
      "Equipo de iluminación",
      "Transformadores y motores",
    ],
  },
  11: {
    nombre: "MATERIALES Y ARTÍCULOS PARA LA CONSTRUCCIÓN (COMPRA-VENTA)",
    lineas: [
      "Cemento, cal y yeso",
      "Madera y herrajes",
      "Pinturas e impermeabilizantes",
      "Pisos y azulejos",
      "Vidrio y cristalería",
      "Plomería y baños",
    ],
  },
  12: {
    nombre:
      "MUEBLES, EQUIPO Y ACCESORIOS DE OFICINA Y RESIDENCIALES (COMPRA-VENTA)",
    lineas: [
      "Muebles de oficina",
      "Muebles para el hogar",
      "Artículos de decoración",
      "Alfombras y persianas",
    ],
  },
  13: {
    nombre: "ROPA, TEXTILES Y CALZADO (COMPRA-VENTA)",
    lineas: [
      "Calzado y marroquinería",
      "Ropa de trabajo y uniformes",
      "Telas y artículos de mercería",
    ],
  },
  14: {
    nombre: "COMBUSTIBLES, LUBRICANTES Y ADITIVOS (COMPRA-VENTA)",
    lineas: [
      "Gasolina y Diesel",
      "Gas L.P. y Natural",
      "Aceites, grasas y lubricantes",
    ],
  },
  15: {
    nombre: "PRODUCTOS QUÍMICOS Y FARMACÉUTICOS (COMPRA-VENTA)",
    lineas: [
      "Gases industriales",
      "Oxígeno medicinal",
      "Productos químicos básicos",
    ],
  },
  16: {
    nombre: "ARTÍCULOS DEPORTIVOS (COMPRA-VENTA)",
    lineas: [
      "Equipo para gimnasio",
      "Artículos deportivos varios",
      "Trofeos y medallas",
    ],
  },
  17: {
    nombre: "INSTRUMENTOS MUSICALES, ACCESORIOS Y REFACCIONES (COMPRA-VENTA)",
    lineas: [
      "Instrumentos de viento, cuerda y percusión",
      "Accesorios y partituras",
    ],
  },
  18: {
    nombre: "JOYERÍA, RELOJERÍA Y ARTÍCULOS DE REGALO (COMPRA-VENTA)",
    lineas: [
      "Artículos de plata y joyería",
      "Relojes",
      "Artículos de regalo y novedades",
    ],
  },
  19: {
    nombre: "JUGUETES Y ARTÍCULOS DE ENTRETENIMIENTO (COMPRA-VENTA)",
    lineas: ["Juguetes educativos", "Artículos de fiesta", "Videojuegos"],
  },
  20: {
    nombre: "ARTÍCULOS FOTOGRÁFICOS Y DE VIDEO (COMPRA-VENTA)",
    lineas: [
      "Cámaras fotográficas y de video",
      "Accesorios de grabación",
      "Equipo de revelado",
    ],
  },
  21: {
    nombre: "ÓPTICA Y ACCESORIOS (COMPRA-VENTA)",
    lineas: ["Armazones y lentes", "Equipo de diagnóstico óptico"],
  },
  22: {
    nombre: "PRODUCTOS DE MADERA Y DERIVADOS (COMPRA-VENTA)",
    lineas: ["Triplay y aglomerados", "Postes y polines"],
  },
  23: {
    nombre: "PRODUCTOS DE PAPEL, CARTÓN Y PLÁSTICO (COMPRA-VENTA)",
    lineas: [
      "Bolsas y envases de plástico",
      "Cajas de cartón",
      "Servilletas y papel higiénico",
    ],
  },
  24: {
    nombre: "FLORES, PLANTAS Y ARTÍCULOS DE JARDINERÍA (COMPRA-VENTA)",
    lineas: [
      "Plantas de ornato y árboles",
      "Tierra y abono",
      "Macetas y herramientas de jardín",
    ],
  },
  25: {
    nombre: "FERRETERÍA, TLAPALERÍA Y ACEROS (COMPRA-VENTA)",
    lineas: [
      "Herramienta manual y eléctrica",
      "Aceros y perfiles",
      "Tlapalería en general",
    ],
  },
  26: {
    nombre: "ARTÍCULOS DE BELLEZA Y PERFUMERÍA (COMPRA-VENTA)",
    lineas: ["Perfumes y lociones", "Cosméticos y cuidado de la piel"],
  },
  27: {
    nombre: "ANIMALES Y MASCOTAS (COMPRA-VENTA)",
    lineas: ["Mascotas", "Aves de corral y ganado"],
  },
  28: {
    nombre: "SERVICIOS COMERCIALES",
    lineas: [
      "Agencias de viajes",
      "Servicios de limpieza",
      "Servicios de vigilancia",
      "Publicidad y medios",
    ],
  },
  29: {
    nombre: "SERVICIOS DE ARRENDAMIENTO",
    lineas: [
      "Renta de inmuebles",
      "Renta de maquinaria",
      "Renta de vehículos",
      "Renta de mobiliario para eventos",
    ],
  },
  30: {
    nombre: "SERVICIOS DE ASESORÍA Y CONSULTORÍA",
    lineas: [
      "Asesoría jurídica",
      "Consultoría administrativa",
      "Auditoría financiera",
    ],
  },
  31: {
    nombre: "SERVICIOS DE CONSTRUCCIÓN Y OBRA PÚBLICA",
    lineas: [
      "Construcción de edificios",
      "Obra civil y pavimentación",
      "Instalaciones eléctricas",
    ],
  },
  32: {
    nombre: "SERVICIOS DE HOSPEDAJE Y ALIMENTACIÓN",
    lineas: ["Hoteles", "Servicio de banquetes", "Restaurantes y cafeterías"],
  },
  33: {
    nombre: "SERVICIOS DE LABORATORIO",
    lineas: ["Análisis clínicos", "Pruebas de calidad de materiales"],
  },
  34: {
    nombre: "SERVICIOS DE MANTENIMIENTO Y REPARACIÓN DE EQUIPOS",
    lineas: [
      "Mantenimiento automotriz",
      "Reparación de climas",
      "Mantenimiento de edificios",
    ],
  },
  35: {
    nombre: "SERVICIOS DE PUBLICIDAD Y COMUNICACIÓN",
    lineas: [
      "Diseño gráfico",
      "Producción de radio y TV",
      "Manejo de redes sociales",
    ],
  },
  36: {
    nombre: "SERVICIOS PROFESIONALES Y TÉCNICOS",
    lineas: [
      "Servicios de ingeniería",
      "Servicios de arquitectura",
      "Servicios de capacitación",
    ],
  },
  37: {
    nombre: "SERVICIOS PÚBLICOS Y DE TELECOMUNICACIONES",
    lineas: ["Servicio de agua", "Energía eléctrica", "Internet y telefonía"],
  },
  38: {
    nombre: "SERVICIOS VARIOS",
    lineas: ["Servicios funerarios", "Servicios de mensajería", "Fumigaciones"],
  },
  39: {
    nombre: "SERVICIOS DE PERITAJE",
    lineas: ["Peritajes de obra", "Peritajes contables", "Valuación de bienes"],
  },
  40: {
    nombre: "TALLERES DE REPARACIÓN Y MANUFACTURA",
    lineas: ["Carpintería", "Herrería", "Imprenta y encuadernación"],
  },
  41: {
    nombre: "SERVICIOS DE TRANSPORTE",
    lineas: [
      "Transporte de carga",
      "Transporte de pasajeros",
      "Fletes y mudanzas",
    ],
  },
  42: {
    nombre: "ASISTENCIAL SOCIAL",
    lineas: ["Servicios de asistencia social", "Donaciones"],
  },
  43: {
    nombre: "FABRICACIÓN Y PRODUCCIÓN",
    lineas: ["Fabricación de estructuras metálicas", "Fabricación de anuncios"],
  },
  44: {
    nombre: "ARTÍCULOS PARA LA NAVEGACIÓN AÉREA (COMPRA-VENTA)",
    lineas: ["Refacciones para aviones", "Mantenimiento aeronáutico"],
  },
  45: {
    nombre: "PANELES SOLARES",
    lineas: ["Paneles fotovoltaicos", "Inversores y baterías"],
  },
  46: {
    nombre: "COMERCIO AL POR MAYOR DE MATERIALES DE DESECHO",
    lineas: ["Reciclaje de metales", "Reciclaje de papel"],
  },
  47: {
    nombre:
      "COMERCIO AL POR MENOR DE MASCOTAS, REGALOS, ARTÍCULOS RELIGIOSOS, ARTESANÍAS",
    lineas: ["Tiendas de mascotas", "Tiendas de artesanías"],
  },
  48: {
    nombre: "OTROS GIROS NO ESPECIFICADOS",
    lineas: ["Otros servicios no clasificados"],
  },
};
