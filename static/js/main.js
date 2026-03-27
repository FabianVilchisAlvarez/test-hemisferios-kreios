/* =======================
ESTADO GLOBAL
======================= */

let currentMap = 1;
const selections = {};
let chartInstance = null;
let esperandoDesempate = false;
let coloresEmpatados = [];
let colorFinal = null;

let userData = {
    nombre: "",
    correo: ""
};

/* =======================
INTERPRETACIONES
======================= */

const INTERPRETACIONES = {

azul:{
titulo:"Azul — Corteza Cerebral Izquierda",
texto:"Tu mente trabaja con lógica, datos y análisis. Eres preciso, crítico y orientado a resultados medibles. En los equipos eres quien exige evidencia y hace las preguntas difíciles antes de actuar."
},

verde:{
titulo:"Verde — Sistema Límbico Izquierdo",
texto:"Piensas de forma secuencial, organizada y metódica. Valoras el orden, los procedimientos y el detalle. Eres el pilar confiable que mantiene los proyectos en marcha y las promesas cumplidas."
},

rojo:{
titulo:"Rojo — Sistema Límbico Derecho",
texto:"Tu inteligencia es emocional e interpersonal. Conectas con las personas de forma genuina, escuchas activamente y construyes relaciones sólidas. Eres el corazón y la energía del equipo"
},

amarillo:{
titulo:"Amarillo — Corteza Cerebral Derecha",
texto:"Piensas de forma holística, creativa e intuitiva. Ves el panorama completo, generas ideas originales y te sientes cómodo en la ambigüedad. Eres el visionario que inspira al equipo."
}

};

/* =======================
FRASES DESEMPATE
======================= */

const FRASES_EMPATE = {
azul:"Prefiero analizar los datos con calma antes de tomar cualquier decisión.",
verde:"Me siento más seguro cuando hay un plan claro y ordenado.",
rojo:"Lo más importante para mí son las personas y el ambiente del equipo.",
amarillo:"Me emociona explorar ideas nuevas y ver el panorama completo."
};


/* =======================
SEGMENTOS
======================= */

function crearSegmentos(){
    const cont = document.getElementById("barraSegmentos");
    cont.innerHTML = "";

    for(let i=0; i<8; i++){
        const seg = document.createElement("div");
        seg.className = "segmento";
        cont.appendChild(seg);
    }
}

/* =======================
INIT
======================= */

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("startBtn").addEventListener("click", iniciarTest);
    document.getElementById("next").addEventListener("click", nextMap);
    document.getElementById("prev").addEventListener("click", prevMap);
    document.getElementById("descargar").addEventListener("click", descargarPDF);

});

/* =======================
INICIAR TEST
======================= */

function iniciarTest(){

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();

    if(nombre === "" || correo === ""){
        alert("Completa los datos");
        return;
    }

    crearSegmentos();

    userData.nombre = nombre;
    userData.correo = correo;

    document.getElementById("startScreen").style.display = "none";

    // document.querySelector(".topbar").style.display = "flex";
    document.getElementById("intro").style.display = "block";
    document.getElementById("mapSection").style.display = "block";
    document.querySelector(".controls").style.display = "flex";
    document.querySelector(".footer").style.display = "block";

    renderMap();
}

/* =======================
MAPA
======================= */

function renderMap(){

    const cont = document.getElementById("mapas");
    cont.innerHTML = "";

    // 🔥 ACTUALIZAR TÍTULO ARRIBA
    document.getElementById("map-title").innerText = `Mapa ${currentMap}`;

        const wordColorMap = buildWordColorMap(MAPS[currentMap]);
    const words = Object.keys(wordColorMap);

    shuffle(words);

    const container = document.createElement("div");
    container.className = "word-container";

    words.forEach(word=>{

        const el = document.createElement("div");
        el.className = "word";
        el.textContent = word;

        if(selections[currentMap]?.includes(word)){
            el.classList.add("selected");
        }

        el.onclick = ()=>toggleWord(el,word);

        container.appendChild(el);
    });

    cont.appendChild(container);

    updateProgress();
}

/* =======================
SELECCIÓN
======================= */

