const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const startColor = "#0000FF";
const endColor = "#880808";

const pointer = {
  x: 0.5 * window.innerWidth,
  y: 0.5 * window.innerHeight,
};

const params = {
  pointsNumber: 30,
  spring: 0.4,
  friction: 0.5,
  baseWidth: 0.9,
  colorTransition: 1,
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

function interpolate(color1, color2, percent) {
  // Convert the hex colors to RGB values
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  // Interpolate the RGB values
  const r = Math.round(r1 + (r2 - r1) * percent);
  const g = Math.round(g1 + (g2 - g1) * percent);
  const b = Math.round(b1 + (b2 - b1) * percent);

  // Convert the interpolated RGB values back to a hex color
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

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

  // Create a linear gradient from the first to the last point
  const gradient = ctx.createLinearGradient(
    trail[0].x,
    trail[0].y, // Start of the gradient at the first point
    trail[trail.length - 1].x,
    trail[trail.length - 1].y // End of the gradient at the last point
  );

  // Define the color stops for the gradient
  gradient.addColorStop(0, startColor); // Start color
  gradient.addColorStop(1, endColor); // End color

  // Apply the gradient as the stroke style
  ctx.strokeStyle = gradient;

  // smooth the curve
  for (let i = 1; i < trail.length - 1; i++) {
    const xc = 0.5 * (trail[i].x + trail[i + 1].x);
    const yc = 0.5 * (trail[i].y + trail[i + 1].y);

    // Calculate the gradient factor based on the index
    const gradientFactor = i / (trail.length - 1);

    ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
    ctx.lineWidth = params.baseWidth * (params.pointsNumber - i);
    // ctx.strokeStyle = interpolate(startColor, endColor, gradientFactor);
    ctx.stroke();
  }
  ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
  ctx.stroke();

  // Draw the paint bucket icon at the start of the stroke
  drawPaintBucket(trail[0].x, trail[0].y);

  window.requestAnimationFrame(update);
}

// Function to draw the paint bucket icon
function drawPaintBucket(x, y) {
  // Create an offscreen canvas to draw the Font Awesome icon as an image
  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = 32; // Width of the icon
  offscreenCanvas.height = 32; // Height of the icon
  const offscreenCtx = offscreenCanvas.getContext("2d");

  // Draw the icon using Font Awesome
  offscreenCtx.font = "24px FontAwesome";
  offscreenCtx.fillStyle = "#000000"; // Icon color
  offscreenCtx.textAlign = "center";
  offscreenCtx.textBaseline = "middle";
  offscreenCanvas.style = "white";
  offscreenCtx.fillText(
    "\uf576",
    offscreenCanvas.width / 2,
    offscreenCanvas.height / 2
  ); // '\uf576' is the Unicode for the paint bucket icon

  // Draw the icon on the main canvas
  ctx.drawImage(offscreenCanvas, x - 32, y - 32, 32, 32); // Adjust the icon's position and size
}
