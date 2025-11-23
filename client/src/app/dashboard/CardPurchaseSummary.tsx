"use client";

import React from 'react'
import { useGetDashboardMetricsQuery } from '../../state/api';
import numeral from 'numeral';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

const CardPurchaseSummary = () => {
  const { data, isLoading } = useGetDashboardMetricsQuery();
  const purchaseData = data?.purchaseSummary || [];

  const lastDataPoint = purchaseData[purchaseData.length - 1] || null;

  const chartData = {
    labels: purchaseData.map(() => ''),
    datasets: [
      {
        data: purchaseData.map(item => item.totalPurchased),
        borderColor: '#8884d8',
        backgroundColor: 'rgba(136, 132, 216, 0.5)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#8884d8',
        pointBorderColor: '#8884d8',
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          title: function(context: any) {
            const index = context[0].dataIndex;
            const date = new Date(purchaseData[index].date);
            return date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
          },
          label: function(context: any) {
            return `$${context.parsed.y.toLocaleString("en")}`;
          }
        }
      }
    },
    scales: {
      y: {
        display: false,
        beginAtZero: true,
      },
      x: {
        display: false,
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    }
  };

  return (
    <div className='flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl overflow-hidden'>
      {isLoading ? ( <div className='m-5'>Loading...</div> 
    ) : ( 
      <> 
        {/* HEADER */}
        <div>
          <h2 className='text-lg font-semibold mb-2 px-7 pt-5'>
            Purchase Summary
          </h2>
          <hr />
        </div>

        {/* BODY */}
        <div className='flex-1 flex flex-col'>
          {/* BODY HEADER */}
          <div className='mb-2 mt-0 px-7'>
            <p className='text-xs text-gray-400'>Purchased</p>
            <div className='flex items-center'>
              <p className='text-2xl font-bold'>
                {lastDataPoint 
                  ? numeral(lastDataPoint.totalPurchased).format("$0.00a")
                  : "0"}
              </p>
              {lastDataPoint && (
                <p 
                className={`text-sm ${ 
                  lastDataPoint.changePercentage! >= 0
                  ? "text-green-500" 
                  : "text-red-500"
                } flex ml-3`}
                >
                  {lastDataPoint.changePercentage! >= 0 ? (
                    <TrendingUp className='w-5 h-5 mr-1'/>
                  ) : (
                    <TrendingDown className='w-5 h-5 mr-1' />
                  )}
                  {Math.abs(lastDataPoint.changePercentage!)}%
                </p>
              )}
            </div>
          </div>
          {/* CHART */}
          <div className="flex-1 px-7 pb-5 min-h-0">
            <div style={{ height: '100%', maxHeight: '200px' }}>
              <Line data={chartData} options={options} />
            </div>
          </div>
        </div>
      </> 
    )}
    </div>
  )
}

export default CardPurchaseSummary