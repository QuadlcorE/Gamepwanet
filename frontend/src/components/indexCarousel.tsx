export default function IndexCarousel() {
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
  
    return (
      <div className="w-full px-4">
        <div className="flex h-[60vh] w-full overflow-hidden">
          {items.map((item, index) => (
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
          ))}
        </div>
      </div>
    );
  }
  