import type { Game } from "../types/game";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LoadingThreeDots from "./loadingThreeDots";

type gameCard = {
  gameData: Game;
  loadingState: boolean;
};

export default function GameCard(gameCard: gameCard) {
  if (gameCard.loadingState) {
    return (
      <div className="w-full max-w-80 aspect-square flex items-center justify-center bg-[#111]">
        <div className="relative w-max-[430] aspect-square rounded-2xl overflow-hidden">
          {/* Fake background */}
          <Skeleton
            height="100%"
            width="100%"
            baseColor="#202020"
            highlightColor="#2c2c2c"
          />

          {/* Bottom card */}
          <div className="rounded-xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 p-4">
            {/* Fake image */}
            <Skeleton height={144} /> {/* 36 * 4 = 144px */}
            {/* Fake text */}
            <div className="mt-3 space-y-2">
              text
              <LoadingThreeDots />
              <Skeleton height={16} width="70%" />
              <Skeleton height={12} width="50%" />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="group relative w-full aspect-square flex items-center justify-center bg-[#111] overflow-hidden"
      >
        {/* Background */}
        <div
          className=" w-full aspect-square z-0
            absolute inset-0
            grayscale blur-[2px]
            group-hover:grayscale-0 group-hover:blur-md
            transition-all duration-300
            bg-cover bg-center
          "
          style={{
            backgroundImage: `url('${gameCard.gameData.background_image}')`,
          }}
        />

        {/* Card — anchored to bottom */}
        <div className="m-1.5 rounded-xl overflow-hidden bg-black  border border-white/20 z-10">
          {/* Card image */}
          <img
            src={gameCard.gameData.background_image}
            alt="Card visual"
            className="w-full h-36 object-cover"
          />

          {/* Card content */}
          <div className="px-4 py-3">
            <h2 className="text-white font-semibold text-sm tracking-wide">
              Mountain Vista
            </h2>
            <p className="text-white/60 text-xs mt-0.5">Swiss Alps, 3,454m</p>
          </div>
        </div>
      </div>
    );
  }
}