function toggleWord(el,word){

    if(!selections[currentMap]) selections[currentMap] = [];

    const sel = selections[currentMap];

    if(el.classList.contains("selected")){

        el.classList.remove("selected");
        sel.splice(sel.indexOf(word),1);

    }else{

        if(sel.length >= 8){
            alert("Solo puedes seleccionar 8 palabras");
            return;
        }

        el.classList.add("selected");
        sel.push(word);

        // 🔥 efecto cuando completas 8
        if(sel.length === 8){
            const barra = document.getElementById("barraSegmentos");
            if(barra){
                barra.classList.add("flash");
            }
        }
    }

    // 🔥 esto SIEMPRE va fuera del else
    updateProgress();
}

/* =======================
NAVEGACIÓN
======================= */

function nextMap(){

    if(!selections[currentMap] || selections[currentMap].length !== 8){
        alert("Selecciona 8 palabras");
        return;
    }

    // 🔥 FORZAMOS 3 MAPAS (seguro y limpio)
    if(currentMap < 3){

        currentMap++;
        renderMap();

    }else{
        calcularResultados();
    }
}

function prevMap(){

    if(currentMap > 1){
        currentMap--;
        renderMap();
    }
}

/* =======================
CALCULAR RESULTADOS
======================= */

function calcularResultados(){

    const totals = {azul:0,amarillo:0,rojo:0,verde:0};

    Object.entries(selections).forEach(([map,words])=>{
        const mapColors = buildWordColorMap(MAPS[map]);
        words.forEach(w=>{
            mapColors[w].forEach(c=>totals[c]++);
        });
    });

    const orden = Object.entries(totals).sort((a,b)=>b[1]-a[1]);
    const max = orden[0][1];

    coloresEmpatados = orden.filter(([c,v])=>v===max).map(x=>x[0]);

    if(coloresEmpatados.length > 1){
        mostrarDesempate();
    }else{
        mostrarResultadoFinal(coloresEmpatados[0], totals);
    }
}

/* =======================
PANTALLA DESEMPATE
======================= */

