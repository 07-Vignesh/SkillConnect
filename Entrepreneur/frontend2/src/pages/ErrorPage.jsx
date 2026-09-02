import { ArrowLeft, Compass, Home, SearchX } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <main className="page-bg min-h-[calc(100vh-72px)]">
      <div className="grid-background" aria-hidden="true" />
      <div className="bg-bloom-top" aria-hidden="true" />
      <div className="bg-bloom-bottom" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />

      <section className="page-content mx-auto flex min-h-[calc(100vh-72px)] max-w-3xl items-center justify-center px-6 py-20 text-center">
        <div className="animate-fade-up w-full">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/10 text-violet-300 shadow-[0_0_45px_rgba(124,58,237,0.2)]">
            <SearchX size={38} strokeWidth={1.5} aria-hidden="true" />
          </div>

          <p className="section-label mb-4">404 / Route unavailable</p>
          <h1 className="gradient-title text-4xl font-extrabold tracking-tight sm:text-6xl">
            This page went off the map.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
            We could not find anything at <span className="break-all text-zinc-200">{location.pathname}</span>.
            Try heading back to SkillConnect or explore the services directory.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/" className="btn-primary">
              <Home size={17} aria-hidden="true" />
              Back to home
            </Link>
            <Link to="/services" className="btn-ghost">
              <Compass size={17} aria-hidden="true" />
              Explore services
            </Link>
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost">
              <ArrowLeft size={17} aria-hidden="true" />
              Go back
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ErrorPage;