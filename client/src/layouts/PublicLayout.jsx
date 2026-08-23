import { Outlet } from 'react-router-dom';
import WhatsAppButton from '../comonents/public/WhatsAppButton';
import Nav from '../comonents/public/Nav';
import Footer from '../comonents/public/Footer';
const PublicLayout = () => (
  <div className="min-h-screen flex flex-col bg-washi text-sumi">
    <Nav/>
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default PublicLayout;