from flask import Flask, render_template, request, jsonify
import smtplib
from email.message import EmailMessage
import base64
import os

app = Flask(__name__)

# =========================
# HOME
# =========================
@app.route("/")
def index():
    return render_template("index.html")


# =========================
# ENVIAR PDF
# =========================
@app.route("/enviar-pdf", methods=["POST"])
def enviar_pdf():

    try:
        # 🔥 FIX RENDER (JSON seguro)
        data = request.get_json(silent=True)

        if not data:
            print("❌ No llegó JSON")
            return jsonify({"error": "No data received"}), 400

        nombre = data.get("nombre")
        correo_destino = data.get("correo")
        pdf_base64 = data.get("pdf")

        print("📩 Datos recibidos:", nombre, correo_destino)

        if not nombre or not correo_destino or not pdf_base64:
            print("❌ Datos incompletos")
            return jsonify({"error": "Datos incompletos"}), 400

        # 🔥 limpiar base64
        if "," in pdf_base64:
            pdf_base64 = pdf_base64.split(",")[1]

        pdf_bytes = base64.b64decode(pdf_base64)

        # 🔐 VARIABLES DE ENTORNO
        EMAIL_USER = os.environ.get("EMAIL_USER")
        EMAIL_PASS = os.environ.get("EMAIL_PASS")

        if not EMAIL_USER or not EMAIL_PASS:
            print("❌ Faltan variables de entorno")
            return jsonify({"error": "Faltan variables de entorno"}), 500

        # 📧 CREAR EMAIL
        msg = EmailMessage()
        msg["Subject"] = "Mapa de Preferencias Hemisféricas - Kreios"
        msg["From"] = EMAIL_USER
        msg["To"] = correo_destino

        # 🔥 mejora entregabilidad
        msg["Reply-To"] = EMAIL_USER

        msg.set_content(f"""
Hola {nombre},

Te compartimos tu resultado del Test de Preferencias Hemisféricas.

Gracias por confiar en Kreios.
""")

        msg.add_attachment(
            pdf_bytes,
            maintype="application",
            subtype="pdf",
            filename="perfil_cognitivo.pdf"
        )

        # 🔥 SMTP GMAIL
        print("📤 Enviando correo...")
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=30) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)

        print("✅ Correo enviado correctamente")

        return jsonify({"ok": True})

    except Exception as e:
        print("❌ Error enviando correo:", str(e))
        return jsonify({"error": str(e)}), 500


# =========================
# RUN
# =========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))