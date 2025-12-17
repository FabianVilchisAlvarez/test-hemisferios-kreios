from flask import Flask, render_template
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static"),
    static_url_path="/static"
)

# ======================
# MAPAS
# ======================
maps = {
    1: {
        "azul": [
            "CIENTÍFICO", "MATEMÁTICO", "ESTADÍSTICO", "INVENTA",
            "DESCUBRIDOR DE PROBLEMAS", "LÓGICO", "ANALÍTICO",
            "SOLUCIONADOR LÓGICO DE PROBLEMAS", "ARTICULADO",
            "DIAGNOSTICADOR", "CONSTRUCTOR"
        ],
        "amarillo": [
            "IDEADOR", "EXPERIMENTAL", "INVENTA", "IMAGINATIVO",
            "SINTETIZADOR", "INTEGRADOR", "CONCEPTUALIZADOR",
            "ESTRATEGA", "INNOVADOR", "DISEÑADOR", "INTUITIVO",
            "SOLUCIONADOR INTUITIVO DE PROBLEMAS", "KINESTÉSICO",
            "CONSTRUCTOR"
        ],
        "verde": [
            "MANUAL", "PLANEADOR", "PLANEADOR OPERATIVO",
            "IMPLEMENTADOR", "PUNTUAL", "IMPLEMENTADOR REPETITIVO",
            "SECUENCIAL", "ORGANIZADOR", "DETALLADO"
        ],
        "rojo": [
            "EXPRESIVO", "PRECEPTIVO", "SOCIAL", "TACTIL", "MUSICAL",
            "SENSIBLE", "CUIDADOSO", "APOYADOR"
        ]
    },

    2: {
        "azul": [
            "TEÓRICO", "INVESTIGADOR", "ABSTRACTO", "COGNITIVO",
            "ARQUITECTO", "COMPUTARIZADO", "CIENTÍFICO", "TÉCNICO",
            "FINANCIERO", "DIAGNOSTICADOR", "CRÍTICO", "RETADOR",
            "DIRIGE", "COCUMENTADO", "CONSTRUCTOR"
        ],
        "amarillo": [
            "TEÓRICO", "INVESTIGADOR", "ABSTRACTO", "COGNITIVO",
            "ARQUITECTO", "VISUAL", "IMAGINATIVO", "RIESGOSO",
            "VARIADO", "ARTÍSTICO", "VENDEDOR", "OBSERVADOR",
            "PSICOLÓGICO", "COMUNICADOR", "ENTRETENIDO",
            "CONSTRUCTOR"
        ],
        "verde": [
            "MECÁNICO", "LEGAL", "ARREGLA", "ADMINISTRADO",
            "CATEGORIZADOR", "AGRICULTOR", "DETALLADO", "OFICINISTA",
            "ENSAMBLADOR", "REPETITIVO", "MILITAR", "METÓDICO",
            "CONTROLADOR", "CONCRETO", "DISIPLINADO", "RECLUTADOR",
            "SUPERVISOR", "FÍSICO", "POLICÍA", "SECRETARIAL"
        ],
        "rojo": [
            "FACILITADOR", "MAESTRO", "MUSICAL", "COORDINADOR",
            "TERAPEUTA", "AYUDADOR", "RELACIONADO CON OTROS",
            "CULTIVADOR", "CONCRETO", "DISTRO", "TRANQUILIZADOR",
            "KINESTÉSICO", "ESPIRITUAL", "CRIADOR", "APOYADOR",
            "SANADOR"
        ]
    },

    3: {
        "azul": [
            "TEÓRICO", "INVESTIGADOR", "INVENTIVO", "COMPUTARIZADO",
            "INGENIERO", "PENSAMIENTO RACIONAL", "ANALIZA",
            "RESUELVE PROBLEMAS", "LÓGICO", "FINANCIERO",
            "DIAGNOSTICADOR", "JUSTIFICA", "DIRIGE", "ARTICULA"
        ],
        "amarillo": [
            "INVESTIGADOR", "INVENTIVO", "EXPERIMENTA",
            "VISUALIZADOR", "IMAGINATIVO", "INNOVADOR",
            "SISTEMATIZADO", "ESTRATÉGICO", "CONCEPTUALIZADOR",
            "EMPRENDEDOR EN EL TRABAJO", "LIDER", "VENDE",
            "DISEÑA", "INTUITIVO", "RESUELVE PROBLEMAS",
            "ENTRETENIDO", "COMUNICADOR"
        ],
        "verde": [
            "CONSTRUCTOR", "RECLUTADOR", "ORGANIZADOR",
            "DEFINIDOR DE POLÍTICAS", "PLANEADOR OPERATIVO",
            "PRESENTA", "LIBRO DE MANTENIMIENTO", "CREA PRODUCTORES",
            "SUPERVISOR", "IMPLEMENTA SOLUCIONES", "ADMINISTRADO",
            "CONTROLADOR", "ENTRADA DE DATOS", "VIGILA",
            "PROCESA DATOS"
        ],
        "rojo": [
            "CONSTRUCTOR", "RECLUTADOR", "FACILITADOR", "ENSEÑA",
            "ASESORA", "COORDINADOR", "EXPRESA IDEAS", "ESCUCHA",
            "ESCRIBE", "PERSUASIVO", "SOCIAL", "DETECTA PROBLEMAS",
            "AYUDADOR", "ENTIENDE", "APOYADOR", "SANADOR"
        ]
    }
}

