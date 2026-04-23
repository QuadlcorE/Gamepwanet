import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router";
import GameCard from "../components/gameCards";
import LoadingThreeDots from "../components/loadingThreeDots";
import TopBar from "../components/topbar";
import env from "../config/env";
import type { Game } from "../types/game";

const PAGE_SIZE = 12;

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const [games, setGames] = useState<Game[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  async function fetchSearchPage(pageToLoad: number, append: boolean) {
    if (!query || isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setErrorMessage(null);

    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsInitialLoading(true);
    }

    const params = new URLSearchParams({
      search: query,
      count: String(PAGE_SIZE),
      page: String(pageToLoad),
    });

    try {
      const response = await fetch(
        `${env.backendBaseUrl}/games/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Response Status: ${response.status}`);
      }

      const result = (await response.json()) as Game[];

      setGames((previousGames) =>
        append ? [...previousGames, ...result] : result
      );
      setPage(pageToLoad);
      setHasMore(result.length === PAGE_SIZE);
    } catch (error) {
      console.error((error as Error).message);
      setErrorMessage("We couldn't load search results right now.");
    } finally {
      isFetchingRef.current = false;
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  }

  useEffect(() => {
    setGames([]);
    setPage(0);
    setHasMore(false);
    setErrorMessage(null);

    if (!query) {
      return;
    }

    void fetchSearchPage(1, false);
  }, [query]);

  useEffect(() => {
    const node = loadMoreTriggerRef.current;

    if (!node || !query || !hasMore || isInitialLoading || isLoadingMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry.isIntersecting || isFetchingRef.current) {
          return;
        }

        void fetchSearchPage(page + 1, true);
      },
      {
        root: null,
        rootMargin: "220px",
        threshold: 0.1,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isInitialLoading, isLoadingMore, page, query]);

  return (
    <>
      <Helmet>
        <title>
          {query ? `Search: ${query} | Gamepwanet` : "Search | Gamepwanet"}
        </title>
      </Helmet>
      <div className="min-h-screen bg-black text-white">
        <TopBar />
        <main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-6">
          <header className="mb-8 space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Search
            </p>
            {query ? (
              <h1 className="text-3xl font-semibold sm:text-4xl">
                Results for "{query}"
              </h1>
            ) : (
              <h1 className="text-3xl font-semibold sm:text-4xl">
                Search for a game
              </h1>
            )}
          </header>

          {!query ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white/70">
              Type a game name in the search bar above and press Enter.
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-3xl border border-red-300/20 bg-red-900/20 p-6 text-sm text-red-100">
              {errorMessage}
            </div>
          ) : null}

          {isInitialLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <LoadingThreeDots speed={0.5} />
            </div>
          ) : null}

          {!isInitialLoading && query && !errorMessage ? (
            <>
              {games.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {games.map((game) => (
                    <GameCard
                      key={`${game.id}-${game.slug}`}
                      gameData={game}
                      loadingState={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
                  <p className="text-lg font-medium">No games found.</p>
                  <p className="mt-2 text-sm text-white/60">
                    Try a different title or check the spelling.
                  </p>
                  <Link
                    to="/"
                    className="mt-5 inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
                  >
                    Back to home
                  </Link>
                </div>
              )}
            </>
          ) : null}

          <div ref={loadMoreTriggerRef} className="h-10" />

          {isLoadingMore ? (
            <div className="mt-4 flex items-center justify-center">
              <LoadingThreeDots speed={0.5} />
            </div>
          ) : null}
        </main>
      </div>
    </>
  );
}
