const inputs = ['dy', 'gap', 'pin', 'material', 'interconnect', 'substrate'];
const layers = document.querySelectorAll('.layer');
const layerDesc = document.getElementById('layer-description');
const insightText = document.getElementById('insight-text');

// Handle dynamic parameter insight updates
const paramInsights = {
    dy: "Lateral Offset: Misalignment beyond 1.6μm causes >0.5dB signal penalty due to mode overlap decay.",
    gap: "Longitudinal Gap: Maintaining collimation allows up to 36μm spacing before beam divergence causes clipping.",
    pin: "Laser Power: Excessive CW power triggers Two-Photon Absorption (TPA) in Silicon, leading to thermal burnout.",
    material: "Waveguide Material: SiN offers superior transparency (lower propagation loss) compared to bulk Silicon in the O-band.",
    interconnect: "Interconnect: Bump-less SoIC significantly reduces parasitic capacitance compared to conventional μbumps.",
    substrate: "Substrate: CoWoS-L packaging reduces trace lengths for high-density routing and superior signal integrity."
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
