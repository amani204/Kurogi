import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/public/Home';
import Menu from './pages/public/Menu';
import Booking from './pages/public/Booking';
import BookingCancel from './pages/public/BookingCancel';
import Order from './pages/public/Order';
import OrderCancel from './pages/public/OrderCancel';
import Gallery from './pages/public/Gallery';
import Contact from './pages/public/Contact';

function App() {
  return (
    <Routes>
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
    </Routes>
  );
}

export default App;