const controls = ['dy', 'pin', 'material', 'interconnect'];
const root = document.documentElement;

function updateSimulation() {
    const dy = parseFloat(document.getElementById('dy').value);
    const pin = parseFloat(document.getElementById('pin').value);
    const material = document.getElementById('material').value;
    const interconnect = document.getElementById('interconnect').value;
    
    // 1. Coupling Efficiency Calculation
    const eta = Math.exp(-2 * Math.pow(dy / 1.6, 2));
    root.style.setProperty('--beam-width', (10 * eta) + 'px');
    root.style.setProperty('--beam-opacity', eta);
    
    // 2. Waveguide Nonlinearity
    let statusText = "Status: Normal";
    if (material === 'Si' && pin >= 24.43) {
        root.style.setProperty('--thermal-color', '#ff0000');
        statusText = "Status: Burnout Alert!";
    } else {
        root.style.setProperty('--thermal-color', '#00ff00');
    }
    
    // 3. Interconnect Scaling
    if (interconnect === 'SoIC') {
        root.style.setProperty('--signal-speed', '0.06s'); // ~16.6x faster
    } else {
        root.style.setProperty('--signal-speed', '1s');
    }
    
    document.getElementById('status').innerText = statusText;
}

controls.forEach(id => {
    document.getElementById(id).addEventListener('input', updateSimulation);
});

updateSimulation();
