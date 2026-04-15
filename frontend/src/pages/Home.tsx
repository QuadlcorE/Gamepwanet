import { Helmet } from "react-helmet-async";
import TopBar from "../components/topbar";
import IndexCarousel from "../components/home/indexCarousel";
import UpcomingGamesSection from "../components/home/upcomingGamesSection";
import HeroSection from "../components/home/herosection";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Gamepwanet</title>
      </Helmet>
      <div className="bg-black text-white min-h-screen">
        <TopBar />
        <HeroSection url="https://www.youtube.com/watch?v=Aj41sjx7sSs">
          <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-5xl ">Welcome to Gamepwanet</h1>
            <h1> Your next adventure awaits you</h1>
          </div>
        </HeroSection>
        <IndexCarousel/>
        <UpcomingGamesSection/>
      </div>
    </>
  );
}
