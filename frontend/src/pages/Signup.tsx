import { useState, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router";
import TopBar from "../components/topbar";
import { loginUser, signupUser, storeSession } from "../lib/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signupUser(username, email, password);
      const session = await loginUser(email, password);
      storeSession(session.access_token, email);
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
        <title>Sign Up | Gamepwanet</title>
      </Helmet>
      <div className="min-h-screen bg-black text-white">
        <TopBar />
        <main className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-6xl items-center justify-center px-6 py-10">
          <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950 shadow-[0_30px_120px_rgba(0,0,0,0.45)] lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex flex-col justify-between border-b border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.28),_transparent_35%),linear-gradient(135deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02))] p-8 lg:border-b-0 lg:border-r lg:p-12">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white">
                  Join In
                </p>
                <h1 className="mt-6 max-w-md text-4xl leading-tight font-semibold">
                  Build your corner of the gaming universe.
                </h1>
                <p className="mt-4 max-w-md text-base text-white/70">
                  Create an account to track favorites and keep your next must-play releases in view.
                </p>
              </div>
              <p className="mt-10 text-sm text-white/55">
                Already have an account?{" "}
                <Link className="text-amber-200 transition-opacity hover:opacity-80" to="/login">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="p-8 lg:p-12">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/40">Sign Up</p>
                  <h2 className="mt-4 text-3xl font-semibold">Create your account</h2>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm text-white/65">Username</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-amber-300/60"
                    placeholder="Choose a username"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-white/65">Email address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-amber-300/60"
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
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-amber-300/60"
                    placeholder="Choose a password"
                    required
                  />
                </label>

                {errorMessage ? <p className="text-sm text-red-300">{errorMessage}</p> : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-white/5 px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
