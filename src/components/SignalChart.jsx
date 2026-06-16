import { memo, useMemo } from 'react';
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatTime, formatVoltage } from '../utils/formatters.js';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const marker = payload.find((item) => item.payload?.markerType);
  const source = marker?.payload ?? payload[0].payload;
  const title =
    source.markerType === 'switch'
      ? 'Anahtarlama noktası'
      : source.markerType === 'probe'
        ? 'Karar anı'
        : `t = ${formatTime(label)}`;

  return (
    <div className="chart-tooltip">
      <strong>{title}</strong>
      <span>Vin: {formatVoltage(source.vin)}</span>
      <span>Vref: {formatVoltage(source.vref)}</span>
      {source.vout !== undefined && <span>Vout: {formatVoltage(source.vout)}</span>}
      {source.markerType === 'switch' && source.direction && <span>Geçiş: {source.direction}</span>}
    </div>
  );
}

function SignalChart({ data, switchingPoints, currentPoint }) {
  const markerData = useMemo(
    () => switchingPoints.map((point) => ({ ...point, markerType: 'switch', vout: undefined })),
    [switchingPoints],
  );
  const currentMarker = useMemo(
    () => (currentPoint ? [{ ...currentPoint, markerType: 'probe' }] : []),
    [currentPoint],
  );

  return (
    <div className="scope-shell">
      <div className="scope-toolbar">
        <span>OSC-01</span>
        <span>Zaman (s)</span>
        <span>Gerilim (V)</span>
      </div>
      <div className="scope-screen">
        <ResponsiveContainer width="100%" height={430}>
          <ComposedChart data={data} margin={{ top: 26, right: 28, bottom: 26, left: 12 }}>
            <CartesianGrid stroke="#24445b" strokeDasharray="3 7" />
            <XAxis
              dataKey="time"
              type="number"
              domain={['dataMin', 'dataMax']}
              tick={{ fill: '#c8dceb', fontSize: 14 }}
              tickFormatter={(value) => Number(value).toFixed(1)}
              label={{ value: 'Zaman (s)', position: 'insideBottom', offset: -14, fill: '#dcecf7', fontSize: 15 }}
            />
            <YAxis
              tick={{ fill: '#c8dceb', fontSize: 14 }}
              label={{ value: 'Gerilim (V)', angle: -90, position: 'insideLeft', fill: '#dcecf7', fontSize: 15 }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend verticalAlign="top" wrapperStyle={{ color: '#dbe9f4', fontSize: 15 }} />
            <Line type="monotone" name="Vin(t)" dataKey="vin" stroke="#45d7ff" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            <Line type="monotone" name="Vref" dataKey="vref" stroke="#f4c84a" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="stepAfter" name="Vout(t)" dataKey="vout" stroke="#b78cff" strokeWidth={2.4} dot={false} isAnimationActive={false} />
            {switchingPoints.slice(0, 40).map((point) => (
              <ReferenceLine
                key={`${point.no}-${point.time}`}
                x={point.time}
                stroke="#ffdf79"
                strokeOpacity={0.4}
                strokeDasharray="2 6"
              />
            ))}
            {currentPoint && (
              <ReferenceLine y={currentPoint.vref} stroke="#f4c84a" strokeOpacity={0.28} strokeDasharray="3 5" />
            )}
            {currentPoint && (
              <ReferenceLine
                x={currentPoint.time}
                stroke="#45d7ff"
                strokeOpacity={0.5}
                strokeDasharray="6 4"
              />
            )}
            <Scatter name="Anahtarlama" data={markerData} dataKey="vin" fill="#ffffff" stroke="#ffdf79" strokeWidth={2} isAnimationActive={false} />
            <Scatter name="Karar anı" data={currentMarker} dataKey="vin" fill="#45d7ff" stroke="#ffffff" strokeWidth={2} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default memo(SignalChart);