function mostrarDesempate(){

    esperandoDesempate = true;

    document.getElementById("mapSection").style.display = "none";
    document.querySelector(".controls").style.display = "none";
    document.getElementById("resultado").style.display = "block";

    // 🔥 OCULTAR ELEMENTOS QUE ENSUCIAN (EL CUADRO BLANCO)
    const chartBox = document.querySelector(".chart-box");
    if(chartBox){
        chartBox.style.display = "none";
    }

    const btnDescargar = document.getElementById("descargar");
    if(btnDescargar){
        btnDescargar.style.display = "none";
    }

    let html = `
        <div class="empate-box">

            <h2 class="empate-titulo">
                Necesitamos una pista más
            </h2>

            <p class="empate-desc">
                Tus resultados quedaron muy cercanos entre varios perfiles.
                Elige la frase que mejor te describe en tu día a día.
            </p>

            <div class="empate-frases">
    `;

    coloresEmpatados.forEach(color=>{
        html += `
            <div class="card-empate" data-color="${color}">
                ${FRASES_EMPATE[color]}
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    const dash = document.getElementById("dashboard");
    dash.innerHTML = html;

    // 🔥 EVENTOS
    document.querySelectorAll(".card-empate").forEach(card => {
        card.addEventListener("click", () => {
            const color = card.getAttribute("data-color");
            resolverEmpate(color);
        });
    });
}

/* =======================
RESOLVER EMPATE
======================= */

function resolverEmpate(colorElegido){

    if(!esperandoDesempate) return;

    esperandoDesempate = false;

    const totals = {azul:0,amarillo:0,rojo:0,verde:0};

    Object.entries(selections).forEach(([map,words])=>{
        const mapColors = buildWordColorMap(MAPS[map]);
        words.forEach(w=>{
            mapColors[w].forEach(c=>totals[c]++);
        });
    });

    // 🔥 GUARDAMOS EL COLOR FINAL (CLAVE)
    colorFinal = colorElegido;

    mostrarResultadoFinal(colorElegido, totals);
}

    function mostrarResultadoFinal(dominante, totals){

    const resultado = document.getElementById("resultado");

    // LIMPIAR TODO EL CONTENEDOR COMPLETO
    resultado.innerHTML = `
    <div id="dashboard"></div>
    <button id="descargar" class="btn">Descargar PDF</button>
    `;

    document.getElementById("mapSection").style.display = "none";
    document.querySelector(".controls").style.display = "none";
    document.getElementById("resultado").style.display = "block";
    document.getElementById("intro").style.display = "none";

    const totalPalabras = Object.values(totals).reduce((a,b)=>a+b,0);
    const palabrasTop = obtenerPalabrasDominantes(dominante);

    const partesTitulo = INTERPRETACIONES[dominante].titulo.split("—");
    const tituloColor = partesTitulo[0].trim();
    const subtitulo = partesTitulo[1]?.trim() || "";

    const total = Object.values(totals).reduce((a,b)=>a+b,0);

let html = `
<div class="dashboard">

    <!-- HEADER -->
    <div style="text-align:center; margin-bottom:25px;">
        <h2 style="font-size:28px;">Resultados</h2>
        <div style="font-size:14px; color:#666;">Tu perfil cognitivo</div>

        <div style="margin-top:10px; font-weight:600;">
            ${userData.nombre}
        </div>

        <div style="font-size:13px; color:#777;">
            ${userData.correo}
        </div>
    </div>

    <!-- CAJA PRINCIPAL -->
    <div class="perfil-dominante bg-${dominante}" style="padding:25px; border-radius:16px;">

        <div style="text-align:center; margin-bottom:10px;">
            <div style="font-size:26px; font-weight:bold;">
                ${tituloColor}
            </div>

            <div style="font-size:14px; opacity:0.9;">
                ${subtitulo}
            </div>
        </div>

        <p style="margin-top:10px;">
            ${INTERPRETACIONES[dominante].texto}
        </p>
    </div>

    <!-- PALABRAS -->
    <div style="margin-top:25px;">
        <div style="font-weight:bold; margin-bottom:10px;">
            Palabras clave:
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${palabrasTop.map(p => `
                <span style="
                    background:#eee;
                    padding:6px 10px;
                    border-radius:10px;
                    font-size:13px;
                ">
                    ${p}
                </span>
            `).join("")}
        </div>
    </div>

    <!-- CARDS -->
    <div style="
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(120px,1fr));
        gap:12px;
        margin-top:30px;
    ">
        ${Object.entries(totals).map(([color,val])=>{
            const porcentaje = Math.round((val/total)*100);

            return `
                <div class="card-resultado ${color}">
                    <div style="font-size:12px;">${color.toUpperCase()}</div>
                    <div class="valor">${val}</div>
                    <div class="porcentaje">${porcentaje}%</div>
                </div>
            `;
        }).join("")}
    </div>

    <!-- BARRAS -->
    <div style="margin-top:30px;">
        <div style="font-weight:bold; margin-bottom:10px;">
            Distribución
        </div>

        ${Object.entries(totals).map(([color,val])=>{
            const porcentaje = Math.round((val/total)*100);

            return `
                <div style="margin-bottom:10px;">
                    <div style="font-size:12px; margin-bottom:3px;">
                        ${color.toUpperCase()}
                    </div>

                    <div style="
                        background:#eee;
                        height:6px;
                        border-radius:10px;
                        overflow:hidden;
                    ">
                        <div style="
                            width:${porcentaje}%;
                            height:100%;
                            background:var(--color-${color}, #6a11cb);
                        "></div>
                    </div>

                    <div style="font-size:11px;">
                        ${porcentaje}%
                    </div>
                </div>
            `;
        }).join("")}
    </div>

</div>
`;

    document.getElementById("dashboard").innerHTML = html;


    // REACTIVAR BOTÓN
    document.getElementById("descargar")
        .addEventListener("click", descargarPDF);
}

/* =======================
CHART (50% MÁS CHICA)
======================= */

function renderChart(totals){

    const canvas = document.getElementById("chart");

    // 🔥 SI NO EXISTE, SALIMOS (evita errores silenciosos)
    if(!canvas) return;

    // 🔥 RESETEAR canvas completamente
    const newCanvas = canvas.cloneNode(true);
    canvas.parentNode.replaceChild(newCanvas, canvas);

    const ctx = newCanvas.getContext("2d");

    if(chartInstance){
        chartInstance.destroy();
        chartInstance = null;
    }

    chartInstance = new Chart(ctx,{
        type:"radar",
        data:{
            labels:["Azul","Amarillo","Rojo","Verde"],
            datasets:[{
                data:[
                    totals.azul,
                    totals.amarillo,
                    totals.rojo,
                    totals.verde
                ]
            }]
        },
        options:{
            responsive:true,
            maintainAspectRatio:true,
            scales:{
                r:{ ticks:{ display:false } }
            }
        }
    });
}

/* =======================
PROGRESO
======================= */

function updateProgress(){

    const count = selections[currentMap]?.length || 0;

    // contador numérico
    const countEl = document.getElementById("count");
    if(countEl) countEl.textContent = count;

    // texto faltantes
    const faltantesEl = document.getElementById("faltantes");
    if(faltantesEl) faltantesEl.textContent = "Faltan " + (8 - count);

    // segmentos visuales
    const segmentos = document.querySelectorAll(".segmento");

    segmentos.forEach((seg, i)=>{
        if(i < count){
            seg.classList.add("activo");
        }else{
            seg.classList.remove("activo");
        }
    });

        // 🔥 MINI BARRA ARRIBA
    const porcentaje = (count / 8) * 100;

    const barra = document.getElementById("mini-bar-fill");
    if(barra){
        barra.style.width = porcentaje + "%";
    }

    // 🔥 AQUÍ VA (AL FINAL)
    const barraSegmentos = document.getElementById("barraSegmentos");

    if(barraSegmentos){
        if(count === 8){
            barraSegmentos.classList.add("barra-completa");
        }else{
            barraSegmentos.classList.remove("barra-completa");
        }
    }
}

/* =======================
UTILIDADES
======================= */

function shuffle(array){
    return array.sort(()=>Math.random()-0.5);
}

function buildWordColorMap(mapData){

    const map = {};

    Object.entries(mapData).forEach(([color,words])=>{
        words.forEach(w=>{
            if(!map[w]) map[w] = [];
            map[w].push(color);
        });
    });

    return map;
}

function obtenerPalabrasDominantes(colorDominante){

    let palabras = [];

    Object.entries(selections).forEach(([map,words])=>{

        const mapColors = buildWordColorMap(MAPS[map]);

        words.forEach(w=>{
            if(mapColors[w].includes(colorDominante)){
                palabras.push(w);
            }
        });

    });

    return [...new Set(palabras)].slice(0,10);
}


/* =======================
DOMINANTE
======================= */

function obtenerDominante(){

    const totals = calcularTotalesPDF();

    let max = 0;
    let dominante = "rojo";

    Object.entries(totals).forEach(([color, val])=>{
        if(val > max){
            max = val;
            dominante = color;
        }
    });

    return dominante;
}

function calcularTotalesPDF(){

    const totals = {azul:0,amarillo:0,rojo:0,verde:0};

    Object.entries(selections).forEach(([map,words])=>{
        const mapColors = buildWordColorMap(MAPS[map]);

        words.forEach(w=>{
            mapColors[w].forEach(c=>totals[c]++);
        });
    });

    return totals;
}

/* =======================
PDF
======================= */

async function descargarPDF(){

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const dominante = colorFinal || obtenerDominante();
    const totals = calcularTotalesPDF();
    const palabras = obtenerPalabrasDominantes(dominante);

    const total = Object.values(totals).reduce((a,b)=>a+b,0);

    // 🔥 separar título y subtítulo
    const partesTitulo = INTERPRETACIONES[dominante].titulo.split("—");
    const tituloColor = partesTitulo[0].trim().toUpperCase();
    const subtitulo = partesTitulo[1]?.trim() || "";

    const colores = {
    azul: [44,106,232],      // #2C6AE8
    verde: [45,182,86],      // #2DB656
    rojo: [233,53,86],       // #E93556
    amarillo: [247,215,54]   // #F7D736
    };

    const colorRGB = colores[dominante];

    let y = 20;

    // ======================
    // HEADER
    // ======================

    pdf.setFont("helvetica","bold");
    pdf.setFontSize(20);
    pdf.text("Resultados", 105, y, {align:"center"});

    y += 10;

    pdf.setFontSize(14);
    pdf.setTextColor(100);
    pdf.text("Tu perfil cognitivo", 105, y, {align:"center"});

    y += 8;

    pdf.setFontSize(10);
    pdf.text(`${userData.nombre} — ${userData.correo}`, 105, y, {align:"center"});

    y += 12;

    // ======================
    // CAJA PRINCIPAL
    // ======================

    pdf.setFillColor(...colorRGB);
    pdf.roundedRect(15, y, 180, 40, 5, 5, "F"); // 🔥 más alta

    pdf.setTextColor(255,255,255);

    // 🔥 TÍTULO GRANDE
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(16);
    pdf.text(tituloColor, 105, y+10, { align:"center" });

    // 🔥 SUBTÍTULO
    pdf.setFont("helvetica","normal");
    pdf.setFontSize(11);
    pdf.text(subtitulo, 105, y+16, { align:"center" });

    // 🔥 TEXTO DESCRIPTIVO
    pdf.setFontSize(10);

    const texto = pdf.splitTextToSize(
        INTERPRETACIONES[dominante].texto,
        170
    );

    pdf.text(texto, 20, y+24);

    y += 50;

    // ======================
    // PALABRAS CLAVE
    // ======================

    pdf.setTextColor(0);
    pdf.setFont("helvetica","bold");
    pdf.text("Palabras clave:", 15, y);

    y += 6;

    pdf.setFont("helvetica","normal");

    let x = 15;

    palabras.forEach(p => {

        const w = pdf.getTextWidth(p) + 6;

        if(x + w > 190){
            x = 15;
            y += 8;
        }

        pdf.setFillColor(230,230,230);
        pdf.roundedRect(x, y-4, w, 6, 2, 2, "F");

        pdf.setTextColor(0);
        pdf.text(p, x+3, y);

        x += w + 3;
    });

    y += 12;

    // ======================
    // CARDS RESULTADOS
    // ======================

    const cardWidth = 40;
    let xCard = 15;

    Object.entries(totals).forEach(([color,val])=>{

        const porcentaje = Math.round((val/total)*100);

        pdf.setFillColor(...colores[color]);
        pdf.roundedRect(xCard, y, cardWidth, 25, 4, 4, "F");

        pdf.setTextColor(255);
        pdf.setFontSize(10);
        pdf.text(color.toUpperCase(), xCard+20, y+7, {align:"center"});

        pdf.setFontSize(16);
        pdf.text(String(val), xCard+20, y+15, {align:"center"});

        pdf.setFontSize(9);
        pdf.text(`${porcentaje}%`, xCard+20, y+21, {align:"center"});

        xCard += cardWidth + 5;
    });

    y += 35;

    // ======================
    // BARRAS
    // ======================

    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.text("Distribución", 15, y);

    y += 8;

    Object.entries(totals).forEach(([color,val])=>{

        const porcentaje = Math.round((val/total)*100);

        pdf.setTextColor(0);
        pdf.setFontSize(10);
        pdf.text(color.toUpperCase(), 15, y);

        pdf.setFillColor(230,230,230);
        pdf.roundedRect(50, y-4, 100, 5, 2, 2, "F");

        pdf.setFillColor(...colores[color]);
        pdf.roundedRect(50, y-4, porcentaje, 5, 2, 2, "F");

        pdf.text(`${porcentaje}%`, 155, y);

        y += 10;
    });

    // ======================
    // FOOTER
    // ======================

    pdf.setDrawColor(200);
    pdf.line(15, 280, 195, 280);

    pdf.setFontSize(8);
    pdf.setTextColor(120);
    pdf.text("Reporte generado automáticamente", 15, 285);
    pdf.text("Kreios", 170, 285);

    // 🔥 convertir PDF a base64
const pdfBase64 = pdf.output("datauristring");

// 🔥 enviar al backend (Flask)
await fetch("/enviar-pdf", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        nombre: userData.nombre,
        correo: userData.correo,
        pdf: pdfBase64
    })
});

// 🔥 mensaje al usuario
alert("📩 Tu reporte fue enviado a tu correo");
}