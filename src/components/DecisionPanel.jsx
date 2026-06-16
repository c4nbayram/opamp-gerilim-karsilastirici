import InfoCard from './InfoCard.jsx';
import { formatTime, formatVoltage } from '../utils/formatters.js';

function DecisionPanel({ params, currentVin, decision, currentTime, onCurrentTimeChange }) {
  const vinTitle = `Anlık Vin(t=${currentTime.toFixed(2)}s)`;

  return (
    <section className={`panel decision-section ${decision.stateKey}`}>
      <div className="section-title">
        <span className="section-index">2</span>
        <div>
          <h2>Referans Gerilimi ve Karar Paneli</h2>
          <p>Anlık karar bölümü giriş ve referans gerilimini sayısal olarak karşılaştırır.</p>
        </div>
      </div>

      <div className="time-probe">
        <div>
          <strong>Karar anı</strong>
          <span>Devre şeması, LED ve karar paneli bu zaman noktasına göre güncellenir.</span>
        </div>
        <label>
          <input
            type="range"
            min="0"
            max={Math.max(0.1, params.duration)}
            step="0.01"
            value={currentTime}
            onChange={(event) => onCurrentTimeChange(Number(event.target.value))}
          />
          <em>{formatTime(currentTime, 2)}</em>
        </label>
      </div>

      <div className="decision-grid">
        <InfoCard
          title={vinTitle}
          value={formatVoltage(currentVin)}
          detail={params.signalType === 'constant' ? 'Sabit giriş değeri' : 'Seçilen karar anı'}
        />
        <InfoCard title="Vref" value={formatVoltage(params.vref)} />
        <InfoCard title="Karşılaştırma" value={decision.relation} active tone={decision.stateKey} />
        <InfoCard title="Vout" value={formatVoltage(decision.output)} detail={decision.logicState} active tone={decision.stateKey} />
        <InfoCard title="Pozitif doyum" value={formatVoltage(params.positiveSat)} />
        <InfoCard title="Negatif doyum" value={formatVoltage(params.negativeSat)} />
      </div>

      <div className="decision-flow">
        <span>Vin</span>
        <i>→</i>
        <span>Karşılaştır</span>
        <i>→</i>
        <strong>{decision.logicState}</strong>
      </div>

      <div className="rule-cards">
        <div className={`rule-card high ${decision.stateKey === 'high' ? 'active' : ''}`}>
          <strong>Vin &gt; Vref</strong>
          <span>Çıkış pozitif doyuma gider.</span>
          <b className="rule-output">Vout = {formatVoltage(params.positiveSat)}</b>
          <small>Lojik durum: HIGH</small>
        </div>
        <div className={`rule-card low ${decision.stateKey === 'low' ? 'active' : ''}`}>
          <strong>Vin &lt; Vref</strong>
          <span>Çıkış negatif doyuma gider.</span>
          <b className="rule-output">Vout = {formatVoltage(params.negativeSat)}</b>
          <small>Lojik durum: LOW</small>
        </div>
        <div className={`rule-card threshold ${decision.stateKey === 'threshold' ? 'active' : ''}`}>
          <strong>Vin = Vref</strong>
          <span>Çıkış eşik bölgesinde kararsız kabul edilir.</span>
          <b className="rule-output">Vout ≈ 0.00 V</b>
          <small>Lojik durum: EŞİK</small>
        </div>
      </div>

      <p className="decision-message">{decision.message}</p>
    </section>
  );
}

export default DecisionPanel;
