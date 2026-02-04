import { NavLink } from "react-router";

export default function TopBar() {
  return (
    <div className="w-full flex items-center justify-between px-6 py-4 ">
      {/* Left word */}
      <h1 className="text-4xl font-semibold transition-transform transition-300 hover:scale-110">
        <NavLink to="/">Gamepwanet</NavLink>
      </h1>

      {/* Right search bar */}
      <div className="w-[280px] ">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-3xl bg-gray-700 opacity-50 hover:opacity-70 focus:opacity-100 duration-500 outline-none "
        />
      </div>
    </div>
  );
}
