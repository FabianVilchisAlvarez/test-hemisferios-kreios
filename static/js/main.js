let currentMap = 1;
const selections = {};
let chartInstance = null;

// =======================
// INTERPRETACIONES
// =======================
const INTERPRETACIONES = {
  amarillo: {
    titulo: "Dominancia Hemisférica Cerebral Amarilla – Steve Jobs",
    texto: `
      <p><strong>Hola visionario</strong>, te habla Steve Jobs. Imagina por un momento cómo es tener un cerebro amarillo.
      Hablo de forma figurativa para captar tu atención, pero me refiero a la dominancia del cuadrante D del modelo de Ned Herrmann.</p>

      <p>Los amarillos somos impacientes, inquietos y nos cuesta trabajo encajar en entornos rígidos y conservadores.
      Amamos la innovación, la creatividad y la disrupción, para bien y para mal.</p>

      <p>Necesitamos espacio, libertad, múltiples estímulos y vivir en el futuro. La espontaneidad, el juego
      y la especulación forman parte natural de nuestra manera de ser.</p>

      <h4>🌟 Luces</h4>
      <ul>
        <li>Imagina posibilidades que antes no existían.</li>
        <li>Reta el status quo y mantiene viva la identidad organizacional.</li>
        <li>Integra ideas aparentemente inconexas.</li>
        <li>Mantiene el dinamismo y la adaptación constante.</li>
      </ul>

      <h4>⚠️ Sombras</h4>
      <ul>
        <li>Pierde piso en la viabilidad real de sus ideas.</li>
        <li>Corre riesgos excesivos.</li>
        <li>Todo se vuelve prototipo sin consolidación.</li>
        <li>Inestabilidad y desperdicio de recursos.</li>
      </ul>
    `
  },

  azul: {
    titulo: "Dominancia Hemisférica Cerebral Azul – Mr. Spock",
    texto: `
      <p><strong>Saludos terrícola.</strong> Soy Mr. Spock, procedente del planeta Vulcano.
      Se me solicitó explicar la dominancia cerebral azul (cuadrante A).</p>

      <p>Somos altamente racionales, orientados a hechos, cifras y lógica.
      Lo emocional rara vez es considerado un argumento válido.</p>

      <p>Hablamos directo, sin rodeos. Las cosas son como son.</p>

      <h4>🌟 Luces</h4>
      <ul>
        <li>Desarrolla métricas, indicadores y modelos sólidos.</li>
        <li>Aporta fundamentos técnicos a las decisiones.</li>
        <li>Balancea la emoción con datos.</li>
        <li>Garantiza rentabilidad y viabilidad.</li>
      </ul>

      <h4>⚠️ Sombras</h4>
      <ul>
        <li>Arrogancia intelectual.</li>
        <li>Frialdad emocional.</li>
        <li>Visión limitada al corto plazo.</li>
        <li>Escepticismo paralizante.</li>
      </ul>
    `
  },

  rojo: {
    titulo: "Dominancia Hemisférica Cerebral Roja – Mahatma Gandhi",
    texto: `
      <p><strong>Hola hermano</strong>, puedes llamarme Gandhi.
      Desde la empatía te comparto cómo es vivir desde el cuadrante rojo.</p>

      <p>No buscamos el porqué, sino el <em>para qué</em>.
      Las personas, emociones y relaciones son lo más importante.</p>

      <p>Transmitimos emociones con intensidad y profundidad.</p>

      <h4>🌟 Luces</h4>
      <ul>
        <li>Humaniza la toma de decisiones.</li>
        <li>Facilita la comunicación emocional.</li>
        <li>Genera confianza y cooperación.</li>
        <li>Permite resolver conflictos de raíz.</li>
      </ul>

      <h4>⚠️ Sombras</h4>
      <ul>
        <li>Paternalismo excesivo.</li>
        <li>Dramatización constante.</li>
        <li>Evasión del conflicto real.</li>
        <li>Intrusión emocional.</li>
      </ul>
    `
  },

  verde: {
    titulo: "Dominancia Hemisférica Cerebral Verde – Margaret Thatcher",
    texto: `
      <p><strong>Hola colaborador</strong>, soy Margaret Thatcher.
      Permíteme estructurar este conocimiento de manera eficiente.</p>

      <p>El orden, la planeación y el control son fundamentales.
      El cambio no es cómodo, pero puede gestionarse.</p>

      <h4>🌟 Luces</h4>
      <ul>
        <li>Anticipa riesgos y propone mitigaciones.</li>
        <li>Organiza información en planes accionables.</li>
        <li>Garantiza resultados y disciplina.</li>
        <li>Ejecuta con enfoque a la tarea.</li>
      </ul>

      <h4>⚠️ Sombras</h4>
      <ul>
        <li>Parálisis por análisis.</li>
        <li>Exceso de control.</li>
        <li>Resistencia al cambio.</li>
        <li>Dominancia autoritaria.</li>
      </ul>
    `
  }
};


