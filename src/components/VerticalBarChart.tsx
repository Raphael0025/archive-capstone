import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

export const options = {
  plugins: {
    title: {
      display: true,
      text: 'Most Downloaded and Viewed Abstracts',
    },
  },
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

interface CustomDataset {
  label: string;
  data: number[];
  backgroundColor: string;
  stack: string;
}

// Define the props for the VerticalBarChart component
interface VerticalBarChartProps {
    datasets: CustomDataset[];
    labels: string[];
}

export default function VerticalBarChart({datasets, labels}: VerticalBarChartProps) {
  
    // Assemble the data object
    const data = {
      labels: labels,
      datasets: datasets,
    };

    return <Bar options={options} data={data} />
}