import { useEffect, useState } from "react";
import LoadingThreeDots from "./loadingThreeDots";
import type { Game } from "../types/game";

export default function IndexCarousel() {
  const url = import.meta.env.VITE_BACKEND_URL;

  const [data, setData] = useState<Array<Game>>();
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await fetch(`${url}/games/top`);
      if (!response.ok) {
        throw new Error(`Response Status: ${response.status}`);
      }
      console.log(response);

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

  const items = [
    {
      title: "Design",
      desc: "Branding & UI visuals",
      bg: "bg-pink-600",
    },
    {
      title: "Frontend",
      desc: "React + Tailwind builds",
      bg: "bg-teal-600",
    },
    {
      title: "Backend",
      desc: "APIs, Auth, Databases",
      bg: "bg-green-600",
    },
    {
      title: "Security",
      desc: "Web3 + audits + analysis",
      bg: "bg-purple-700",
    },
    {
      title: "Games",
      desc: "Python + GameMaker projects",
      bg: "bg-orange-600",
    },
  ];

  return isLoading ? (
    <div className="w-full h-[60vh] bg-white/5 flex items-center">
      <LoadingThreeDots className="flex mx-auto" speed={0.5} />
    </div>
  ) : (
    <div className="w-full ">
      <div className="flex h-[60vh] w-full overflow-hidden">
        {/* {data?.map((item, index) => (
            <div
              key={index}
              className={`group
              flex-[1]
              cursor-pointer
              bg-gray-900
              text-white
              p-6
              transition-all
              duration-300
              ease-in-out
              hover:flex-[3]
              ${item.bg}
            `}
                
            >
              <div className="h-full flex flex-col justify-end">
                <h3 className="text-2xl font-semibold">{item.title}</h3>

                <p className="mt-2 text-sm text-white/70 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  {item.desc}
                </p>
              </div>
            </div>
          ))} */}
        {data?.map((item) => (
          <div
            key={item.id}
            className="
      group
      relative
      flex-[1]
      cursor-pointer
      text-white
      p-6
      transition-all
      duration-300
      ease-in-out
      hover:flex-[3]
      bg-cover
      bg-center
      overflow-hidden
    "
            style={{
              backgroundImage: `url(${item.background_image})`,
            }}
          >
            {/* Dark overlay */}
            {/* <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-all duration-300" /> */}

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
