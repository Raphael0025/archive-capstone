import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: { title: string; viewCount?: number; downloadCount?: number }[];
  title: string;
  parameter: 'viewCount' | 'downloadCount';
}

export default function PieChart({ data, title, parameter }: PieChartProps) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    // Handle the case when data is undefined, not an array, or an empty array
    return <div>No data available</div>;
  }

  const chartData = {
    labels: data.map((item) => item.title),
    datasets: [
      {
        label: parameter === 'viewCount' ? 'View Count' : 'Download Count',
        data: data.map((item) => (parameter === 'viewCount' ? item.viewCount || 0 : item.downloadCount)),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className='widgets p-2 w-full h-fit flex flex-col items-center rounded justify-center'>
      <h2 className='font-medium text-start text-base'>{title}</h2>
      <Doughnut
        className='w-1/2'
        options={{
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: 'white',
              },
            },
          },
        }}
        data={chartData}
      />
    </div>
  );
}
