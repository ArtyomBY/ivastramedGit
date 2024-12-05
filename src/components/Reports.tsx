import React from 'react';
import { Typography, Card, CardContent } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль'],
  datasets: [
    {
      label: 'Посещения сайта',
      data: [1500, 2300, 1800, 2900, 3200, 4100, 3900],
      borderColor: '#42a5f5',
      backgroundColor: 'rgba(66, 165, 245, 0.5)',
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Посещаемость сайта по месяцам',
    },
  },
};

const Reports: React.FC = () => {
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">Отчеты</Typography>
        <Line data={data} options={options} />
      </CardContent>
    </Card>
  );
};

export default Reports;
