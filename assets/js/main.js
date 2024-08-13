const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

const pointer = {
    x: .5 * window.innerWidth,
    y: .5 * window.innerHeight,
}

window.addEventListener("click", e =>{
    updateMousePosition (e.pageX, e.pageY);
});
window.addEventListener("mousemove", e =>{
    updateMousePosition (e.pageX, e.pageY);
});
window.addEventListener("touchmove", e =>{
    updateMousePosition (e.targetTouches[0].pageX, e.targetTouches[0].pageY);
});

window.addEventListener("resize", setupCanvas);//setup canvas if window resizes

function updateMousePosition(eX, eY) {
    pointer.x = eX;
    pointer.y = eY;
}

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


const p = {x: 0, y: 0}; // coordinate to draw

setupCanvas();
update(0);

function update(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // copy cursor position
    p.x = pointer.x;
    p.y = pointer.y;
    // draw a dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
    ctx.fill();

    window.requestAnimationFrame(update);
}