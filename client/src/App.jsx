import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AutContext';

import PublicLayout from './layouts/PublicLayout';
import Home from './pages/public/Home';
import Menu from './pages/public/Menu';
import Booking from './pages/public/Booking';
import BookingCancel from './pages/public/BookingCancel';
import Order from './pages/public/Order';
import OrderCancel from './pages/public/OrderCancel';
import Gallery from './pages/public/Gallery';
import Contact from './pages/public/Contact';

import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoutes';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
// Bookings, Orders, MenuEditor, Categories, DeliveryZones, Settings — added as we build each
import Bookings from './pages/admin/Bookings';
import Orders from './pages/admin/Orders';
import MenuEditor from './pages/admin/MenuEditor'
import Categories from './pages/admin/Categories'
import DeliveryZones from './pages/admin/DeliveryZone';
import Settings from './pages/admin/Settings';
function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/cancel/:token" element={<BookingCancel />} />
          <Route path="/order" element={<Order />} />
          <Route path="/order-cancel/:token" element={<OrderCancel />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="menu" element={<ProtectedRoute role="owner"><MenuEditor /></ProtectedRoute>} />
          <Route path="categories" element={<ProtectedRoute role="owner"><Categories /></ProtectedRoute>} />
        <Route path="delivery-zones" element={<ProtectedRoute role="owner"><DeliveryZones /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute role="owner"><Settings /></ProtectedRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;