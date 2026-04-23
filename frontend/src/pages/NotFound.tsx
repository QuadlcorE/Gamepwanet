import { Helmet } from "react-helmet-async";
import TopBar from "../components/topbar";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 | Gamepwanet</title>
      </Helmet>
      <main className="min-h-screen bg-black text-white flex flex-col">
        <TopBar/>
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="text-center space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-zinc-400">
              Error 404
            </p>
            <h1 className="text-5xl font-bold">Page not found</h1>
            <p className="text-zinc-300 max-w-md">
              The page you are looking for does not exist or may have been
              moved.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
