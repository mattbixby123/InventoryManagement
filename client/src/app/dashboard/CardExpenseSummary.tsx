"use client";

import { ExpenseByCategorySummary, useGetDashboardMetricsQuery } from '@/state/api';
import { TrendingUp } from 'lucide-react';
import React from 'react'
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type ExpenseSums = {
  [category: string]: number;
}

const colors = ["#00C49F", "#0088FE", "#FFBB28"]

const CardExpenseSummary = () => {
  const { data: dashboardMetrics , isLoading } = useGetDashboardMetricsQuery();

  const expenseSummaryData = dashboardMetrics?.expenseSummary || [];
  const expenseByCategorySummary = dashboardMetrics?.expenseByCategorySummary || [];

  // Calculate total expenses across all days
  const totalExpensesAllDays = expenseSummaryData.reduce(
    (acc, curr) => acc + curr.totalExpenses,
    0
  ) || 0;

  // Calculate average expenses per day
  const averageExpenses = expenseSummaryData.length > 0 
    ? totalExpensesAllDays / expenseSummaryData.length 
    : 0;

  const expenseSums = expenseByCategorySummary.reduce(
    (acc: ExpenseSums, item: ExpenseByCategorySummary) => {
      const category = item.category + " Expenses";
      const amount = parseInt(item.amount, 10);
      if(!acc[category]) acc[category] = 0;
      acc[category] += amount;
      return acc;
    },
    {}
  );
  
  const expenseCategories = Object.entries(expenseSums).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const totalExpenses = expenseCategories.reduce(
    (acc, category: { value: number }) => acc + category.value,
    0
  );
  
  const formattedTotalExpenses = totalExpenses.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const chartData = {
    labels: expenseCategories.map(item => item.name),
    datasets: [
      {
        data: expenseCategories.map(item => item.value),
        backgroundColor: colors,
        borderWidth: 0,
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
    },
    cutout: '70%',
  };

  return (
    <div className='row-span-3 bg-white shadow-md rounded-2xl flex flex-col justify-between'>
      {isLoading ? ( 
        <div className='m-5'>Loading...</div> 
      ) : ( 
        <> 
          {/* HEADER */}
          <div>
            <h2 className='text-lg font-semibold mb-2 px-7 pt-5'>
              Expense Summary
            </h2>
            <hr />
          </div>
          {/* BODY */}
          <div className='xl:flex justify-between pr-7'>
            {/* CHART */}
            <div className='relative basis-3/5' style={{ height: '140px' }}>
              <Doughnut data={chartData} options={options} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="font-bold text-xl">
                  ${formattedTotalExpenses}
                </span>
              </div>
            </div>
            {/* LABELS */}
            <ul className="flex flex-col justify-around items-center xl:items-start py-3 gap-1">
              {expenseCategories.map((entry, index) => (
                <li
                  key={`legend-${index}`}
                  className="flex items-center text-xs"
                >
                  <span
                    className="mr-2 w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></span>
                  <span className="whitespace-nowrap">
                    {entry.name.replace(' Expenses', '')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* FOOTER */}
          <div>
            <hr />
            {expenseSummaryData.length > 0 && (
              <div className="mt-3 flex justify-between items-center px-7 mb-4">
                <div className="pt-2">
                  <p className="text-sm">
                    Average:{" "}
                    <span className="font-semibold">
                      ${averageExpenses.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </p>
                </div>
                <span className="flex items-center mt-2">
                  <TrendingUp className="mr-2 text-green-500" />
                  30%
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
export default CardExpenseSummary;