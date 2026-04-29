import type { Game } from "../types/game";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LoadingThreeDots from "./loadingThreeDots";
import { Link } from "react-router";
import { igdbImageUrl } from "../lib/igdb-image";

type gameCard = {
  gameData: Game;
  loadingState: boolean;
};

function formatReleaseDate(value?: number) {
  if (!value) {
    return "Release date TBD";
  }
  return new Date(value * 1000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function GameCard(gameCard: gameCard) {
  const coverImage = igdbImageUrl(gameCard.gameData.cover?.url, "cover_big");

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
            backgroundImage: coverImage ? `url('${coverImage}')` : undefined,
          }}
        />

        <div className="m-1.5 rounded-xl overflow-hidden bg-black  border border-white/20 z-10">
          {coverImage ? (
            <img
              src={coverImage}
              alt={gameCard.gameData.name}
              className="w-full h-36 object-cover"
            />
          ) : (
            <div className="w-full h-36 flex items-center justify-center bg-white/10 text-white/50 text-sm">
              No cover image
            </div>
          )}

          <div className="px-4 py-3">
            <h2 className="text-white font-semibold text-sm tracking-wide">
              {gameCard.gameData.name}
            </h2>
            <p className="text-white/60 text-xs mt-0.5">
              Release Date: {formatReleaseDate(gameCard.gameData.first_release_date)}
            </p>
          </div>
        </div>
      </Link>
    );
  }
}
