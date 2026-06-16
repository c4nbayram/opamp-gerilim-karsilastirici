import { useState } from 'react';
import ParameterControls from './ParameterControls.jsx';
import { formatVoltage } from '../utils/formatters.js';

function EditableValue({ fieldKey, value, x, y, box, step, editing, setEditing, onChange, textAnchor }) {
  if (editing === fieldKey) {
    return (
          <foreignObject x={box.x} y={box.y} width={box.w} height="42">
        <div className="svg-edit-wrap">
          <input
            className="svg-edit-input"
            type="number"
            step={step}
            autoFocus
            defaultValue={value}
            onChange={(event) => onChange(fieldKey, event.target.value)}
            onBlur={() => setEditing(null)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === 'Escape') setEditing(null);
            }}
          />
        </div>
      </foreignObject>
    );
  }

  return (
    <text
      className="diagram-value editable"
      x={x}
      y={y}
      textAnchor={textAnchor}
      tabIndex={0}
      role="button"
      onClick={() => setEditing(fieldKey)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setEditing(fieldKey);
        }
      }}
    >
      {formatVoltage(value)}
    </text>
  );
}

function CircuitDiagram({ params, currentTime, currentVin, decision, onChange }) {
  const [editing, setEditing] = useState(null);
  const stateClass = decision.stateKey;
  const outputLabel = decision.logicState;
  const vinEditable = params.signalType === 'constant';
  const vinLabel = vinEditable ? 'Sabit Vin' : `Vin (t=${currentTime.toFixed(2)}s)`;

  return (
    <div className={`circuit-board ${stateClass}`}>
      <svg viewBox="0 0 680 360" role="img" aria-label="Op-amp karşılaştırıcı devre şeması">
        <defs>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path className="wire input-wire" d="M66 128 H225" />
        <path className="wire reference-wire" d="M66 232 H225" />
        <path className="wire output-wire" d="M436 180 H592" />
        <path className="supply-line positive" d="M330 96 V126" />
        <path className="supply-line negative" d="M330 264 V234" />

        <circle className="node" cx="225" cy="128" r="5" />
        <circle className="node" cx="225" cy="232" r="5" />
        <circle className="node output-node" cx="592" cy="180" r="6" />

        <polygon className="opamp-body" points="225,78 225,282 440,180" />
        <text className="pin-label" x="244" y="136">+</text>
        <text className="pin-label" x="246" y="242">−</text>
        <text className="chip-label" x="296" y="184">OP-AMP</text>

        <text className="diagram-label" x="68" y="110">{vinLabel}</text>
        {vinEditable ? (
          <EditableValue
            fieldKey="constantVin"
            value={currentVin}
            x={68}
            y={151}
            box={{ x: 60, y: 126, w: 154 }}
            step={0.1}
            editing={editing}
            setEditing={setEditing}
            onChange={onChange}
          />
        ) : (
          <text className="diagram-value" x="68" y="151">
            <title>Vin sinyalden hesaplanır. Elle girmek için sinyal tipini &quot;Sabit&quot; seç.</title>
            {formatVoltage(currentVin)}
          </text>
        )}

        <text className="diagram-label" x="68" y="214">Vref</text>
        <EditableValue
          fieldKey="vref"
          value={params.vref}
          x={68}
          y={255}
          box={{ x: 60, y: 230, w: 154 }}
          step={0.1}
          editing={editing}
          setEditing={setEditing}
          onChange={onChange}
        />

        <text className="diagram-label supply-text" x="330" y="42" textAnchor="middle">+Vsat</text>
        <EditableValue
          fieldKey="positiveSat"
          value={params.positiveSat}
          x={330}
          y={70}
          textAnchor="middle"
          box={{ x: 272, y: 46, w: 116 }}
          step={0.1}
          editing={editing}
          setEditing={setEditing}
          onChange={onChange}
        />

        <text className="diagram-label supply-text" x="330" y="304" textAnchor="middle">-Vsat</text>
        <EditableValue
          fieldKey="negativeSat"
          value={params.negativeSat}
          x={330}
          y={332}
          textAnchor="middle"
          box={{ x: 266, y: 308, w: 128 }}
          step={0.1}
          editing={editing}
          setEditing={setEditing}
          onChange={onChange}
        />

        <text className="diagram-label output-text" x="492" y="150">Vout</text>
        <text className="diagram-value output-text" x="488" y="206">{formatVoltage(decision.output)}</text>

        <g className="led-pack" filter="url(#softGlow)">
          <circle className="led-ring" cx="620" cy="180" r="24" />
          <circle className="led-core" cx="620" cy="180" r="13" />
          <text className="led-text" x="620" y="238" textAnchor="middle">{outputLabel}</text>
        </g>
      </svg>
      <span className="circuit-hint">İpucu: Şemadaki değerlere tıklayarak düzenleyebilirsin.</span>
    </div>
  );
}

function CircuitPanel({ params, currentTime, currentVin, decision, warnings, onChange, onReset, presets, onLoadPreset }) {
  return (
    <section className="panel circuit-section">
      <div className="section-title">
        <span className="section-index">1</span>
        <div>
          <h2>Op-Amp Karşılaştırıcı Devresi</h2>
          <p>Değerleri sağdaki panelden ya da doğrudan şema üzerine tıklayarak değiştir.</p>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="warning-strip">
          {warnings.map((warning) => (
            <span key={warning}>{warning}</span>
          ))}
        </div>
      )}

      <div className="circuit-layout">
        <CircuitDiagram
          params={params}
          currentTime={currentTime}
          currentVin={currentVin}
          decision={decision}
          onChange={onChange}
        />
        <ParameterControls
          params={params}
          onChange={onChange}
          presets={presets}
          onLoadPreset={onLoadPreset}
          onReset={onReset}
        />
      </div>
    </section>
  );
}

export default CircuitPanel;
