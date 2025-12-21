// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  BadgePercent,
  List
} from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.dispatchEvent(new Event('storage'));
      navigate('/auth/login');
    }
  };

  const loadProducts = () => {
    console.log('Loading products...');
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('auth_user') || 'null');
   //console.log(user)
    if (!user || user.role !== 'admin') {
      navigate('/auth/login');
      return;
    }
    setAdminUser(user);
    loadProducts();
  }, [navigate]);

  const adminData = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/adminpage' },
    { id: 'Offer', label: 'Offer', icon: BadgePercent, path: '/adminpage/offersection' },
     { id: 'NewArrival', label: 'NewArrival', icon: ShoppingCart, path: '/adminpage/newArrival' },
    { id: 'products', label: 'Products', icon: Package, path: '/adminpage/productcontent' },
    {id:'Poster',label:'Poster',icon:List,path:'/adminpage/poster'},
    { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/adminpage/ordercontent' },
    { id: 'users', label: 'Users', icon: Users, path: '/adminpage/usercontent' },

  ];

  if (!adminUser) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50  p-2 rounded-md shadow-md text-gray-600 hover:bg-gray-100"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome back, {adminUser.first||"Masif Ahamed"}</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6">
          {adminData.map((item) => (
            <NavLink
              to={item.path}
              key={item.id}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center w-full px-6 py-3 text-left transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
              end={item.path === '/adminpage'} // This ensures exact match for dashboard
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-6 py-3 text-left text-gray-600 hover:bg-gray-50 transition-colors duration-200 mt-10"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile header spacer - only visible on mobile */}
        <div className="h-16 lg:h-0"></div>
        
        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

// // AdminDashboard.jsx - UPDATED
// import React, { useEffect, useState } from 'react';
// import {
//   BarChart3,
//   Package,
//   Users,
//   ShoppingCart,
//   LogOut,
//   Menu,
//   X,
//   BadgePercent,
//   List
// } from 'lucide-react';
// import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const AdminDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, logout, loading } = useAuth();

//   const handleLogout = () => {
//     if (window.confirm('Are you sure you want to logout?')) {
//       logout();
//     }
//   };

//   useEffect(() => {
//     // Redirect if not admin or not authenticated
//     if (!loading && (!user || user.role !== 'admin')) {
//       navigate('/auth/login');
//     }
//   }, [user, loading, navigate]);

//   const adminData = [
//     { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/adminpage' },
//     { id: 'Offer', label: 'Offer', icon: BadgePercent, path: '/adminpage/offersection' },
//     { id: 'products', label: 'Products', icon: Package, path: '/adminpage/productcontent' },
//     { id: 'Poster', label: 'Poster', icon: List, path: '/adminpage/poster' },
//     { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/adminpage/ordercontent' },
//     { id: 'users', label: 'Users', icon: Users, path: '/adminpage/usercontent' },
//   ];

//   // Show loading spinner
//   if (loading) {
//     return (
//       <div className='min-h-screen flex items-center justify-center'>
//         <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
//       </div>
//     );
//   }

//   // Show nothing while redirecting or if not admin
//   if (!user || user.role !== 'admin') {
//     return null;
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Mobile menu button */}
//       <button
//         onClick={() => setSidebarOpen(true)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md text-gray-600 hover:bg-gray-100"
//       >
//         <Menu size={20} />
//       </button>

//       {/* Sidebar */}
//       <div 
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         <div className="flex items-center justify-between p-6 border-b">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
//             <p className="text-sm text-gray-600 mt-1">Welcome back, {user.name}</p>
//             <p className="text-xs text-gray-500 mt-1">{user.email}</p>
//           </div>
//           <button
//             onClick={() => setSidebarOpen(false)}
//             className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <nav className="mt-6">
//           {adminData.map((item) => (
//             <NavLink
//               to={item.path}
//               key={item.id}
//               onClick={() => setSidebarOpen(false)}
//               className={({ isActive }) =>
//                 `flex items-center w-full px-6 py-3 text-left transition-colors duration-200 ${
//                   isActive
//                     ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`
//               }
//               end={item.path === '/adminpage'}
//             >
//               <item.icon size={20} className="mr-3" />
//               {item.label}
//             </NavLink>
//           ))}

//           <button
//             onClick={handleLogout}
//             className="flex items-center w-full px-6 py-3 text-left text-gray-600 hover:bg-gray-50 transition-colors duration-200 mt-10"
//           >
//             <LogOut size={20} className="mr-3" />
//             Logout
//           </button>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col lg:ml-0">
//         {/* Top Header Bar */}
//         <header className="bg-white shadow-sm border-b lg:block hidden">
//           <div className="flex justify-between items-center px-6 py-4">
//             <div>
//               <h1 className="text-xl font-semibold text-gray-900">
//                 {adminData.find(item => item.path === location.pathname)?.label || 'Dashboard'}
//               </h1>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               <div className="text-right">
//                 <p className="font-medium text-gray-900">{user.name}</p>
//                 <p className="text-sm text-gray-600">Administrator</p>
//               </div>
              
//               <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
//                 <span className="text-white font-bold">
//                   {user.name?.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Mobile header spacer - only visible on mobile */}
//         <div className="h-16 lg:h-0"></div>
        
//         {/* Dynamic Content Area */}
//         <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50">
//           <Outlet />
//         </main>
//       </div>

//       {/* Mobile sidebar overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;