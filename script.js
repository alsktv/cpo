const inputs = ['dy', 'gap', 'pin', 'material', 'interconnect', 'substrate'];
const layers = document.querySelectorAll('.layer');
const layerDesc = document.getElementById('layer-description');
const insightText = document.getElementById('insight-text');

// Handle dynamic parameter insight updates
const paramInsights = {
    dy: "측면 오프셋: 1.6μm를 초과하는 오정렬은 모드 중첩 감쇠로 인해 >0.5dB의 신호 손실을 유발합니다.",
    gap: "종방향 간격: 평행 콜리메이팅을 통해 36μm까지의 간격까지는 빔 발산으로 인한 손실을 억제합니다.",
    pin: "레이저 입력 전력: 과도한 CW 전력은 실리콘 내 2광자 흡수(TPA)를 유발하여 열적 파괴를 초래합니다.",
    material: "도파관 재질: 질화규소(SiN)는 실리콘에 비해 O-밴드에서 광 투과율이 우수하고 손실이 적습니다.",
    interconnect: "인터커넥트: 펌프 없는 SoIC는 기존 μ범프 대비 기생 커패시턴스를 획기적으로 줄여줍니다.",
    substrate: "기판: CoWoS-L 패키징은 배선 경로를 단축하여 고밀도 라우팅과 신호 무결성을 향상시킵니다."
};

function update() {
    const dy = parseFloat(document.getElementById('dy').value);
    const pin = parseFloat(document.getElementById('pin').value);
    const material = document.getElementById('material').value;
    const interconnect = document.getElementById('interconnect').value;
    const substrate = document.getElementById('substrate').value;

    // Alignment Mechanics
    const lensTop = document.getElementById('lens-top');
    lensTop.setAttribute('cx', 400 + (dy * 20));
    
    const beam = document.getElementById('laser-beam');
    if (dy > 1.6) {
        beam.style.filter = 'blur(5px)';
        document.getElementById('alert-pulse').classList.remove('hidden');
    } else {
        beam.style.filter = 'none';
        document.getElementById('alert-pulse').classList.add('hidden');
    }

    // Thermal/Burnout
    const eic = document.getElementById('eic-layer');
    eic.style.fill = (interconnect === 'SoIC') ? '#10b981' : '#f59e0b';
    
    const track = document.getElementById('waveguide-track');
    if (material === 'Si' && pin >= 24.43) {
        track.classList.add('burnout');
        track.setAttribute('fill', '#374151');
    } else {
        track.classList.remove('burnout');
        track.setAttribute('fill', material === 'SiN' ? '#38bdf8' : '#fbbf24');
    }
}

// Layer hover interactions
layers.forEach(layer => {
    layer.addEventListener('mouseover', () => {
        layerDesc.innerText = layer.getAttribute('data-info');
    });
});

// Parameter change interactions
inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', (e) => {
        update();
        insightText.innerText = paramInsights[id];
    });
});

update();
