import Navbar from "@/components/Navbar";
import BingoCard from "@/components/BingoCard";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col relative font-geologica">
      {/* 1. CLEAN BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/504946951a8fc781510fdffdc667c83b41847c58?width=2578"
          alt=""
          className="w-full h-full object-cover object-center"
          aria-hidden="true"
        />

        {/* Subtle Gradient Spotlight for the Hero Text */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)",
            backdropFilter: "blur(1px)"
          }}
        />

        {/* Global overlay for general readability */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
      </div>

      {/* 2. CONTENT LAYER */}
      <div className="relative z-[100] flex flex-col min-h-screen">
        <Navbar />

        <main className="flex flex-col pt-4 md:pt-8">
          {/* Tagline */}
          <div className="w-full text-center px-4 pb-8 md:pb-12">
            <h1
              className="font-geologica font-bold tracking-tight leading-[1.1]"
              style={{
                color: "#fff",
                fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
                textShadow: "0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
                letterSpacing: "-0.02em",
              }}
            >
              Small habits. Big wins.<br className="hidden md:block" /> One square at a time.
            </h1>
          </div>

          {/* Main content: focused to max-w-5xl to match Navbar */}
          <div className="max-w-5xl mx-auto w-full flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-16 px-6 pb-20">

            {/* Left: Quote */}
            <div className="max-w-sm lg:max-w-md text-center lg:text-left animate-slide-up">
              <blockquote
                className="font-geologica font-normal leading-snug"
                style={{
                  color: "#000",
                  fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)",
                  letterSpacing: "0.02em",
                  textShadow: "0 2px 4px #fff",
                }}
              >
                &ldquo;A day focused on mental health and physical rest.
                Include activities like meditation, hydration, reading, and
                digital detox.&rdquo;
              </blockquote>

              <p className="mt-8 text-sm font-geologica font-bold uppercase tracking-widest opacity-40">
                Tap a tile to mark progress &rarr;
              </p>
            </div>

            {/* Right: Bingo Card */}
            <div className="animate-fade-in w-full max-w-sm sm:max-w-md lg:max-w-none lg:w-auto flex justify-center lg:justify-end">
              <BingoCard title="Stillness Sanctuary" />
            </div>
          </div>
        </main>

        <footer className="w-full py-10 mt-auto border-t border-black/5 flex flex-col items-center gap-4">
          <div className="flex gap-6">
            <a href="/privacy" className="text-xs font-geologica text-black/40 hover:text-black/80 transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-xs font-geologica text-black/40 hover:text-black/80 transition-colors">Terms of Service</a>
            <a href="mailto:support@habit.bingo" className="text-[10px] uppercase tracking-[0.15em] font-geologica text-black/40 hover:text-black/80 transition-colors">Support</a>
          </div>
          <p className="text-[10px] font-geologica text-black/20">© 2026 HabitBingo. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}