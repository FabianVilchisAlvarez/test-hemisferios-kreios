let currentMap = 1;
const selections = {};
let chartInstance = null;

/* =======================
INTERPRETACIONES
======================= */

const INTERPRETACIONES = {

amarillo:{
titulo:"Dominancia Cognitiva Amarilla – Pensamiento Creativo e Innovador",
texto:`

<p>
Tu perfil refleja una predominancia del <strong>pensamiento creativo, conceptual y orientado hacia la exploración de nuevas posibilidades</strong>. Este tipo de procesamiento cognitivo se caracteriza por una fuerte capacidad para imaginar escenarios, generar ideas y conectar conceptos aparentemente diferentes.
</p>

<p>
Las personas con dominancia amarilla suelen procesar la información de manera global. Esto significa que su cerebro tiende a enfocarse primero en el panorama general antes que en los detalles específicos. Es común que tu mente funcione de forma asociativa, conectando ideas rápidamente y generando nuevas interpretaciones o soluciones.
</p>

<h4>🧠 Cómo procesa información tu cerebro</h4>
<ul>
<li>Tiendes a captar el contexto general antes de analizar los detalles.</li>
<li>Tu mente conecta conceptos y genera asociaciones con rapidez.</li>
<li>Prefieres explorar posibilidades y alternativas antes que seguir estructuras rígidas.</li>
<li>Tu pensamiento suele orientarse hacia el futuro y hacia lo que podría ser posible.</li>
</ul>

<h4>🧩 Cómo tomas decisiones</h4>
<p>
Las decisiones en este perfil suelen surgir de una combinación entre intuición, creatividad y visión estratégica. En lugar de centrarse exclusivamente en datos concretos, tu cerebro tiende a evaluar ideas desde su potencial o impacto futuro.
</p>

<h4>🌟 Fortalezas cognitivas</h4>
<ul>
<li>Alta creatividad y pensamiento innovador.</li>
<li>Capacidad para generar ideas originales.</li>
<li>Visión estratégica a largo plazo.</li>
<li>Facilidad para encontrar soluciones poco convencionales.</li>
</ul>

<h4>⚠️ Riesgos cognitivos</h4>
<ul>
<li>Puede existir tendencia a pasar rápidamente de una idea a otra.</li>
<li>Algunas ideas pueden necesitar más análisis antes de implementarse.</li>
<li>Las tareas repetitivas o altamente estructuradas pueden resultar poco motivadoras.</li>
</ul>

<h4>📈 Desarrollo recomendado</h4>
<p>
Tu capacidad para generar ideas es una gran fortaleza. Para potenciar aún más tu perfil, resulta útil complementar la creatividad con herramientas de organización, priorización y evaluación práctica de proyectos. Cuando la creatividad se combina con estructura, el impacto de tus ideas puede ser mucho mayor.
</p>

`
},

azul:{
titulo:"Dominancia Cognitiva Azul – Pensamiento Analítico y Lógico",
texto:`

<p>
Tu perfil muestra una clara predominancia del <strong>pensamiento analítico, lógico y estructurado</strong>. Este estilo cognitivo se caracteriza por la tendencia a procesar la información de forma detallada, buscando comprender las relaciones entre datos, causas y consecuencias.
</p>

<p>
Las personas con dominancia azul suelen sentirse cómodas cuando pueden analizar información de manera objetiva. Tu cerebro tiende a organizar mentalmente los problemas en partes más pequeñas para entenderlos mejor y encontrar soluciones racionales.
</p>

<h4>🧠 Cómo procesa información tu cerebro</h4>
<ul>
<li>Analizas la información paso a paso antes de llegar a una conclusión.</li>
<li>Buscas coherencia lógica entre los diferentes elementos de un problema.</li>
<li>Tiendes a evaluar datos y evidencias antes de tomar decisiones.</li>
<li>Prefieres comprender cómo funcionan las cosas antes de actuar.</li>
</ul>

<h4>🧩 Cómo tomas decisiones</h4>
<p>
Las decisiones suelen basarse en información verificable y análisis racional. Este enfoque permite reducir errores y tomar decisiones fundamentadas, especialmente en contextos que requieren precisión o evaluación de riesgos.
</p>

<h4>🌟 Fortalezas cognitivas</h4>
<ul>
<li>Pensamiento crítico y capacidad analítica.</li>
<li>Facilidad para detectar errores o inconsistencias.</li>
<li>Capacidad para resolver problemas complejos.</li>
<li>Alta objetividad en la evaluación de situaciones.</li>
</ul>

<h4>⚠️ Riesgos cognitivos</h4>
<ul>
<li>Puede existir tendencia a analizar demasiado antes de actuar.</li>
<li>En algunas situaciones la lógica puede dejar en segundo plano factores emocionales o sociales.</li>
<li>La búsqueda de información perfecta puede retrasar decisiones.</li>
</ul>

<h4>📈 Desarrollo recomendado</h4>
<p>
Tu capacidad analítica es una fortaleza muy valiosa. Integrar perspectivas más intuitivas o sociales en el proceso de decisión puede enriquecer tu enfoque, permitiendo equilibrar precisión lógica con sensibilidad interpersonal.
</p>

`
},

rojo:{
titulo:"Dominancia Cognitiva Roja – Pensamiento Relacional y Empático",
texto:`

<p>
Tu perfil refleja una orientación cognitiva centrada en las <strong>personas, las emociones y la dinámica de las relaciones</strong>. Este estilo de pensamiento se caracteriza por una alta sensibilidad hacia el entorno social y hacia el impacto que las decisiones tienen en los demás.
</p>

<p>
Las personas con dominancia roja suelen interpretar la información considerando tanto los hechos como el componente emocional o humano de las situaciones. Esto permite comprender mejor las motivaciones, necesidades y perspectivas de otras personas.
</p>

<h4>🧠 Cómo procesa información tu cerebro</h4>
<ul>
<li>Tiendes a percibir emociones y estados de ánimo en las personas.</li>
<li>Tu cerebro evalúa cómo afectan las decisiones a quienes te rodean.</li>
<li>Te resulta natural interpretar dinámicas sociales.</li>
<li>Das importancia a la comunicación y al entendimiento mutuo.</li>
</ul>

<h4>🧩 Cómo tomas decisiones</h4>
<p>
Las decisiones en este perfil suelen considerar el impacto humano y relacional. Buscas soluciones que favorezcan la cooperación, el bienestar del grupo y la armonía interpersonal.
</p>

<h4>🌟 Fortalezas cognitivas</h4>
<ul>
<li>Alta empatía y comprensión emocional.</li>
<li>Habilidad para construir relaciones de confianza.</li>
<li>Capacidad para mediar o facilitar acuerdos.</li>
<li>Comunicación clara y cercana.</li>
</ul>

<h4>⚠️ Riesgos cognitivos</h4>
<ul>
<li>En ocasiones puedes evitar conflictos aunque sea necesario enfrentarlos.</li>
<li>Podrías priorizar demasiado la armonía del grupo.</li>
<li>Algunas decisiones requieren mayor distancia emocional para evaluarse objetivamente.</li>
</ul>

<h4>📈 Desarrollo recomendado</h4>
<p>
Tu capacidad relacional es una gran fortaleza. Integrar herramientas de análisis y toma de decisiones estructurada puede ayudarte a equilibrar empatía con objetividad, ampliando tu capacidad de liderazgo y resolución de problemas.
</p>

`
},

verde:{
titulo:"Dominancia Cognitiva Verde – Pensamiento Organizado y Ejecutor",
texto:`

<p>
Tu perfil refleja una fuerte orientación hacia la <strong>estructura, organización y ejecución eficiente</strong>. Este estilo cognitivo se caracteriza por la tendencia a ordenar la información, establecer procedimientos claros y asegurar que las tareas se realicen de forma consistente.
</p>

<p>
Las personas con dominancia verde suelen sentirse cómodas cuando existen reglas claras, procesos definidos y objetivos concretos. Tu cerebro tiende a buscar estabilidad y coherencia en la forma en que se realizan las actividades.
</p>

<h4>🧠 Cómo procesa información tu cerebro</h4>
<ul>
<li>Organizas mentalmente la información en pasos o procesos.</li>
<li>Prefieres trabajar con métodos claros y definidos.</li>
<li>Te resulta natural planificar antes de actuar.</li>
<li>Valoras la consistencia y la eficiencia en la ejecución.</li>
</ul>

<h4>🧩 Cómo tomas decisiones</h4>
<p>
Las decisiones en este perfil suelen basarse en la planificación, el orden y la viabilidad práctica. Buscas soluciones que puedan implementarse de manera organizada y sostenible en el tiempo.
</p>

<h4>🌟 Fortalezas cognitivas</h4>
<ul>
<li>Alta capacidad de organización.</li>
<li>Disciplina en la ejecución de tareas.</li>
<li>Seguimiento constante de objetivos.</li>
<li>Capacidad para mantener procesos estables.</li>
</ul>

<h4>⚠️ Riesgos cognitivos</h4>
<ul>
<li>En algunos contextos puede existir preferencia excesiva por la rutina.</li>
<li>Los cambios rápidos o la ambigüedad pueden generar incomodidad.</li>
<li>Podrías priorizar demasiado el proceso sobre la exploración de nuevas ideas.</li>
</ul>

<h4>📈 Desarrollo recomendado</h4>
<p>
Tu capacidad organizativa es esencial para convertir planes en resultados concretos. Integrar mayor flexibilidad y apertura a nuevas perspectivas puede enriquecer tu estilo, permitiendo combinar estructura con innovación cuando la situación lo requiera.
</p>

`
}

};

