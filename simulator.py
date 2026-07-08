import numpy as np
import json

def calculate_coupling_efficiency(dy, dz, dx=36e-6, w0=1e-6, n=1.5, lam=1.31e-6):
    """Section A: Rayleigh Diffraction & Overlap Integral."""
    xr = (np.pi * w0**2 * n) / lam
    w_x = w0 * np.sqrt(1 + (dx/xr)**2)
    eta0 = 1.0 # Normalized peak coupling
    eta = eta0 * np.exp(-2 * ((dy**2 + dz**2) / w_x**2))
    return eta

def calculate_nonlinear_attenuation(pin_dbm, material='Si', length=1e-3, alpha=100):
    """Section B: Waveguide Thermo-Optic Nonlinearity."""
    pin_w = 10**((pin_dbm - 30)/10)
    
    if material == 'Si':
        beta_tpa = 0.7e-11
        # Simplified solution to dP/dx = -alpha*P - (beta/Aeff)*P^2
        # Assuming Aeff is roughly 0.2 um^2
        aeff = 0.2e-12 
        # For simplicity in this demo, linear approximation with penalty
        if pin_dbm >= 24.43:
            return 0 # Burnout
        pout_w = pin_w * np.exp(-alpha * length) * (1 - (beta_tpa/aeff) * pin_w * length)
    else: # SiN
        pout_w = pin_w * np.exp(-alpha * length)
        
    return 10 * np.log10(pout_w * 1e3)

def get_cpo_metrics():
    """Section C & D: Electrical and Multiphysics metrics."""
    return {
        "SoIC_vs_Bump_Cap": 0.13,
        "SoIC_Noise_Reduction": 0.40,
        "Thermal_Drop_Percent": 15.6,
        "Eye_Width_Increase_GSGS": 24,
        "Eye_Width_Increase_GSSG": 16
    }

def run_simulation(params):
    # This function would be called by the frontend or a bridge
    dy = float(params.get('dy', 0))
    dz = float(params.get('dz', 0))
    pin = float(params.get('pin', 0))
    
    results = {
        "coupling": calculate_coupling_efficiency(dy*1e-6, dz*1e-6),
        "si_out": calculate_nonlinear_attenuation(pin, 'Si'),
        "sin_out": calculate_nonlinear_attenuation(pin, 'SiN'),
        "metrics": get_cpo_metrics()
    }
    return results

if __name__ == "__main__":
    # Test output
    print(json.dumps(run_simulation({'dy': 0.5, 'dz': 0, 'pin': 20})))
