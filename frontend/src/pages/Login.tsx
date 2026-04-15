import { useState, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router";
import TopBar from "../components/topbar";
import { loginUser, storeSession } from "../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const result = await loginUser(email, password);
      storeSession(result.access_token, email);
      navigate("/");
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Login | Gamepwanet</title>
      </Helmet>
      <div className="min-h-screen bg-black text-white">
        <TopBar />
        <main className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-6xl items-center justify-center px-6 py-10">
          <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950 shadow-[0_30px_120px_rgba(0,0,0,0.45)] lg:grid-cols-[1.15fr_0.85fr]">
            <div className="flex flex-col justify-between bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.35),_transparent_35%),linear-gradient(135deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.02))] p-8 lg:p-12">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white">
                  Gamepwanet
                </p>
                <h1 className="mt-6 max-w-md text-4xl leading-tight font-semibold">
                  Jump back into your next adventure.
                </h1>
                <p className="mt-4 max-w-md text-base text-white/70">
                  Sign in to keep your game picks, wishlist, and favorites close at hand.
                </p>
              </div>
              <p className="mt-10 text-sm text-white/55">
                New here?{" "}
                <Link className="text-emerald-200 transition-opacity hover:opacity-80" to="/signup">
                  Create an account
                </Link>
              </p>
            </div>

            <div className="p-8 lg:p-12">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/40">Login</p>
                  <h2 className="mt-4 text-3xl font-semibold">Welcome back</h2>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm text-white/65">Email address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-emerald-300/60"
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-white/65">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-emerald-300/60"
                    placeholder="Enter your password"
                    required
                  />
                </label>

                {errorMessage ? <p className="text-sm text-red-300">{errorMessage}</p> : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-white/5 px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
