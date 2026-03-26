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

    data = request.json

    nombre = data["nombre"]
    correo_destino = data["correo"]
    pdf_base64 = data["pdf"]

    # 🔥 limpiar base64
    pdf_base64 = pdf_base64.split(",")[1]
    pdf_bytes = base64.b64decode(pdf_base64)

    msg = EmailMessage()
    msg["Subject"] = "Tu perfil cognitivo - Kreios"
    msg["From"] = "TU_CORREO@gmail.com"
    msg["To"] = correo_destino

    msg.set_content(f"""
Hola {nombre},

Adjunto encontrarás tu resultado del Test de Perfil Cognitivo.

Gracias por confiar en Kreios.
""")

    msg.add_attachment(
        pdf_bytes,
        maintype="application",
        subtype="pdf",
        filename="perfil_cognitivo.pdf"
    )

    # 🔥 CONFIG GMAIL
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login("kreiosconsultoria@gmail.com", "yukmezqrtuqhqekc")
        server.send_message(msg)

    return jsonify({"ok": True})


# =========================
# RUN (IMPORTANTE PARA RENDER)
# =========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))