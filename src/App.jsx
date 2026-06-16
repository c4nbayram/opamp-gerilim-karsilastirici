import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import CircuitPanel from './components/CircuitPanel.jsx';
import DecisionPanel from './components/DecisionPanel.jsx';
import SignalChart from './components/SignalChart.jsx';
import SwitchingTable from './components/SwitchingTable.jsx';
import { defaultParams, presets } from './data/presets.js';
import { createSimulationData, getVinAtTime } from './utils/signalGenerators.js';
import { compareVoltages, validateParams } from './utils/comparatorLogic.js';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function App() {
  const [params, setParams] = useState(defaultParams);
  const [decisionTime, setDecisionTime] = useState(0);

  const duration = Math.max(0.1, Number(params.duration) || 4);

  useEffect(() => {
    setDecisionTime((current) => clamp(current, 0, duration));
  }, [duration]);

  const simulation = useMemo(() => createSimulationData(params), [params]);
  const warnings = useMemo(() => validateParams(params), [params]);

  const view = useMemo(() => {
    const time = clamp(Number(decisionTime) || 0, 0, duration);
    const vin = getVinAtTime(time, params);
    const decision = compareVoltages(vin, params.vref, params.positiveSat, params.negativeSat);
    return {
      currentTime: time,
      currentPoint: { time, vin, vref: params.vref, vout: decision.output },
      decision,
    };
  }, [params, decisionTime, duration]);

  const updateParam = (key, value) => {
    setParams((current) => ({
      ...current,
      [key]: key === 'signalType' ? value : Number(value),
    }));
  };

  const loadPreset = (values) => {
    setParams(values);
    setDecisionTime(0);
  };

  const resetSimulation = () => {
    setParams(defaultParams);
    setDecisionTime(0);
  };

  return (
    <div className="app-shell">
      <Header />

      <main className="content-stack">
        <CircuitPanel
          params={params}
          currentTime={view.currentTime}
          currentVin={view.currentPoint.vin}
          decision={view.decision}
          warnings={warnings}
          onChange={updateParam}
          onReset={resetSimulation}
          presets={presets}
          onLoadPreset={loadPreset}
        />

        <DecisionPanel
          params={params}
          currentVin={view.currentPoint.vin}
          decision={view.decision}
          currentTime={view.currentTime}
          onCurrentTimeChange={setDecisionTime}
        />

        <section className="panel signal-section">
          <div className="section-title">
            <span className="section-index">3</span>
            <div>
              <h2>Giriş ve Çıkış İşaret Grafikleri</h2>
              <p>Anahtarlama noktası, giriş sinyalinin referans gerilimini kestiği andır.</p>
            </div>
          </div>

          <SignalChart
            data={simulation.data}
            switchingPoints={simulation.switchingPoints}
            currentPoint={view.currentPoint}
          />
          <SwitchingTable switchingPoints={simulation.switchingPoints} />
        </section>
      </main>
    </div>
  );
}

export default App;
