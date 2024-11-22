import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getVentasTotalesMensuales } from '../services/venta_service/api';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VentasMensualesChart = () => {
  const [ventasMensuales, setVentasMensuales] = useState({
    JANUARY: 0,
    FEBRUARY: 0,
    MARCH: 0,
    APRIL: 0,
    MAY: 0,
    JUNE: 0,
    JULY: 0,
    AUGUST: 0,
    SEPTEMBER: 0,
    OCTOBER: 0,
    NOVEMBER: 0,
    DECEMBER: 0
  });

  useEffect(() => {
    fetchVentasMensuales();
  }, []);

  const fetchVentasMensuales = async () => {
    try {
      const data = await getVentasTotalesMensuales();
      setVentasMensuales(data);
    } catch (error) {
      console.error('Error al obtener los datos de ventas mensuales:', error);
    }
  };

  const chartData = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Ventas Totales por Mes',
        data: [
          ventasMensuales.JANUARY,
          ventasMensuales.FEBRUARY,
          ventasMensuales.MARCH,
          ventasMensuales.APRIL,
          ventasMensuales.MAY,
          ventasMensuales.JUNE,
          ventasMensuales.JULY,
          ventasMensuales.AUGUST,
          ventasMensuales.SEPTEMBER,
          ventasMensuales.OCTOBER,
          ventasMensuales.NOVEMBER,
          ventasMensuales.DECEMBER
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '80%', height: '400px', margin: '0 auto' }}>
      <h3 className="text-center">Comparativa de Ventas Mensuales</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default VentasMensualesChart;
