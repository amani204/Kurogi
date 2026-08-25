import { Outlet } from 'react-router-dom';
import WhatsAppButton from '../components/public/WhatsAppButton';
import Nav from '../components/public/Nav';
import Footer from '../components/public/Footer';
import ScrollToTop from './ScrollOnTop';
const PublicLayout = () => (
  <div className="min-h-screen flex flex-col bg-washi text-sumi">
     <ScrollToTop />
    <Nav/>
    <main className="flex-1">
    <Outlet />
    </main>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default PublicLayout;