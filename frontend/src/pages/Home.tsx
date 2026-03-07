import { Helmet } from "react-helmet-async";
import TopBar from "../components/topbar";
import IndexCarousel from "../components/home/indexCarousel";
import UpcomingGamesSection from "../components/home/upcomingGamesSection";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Gamepwanet</title>
      </Helmet>
      <div className="bg-black text-white min-h-screen">
        <TopBar />
        <IndexCarousel/>
        <UpcomingGamesSection/>
        <h1>Welcome to Gamepwanet</h1>
      </div>
    </>
  );
}
