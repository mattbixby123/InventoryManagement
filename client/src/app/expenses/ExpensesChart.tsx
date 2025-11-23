"use client";

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type AggregatedDataItem = {
  name: string;
  color?: string;
  amount: number;
};

interface ExpensesChartProps {
  aggregatedData: AggregatedDataItem[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export default function ExpensesChart({ 
  aggregatedData, 
  activeIndex: _activeIndex, 
  setActiveIndex 
}: ExpensesChartProps) {
  const chartData = {
    labels: aggregatedData.map(item => item.name),
    datasets: [
      {
        data: aggregatedData.map(item => item.amount),
        backgroundColor: aggregatedData.map(item => item.color || '#8884d8'),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: { label: string; parsed: number }) {
            return `${context.label}: $${context.parsed.toLocaleString()}`;
          }
        }
      }
    },
    onHover: (_event: unknown, elements: { index: number }[]) => {
      if (elements.length > 0) {
        setActiveIndex(elements[0].index);
      }
    }
  };

  return (
    <div className="flex-grow bg-white dark:bg-gray-800 shadow rounded-lg p-4 md:p-6">
      <div style={{ height: '400px' }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}