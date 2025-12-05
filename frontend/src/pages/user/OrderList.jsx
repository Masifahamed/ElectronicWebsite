// OrderList.jsx - CORRECTED
import { Check, Home } from 'lucide-react'
import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const OrderList = () => {
 
  const navItems = [
    {
      path: '/orders',
      label: 'Order',
      icon: <Home size={20} />,
      end: true // Exact match for base path
    },
    {
      path: '/orders/active',
      label: 'Active Order',
      icon: '📦'
    },
    {
      path: '/orders/track',
      label: 'Track Order',
      icon: '🚚'
    }
  ]

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Left sidebar */}
          <div className='lg:w-1/4 bg-white rounded-lg lg:h-[650px] shadow-sm p-6 h-full'>
            <h2 className='text-lg font-semibold text-gray-700 mb-4'>Order Management</h2>
            <nav className='space-y-2'>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end || false} // Use end prop for exact matching
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right side content - ONLY this area changes */}
          <div className='lg:w-3/4'>
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <Outlet /> {/* This will show OrderPage, ActiveOrderPage, or TrackOrderPage */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderList