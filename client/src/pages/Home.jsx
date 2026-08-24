import CriticalAcclaim from "../comonents/public/home/CriticalAcclaim";
import Hero from "../comonents/public/home/Hero";
import Location from "../comonents/public/home/Location";
import FeaturedDishes from "../comonents/public/home/MenuFeateured";
import Philosophy from "../comonents/public/home/Philosophy";
import ReserveCTA from "../comonents/public/home/ReserveCTA";

const Home = () => (
  <>
    <Hero/>
    <Philosophy/>
    <FeaturedDishes/>
    <Location/>
    <CriticalAcclaim/>
    <ReserveCTA/>
  </>
);

export default Home;