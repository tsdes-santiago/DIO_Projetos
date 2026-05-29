import { calculateEmission } from './calculator.js';
import { buildComparisonTable } from './comparison.js';

const form = document.getElementById('trip-form');
const result = document.getElementById('result');
const comparisonWrapper = document.getElementById('comparison-table-wrapper');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const origin = formData.get('origin')?.toString().trim();
  const destination = formData.get('destination')?.toString().trim();
  const distance = Number(formData.get('distance'));
  const transport = formData.get('transport')?.toString();

  if (!origin || !destination || !distance || !transport) {
    result.textContent = 'Preencha todos os campos para calcular a emissão.';
    result.className = 'result-placeholder';
    return;
  }

  try {
    const calculation = calculateEmission(distance, transport);

    result.className = 'result-content';
    result.innerHTML = `
      <p><strong>Rota:</strong> ${origin} → ${destination}</p>
      <p><strong>Transporte:</strong> ${calculation.transportLabel}</p>
      <p><strong>Distância:</strong> ${distance.toFixed(1)} km</p>
      <p><strong>Fator de emissão:</strong> ${calculation.factor.toFixed(3)} kg CO2e/km</p>
      <p><strong>Emissão estimada:</strong> ${calculation.emission.toFixed(2)} kg CO2e</p>
    `;

    comparisonWrapper.innerHTML = buildComparisonTable(distance);

  } catch (error) {
    result.textContent = error.message;
    result.className = 'result-placeholder';
  }
});