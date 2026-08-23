import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Booking from './pages/Booking';
import Order from './pages/Order';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

function App() {
  return (
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/booking" element={<Booking />} />
  
          <Route path="/order" element={<Order />} />
          
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
  );
}

export default App;