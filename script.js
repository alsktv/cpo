const canvas = document.getElementById('cpoCanvas');
const ctx = canvas.getContext('2d');
const modeEl = document.getElementById('mode');
const pinEl = document.getElementById('pin');
const substrateEl = document.getElementById('substrate');
const interconnectEl = document.getElementById('interconnect');
const statusBanner = document.getElementById('status-banner');

let particles = [];
let isBurnedOut = false;

class Particle {
    constructor(x, y, color, speed, type) {
        this.x = x; this.y = y; this.color = color; this.speed = speed; this.type = type;
        this.size = type === 'light' ? 4 : 2;
    }
    update() {
        this.x += this.speed;
        if (this.x > canvas.width) this.x = 0;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawGeometricShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Substrate
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 500, canvas.width, 100);
    
    // ASIC
    ctx.fillStyle = '#334155';
    ctx.fillRect(100, 350, 200, 150);
    ctx.fillStyle = '#fff';
    ctx.fillText('ASIC', 180, 425);
    
    // COUPE
    ctx.fillStyle = '#475569';
    ctx.fillRect(500, 300, 300, 200);
    
    // PIC Components
    // Ring Modulator
    ctx.strokeStyle = '#22d3ee';
    ctx.beginPath(); ctx.arc(600, 400, 20, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(600, 400, 15, 0, Math.PI * 2); ctx.stroke();
    
    // Ge-PD
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(700, 380, 40, 40);
    
    // TSVs
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    for(let i = 0; i < 5; i++) {
        ctx.beginPath(); ctx.moveTo(550 + i * 40, 500); ctx.lineTo(550 + i * 40, 350); ctx.stroke();
    }
}

function animate() {
    if (isBurnedOut) {
        statusBanner.innerText = "CATASTROPHIC BURN-OUT";
        ctx.strokeStyle = 'red'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(500, 400); ctx.lineTo(800, 400); ctx.stroke();
        return;
    }
    
    drawGeometricShapes();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

function checkBurnout() {
    if (parseFloat(pinEl.value) >= 24.43 && substrateEl.value === 'Standard') {
        isBurnedOut = true;
    } else {
        isBurnedOut = false;
        statusBanner.innerText = "";
    }
}

pinEl.addEventListener('input', checkBurnout);
// Simple particle generation
setInterval(() => {
    particles.push(new Particle(100, 450, modeEl.value === 'TX' ? '#38bdf8' : '#22d3ee', 2, 'elec'));
}, 500);

animate();
