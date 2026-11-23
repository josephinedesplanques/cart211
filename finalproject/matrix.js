// Create the background layer inside <body>
const matrix = document.createElement("div");
matrix.id = "matrix";
matrix.setAttribute("aria-hidden", "true");
document.body.prepend(matrix);

const chars = "アイウエオカキクケコサシスセソタチツテト0123456789".split("");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let cols = [];   // each column is a list of spans
let heads = [];  // where each falling streak currently is (-1 = none)
let timer;

const rand = list => list[Math.floor(Math.random() * list.length)];

function build() {
  matrix.innerHTML = "";
  const cell = Math.max(window.innerWidth, window.innerHeight) * 0.02;
  matrix.style.setProperty("--cell", cell + "px");

  const nCols = Math.ceil(window.innerWidth / cell) + 1;
  const nRows = Math.ceil(window.innerHeight / cell) + 1;

  cols = [];
  heads = [];
  for (let c = 0; c < nCols; c++) {
    const p = document.createElement("p");
    const spans = [];
    for (let r = 0; r < nRows; r++) {
      const s = document.createElement("span");
      s.textContent = rand(chars);
      p.appendChild(s);
      spans.push(s);
    }
    matrix.appendChild(p);
    cols.push(spans);
    heads.push(-1);
  }
}

function light(span) {
  span.textContent = rand(chars);   // the glitch: the character changes as it lights up
  span.classList.add("lit");
  setTimeout(() => span.classList.remove("lit"), 60);
}

function tick() {
  cols.forEach((spans, c) => {
    if (heads[c] === -1) {
      if (Math.random() < 0.02) heads[c] = 0;        // start a new streak
    } else {
      light(spans[heads[c]]);
      heads[c]++;
      if (heads[c] >= spans.length) heads[c] = -1;   // streak finished
    }
  });
  for (let i = 0; i < 6; i++) {                      // random flickers
    light(rand(rand(cols)));
  }
}

function start() {
  clearInterval(timer);
  build();
  if (!reduceMotion) timer = setInterval(tick, 70);
}

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(start, 200);
});

start();