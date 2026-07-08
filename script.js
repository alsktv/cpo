const canvas = document.getElementById('cpoCanvas');
const ctx = canvas.getContext('2d');
const modeEl = document.getElementById('mode');
const pinEl = document.getElementById('pin');
const gapEl = document.getElementById('gap');
const substrateEl = document.getElementById('substrate');
const interconnectEl = document.getElementById('interconnect');
const materialEl = document.getElementById('material');
const statusBanner = document.getElementById('status-banner');
const logEl = document.getElementById('insights-log');

let particles = [];
let isBurnedOut = false;

class Particle {
    constructor(x, y, color, speed, type) {
        this.x = x; this.y = y; this.color = color; this.speed = speed; this.type = type;
        this.size = type === 'light' ? 4 : 2;
    }
    update() {
        if (this.type === 'elec') this.x += this.speed;
        else this.x += this.speed; // Light speed adjustment
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawSchematic() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gap = parseFloat(gapEl.value);

    // Top: iFAU/COIT
    ctx.fillStyle = '#1e293b'; ctx.fillRect(100, 50, 800, 50); // iFAU
    ctx.fillStyle = '#475569'; ctx.fillRect(100, 100, 800, 50); // COIT
    ctx.fillStyle = '#d4af37'; ctx.fillRect(500, 100, 50, 50); // TMR Mirror

    // Lenses
    ctx.strokeStyle = '#fff';
    ctx.beginPath(); ctx.arc(525, 150 + gap/2, 20, 0, Math.PI); ctx.stroke(); // Top lens
    ctx.beginPath(); ctx.arc(525, 170 + gap/2, 20, Math.PI, 0); ctx.stroke(); // Bottom lens

    // Middle: COUPE/PIC/EIC
    ctx.fillStyle = '#334155'; ctx.fillRect(400, 250, 400, 150); // PIC/EIC
    
    // Bottom: ASIC/Interposer
    ctx.fillStyle = '#1e293b'; ctx.fillRect(50, 450, 800, 100); // Substrate

    if (isBurnedOut) {
        statusBanner.innerText = "CATASTROPHIC BURN-OUT";
        ctx.strokeStyle = 'red'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(400, 300); ctx.lineTo(800, 300); ctx.stroke(); // Fracture
    }
}

function animate() {
    drawSchematic();
    particles.forEach(p => { p.update(); p.draw(); });
    particles = particles.filter(p => p.x < canvas.width && p.x > 0);
    requestAnimationFrame(animate);
}

function checkBurnout() {
    isBurnedOut = (parseFloat(pinEl.value) >= 24.43 && materialEl.value === 'Si');
    if (isBurnedOut) statusBanner.innerText = "CATASTROPHIC BURN-OUT";
    else statusBanner.innerText = "";
}

pinEl.addEventListener('input', checkBurnout);
materialEl.addEventListener('change', checkBurnout);

// Particle loop
setInterval(() => {
    if (isBurnedOut) return;
    const color = modeEl.value === 'TX' ? '#38bdf8' : '#22d3ee';
    particles.push(new Particle(100, 450, color, 5, 'elec'));
}, 500);

animate();
