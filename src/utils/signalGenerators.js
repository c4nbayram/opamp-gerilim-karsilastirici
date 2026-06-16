import { getComparatorOutput } from './comparatorLogic.js';

const EPSILON = 1e-6;

function sanitizeNumber(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function getVinAtTime(t, params) {
  const type = params.signalType;
  const amplitude = sanitizeNumber(params.amplitude, 0);
  const offset = sanitizeNumber(params.offset, 0);
  const frequency = Math.max(0, sanitizeNumber(params.frequency, 0));

  if (type === 'constant') {
    return sanitizeNumber(params.constantVin, 0);
  }

  if (frequency === 0) {
    return offset;
  }

  const phase = (t * frequency) % 1;

  if (type === 'square') {
    return offset + (phase < 0.5 ? amplitude : -amplitude);
  }

  if (type === 'triangle') {
    const triangle = 1 - 4 * Math.abs(phase - 0.5);
    return offset + amplitude * triangle;
  }

  if (type === 'ramp') {
    return offset + amplitude * (2 * phase - 1);
  }

  return offset + amplitude * Math.sin(2 * Math.PI * frequency * t);
}

export function createSimulationData(params) {
  const duration = Math.max(0.1, sanitizeNumber(params.duration, 4));
  const sampleCount = Math.max(40, Math.round(sanitizeNumber(params.samples, 400)));
  const vref = sanitizeNumber(params.vref, 0);
  const positiveSat = sanitizeNumber(params.positiveSat, 12);
  const negativeSat = sanitizeNumber(params.negativeSat, -12);
  const data = [];
  const switchingPoints = [];
  let previousOutput = 0;
  let lastSignedPoint = null;

  for (let index = 0; index < sampleCount; index += 1) {
    const t = sampleCount === 1 ? 0 : (duration * index) / (sampleCount - 1);
    const vin = getVinAtTime(t, params);
    const vout = getComparatorOutput(vin, vref, positiveSat, negativeSat, previousOutput);
    const point = {
      index,
      time: Number(t.toFixed(6)),
      vin: Number(vin.toFixed(6)),
      vref,
      vout: Number(vout.toFixed(6)),
    };

    const currentDiff = vin - vref;
    const currentSign = Math.abs(currentDiff) <= EPSILON ? 0 : Math.sign(currentDiff);

    if (lastSignedPoint && currentSign !== 0 && lastSignedPoint.sign !== currentSign) {
      const previousDiff = lastSignedPoint.vin - vref;
      const ratio = Math.abs(previousDiff) / (Math.abs(previousDiff) + Math.abs(currentDiff));
      const switchTime = lastSignedPoint.time + (point.time - lastSignedPoint.time) * ratio;
      const direction = lastSignedPoint.sign < 0 && currentSign > 0 ? 'LOW → HIGH' : 'HIGH → LOW';

      switchingPoints.push({
        no: switchingPoints.length + 1,
        time: Number(switchTime.toFixed(6)),
        vin: vref,
        vref,
        direction,
      });
    }

    data.push(point);
    if (currentSign !== 0) {
      lastSignedPoint = { ...point, sign: currentSign };
    }
    previousOutput = vout;
  }

  return { data, switchingPoints };
}