interp = {
    "amarillo": {
        "titulo": "Dominancia Hemisférica Amarilla – Pensamiento Estratégico y Creativo",
        "texto": """
Las personas con dominancia hemisférica amarilla destacan por su pensamiento
estratégico, creatividad e innovación. Tienen una visión global, son capaces
de conectar ideas aparentemente no relacionadas y generar soluciones nuevas
ante escenarios complejos.

Se sienten cómodas ante la ambigüedad, disfrutan del cambio y suelen impulsar
iniciativas de transformación. Son perfiles ideales para liderazgo estratégico,
innovación, diseño de soluciones y desarrollo de nuevos modelos de negocio.
"""
    },
    "azul": {
        "titulo": "Dominancia Hemisférica Azul – Pensamiento Analítico y Lógico",
        "texto": """
La dominancia azul se asocia con el pensamiento lógico, analítico y racional.
Estas personas destacan por su capacidad de análisis profundo, toma de
decisiones basada en datos y estructuración de problemas complejos.

Son metódicas, objetivas y orientadas a resultados medibles. Resultan clave en
roles técnicos, financieros, de planeación, ingeniería y análisis estratégico,
donde la precisión y el razonamiento estructurado son fundamentales.
"""
    },
    "verde": {
        "titulo": "Dominancia Hemisférica Verde – Organización y Ejecución",
        "texto": """
Las personas con dominancia verde sobresalen por su enfoque práctico,
organizado y orientado a la ejecución. Son consistentes, disciplinadas y
altamente confiables para convertir planes en acciones concretas.

Destacan en la implementación de procesos, control operativo, seguimiento
y mejora continua. Son perfiles clave para garantizar estabilidad, eficiencia
y cumplimiento dentro de las organizaciones.
"""
    },
    "rojo": {
        "titulo": "Dominancia Hemisférica Roja – Relación Humana y Comunicación",
        "texto": """
La dominancia roja refleja una fuerte orientación a las personas, la empatía
y la comunicación. Estas personas tienen gran sensibilidad social, capacidad
de escucha y habilidades para generar confianza y cohesión en equipos.

Son fundamentales en liderazgo humano, desarrollo de talento, servicio al
cliente, facilitación y gestión del cambio, ya que conectan emocionalmente
con otros y promueven entornos colaborativos.
"""
    }
}


@app.route("/")
def index():
    return render_template("index.html", maps=maps, interp=interp)

if __name__ == "__main__":
    app.run()
