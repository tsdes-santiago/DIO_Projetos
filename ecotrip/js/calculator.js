import { EMISSION_FACTORS } from './emission-factors.js';

export function calculateEmission(distance, transportType) {
  const transport = EMISSION_FACTORS[transportType];

  if (!transport) {
    throw new Error('Meio de transporte inválido.');
  }

  const emission = Number(distance) * transport.factor;

  return {
    transportLabel: transport.label,
    factor: transport.factor,
    emission
  };
}

