const canvas = document.getElementById('cpoCanvas');
const ctx = canvas.getContext('2d');
const modeSelect = document.getElementById('mode');
const substrateSelect = document.getElementById('substrate');
const logEntries = document.getElementById('log-entries');

let particles = [];
let burnout = false;

function log(message) {
    const li = document.createElement('li');
    li.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
    logEntries.prepend(li);
}

function drawSystem() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const substrate = substrateSelect.value;
    const interconnect = document.getElementById('interconnect').value;

    // 1. Substrate Layer (Dynamic)
    ctx.fillStyle = substrate === 'MCM' ? '#166534' : '#1e293b';
    ctx.fillRect(50, 650, 800, 100);
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    
    if (substrate === 'MCM') {
        ctx.fillText('Standard MCM | Link: 8000um | Density: 1.0X | Power: 1.0X', 60, 710);
    } else if (substrate === 'InFO') {
        ctx.fillText('RDL InFO | Link: 550um | Density: 12.5X | Power: 0.3X', 60, 710);
    } else {
        ctx.fillText('CoWoS-L | Link: 500um | Density: 25.0X | BW: 3.6X', 60, 710);
        ctx.fillText('Eye-Diagram: Wide Open (+24% Margin)', 60, 730);
    }
    
    // 2. ASIC (XPU)
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(60, 450, 250, 150);
    ctx.fillStyle = '#fff';
    ctx.fillText('ASIC (XPU)', 70, 470);
    ctx.fillText('Data Rate: 112 Gbps', 70, 500);

    // 3. COUPE Engine
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(400, 450, 350, 150); // PIC
    ctx.fillStyle = '#d97706';
    ctx.fillRect(400, 350, 350, 100); // EIC
    
    ctx.fillStyle = '#fff';
    ctx.fillText('EIC Die (Drivers / TIAs)', 410, 370);
    ctx.fillText('PIC Die (Optical Core)', 410, 470);
    ctx.fillText('MRM (TX WDM)', 420, 500);
    ctx.fillText('Ge-PD (RX Segment)', 420, 530);

    // 4. Optical Stack
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(400, 150, 350, 100); // iFAU
    ctx.fillText('iFAU Fiber Arrays (O-band: 1260-1360nm)', 410, 170);
}

function updateParticles() {
    const mode = modeSelect.value;
    const speed = (document.getElementById('interconnect').value === 'SoIC') ? 5 : 0.5;
    
    if (Math.random() < 0.1) {
        particles.push({
            x: mode === 'TX' ? 185 : 500,
            y: 600,
            vx: mode === 'TX' ? speed : 0,
            vy: mode === 'TX' ? 0 : speed
        });
    }

    ctx.fillStyle = mode === 'TX' ? '#f59e0b' : '#38bdf8';
    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y -= p.vy;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
        ctx.fill();
        if (p.x > 900 || p.y < 0) particles.splice(i, 1);
    });
}

function animate() {
    drawSystem();
    if (!burnout) updateParticles();
    requestAnimationFrame(animate);
}

animate();
log("시스템 파라미터가 캔버스에 로드되었습니다.");
