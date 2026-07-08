const canvas = document.getElementById('cpoCanvas');
const ctx = canvas.getContext('2d');
const config = {
    mode: document.getElementById('mode'),
    substrate: document.getElementById('substrate'),
    interconnect: document.getElementById('interconnect'),
    laserPower: document.getElementById('pin'),
    material: document.getElementById('material')
};
const logEntries = document.getElementById('log-entries');

let particles = [];
let burnout = false;

function log(message) {
    const li = document.createElement('li');
    li.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
    logEntries.prepend(li);
}

function drawASIC() {
    const power = parseFloat(config.laserPower.value);
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(60, 450, 250, 150);
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('ASIC (XPU)', 70, 470);
    ctx.fillText(`Data Rate: ${power * 5.6} Gbps`, 70, 500);
    ctx.fillText(`Dynamic Power: ${power * 10} mW`, 70, 520);
}

function drawCOUPE() {
    const power = parseFloat(config.laserPower.value);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(400, 450, 350, 150); // PIC
    ctx.fillStyle = '#d97706';
    ctx.fillRect(400, 350, 350, 100); // EIC
    
    ctx.fillStyle = '#fff';
    ctx.fillText('EIC Die (Drivers / TIAs)', 410, 370);
    ctx.fillText(`TIA Noise: ${(24.43 / power).toFixed(2)} uA`, 410, 390);
    ctx.fillText('PIC Die (Optical Routing Core)', 410, 470);
    
    // Sub-components
    ctx.strokeRect(420, 490, 60, 60);
    ctx.fillText('MRM (TX WDM)', 420, 485);
    ctx.strokeRect(500, 490, 60, 60);
    ctx.fillText('Ge-PD (RX Segment)', 500, 485);
    
    ctx.fillText(`Waveguide Loss: <0.01 dB/cm`, 420, 570);
    ctx.fillText(`Δn index shift: ${power * 0.001}`, 420, 590);
}

function drawOpticalCoupler() {
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(400, 150, 350, 100);
    ctx.fillText('iFAU Fiber Arrays (O-band: 1260-1360nm)', 410, 170);
    ctx.fillText('COIT (TMR Mirror)', 410, 200);
    ctx.fillText('COIB (BMR Mirror)', 410, 220);
}

function drawSubstrate() {
    const sub = config.substrate.value;
    const x = 50, y = 650, w = 800, h = 100;
    
    ctx.fillStyle = sub === 'MCM' ? '#166534' : '#1e293b';
    ctx.fillRect(x, y, w, h);
    
    ctx.fillStyle = '#fff';
    if (sub === 'MCM') {
        ctx.fillText('Standard MCM | Link: 8000um | Density: 1.0X | Power: 1.0X', 60, 680);
        ctx.strokeStyle = '#22c55e';
        for(let i=0; i<8; i++) ctx.strokeRect(60 + i*100, 700, 80, 20);
    } else if (sub === 'InFO') {
        ctx.fillText('RDL InFO | Link: 550um | Density: 12.5X | Power: 0.3X', 60, 680);
        ctx.strokeStyle = '#38bdf8';
        for(let i=0; i<40; i++) ctx.strokeRect(60 + i*20, 700, 10, 30);
    } else {
        ctx.fillText('CoWoS-L | Link: 500um | Density: 25.0X | BW: 3.6X', 60, 680);
        ctx.fillText('Eye-Diagram: Wide Open (+24% Margin)', 60, 710);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(60, 730, 780, 10);
    }
}

function drawSystem() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const power = parseFloat(config.laserPower.value);
    burnout = power > 24.43 && config.material.value === 'Si';

    drawSubstrate();
    drawASIC();
    drawCOUPE();
    drawOpticalCoupler();
    
    if (burnout) {
        ctx.fillStyle = 'red';
        ctx.font = '20px Arial';
        ctx.fillText('BURNT OUT (TPA Effect)', 400, 500);
        ctx.beginPath();
        ctx.arc(450, 500, 50, 0, Math.PI*2);
        ctx.stroke();
    }
}

function updateParticles() {
    if (burnout) return;
    
    const sub = config.substrate.value;
    const speed = sub === 'MCM' ? 0.5 : (sub === 'InFO' ? 2 : 8);
    
    if (Math.random() < 0.1) {
        particles.push({
            x: 185, y: 600,
            vx: speed, vy: 0
        });
    }

    ctx.fillStyle = '#f59e0b';
    particles.forEach((p, i) => {
        p.x += p.vx;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
        ctx.fill();
        if (p.x > 900) particles.splice(i, 1);
    });
}

function animate() {
    drawSystem();
    updateParticles();
    requestAnimationFrame(animate);
}

animate();
log("시스템 시뮬레이션 엔진이 재설계되었습니다.");
