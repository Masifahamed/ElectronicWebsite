// App.jsx - CLEANER VERSION
import { BrowserRouter, Routes, Route, Navigate, Router } from 'react-router-dom'
import Navbar from './components/user/Navbar'
import Footer from './components/user/Footer'
import RegisterPage from './pages/auth/RegisterPage'
import LoginPage from './pages/auth/LoginPage'
import AdminPage from './pages/admin/AdminPage'
import DashboardContent from './pages/admin/DashboardContent'
import OrderContent from './pages/admin/OrderContent'
import ProductContent from './pages/admin/ProductContent'
import UserContent from './pages/admin/UserContent'
import HeroManagement from './pages/admin/HeroManagement'
import AdminRoute from './components/Admin/AdminRoute'
import AuthMainPage from './pages/auth/AuthMainPage'
import MainContent from './components/auth/MainContent'
import { useAuth } from './pages/auth/WithAuth'
//import { AuthProvider } from './context/AuthContext'
import PosterPage from './pages/admin/PosterPage'
import NewArrival from './pages/admin/NewArrival'

//initializeDefaultAdmin()

const App = () => {
  //Protected Route Components
const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('auth_user') || 'null');

  if (!user) return <Navigate to="/auth/login" />; // not logged in
  if (role && user.role !== role) return <Navigate to="/auth/login" />; // wrong role

  return children; // allow access
};
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If user is logged in, redirect based on role
  
  if (isAuthenticated && user?.role === 'admin') return <Navigate to="/adminpage" replace />;
  if (isAuthenticated && user?.role === 'user') return <Navigate to="/" replace />;

  // Not logged in → allow public route (login/register)
  return children;
};

  return (
   // <AuthProvider>
      <BrowserRouter>
      <Routes>
        {/* <Route path='/' element={<Navigate to="/auth/login" replace/>}/> */}
        {/* Public Auth Routes - No Layout */}
        <Route path='/auth' element={
          <PublicRoute>
          <AuthMainPage/>
          </PublicRoute>
         }>
       <Route path="register" element={<RegisterPage/>} />
          <Route path="login" element={<LoginPage />} />
         <Route index element={<Navigate to='/auth/login' replace/>}/> 
     
        </Route>
       
        {/* Admin Routes - Protected */}
        <Route path='/adminpage' element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }>
          <Route index element={<DashboardContent />} />
          <Route path='ordercontent' element={<OrderContent />} />
          <Route path='productcontent' element={<ProductContent />} />
          <Route path='usercontent' element={<UserContent />} />
          <Route path='offersection' element={<HeroManagement />} />
          <Route path='poster' element={<PosterPage/>}/>
          <Route path='newArrival' element={<NewArrival/>}/>
        </Route>

        {/* Main App Routes with Layout */}
        <Route path="/*" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <MainContent/>
            </main>
            <Footer />
          </div>
        } />
        </Routes>
    </BrowserRouter>
   // </AuthProvider>
    
  )
}

export default App

// App.jsx - UPDATED VERSION
// import React from 'react'
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import Navbar from './components/user/Navbar'
// import Footer from './components/user/Footer'
// import RegisterPage from './pages/auth/RegisterPage'
// import LoginPage from './pages/auth/LoginPage'
// import AdminPage from './pages/admin/AdminPage'
// import DashboardContent from './pages/admin/DashboardContent'
// import OrderContent from './pages/admin/OrderContent'
// import ProductContent from './pages/admin/ProductContent'
// import UserContent from './pages/admin/UserContent'
// import HeroManagement from './pages/admin/HeroManagement'
// import { initializeDefaultAdmin } from './ultis/constant'
// import AuthMainPage from './pages/auth/AuthMainPage'
// import MainContent from './components/auth/MainContent'
// import { useAuth } from './context/AuthContext'
// import { AuthProvider } from './context/AuthContext'
// import PosterPage from './pages/admin/PosterPage'
// import ProfilePage from './pages/user/ProfilePage'

// // Protected Route Components
// const ProtectedRoute = ({ children, adminOnly = false }) => {
//   const { isAuthenticated, user, loading } = useAuth()

