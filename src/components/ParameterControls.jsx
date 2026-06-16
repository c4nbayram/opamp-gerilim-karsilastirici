import { signalTypes } from '../data/presets.js';

const controls = [
  { key: 'constantVin', label: 'Sabit Vin değeri', unit: 'V', min: -15, max: 15, step: 0.1, onlyConstant: true },
  { key: 'vref', label: 'Vref', unit: 'V', min: -12, max: 12, step: 0.1 },
  { key: 'positiveSat', label: '+Vsat', unit: 'V', min: -15, max: 20, step: 0.1 },
  { key: 'negativeSat', label: '-Vsat', unit: 'V', min: -20, max: 15, step: 0.1 },
  { key: 'amplitude', label: 'Genlik', unit: 'V', min: 0, max: 12, step: 0.1 },
  { key: 'frequency', label: 'Frekans', unit: 'Hz', min: 0, max: 8, step: 0.1 },
  { key: 'offset', label: 'Offset', unit: 'V', min: -10, max: 10, step: 0.1 },
  { key: 'duration', label: 'Simülasyon süresi', unit: 's', min: 0.5, max: 10, step: 0.1 },
  { key: 'samples', label: 'Örnekleme sayısı', unit: '', min: 40, max: 1000, step: 10 },
];

function ParameterControls({ params, onChange, presets, onLoadPreset, onReset }) {
  return (
    <div className="control-bank">
      <div className="control-bank-head">
        <h3>Devre Parametreleri</h3>
        <span>Giriş, referans ve doyum değerlerini buradan ayarlayın.</span>
      </div>

      <div className="control-topline">
        <label className="select-control">
          <span>Sinyal tipi</span>
          <select value={params.signalType} onChange={(event) => onChange('signalType', event.target.value)}>
            {signalTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <button className="ghost-button" type="button" onClick={onReset}>
          Simülasyonu sıfırla
        </button>
      </div>

      <div className="preset-row" aria-label="Örnek senaryolar">
        {presets.map((preset) => (
          <button key={preset.name} type="button" onClick={() => onLoadPreset(preset.values)}>
            {preset.name}
          </button>
        ))}
      </div>

      <div className="knob-grid">
        {controls.map((control) => {
          const disabled = control.onlyConstant && params.signalType !== 'constant';

          return (
            <label key={control.key} className={`range-control ${disabled ? 'disabled' : ''}`}>
              <span className="control-label">
                {control.label}
                {disabled && <small>Sadece sabit sinyalde kullanılır</small>}
              </span>
              <div className="range-line">
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={params[control.key]}
                  disabled={disabled}
                  onChange={(event) => onChange(control.key, event.target.value)}
                />
                <div className="number-box">
                  <input
                    type="number"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={params[control.key]}
                    disabled={disabled}
                    onChange={(event) => onChange(control.key, event.target.value)}
                  />
                  {control.unit && <em>{control.unit}</em>}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default ParameterControls;
