from flask import Flask, render_template, request, jsonify
import base64
import os
import requests

app = Flask(__name__)

# =========================
# HOME
# =========================
@app.route("/")
def index():
    return render_template("index.html")


# =========================
# ENVIAR PDF (BREVO)
# =========================
@app.route("/enviar-pdf", methods=["POST"])
def enviar_pdf():
    try:
        data = request.json

        nombre = data.get("nombre")
        correo_destino = data.get("correo")
        pdf_base64 = data.get("pdf")

        print("📩 Datos recibidos:", nombre, correo_destino)

        if not nombre or not correo_destino or not pdf_base64:
            return jsonify({"error": "Datos incompletos"}), 400

        # 🔥 limpiar base64
        pdf_base64 = pdf_base64.split(",")[1]
        pdf_bytes = base64.b64decode(pdf_base64)

        # 🔐 ENV
        BREVO_API_KEY = os.environ.get("BREVO_API_KEY")
        EMAIL_USER = os.environ.get("EMAIL_USER")

        if not BREVO_API_KEY or not EMAIL_USER:
            return jsonify({"error": "Faltan variables de entorno"}), 500

        print("📤 Enviando correo con Brevo...")

        url = "https://api.brevo.com/v3/smtp/email"

        headers = {
            "accept": "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json"
        }

        payload = {
            "sender": {
                "name": "Kreios",
                "email": EMAIL_USER
            },
            "to": [
                {
                    "email": correo_destino,
                    "name": nombre
                }
            ],
            "subject": "Mapa de Preferencias Hemisféricas - Kreios",
            "htmlContent": f"""
            <html>
                <body>
                    <p>Hola {nombre},</p>
                    <p>Adjunto encontrarás tu resultado del test.</p>
                    <p>Gracias por confiar en <b>Kreios</b>.</p>
                </body>
            </html>
            """,
            "attachment": [
                {
                    "content": base64.b64encode(pdf_bytes).decode("utf-8"),
                    "name": "perfil_cognitivo.pdf"
                }
            ]
        }

        response = requests.post(url, json=payload, headers=headers)

        print("📨 Respuesta Brevo:", response.text)

        if response.status_code not in [200, 201]:
            return jsonify({"error": response.text}), 500

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