import { useEffect, useState, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { Heart, LibraryBig, Sparkles } from "lucide-react";
import TopBar from "../components/topbar";
import { getStoredEmail } from "../lib/auth";
import { getUserProfile } from "../lib/profile";
import { getGameInfo, type GameInfo } from "../lib/rawg-api";

type ProfileCollections = {
  favorites: GameInfo[];
  wishlist: GameInfo[];
};

const EMPTY_COLLECTIONS: ProfileCollections = {
  favorites: [],
  wishlist: [],
};

function formatReleaseDate(value: string | null) {
  if (!value) {
    return "Release date TBD";
  }

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function GameTile({ game, accent }: { game: GameInfo; accent: string }) {
  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.04] shadow-[0_22px_60px_rgba(0,0,0,0.28)] transition-transform duration-300 hover:-translate-y-1">
      <div
        className="h-44 bg-cover bg-center"
        style={{
          backgroundImage: game.background_image
            ? `linear-gradient(180deg, rgba(9,10,15,0.12), rgba(9,10,15,0.78)), url('${game.background_image}')`
            : `linear-gradient(135deg, ${accent}, rgba(17,24,39,0.85))`,
        }}
      />
      <div className="space-y-4 p-5 text-left">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/40">Saved game</p>
          <h2 className="text-xl font-semibold text-white">{game.name}</h2>
          <p className="text-sm text-white/65">
            {formatReleaseDate(game.released)}
            {typeof game.metacritic === "number" ? ` | Metacritic ${game.metacritic}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {game.genres.slice(0, 3).map((genre) => (
            <span
              key={genre.id}
              className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/75"
            >
              {genre.name}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function CollectionSection({
  title,
  eyebrow,
  description,
  icon,
  games,
  accent,
}: {
  title: string;
  eyebrow: string;
  description: string;
  icon: ReactNode;
  games: GameInfo[];
  accent: string;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.22)] lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-white/35">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62">{description}</p>
        </div>
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 text-white"
          style={{ background: accent }}
        >
          {icon}
        </div>
      </div>

      {games.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => (
            <GameTile key={game.id} game={game} accent={accent} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.5rem] border border-dashed border-white/12 bg-black/25 px-6 py-10 text-left">
          <p className="text-lg font-semibold text-white">Nothing here yet</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
            Save a few games and this section will start to feel like your own command deck.
          </p>
        </div>
      )}
    </section>
  );
}

export default function Profile() {
  const [collections, setCollections] = useState<ProfileCollections>(EMPTY_COLLECTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const email = getStoredEmail();

  useEffect(() => {
    let isCancelled = false;

    async function loadProfile() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const profile = await getUserProfile();
        const [favorites, wishlist] = await Promise.all([
          Promise.all(profile.favorite_ids.map((gameId) => getGameInfo(gameId))),
          Promise.all(profile.wishlist_ids.map((gameId) => getGameInfo(gameId))),
        ]);

        if (!isCancelled) {
          setCollections({ favorites, wishlist });
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage((error as Error).message);
          setCollections(EMPTY_COLLECTIONS);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Profile | Gamepwanet</title>
      </Helmet>
      <div className="min-h-screen bg-[#050608] text-white">
        <TopBar />
        <main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-6">
          <section className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.2),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.2),_transparent_30%),linear-gradient(145deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02))] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.4)] lg:p-10">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl text-left">
                <p className="text-xs uppercase tracking-[0.45em] text-white/45">Profile</p>
                <h1 className="mt-4 text-4xl leading-tight font-semibold lg:text-6xl">
                  Your saved worlds, all in one place.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
                  Keep tabs on the games you already love and the ones you are lining up next.
                </p>
              </div>
              <div className="grid gap-3 text-left sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-white/10 bg-black/25 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/35">Signed in</p>
                  <p className="mt-2 break-all text-sm text-white/80">{email ?? "Current player"}</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-black/25 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/35">Saved total</p>
                  <p className="mt-2 text-sm text-white/80">
                    {collections.favorites.length + collections.wishlist.length} games tracked
                  </p>
                </div>
              </div>
            </div>
          </section>

          {isLoading ? (
            <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-12 text-left">
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">Loading</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Building your profile view</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
                We're pulling your saved IDs from the backend and filling them out with game details.
              </p>
            </section>
          ) : errorMessage ? (
            <section className="mt-10 rounded-[2rem] border border-red-300/25 bg-red-500/10 px-6 py-10 text-left">
              <p className="text-xs uppercase tracking-[0.35em] text-red-200/75">Profile unavailable</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">We couldn't load your saved games.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">{errorMessage}</p>
              <Link
                to="/login"
                className="mt-6 inline-flex rounded-2xl border border-white/10 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85"
              >
                Go to login
              </Link>
            </section>
          ) : (
            <div className="mt-10 space-y-8">
              <CollectionSection
                title="Favorites"
                eyebrow="Your core lineup"
                description="These are the games you've already marked as keepers. It's the fastest way to revisit the titles that define your taste."
                icon={<Heart className="h-6 w-6" />}
                games={collections.favorites}
                accent="linear-gradient(135deg, rgba(248,113,113,0.36), rgba(190,24,93,0.28))"
              />
              <CollectionSection
                title="Wishlist"
                eyebrow="Next up"
                description="A staging area for your next obsession. As your list grows, this becomes a quick scan of future releases and must-play picks."
                icon={<LibraryBig className="h-6 w-6" />}
                games={collections.wishlist}
                accent="linear-gradient(135deg, rgba(59,130,246,0.32), rgba(16,185,129,0.24))"
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
