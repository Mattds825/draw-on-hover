const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const pointer = {
  x: 0.5 * window.innerWidth,
  y: 0.5 * window.innerHeight,
};

const params = {
  pointsNumber: 30,
  spring: 0.4,
  friction: 0.5,
};

const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
  trail[i] = {
    x: pointer.x,
    y: pointer.y,
    dx: 0,
    dy: 0,
  };
}

window.addEventListener("click", (e) => {
  updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("mousemove", (e) => {
  updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("touchmove", (e) => {
  updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
});

window.addEventListener("resize", setupCanvas); //setup canvas if window resizes

function updateMousePosition(eX, eY) {
  pointer.x = eX;
  pointer.y = eY;
}

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// const p = { x: 0, y: 0 }; // coordinate to draw

setupCanvas();
update(0);

function update(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  trail.forEach((p, pIdx) => {
    const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
    const spring = pIdx === 0 ? 0.4 * params.spring : params.spring;

    // update coordidate values
    p.dx = (prev.x - p.x) * spring;
    p.dy = (prev.y - p.y) * spring;
    p.dx *= params.friction;
    p.dy *= params.friction;

    p.x += p.dx;
    p.y += p.dy;

    // draw circle
    // ctx.beginPath();
    // ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
    // ctx.fill();

    // draw line
    if (pIdx === 0) {
      // start the line on the first point
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }
    // else {
    //   // continue with new line segment to the following one
    //   ctx.lineTo(p.x, p.y);
    // }
    
  });
  // smooth the curve
  for (let i = 1; i < trail.length - 1; i++) {
    const xc = 0.5 * (trail[i].x + trail[i + 1].x);
    const yc = 0.5 * (trail[i].y + trail[i + 1].y);
    ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
  }
  ctx.stroke();
  window.requestAnimationFrame(update);
}