/* =======================
UTILIDADES
======================= */

function shuffle(array){
return array.sort(()=>Math.random()-0.5);
}

function buildWordColorMap(mapData){

const map={};

Object.entries(mapData).forEach(([color,words])=>{
words.forEach(w=>{
if(!map[w]) map[w]=[];
map[w].push(color);
});
});

return map;

}

/* =======================
MAPA
======================= */

function renderMap(){

const cont=document.getElementById("mapas");
cont.innerHTML="";

const title=document.createElement("h2");
title.textContent=`Mapa ${currentMap}`;
cont.appendChild(title);

const info=document.createElement("p");
info.innerHTML="Selecciona <strong>8 palabras</strong>";
cont.appendChild(info);

const wordColorMap=buildWordColorMap(MAPS[currentMap]);
const words=Object.keys(wordColorMap);

shuffle(words);

const container=document.createElement("div");
container.className="word-container";

words.forEach(word=>{

const el=document.createElement("div");
el.className="word";
el.textContent=word;

if(selections[currentMap]?.includes(word)){
el.classList.add("selected");
}

el.onclick=()=>toggleWord(el,word);

container.appendChild(el);

});

cont.appendChild(container);

updateProgress();

}

/* =======================
SELECCIÓN
======================= */

function toggleWord(el,word){

if(!selections[currentMap]){
selections[currentMap]=[];
}

const sel=selections[currentMap];

if(el.classList.contains("selected")){

el.classList.remove("selected");
const index=sel.indexOf(word);
if(index>-1){
sel.splice(index,1);
}

}else{

if(sel.length>=8){
alert("Solo puedes seleccionar 8 palabras");
return;
}

el.classList.add("selected");
sel.push(word);

}

updateProgress();

}

