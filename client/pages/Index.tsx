import Navbar from "@/components/Navbar";
import BingoCard from "@/components/BingoCard";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col relative font-geologica">
      {/* Background image - low-poly geometric gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/504946951a8fc781510fdffdc667c83b41847c58?width=2578"
          alt=""
          className="w-full h-full object-cover object-center"
          aria-hidden="true"
        />
        {/* The "Vivid" Darkening Overlay */}
        <div
          className="absolute inset-0 h-[60vh]"
          style={{
            background: "linear-gradient(to bottom, rgba(74, 20, 140, 0.2), transparent)",
            backdropFilter: "contrast(1.2) brightness(0.8) saturate(1.2) blur(2px)"
          }}
        />

        {/* The "Frosty Ribbon" Overlay - Positioned behind the headline */}
        <div
          className="absolute top-[10%] left-0 w-full h-[35vh]"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        />
        {/* Slight overlay for readability */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(230,230,230,0.10)" }}
        />
      </div>

      {/* Content on top of background */}
      <div className="relative z-[100] flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Hero section */}
        <main className="flex flex-col pt-0 md:pt-4">
          {/* Tagline */}
          <div
            className="w-full text-center px-4 pt-4 pb-2 md:pt-6 md:pb-8"
            style={{ backdropFilter: "blur(2px)" }}
          >
            <h1
              className="font-geologica font-bold tracking-tight leading-[1.1]"
              style={{
                color: "#fff",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                textShadow: "0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
                letterSpacing: "-0.01em",
              }}
            >
              Small habits. Big wins.<br className="hidden md:block" /> One square at a time.
            </h1>
          </div>

          {/* Main content: quote + bingo card */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12 px-6 pb-10 lg:px-12 lg:pt-12">
            {/* Left: Quote */}
            <div
              className="max-w-sm lg:max-w-md text-center lg:text-left animate-slide-up mt-4"
              style={{
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
              }}
            >
              <blockquote
                className="font-geologica font-normal leading-snug"
                style={{
                  color: "#000",
                  fontSize: "clamp(1.1rem, 2.5vw, 2rem)",
                  letterSpacing: "0.03em",
                  textShadow: "0 2px 4px #fff",
                }}
              >
                &ldquo;A day focused on mental health and physical rest.
                Include activities like meditation, hydration, reading, and
                digital detox.&rdquo;
              </blockquote>

              {/* CTA hint */}
              <p
                className="mt-6 text-sm font-geologica"
                style={{ color: "rgba(0,0,0,0.55)", letterSpacing: "0.03em" }}
              >
                Tap any tile to mark your progress &rarr;
              </p>
            </div>

            {/* Right: Bingo Card */}
            <div className="animate-fade-in w-full max-w-sm sm:max-w-md lg:max-w-none lg:w-auto">
              <BingoCard title="Stillness Sanctuary" />
            </div>
          </div>
        </main>

        <footer className="w-full py-10 mt-auto border-t border-black/5 flex flex-col items-center gap-4">
          <div className="flex gap-6">
            <a href="/privacy" className="text-xs font-geologica text-black/40 hover:text-black/80 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-xs font-geologica text-black/40 hover:text-black/80 transition-colors">
              Terms of Service
            </a>
            <a href="mailto:support@habit.bingo" className="text-[10px] uppercase tracking-[0.15em] font-geologica text-black/40 hover:text-black/80 transition-colors">
              Support
            </a>
          </div>
          <p className="text-[10px] font-geologica text-black/20">
            © 2026 HabitBingo. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}