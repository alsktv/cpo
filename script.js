const modeSelect = document.getElementById('mode');
const canvas = document.getElementById('animation-canvas');
const ctx = canvas.getContext('2d');
const inputs = ['dy', 'gap', 'pin', 'material', 'interconnect', 'substrate'];
const insightText = document.getElementById('insight-text');
const logEntries = document.getElementById('log-entries');

let particles = [];
const paramInsights = {
    dy: "측면 오프셋: 1.6μm 초과 시 모드 중첩 감쇠로 인한 신호 손실 (>0.5dB).",
    gap: "종방향 간격: 36μm까지 최적의 콜리메이팅 유지.",
    pin: "레이저 입력 전력: >24.43dBm 시 TPA에 의한 열적 파괴 가능성.",
    material: "도파관 재질: SiN은 O-밴드 투과율이 우수함.",
    interconnect: "인터커넥트: SoIC 적용 시 기생 커패시턴스 감소.",
    substrate: "기판: CoWoS-L 적용 시 라우팅 밀도 및 신호 무결성 향상."
};

function log(message) {
    const li = document.createElement('li');
    li.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
    logEntries.prepend(li);
}

function update() {
    const mode = modeSelect.value;
    const dy = parseFloat(document.getElementById('dy').value);
    const pin = parseFloat(document.getElementById('pin').value);
    const material = document.getElementById('material').value;
    const interconnect = document.getElementById('interconnect').value;
    
    // Thermal Check
    const laserBeam = document.getElementById('laser-beam');
    if (material === 'Si' && pin >= 24.43) {
        laserBeam.classList.add('burnout');
        log("경고: TPA 효과에 의한 도파관 열적 파괴 발생!");
        document.getElementById('alert-pulse').classList.remove('hidden');
    } else {
        laserBeam.classList.remove('burnout');
        document.getElementById('alert-pulse').classList.add('hidden');
    }

    log(`시스템 모드: ${mode} 모드 활성화됨.`);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const mode = modeSelect.value;
    const speed = (document.getElementById('interconnect').value === 'SoIC') ? 5 : 0.3;
    
    // Generate/Move particles based on mode
    ctx.fillStyle = (mode === 'TX') ? '#f59e0b' : '#38bdf8';
    
    // Simplistic animation
    particles.push({x: 400, y: (mode === 'TX' ? 700 : 50), vy: (mode === 'TX' ? -speed : speed)});
    
    particles = particles.filter(p => p.y > 50 && p.y < 750);
    particles.forEach(p => {
        p.y += p.vy;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

// Event Listeners
modeSelect.addEventListener('change', update);
inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        update();
        insightText.innerText = paramInsights[id];
    });
});

update();
animate();
