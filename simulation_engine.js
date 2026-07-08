const inputs = ['dy', 'gap', 'pin', 'material', 'interconnect', 'substrate'];
const logEntries = document.getElementById('log-entries');

function addLog(message) {
    const li = document.createElement('li');
    li.innerText = message;
    logEntries.prepend(li);
}

function update() {
    const dy = parseFloat(document.getElementById('dy').value);
    const gap = parseFloat(document.getElementById('gap').value);
    const pin = parseFloat(document.getElementById('pin').value);
    const material = document.getElementById('material').value;
    const interconnect = document.getElementById('interconnect').value;
    
    // Lens Positioning (Gap Effect)
    const lensTop = document.getElementById('lens-top');
    const lensBottom = document.getElementById('lens-bottom');
    const beam = document.getElementById('laser-beam');
    
    // Gap adjusts vertical position of bottom lens
    lensBottom.setAttribute('cy', 350 + (gap * 0.5));
    beam.setAttribute('y2', 335 + (gap * 0.5));
    
    // Alignment Alert
    const alert = document.getElementById('alert-pulse');
    if (dy > 1.6) {
        alert.classList.remove('hidden');
    } else {
        alert.classList.add('hidden');
    }

    // Interconnect Logic
    const bondNodes = document.getElementById('bond-nodes');
    bondNodes.innerHTML = '';
    const isSoIC = (interconnect === 'SoIC');
    
    // Render Bond Nodes
    const count = isSoIC ? 20 : 5;
    const spacing = isSoIC ? 15 : 60;
    
    for(let i=0; i<count; i++) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", 250 + (i * spacing));
        circle.setAttribute("cy", 580);
        circle.setAttribute("r", isSoIC ? 2 : 8);
        circle.setAttribute("fill", isSoIC ? "#10b981" : "#f59e0b");
        bondNodes.appendChild(circle);
    }
    
    if (isSoIC) {
        addLog("SoIC 본딩 선택: 루프 기생 성분 85% 감소, 속도 16.6배 향상, 수신기 노이즈 40% 감소.");
        document.getElementById('eic-layer').style.stroke = "#10b981";
    } else {
        document.getElementById('eic-layer').style.stroke = "none";
    }

    // Burnout Logic
    const pic = document.getElementById('pic-layer');
    if (material === 'Si' && pin >= 24.43) {
        beam.classList.add('burnout');
        addLog("경고: 24.43 dBm에서 실리콘 도파관 열적 파괴 발생 (TPA/FCA).");
    } else {
        beam.classList.remove('burnout');
    }
}

inputs.forEach(id => document.getElementById(id).addEventListener('input', update));
update();
