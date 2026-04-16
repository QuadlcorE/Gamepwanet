import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { CircleUserRound, LogOut, UserRound } from "lucide-react";
import { clearSession, getStoredEmail, isLoggedIn } from "../lib/auth";

export default function TopBar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setEmail(getStoredEmail());
  }, []);

  function handleLogout() {
    clearSession();
    setLoggedIn(false);
    setEmail(null);
    setIsMenuOpen(false);
    navigate("/");
  }

  return (
    <div className="w-full flex items-center justify-between gap-4 px-6 py-4">
      <h1 className="text-4xl font-semibold transition-transform transition-300 hover:scale-110">
        <NavLink to="/">Gamepwanet</NavLink>
      </h1>

      <div className="flex items-center gap-4">
        <div className="w-[280px]">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-3xl bg-gray-700 px-4 py-2 opacity-50 outline-none duration-500 hover:opacity-70 focus:opacity-100"
          />
        </div>

        {loggedIn ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition-colors hover:bg-white/14"
              aria-label="Open account menu"
            >
              <CircleUserRound className="h-6 w-6" />
            </button>

            {isMenuOpen ? (
              <div className="absolute right-0 top-14 z-20 w-64 rounded-3xl border border-white/10 bg-neutral-950/95 p-4 shadow-2xl backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Signed in</p>
                <p className="mt-2 break-all text-sm text-white/80">{email}</p>
                <NavLink
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85"
                >
                  <UserRound className="h-4 w-4" />
                  View profile
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-85"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <NavLink
              to="/login"
              className=" px-4 py-2 text-sm font-semibold text-white transition-colors hover:text-white/70"
            >
              Log in
            </NavLink>
            <NavLink
              to="/signup"
              className="px-4 py-2 text-sm font-semibold text-white transition-colors hover:text-white/70"
            >
              Sign up
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}
