import { useEffect, useState } from "react";
import LoadingThreeDots from "../loadingThreeDots";
import type { Game } from "../../types/game";
import env from "../../config/env";

export default function IndexCarousel() {
  const [data, setData] = useState<Array<Game>>();
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await fetch(`${env.backendBaseUrl}/games/top`);
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

  return isLoading ? (
    <div className="w-full h-[60vh] bg-white/5 flex items-center">
      <LoadingThreeDots className="flex mx-auto" speed={0.5} />
    </div>
  ) : (
    <div className="w-full ">
      <div className="flex h-[60vh] w-full overflow-hidden">
        {data?.map((item) => (
          <div
            key={item.id}
            className="
              group
              relative
              flex-1
              cursor-pointer
              text-white
              p-6
              transition-all
              duration-300
              ease-in-out
              hover:flex-6
              bg-cover
              bg-center
              overflow-hidden
            "
            style={{
              backgroundImage: `url(${item.background_image})`,
            }}
          >
            {/* Bottom gradient overlay */}
            <div
              className="
                absolute inset-0
                bg-linear-to-t
                from-black
                via-black/10
                to-transparent
                opacity-30
                group-hover:opacity-90
                transition-opacity duration-300
              "
            />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end">
              <h3
                className="
                  text-2xl
                  font-semibold
                  opacity-0
                  translate-y-4
                  transition-all
                  duration-300
                  group-hover:opacity-100
                  group-hover:translate-y-0
                "
              >
                {item.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
