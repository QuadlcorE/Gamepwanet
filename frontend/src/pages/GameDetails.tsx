import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router";
import ReactGlider from "react-glider";
import "glider-js/glider.min.css";
import TopBar from "../components/topbar";
import LoadingThreeDots from "../components/loadingThreeDots";
import env from "../config/env";
import type { GameDetail } from "../types/game";
import type { GliderMethods } from "react-glider/dist/types";
import { igdbImageUrl } from "../lib/igdb-image";

function formatDate(value?: string | null) {
  if (!value) {
    return "TBA";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatUnixDate(value?: number) {
  if (!value) {
    return "TBA";
  }

  return formatDate(new Date(value * 1000).toISOString());
}

function joinNames(items?: Array<{ name: string }>) {
  if (!items?.length) {
    return "Unknown";
  }

  return items.map((item) => item.name).join(", ");
}

export default function GameDetailsPage() {
  const { gameId } = useParams();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<number | null>(null);
  const screenshotIndexRef = useRef(0);
  const screenshotGliderRef = useRef<GliderMethods | null>(null);

  useEffect(() => {
    async function fetchGameDetails() {
      if (!gameId) {
        setErrorMessage("That game could not be found.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await fetch(`${env.backendBaseUrl}/games/${gameId}`);

        if (!response.ok) {
          throw new Error(`Response Status: ${response.status}`);
        }

        const result = (await response.json()) as GameDetail;
        setGame(result);
      } catch (error) {
        console.error((error as Error).message);
        setErrorMessage("We couldn't load this game right now.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchGameDetails();
  }, [gameId]);

  useEffect(() => {
    if (selectedScreenshotIndex === null) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedScreenshotIndex(null);
      } else if (event.key === "ArrowRight" && game?.screenshots?.length) {
        setSelectedScreenshotIndex((previous) => {
          if (previous === null) return previous;
          return previous + 1 >= game.screenshots!.length ? 0 : previous + 1;
        });
      } else if (event.key === "ArrowLeft" && game?.screenshots?.length) {
        setSelectedScreenshotIndex((previous) => {
          if (previous === null) return previous;
          return previous - 1 < 0 ? game.screenshots!.length - 1 : previous - 1;
        });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [game?.screenshots, selectedScreenshotIndex]);

  useEffect(() => {
    const screenshots = game?.screenshots ?? [];

    if (!screenshots.length || selectedScreenshotIndex !== null) {
      return;
    }

    const autoplay = window.setInterval(() => {
      const currentIndex = screenshotIndexRef.current;
      const nextIndex =
        currentIndex + 1 >= screenshots.length ? 0 : currentIndex + 1;

      screenshotIndexRef.current = nextIndex;
      screenshotGliderRef.current?.scrollItem(nextIndex);
    }, 3500);

    return () => {
      window.clearInterval(autoplay);
    };
  }, [game?.screenshots?.length, selectedScreenshotIndex]);

  useEffect(() => {
    screenshotIndexRef.current = 0;
  }, [game?.screenshots?.length]);

  useEffect(() => {
    if (selectedScreenshotIndex === null) {
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [selectedScreenshotIndex]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <TopBar />
        <div className="flex min-h-[70vh] items-center justify-center">
          <LoadingThreeDots speed={0.5} />
        </div>
      </div>
    );
  }

  if (errorMessage || !game) {
    return (
      <>
        <Helmet>
          <title>Game Unavailable | Gamepwanet</title>
        </Helmet>
        <div className="min-h-screen bg-black text-white">
          <TopBar />
          <main className="flex min-h-[70vh] items-center justify-center px-6">
            <div className="max-w-xl space-y-4 text-center">
              <p className="text-sm uppercase tracking-[0.4em] text-white/40">
                Game Details
              </p>
              <h1 className="text-4xl font-semibold">
                Unable to load this game
              </h1>
              <p className="text-white/70">
                {errorMessage ?? "That game could not be found."}
              </p>
              <Link
                to="/"
                className="inline-flex rounded-full border border-white/15 px-5 py-2 text-sm font-semibold transition hover:bg-white/10"
              >
                Back to home
              </Link>
            </div>
          </main>
        </div>
      </>
    );
  }

  const heroImage = igdbImageUrl(
    game.cover?.url ?? game.artworks?.[0]?.url,
    "720p"
  );
  const headerImage = igdbImageUrl(
    game.artworks?.[0]?.url ?? game.cover?.url,
    "1080p"
  );
  const screenshots = game.screenshots ?? [];
  const developers = (game.involved_companies ?? [])
    .filter((company) => company.developer)
    .map((company) => company.company);
  const publishers = (game.involved_companies ?? [])
    .filter((company) => !company.developer)
    .map((company) => company.company);
  const website = game.websites?.[0]?.url;
  const selectedScreenshot =
    selectedScreenshotIndex === null
      ? null
      : igdbImageUrl(screenshots[selectedScreenshotIndex]?.url, "1080p");

  function showPreviousScreenshot() {
    if (!screenshots.length) {
      return;
    }
    setSelectedScreenshotIndex((previous) => {
      if (previous === null) {
        return 0;
      }
      return previous - 1 < 0 ? screenshots.length - 1 : previous - 1;
    });
  }

  function showNextScreenshot() {
    if (!screenshots.length) {
      return;
    }
    setSelectedScreenshotIndex((previous) => {
      if (previous === null) {
        return 0;
      }
      return previous + 1 >= screenshots.length ? 0 : previous + 1;
    });
  }

  return (
    <>
      <Helmet>
        <title>{game.name} | Gamepwanet</title>
      </Helmet>
      <div className="min-h-screen bg-black text-white">
        <div className="relative isolate overflow-hidden">
          {headerImage ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(${headerImage})` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgb(0_0_0_/0.2)_20%,rgb(0_0_0_/0.3)_80%,rgb(0_0_0)_100%)]" />
            </>
          ) : heroImage ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50"
                style={{ backgroundImage: `url(${headerImage})` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgb(0_0_0_/0.1)_20%,rgb(0_0_0_/0.3)_80%,rgb(0_0_0)_100%)]" />
            </>
          ) : null}

          <div className="relative z-10">
            <TopBar />
            <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-16 pt-8">
              <section className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.4em] text-white/40">
                      Game Details
                    </p>
                    <h1 className="text-4xl font-semibold sm:text-5xl">
                      {game.name}
                    </h1>
                    <p className="max-w-3xl text-base leading-7 text-white/75 sm:text-lg">
                      {game.summary?.trim() ||
                        game.storyline?.trim() ||
                        "No description is available for this title yet."}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                        Release
                      </p>
                      <p className="mt-3 text-lg font-semibold">
                        {formatUnixDate(game.first_release_date)}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                        Rating
                      </p>
                      <p className="mt-3 text-lg font-semibold">
                        {game.rating ? `${(game.rating / 20).toFixed(1)}/5` : "Unrated"}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                        Ratings
                      </p>
                      <p className="mt-3 text-lg font-semibold">
                        {game.rating_count ?? "N/A"}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                        Slug
                      </p>
                      <p className="mt-3 text-lg font-semibold">
                        {game.slug}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
                  {heroImage ? (
                    <img
                      src={heroImage}
                      alt={`${game.name} cover art`}
                      className="h-full min-h-80 w-full object-cover"
                    />
                  ) : (
                    <div className="flex min-h-80 items-center justify-center bg-white/5 text-white/50">
                      No image available
                    </div>
                  )}
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-white/10 bg-neutral-950/70 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                    Genres
                  </p>
                  <p className="mt-4 text-sm leading-6 text-white/80">
                    {joinNames(game.genres)}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-neutral-950/70 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                    Developers
                  </p>
                  <p className="mt-4 text-sm leading-6 text-white/80">
                    {joinNames(developers)}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-neutral-950/70 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                    Publishers
                  </p>
                  <p className="mt-4 text-sm leading-6 text-white/80">
                    {joinNames(publishers)}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-neutral-950/70 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                    Reviews
                  </p>
                  <p className="mt-4 text-sm leading-6 text-white/80">
                    {game.rating_count ?? "Unknown"}
                  </p>
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-neutral-950/70 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                  Platforms
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {game.platforms?.length ? (
                    game.platforms.map((entry) => (
                      <span
                        key={entry.id}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85"
                      >
                        {entry.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-white/60">
                      Platform data is not available.
                    </p>
                  )}
                </div>
              </section>

              {screenshots.length ? (
                <section className="rounded-[2rem] border border-white/10 bg-neutral-950/70 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40 p-4">
                    Screenshots
                  </p>
                  <ReactGlider
                    ref={screenshotGliderRef}
                    className="mt-5"
                    draggable
                    hasArrows
                    rewind
                    // TODO: Fix pointer to finner pointer 
                    // arrows={{ 
                    //   prev: '#buttonPrev',
                    //   next: '#buttonNext',
                    // }}
                    slidesToShow={1}
                    slidesToScroll={1}
                    responsive={[
                      {
                        breakpoint: 768,
                        settings: {
                          slidesToShow: 2,
                          slidesToScroll: 1,
                        },
                      },
                      {
                        breakpoint: 1280,
                        settings: {
                          slidesToShow: 3,
                          slidesToScroll: 1,
                        },
                      },
                    ]}
                  >
                    {screenshots.map((shot, index) => (
                      <div key={shot.id} className="px-2">
                        <button
                          type="button"
                          onClick={() => setSelectedScreenshotIndex(index)}
                          className="block w-full overflow-hidden rounded-2xl border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                          aria-label={`Open ${game.name} screenshot ${shot.id}`}
                        >
                          <img
                            src={igdbImageUrl(shot.url, "720p")}
                            alt={`${game.name} screenshot ${shot.id}`}
                            className="h-52 w-full object-cover transition hover:scale-[1.02] sm:h-60"
                          />
                        </button>
                      </div>
                    ))}
                  </ReactGlider>
                </section>
              ) : null}

              {website ? (
                <section>
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-85"
                  >
                    Visit official website
                  </a>
                </section>
              ) : null}
            </main>
          </div>
        </div>
      </div>
      {selectedScreenshot ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            onClick={() => setSelectedScreenshotIndex(null)}
            className="absolute inset-0 h-full w-full cursor-pointer"
            aria-label="Close screenshot preview"
          />
          <button
            type="button"
            onClick={() => setSelectedScreenshotIndex(null)}
            className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/50 text-lg font-semibold text-white transition hover:bg-black/80"
            aria-label="Close screenshot preview"
          >
            X
          </button>
          <button
            type="button"
            onClick={showPreviousScreenshot}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/30 bg-black/50 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/80"
            aria-label="Previous screenshot"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={showNextScreenshot}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/30 bg-black/50 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/80"
            aria-label="Next screenshot"
          >
            Next
          </button>
          <div className="relative z-10">
            <img
              src={selectedScreenshot}
              alt={`${game.name} fullscreen screenshot`}
              className="max-h-[92vh] w-auto max-w-[95vw] rounded-xl object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
