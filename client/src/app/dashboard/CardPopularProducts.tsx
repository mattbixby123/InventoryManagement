import React from 'react'
import { useGetDashboardMetricsQuery } from '../state/api'

const CardPopularProducts = () => {
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

  return (
    <div className='row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16'>
      {isLoading ? (
        <div className='m-5'>Loading...</div>
      ) : (
        <>
          <h3 className='text-lg font-semibold px-7 pt-5 pb-2'>
            Popular Products
          </h3>
          <hr />
          <div className='overflow-auto h-full'>
            {dashboardMetrics?.popularProducts.map((product) => (
              <div
                key={product.productId}
                className="flex items-center justify-between gap-3 px-5 py-7 border-b"
              >
                <div>img</div>
                <div className='flex flex-col justify-between gap-1'>
                  <div className='font-bold text-gray-700'>{product.name}</div>
                  <div className='flex text-sm items-center'>
                      <span className='font-bold text-blue-500 text-xs'>
                        ${product.price}
                      </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default CardPopularProducts