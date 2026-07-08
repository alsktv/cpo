const inputs = ['dy', 'gap', 'material', 'pin', 'interconnect', 'substrate'];

function update() {
    const dy = parseFloat(document.getElementById('dy').value);
    const pin = parseFloat(document.getElementById('pin').value);
    const material = document.getElementById('material').value;
    const interconnect = document.getElementById('interconnect').value;
    const substrate = document.getElementById('substrate').value;

    // 1. Coupling & Alert
    const beamPath = document.getElementById('beam-path');
    beamPath.setAttribute('d', `M0 25 L 600 25`);
    const alertBox = document.getElementById('alert-box');
    if (dy > 1.6) {
        beamPath.classList.add('blur');
        alertBox.classList.remove('hidden');
    } else {
        beamPath.classList.remove('blur');
        alertBox.classList.add('hidden');
    }

    // 2. Waveguide Burnout/Glow
    const picLayer = document.getElementById('layer-pic');
    if (material === 'Si' && pin >= 24.43) {
        picLayer.style.backgroundColor = '#7f1d1d'; // Dark red
        picLayer.style.boxShadow = '0 0 20px #ef4444';
    } else if (material === 'SiN') {
        picLayer.style.backgroundColor = '#1e3a8a'; // Dark blue
        picLayer.style.boxShadow = `0 0 ${pin - 15}px #38bdf8`;
    } else {
        picLayer.style.backgroundColor = '#1f2937';
        picLayer.style.boxShadow = 'none';
    }

    // 3. Scaling & Thermal
    const eicLayer = document.getElementById('layer-eic');
    const eye = document.getElementById('eye-diagram');
    if (interconnect === 'SoIC' && substrate === 'CoWoS') {
        eicLayer.style.backgroundColor = '#064e3b'; // Cool blue/green
        eye.classList.remove('hidden');
    } else {
        eicLayer.style.backgroundColor = '#f59e0b'; // Orange
        eye.classList.add('hidden');
    }
}

inputs.forEach(id => document.getElementById(id).addEventListener('input', update));
update();
