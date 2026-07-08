const inputs = ['dy', 'gap', 'pin', 'material', 'interconnect', 'substrate'];

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

    // Interposer Data
    const eye = document.getElementById('eye-diagram-box');
    eye.classList.toggle('hidden', !(interconnect === 'SoIC' && substrate === 'CoWoS'));
}

inputs.forEach(id => document.getElementById(id).addEventListener('input', update));
update();
