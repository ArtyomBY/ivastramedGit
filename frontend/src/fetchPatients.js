import api from './api';

async function fetchPatients() {
  try {
    const response = await api.get('/patients');
    console.log('Patients:', response.data);
  } catch (error) {
    console.error('Error fetching patients:', error);
  }
}

fetchPatients();
