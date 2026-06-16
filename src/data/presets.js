export const defaultParams = {
  constantVin: 2,
  vref: 1,
  positiveSat: 12,
  negativeSat: -12,
  signalType: 'sine',
  amplitude: 4,
  offset: 0,
  frequency: 1,
  duration: 4,
  samples: 400,
};

export const signalTypes = [
  { value: 'sine', label: 'Sinüs' },
  { value: 'triangle', label: 'Üçgen' },
  { value: 'square', label: 'Kare' },
  { value: 'ramp', label: 'Rampa' },
  { value: 'constant', label: 'Sabit' },
];

export const presets = [
  {
    name: 'Sinüs girişli',
    values: { ...defaultParams, signalType: 'sine', amplitude: 4, offset: 0, frequency: 1 },
  },
  {
    name: 'Sabit Vin > Vref',
    values: { ...defaultParams, signalType: 'constant', constantVin: 5, vref: 1 },
  },
  {
    name: 'Sabit Vin < Vref',
    values: { ...defaultParams, signalType: 'constant', constantVin: -2, vref: 1 },
  },
  {
    name: 'Yüksek frekans',
    values: { ...defaultParams, signalType: 'sine', amplitude: 3.5, frequency: 4, samples: 700 },
  },
  {
    name: 'Offsetli sinyal',
    values: { ...defaultParams, signalType: 'triangle', amplitude: 2.8, offset: 1.8, vref: 1 },
  },
];
