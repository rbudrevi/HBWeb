import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Construction } from "lucide-react";

const pageNames: Record<string, string> = {
  "/boards": "My Boards",
  "/create": "Create Board",
  "/challenges": "Challenges",
  "/about": "About",
  "/profile": "Profile",
  "/settings": "Settings",
};

export default function Placeholder() {
  const { pathname } = useLocation();
  const name = pageNames[pathname] ?? "This Page";

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-geologica">
      <div className="absolute inset-0 z-0">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/504946951a8fc781510fdffdc667c83b41847c58?width=2578"
          alt=""
          className="w-full h-full object-cover object-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0" style={{ background: "rgba(230,230,230,0.10)" }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <div
            className="rounded-3xl p-10 text-center max-w-md w-full"
            style={{
              background: "rgba(200,200,200,0.35)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
            }}
          >
            <Construction
              size={48}
              className="mx-auto mb-4"
              style={{ color: "rgba(0,0,0,0.25)" }}
            />
            <h1
              className="font-geologica font-bold text-2xl mb-2 tracking-wide"
              style={{ color: "#F000A4" }}
            >
              {name}
            </h1>
            <p className="font-geologica text-black/60 mb-6 text-sm leading-relaxed">
              This page is coming soon. Continue prompting to build it out!
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2.5 rounded-2xl font-geologica font-semibold text-white text-sm tracking-wide transition-opacity hover:opacity-80"
              style={{ background: "#F000A4" }}
            >
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