//   if (loading) {
//     return (
//       <div className='min-h-screen flex items-center justify-center'>
//         <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500'></div>
//       </div>
//     )
//   }

//   if (!isAuthenticated) {
//     return <Navigate to='/auth/login' replace />
//   }

//   if (adminOnly && user?.role !== 'admin') {
//     return <Navigate to='/' replace />
//   }

//   return children
// }

// const PublicRoute = ({ children }) => {
//   const { isAuthenticated, user, loading } = useAuth();
  
//   if (loading) {
//     return (
//       <div className='min-h-screen flex items-center justify-center'>
//         <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500'></div>
//       </div>
//     )
//   }

//   // Redirect authenticated users away from auth pages
//   if (isAuthenticated) {
//     if (user?.role === 'admin') {
//       return <Navigate to='/adminpage' replace />
//     }
//     return <Navigate to='/' replace />
//   }

//   return children
// }

// // Component to conditionally show register based on user role
// const AuthLayoutWrapper = () => {
//   const { user } = useAuth()
//   const showRegister = !user || user.role !== 'admin'
  
//   return <AuthMainPage showRegister={showRegister} />
// }

// initializeDefaultAdmin()

// const App = () => {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* Public Auth Routes - No Layout */}
//           <Route path='/auth' element={
//             <PublicRoute>
//               <AuthLayoutWrapper />
//             </PublicRoute>
//           }>
//             <Route path="register" element={<RegisterPage />} />
//             <Route path="login" element={<LoginPage />} />
//             <Route index element={<Navigate to='/auth/login' replace />} />
//           </Route>

//           {/* Admin Routes - Protected */}
//           <Route path='/adminpage' element={
//             <ProtectedRoute adminOnly={true}>
//               <AdminPage />
//             </ProtectedRoute>
//           }>
//             <Route index element={<DashboardContent />} />
//             <Route path='ordercontent' element={<OrderContent />} />
//             <Route path='productcontent' element={<ProductContent />} />
//             <Route path='usercontent' element={<UserContent />} />
//             <Route path='offersection' element={<HeroManagement />} />
//             <Route path='poster' element={<PosterPage />} />
//           </Route>

//           {/* User Profile Route */}
//           <Route path="/profile" element={
//             <ProtectedRoute>
//               <div className="min-h-screen flex flex-col">
//                 <Navbar />
//                 <main className="flex-grow">
//                   <ProfilePage />
//                 </main>
//                 <Footer />
//               </div>
//             </ProtectedRoute>
//           } />

//           {/* User Orders Route */}
//           <Route path="/orders" element={
//             <ProtectedRoute>
//               <div className="min-h-screen flex flex-col">
//                 <Navbar />
//                 <main className="flex-grow">
//                   <div className="container mx-auto px-4 py-8">
//                     <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Orders</h1>
//                     <p className="text-gray-600">Your order history will appear here.</p>
//                   </div>
//                 </main>
//                 <Footer />
//               </div>
//             </ProtectedRoute>
//           } />

//           {/* User Wishlist Route */}
//           <Route path="/wishlist" element={
//             <ProtectedRoute>
//               <div className="min-h-screen flex flex-col">
//                 <Navbar />
//                 <main className="flex-grow">
//                   <div className="container mx-auto px-4 py-8">
//                     <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Wishlist</h1>
//                     <p className="text-gray-600">Your saved items will appear here.</p>
//                   </div>
//                 </main>
//                 <Footer />
//               </div>
//             </ProtectedRoute>
//           } />

//           {/* Product Route - Public */}
//           <Route path="/product" element={
//             <div className="min-h-screen flex flex-col">
//               <Navbar />
//               <main className="flex-grow">
//                 <div className="container mx-auto px-4 py-8">
//                   <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Products</h1>
//                   <p className="text-gray-600">Browse our amazing product collection.</p>
//                 </div>
//               </main>
//               <Footer />
//             </div>
//           } />

//           {/* Main App Routes with Layout */}
//           <Route path="/*" element={
//             <div className="min-h-screen flex flex-col">
//               <Navbar />
//               <main className="flex-grow">
//                 <MainContent />
//               </main>
//               <Footer />
//             </div>
//           } />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   )
// }

// export default App