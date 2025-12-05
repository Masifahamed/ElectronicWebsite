import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'

const Auth = () => {
  const authDetails = [
    {
      id: 'login',
      label: 'Login',
      path: '/auth/login'
    },
    {
      id: 'register', 
      label: 'Register',
      path: '/auth/register'
    }
  ]

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl  shadow-2xl p-8 w-150  transition-all duration-300 hover:shadow-xl">
        {/* Header with Tabs */}
        <div className="text-center mb-8 ">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h2>
          <p className="text-gray-600 mb-6">Choose your authentication method</p>
          
          {/* Tabs Navigation */}
          <div className="bg-gray-100 rounded-lg p-1 flex mb-2">
            {authDetails.map((item) => (
              <NavLink 
                to={item.path} 
                key={item.id}
                className={({ isActive }) => 
                  `flex-1 text-center py-3 px-4 rounded-md transition-all duration-300 font-medium relative overflow-hidden ${
                    isActive 
                      ? 'bg-white text-blue-600 shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="transition-all duration-300  ease-in-out">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Auth