// =======================
// UTILIDADES
// =======================
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// =======================
// RENDER MAPA (WIZARD)
// =======================
function renderMap() {
  const cont = document.getElementById("mapas");
  cont.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = `Mapa ${currentMap}`;
  cont.appendChild(title);

  const info = document.createElement("p");
  info.innerHTML = "Selecciona <strong>8 palabras</strong>.";
  cont.appendChild(info);

  const words = [];
  Object.entries(MAPS[currentMap]).forEach(([color, list]) => {
    list.forEach(word => words.push({ word, color }));
  });

  shuffle(words);

  const wrap = document.createElement("div");
  wrap.className = "words";

  words.forEach(item => {
    const div = document.createElement("div");
    div.className = "word";
    div.textContent = item.word;
    div.onclick = () => toggleWord(div, item.color);
    wrap.appendChild(div);
  });

  cont.appendChild(wrap);
}

// =======================
// SELECCIÓN
// =======================
function toggleWord(el, color) {
  selections[currentMap] = selections[currentMap] || [];
  const sel = selections[currentMap];

  if (el.classList.contains("selected")) {
    el.classList.remove("selected");
    const idx = sel.indexOf(color);
    if (idx > -1) sel.splice(idx, 1);
  } else {
    if (sel.length >= 8) {
      alert("Solo puedes seleccionar 8 palabras");
      return;
    }
    el.classList.add("selected");
    sel.push(color);
  }
}

// =======================
// BOTONES WIZARD
// =======================
document.getElementById("next").onclick = () => {
  if (!selections[currentMap] || selections[currentMap].length !== 8) {
    alert("Selecciona exactamente 8 palabras antes de continuar");
    return;
  }

  if (currentMap < 3) {
    currentMap++;
    renderMap();
  } else {
    showResults();
  }
};

document.getElementById("prev").onclick = () => {
  if (currentMap > 1) {
    currentMap--;
    renderMap();
  }
};

// =======================
// RESULTADOS
// =======================
function showResults() {
  document.querySelector(".controls").style.display = "none";
  document.getElementById("mapas").style.display = "none";

  const result = document.getElementById("resultado");
  result.style.display = "block";

  const totals = { azul: 0, amarillo: 0, verde: 0, rojo: 0 };
  Object.values(selections).flat().forEach(c => totals[c]++);

  const orden = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const dominante = orden[0][0];
  const secundario = orden[1][0];

  // personaje
  let personaje = "";
  let imgSrc = "";

  if (dominante === "amarillo") { personaje = "Steve Jobs"; imgSrc = "/static/images/steve.png"; }
  if (dominante === "azul") { personaje = "Mr. Spock"; imgSrc = "/static/images/spock.png"; }
  if (dominante === "rojo") { personaje = "Mahatma Gandhi"; imgSrc = "/static/images/gandhi.png"; }
  if (dominante === "verde") { personaje = "Margaret Thatcher"; imgSrc = "/static/images/tatcher.png"; }

  document.getElementById("interpretacion").innerHTML = `
    <h3>${INTERPRETACIONES[dominante].titulo}</h3>
    <p>${INTERPRETACIONES[dominante].texto}</p>
    <p><strong>Perfil secundario:</strong> ${secundario.toUpperCase()}</p>
    <div style="text-align:center;margin-top:16px;">
      <h4>Personaje representativo</h4>
      <p><strong>${personaje}</strong></p>
      <img src="${imgSrc}" style="max-width:180px;" />
    </div>
  `;

  const ctx = document.getElementById("chart").getContext("2d");
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Azul", "Amarillo", "Verde", "Rojo"],
      datasets: [{
        data: Object.values(totals)
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });

  document.getElementById("descargar").disabled = false;

  // guardar para PDF
  window.__pdfData = { dominante, secundario, imgSrc };
}

// =======================
// PDF
// =======================
document.getElementById("descargar").onclick = async () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const logo = new Image();
  logo.src = "/static/images/logo.png";
  await new Promise(r => logo.onload = r);

  const logoWidth = 80;
  const ratio = logo.height / logo.width;
  const logoHeight = logoWidth * ratio;

  pdf.addImage(logo, "PNG", (210 - logoWidth) / 2, 35, logoWidth, logoHeight);

  pdf.setFontSize(18);
  pdf.text("Test de Preferencias Hemisféricas", 105, 100, { align: "center" });
  pdf.setFontSize(12);
  pdf.text("Reporte de resultados personalizados", 105, 112, { align: "center" });

  pdf.addPage();

  const canvas = await html2canvas(document.getElementById("resultado"), { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const imgWidth = 190;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  pdf.save("Reporte_Test_Kreios.pdf");
};

// =======================
// INIT
// =======================
renderMap();
