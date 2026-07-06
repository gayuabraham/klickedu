import leadsData from '../data/leads.json';

const SIMULATED_DELAY = 800;
const ERROR_CHANCE = 0;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchLeads() {
  await delay(SIMULATED_DELAY);

  if (ERROR_CHANCE > 0 && Math.random() < ERROR_CHANCE) {
    throw new Error('Failed to fetch leads. Please try again later.');
  }

  return {
    leads: JSON.parse(JSON.stringify(leadsData.leads)),
    employees: [...leadsData.employees],
  };
}