/* =======================
NAVEGACIÓN
======================= */

document.getElementById("next").onclick=()=>{

if(!selections[currentMap] || selections[currentMap].length!==8){

alert("Selecciona exactamente 8 palabras");
return;

}

if(currentMap<3){

currentMap++;
renderMap();

}else{

showResults();

}

};

document.getElementById("prev").onclick=()=>{

if(currentMap>1){

currentMap--;
renderMap();

}

};

/* =======================
RESULTADOS
======================= */

function showResults(){

document.getElementById("intro").style.display="none";
document.getElementById("mapSection").style.display="none";
document.querySelector(".controls").style.display="none";

document.getElementById("resultado").style.display="block";

const totals={azul:0,amarillo:0,rojo:0,verde:0};

Object.entries(selections).forEach(([map,words])=>{

const mapColors=buildWordColorMap(MAPS[parseInt(map)]);

words.forEach(w=>{
mapColors[w].forEach(c=>totals[c]++);
});

});

const orden=Object.entries(totals).sort((a,b)=>b[1]-a[1]);

const dominante=orden[0][0];
const secundario=orden[1][0];

document.getElementById("interpretacion").innerHTML=`

<h3>🧠 Estos son tus resultados</h3>

<h3>${INTERPRETACIONES[dominante].titulo}</h3>

${INTERPRETACIONES[dominante].texto}

<p><strong>Perfil secundario:</strong> ${secundario.toUpperCase()}</p>

<p>
Tu cerebro utiliza los cuatro estilos de pensamiento. 
Este resultado muestra cuál tiendes a utilizar con mayor frecuencia al analizar situaciones, resolver problemas o tomar decisiones.
</p>

`;

renderChart(totals);

}

/* =======================
RADAR CHART
======================= */

function renderChart(totals){

const ctx=document.getElementById("chart").getContext("2d");

if(chartInstance){
chartInstance.destroy();
}

chartInstance=new Chart(ctx,{
type:"radar",
data:{
labels:["Azul","Amarillo","Rojo","Verde"],
datasets:[{
label:"Perfil cognitivo",
data:[
totals.azul,
totals.amarillo,
totals.rojo,
totals.verde
],
backgroundColor:"rgba(0,0,0,0.1)",
borderColor:"#333",
pointBackgroundColor:[
"#007BFF",
"#FFD700",
"#E74C3C",
"#2ECC71"
],
pointBorderColor:"#fff",
pointRadius:6
}]
},
options:{
responsive:true,
plugins:{
legend:{
display:false
}
},
scales:{
r:{
beginAtZero:true,
ticks:{
stepSize:2
}
}
}
}
});

}

/* =======================
PROGRESO
======================= */

function updateProgress(){

const count=selections[currentMap]?.length || 0;
const percent=(count/8)*100;

document.getElementById("progress-bar").style.width=percent+"%";
document.getElementById("count").textContent=count;

}

/* =======================
INIT
======================= */

renderMap();