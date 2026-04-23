import type { Game } from "../types/game";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LoadingThreeDots from "./loadingThreeDots";
import { Link } from "react-router";

type gameCard = {
  gameData: Game;
  loadingState: boolean;
};

export default function GameCard(gameCard: gameCard) {
  if (gameCard.loadingState) {
    return (
      <div className="w-full max-w-80 aspect-square flex items-center justify-center bg-[#111]">
        <div className="relative w-max-[430] aspect-square rounded-2xl overflow-hidden">
          <Skeleton
            height="100%"
            width="100%"
            baseColor="#202020"
            highlightColor="#2c2c2c"
          />

          <div className="rounded-xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 p-4">
            <Skeleton height={144} />
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
      <Link
        to={`/games/${gameCard.gameData.slug}`}
        className="group relative w-full aspect-square flex items-center justify-center bg-[#111] overflow-hidden"
      >
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

        <div className="m-1.5 rounded-xl overflow-hidden bg-black  border border-white/20 z-10">
          <img
            src={gameCard.gameData.background_image}
            alt={gameCard.gameData.name}
            className="w-full h-36 object-cover"
          />

          <div className="px-4 py-3">
            <h2 className="text-white font-semibold text-sm tracking-wide">
              {gameCard.gameData.name}
            </h2>
            <p className="text-white/60 text-xs mt-0.5">Release Date: {gameCard.gameData.released}</p>
          </div>
        </div>
      </Link>
    );
  }
}
