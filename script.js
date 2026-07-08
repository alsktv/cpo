const canvas = document.getElementById('cpoCanvas');
const ctx = canvas.getContext('2d');
const modeSelect = document.getElementById('mode');
const logEntries = document.getElementById('log-entries');

// Simulation State
let particles = [];
let burnout = false;

function log(message) {
    const li = document.createElement('li');
    li.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
    logEntries.prepend(li);
}

function drawSystem() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Substrate
    ctx.fillStyle = '#334155';
    ctx.fillRect(50, 700, 700, 50); // Foundation
    
    // 2. Interposer
    ctx.fillStyle = '#475569';
    ctx.fillRect(50, 650, 700, 50);
    
    // 3. ASIC Block (Left)
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(60, 450, 250, 200);
    
    // 4. COUPE Optical Engine (Right)
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(350, 450, 350, 200); // PIC Layer
    ctx.fillStyle = '#d97706';
    ctx.fillRect(350, 350, 350, 100); // EIC Layer

    // Draw Micro components (PD, MRM)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(400, 460, 20, 20); // PD
    ctx.beginPath();
    ctx.arc(500, 470, 15, 0, Math.PI*2);
    ctx.stroke(); // MRM

    // Vertical Optical Stack
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(500, 350); ctx.lineTo(500, 100); ctx.stroke(); // Lens stack
}

function updateParticles() {
    const mode = modeSelect.value;
    const isSoIC = document.getElementById('interconnect').value === 'SoIC';
    const speed = isSoIC ? 16.6 : 1.0;
    
    // Logic for particles based on mode
    if (Math.random() < 0.1) {
        particles.push({
            x: mode === 'TX' ? 185 : 500,
            y: mode === 'TX' ? 650 : 100,
            vx: mode === 'TX' ? speed : 0,
            vy: mode === 'TX' ? 0 : speed,
            color: mode === 'TX' ? '#f59e0b' : '#38bdf8'
        });
    }

    ctx.fillStyle = '#f59e0b';
    particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
        ctx.fill();
        
        if (p.x > 800 || p.y > 800) particles.splice(index, 1);
    });
}

function animate() {
    drawSystem();
    if (!burnout) updateParticles();
    requestAnimationFrame(animate);
}

// Thermal Safety
function checkBurnout() {
    const material = document.getElementById('material').value;
    const pin = parseFloat(document.getElementById('pin').value);
    if (material === 'Si' && pin >= 24.43) {
        burnout = true;
        log("CRITICAL: TPA Burnout detected!");
        document.getElementById('alert-pulse').classList.remove('hidden');
    }
}

document.getElementById('pin').addEventListener('input', checkBurnout);
animate();
