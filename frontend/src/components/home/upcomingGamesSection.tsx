import { useEffect, useState } from "react";
import type { Game } from "../../types/game";
import GameCard from "../gameCards";
import env from "../../config/env";

export default function UpcomingGamesSection() {
  const [data, setData] = useState<Array<Game>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const gameCount = 3;

  async function fetchData() {
    const params = new URLSearchParams({
      count: `${gameCount}`,
    });
    try {
      const response = await fetch(
        `${env.backendBaseUrl}/games/upcoming/?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error(`Response Status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-3 my-3 py-3 ">
      <div className="flex items-center justify-center"><p className="font-light text-5xl">Upcoming games</p></div>
      <div className="grid grid-cols-3 col-span-2">
        {Array.from({ length: gameCount }, (_, i) => (
          <div key={i}>
            {data[i] ? (
              <GameCard gameData={data[i]} loadingState={isLoading} />
            ) : (
              <div></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
