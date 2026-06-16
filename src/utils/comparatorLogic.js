const EPSILON = 1e-6;

export function compareVoltages(vin, vref, positiveSat, negativeSat) {
  const diff = vin - vref;

  if (Math.abs(diff) <= EPSILON) {
    return {
      relation: 'Vin = Vref',
      logicState: 'EŞİK',
      output: 0,
      stateKey: 'threshold',
      message: 'Vin referans gerilimine eşit olduğu için çıkış eşik bölgesindedir.',
    };
  }

  if (diff > 0) {
    return {
      relation: 'Vin > Vref',
      logicState: 'HIGH',
      output: positiveSat,
      stateKey: 'high',
      message: 'Vin > Vref olduğu için çıkış +Vsat seviyesindedir.',
    };
  }

  return {
    relation: 'Vin < Vref',
    logicState: 'LOW',
    output: negativeSat,
    stateKey: 'low',
    message: 'Vin < Vref olduğu için çıkış -Vsat seviyesindedir.',
  };
}

export function getComparatorOutput(vin, vref, positiveSat, negativeSat, previousOutput = 0) {
  const diff = vin - vref;

  if (Math.abs(diff) <= EPSILON) {
    return previousOutput;
  }

  return diff > 0 ? positiveSat : negativeSat;
}

export function validateParams(params) {
  const warnings = [];

  if (params.positiveSat <= params.negativeSat) {
    warnings.push('+Vsat değeri -Vsat değerinden büyük olmalıdır.');
  }

  if (params.samples < 40) {
    warnings.push('Örnekleme sayısı grafiğin okunması için en az 40 olmalıdır.');
  }

  if (params.duration <= 0) {
    warnings.push('Simülasyon süresi 0 saniyeden büyük olmalıdır.');
  }

  if (params.frequency < 0) {
    warnings.push('Frekans negatif olamaz.');
  }

  return warnings;
}
