import CriticalAcclaim from "../../components/public/home/CriticalAcclaim";
import Hero from "../../components/public/home/Hero";
import Location from "../../components/public/home/Location";
import FeaturedDishes from "../../components/public/home/MenuFeateured";
import Philosophy from "../../components/public/home/Philosophy";
import ReserveCTA from "../../components/public/home/ReserveCTA";

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