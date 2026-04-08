from flask import Flask, render_template, request, jsonify
import os
from datetime import datetime

# =========================
# IMPORT DB SOLO SI NO SE SALTA
# =========================
SKIP_DB = os.environ.get("SKIP_DB", "0") == "1"

if not SKIP_DB:
    import psycopg2

app = Flask(__name__)

# =========================
# DB CONNECTION
# =========================
def get_db_connection():
    if SKIP_DB:
        print("⚠️ DB connection skipped (SKIP_DB=1)")
        return None
    try:
        conn = psycopg2.connect(
            os.environ.get("DATABASE_URL"),
            sslmode="require"
        )
        return conn
    except Exception as e:
        print("❌ Error conectando a DB:", str(e))
        return None

# =========================
# INIT TABLE
# =========================
def init_db():
    if SKIP_DB:
        print("⚠️ DB initialization skipped (SKIP_DB=1)")
        return

    conn = get_db_connection()
    if conn is None:
        print("⚠️ No se pudo inicializar la DB")
        return

    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS resultados (
        id SERIAL PRIMARY KEY,
        nombre TEXT,
        correo TEXT,
        dominante TEXT,
        azul INT,
        rojo INT,
        verde INT,
        amarillo INT,
        fecha TIMESTAMP
    );
    """)
    conn.commit()
    cur.close()
    conn.close()
    print("✅ Tabla verificada/creada")

# =========================
# HOME
# =========================
@app.route("/")
def index():
    return render_template("index.html")

# =========================
# GUARDAR RESULTADO
# =========================
@app.route("/guardar-resultado", methods=["POST"])
def guardar_resultado():
    try:
        data = request.json
        nombre = data.get("nombre")
        correo = data.get("correo")
        dominante = data.get("dominante")
        totales = data.get("totales", {})

        if not nombre or not correo or not dominante:
            return jsonify({"error": "Datos incompletos"}), 400

        if SKIP_DB:
            print(f"📊 Resultado recibido (sin DB): {nombre} - {dominante} - {totales}")
            return jsonify({"ok": True})

        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "DB no disponible"}), 500

        cur = conn.cursor()
        cur.execute("""
        INSERT INTO resultados 
        (nombre, correo, dominante, azul, rojo, verde, amarillo, fecha)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            nombre,
            correo,
            dominante,
            totales.get("azul", 0),
            totales.get("rojo", 0),
            totales.get("verde", 0),
            totales.get("amarillo", 0),
            datetime.now()
        ))
        conn.commit()
        cur.close()
        conn.close()

        print(f"📊 Resultado guardado: {nombre} - {dominante}")
        return jsonify({"ok": True})

    except Exception as e:
        print("❌ Error guardando:", str(e))
        return jsonify({"error": str(e)}), 500

# =========================
# VER RESULTADOS
# =========================
@app.route("/resultados", methods=["GET"])
def ver_resultados():
    if SKIP_DB:
        return jsonify({"info": "DB no disponible temporalmente"})

    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "DB no disponible"}), 500

        cur = conn.cursor()
        cur.execute("""
        SELECT nombre, correo, dominante, azul, rojo, verde, amarillo, fecha
        FROM resultados
        ORDER BY fecha DESC
        LIMIT 50
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        resultados = []
        for r in rows:
            resultados.append({
                "nombre": r[0],
                "correo": r[1],
                "dominante": r[2],
                "azul": r[3],
                "rojo": r[4],
                "verde": r[5],
                "amarillo": r[6],
                "fecha": str(r[7])
            })
        return jsonify(resultados)

    except Exception as e:
        print("❌ Error consultando:", str(e))
        return jsonify({"error": str(e)}), 500

# =========================
# HEALTH CHECK
# =========================
@app.route("/health")
def health():
    return {"status": "ok"}

# =========================
# INIT APP (🔥 ARREGLADO)
# =========================
if not SKIP_DB:
    init_db()

# =========================
# RUN
# =========================
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )