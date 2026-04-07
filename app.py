from flask import Flask, render_template
import os

app = Flask(__name__)

# =========================
# HOME
# =========================
@app.route("/")
def index():
    return render_template("index.html")


# =========================
# HEALTH CHECK (RENDER)
# =========================
@app.route("/health")
def health():
    return {"status": "ok"}


# =========================
# RUN
# =========================
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )