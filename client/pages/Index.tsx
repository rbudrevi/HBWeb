import Navbar from "@/components/Navbar";
import BingoCard from "@/components/BingoCard";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden font-geologica">
      {/* Background image - low-poly geometric gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/504946951a8fc781510fdffdc667c83b41847c58?width=2578"
          alt=""
          className="w-full h-full object-cover object-center overflow-visible"
          aria-hidden="true"
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
        <main className="flex-1 flex flex-col">
          {/* Tagline */}
          <div
            className="w-full text-center px-4 py-6 md:py-8"
            style={{ backdropFilter: "blur(2px)" }}
          >
            <h1
              className="font-geologica font-bold tracking-wide leading-tight"
              style={{
                color: "#fff",
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                textShadow: "0 4px 4px rgba(0,0,0,0.25), 0 4px 4px rgba(0,0,0,0.25)",
                letterSpacing: "0.02em",
              }}
            >
              Small habits. Big wins. One square at a time.
            </h1>
          </div>

          {/* Main content: quote + bingo card */}
          <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12 px-6 pb-10 lg:px-12 lg:pt-24">
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
      </div>
    </div>
  );
}
