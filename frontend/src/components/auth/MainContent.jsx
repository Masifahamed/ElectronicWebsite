import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../../pages/user/HomePage';
import ProductPage from '../../pages/user/ProductPage';
import WishListPage from '../../pages/user/WishListPage';
import ProfilePage from '../../pages/user/ProfilePage';
import OrderList from '../../pages/user/OrderList';
import OrderPage from '../../pages/user/OrderPage';
import ActiveOrderPage from '../../pages/user/ActiveorderPage';
import TrackOrderPage from '../../pages/user/TrackOrderPage';
import { Toaster } from 'react-hot-toast';




const MainContent = () => {
  return (
    <>
    <Toaster position='top-center'/>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/product' element={<ProductPage />} />
      <Route path='/wishlist' element={<WishListPage />} />
      <Route path='/profile' element={<ProfilePage/>} />
      
      {/* Order Routes */}
      <Route path='/orders' element={<OrderList />}>
        <Route index element={<OrderPage />} />
        <Route path='active' element={<ActiveOrderPage />} />
        <Route path='track' element={<TrackOrderPage />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/auth/login" replace/>} />

    </Routes>
    </>
  );
};

export default MainContent;

