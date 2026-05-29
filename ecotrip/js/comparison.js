import { EMISSION_FACTORS } from './emission-factors.js';

const CARBON_PRICE_USD_PER_TON = 19;

export function buildComparisonTable(distance) {
  const rows = Object.entries(EMISSION_FACTORS)
    .map(([key, transport]) => {
      const emissionKg = distance * transport.factor;
      const emissionTon = emissionKg / 1000;
      const carbonCost = emissionTon * CARBON_PRICE_USD_PER_TON;

      return {
        key,
        label: transport.label,
        factor: transport.factor,
        emissionKg,
        carbonCost
      };
    })
    .sort((a, b) => a.emissionKg - b.emissionKg);

  const tableRows = rows.map((item, index) => `
    <tr class="${index === 0 ? 'best-option' : ''}">
      <td>${item.label}</td>
      <td>${item.factor.toFixed(3)} kg CO2e/km</td>
      <td>${item.emissionKg.toFixed(2)} kg CO2e</td>
      <td>US$ ${item.carbonCost.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <table class="comparison-table">
      <thead>
        <tr>
          <th>Transporte</th>
          <th>Fator de emissão</th>
          <th>Emissão total</th>
          <th>Custo estimado do carbono</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    <p class="comparison-note">
      Estimativa de custo baseada em US$ ${CARBON_PRICE_USD_PER_TON}/tCO2e.
    </p>
  `;
}