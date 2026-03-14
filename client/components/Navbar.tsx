import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Home,
  LayoutGrid,
  PlusCircle,
  Trophy,
  Info,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "My Boards", href: "/boards", icon: LayoutGrid },
  { label: "Create", href: "/create", icon: PlusCircle },
  { label: "Challenges", href: "/challenges", icon: Trophy },
  { label: "About", href: "/about", icon: Info },
];

const userMenuItems = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Sign Out", href: "/", icon: LogOut, danger: true },
];

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setNavOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header
      className="sticky top-0 w-full z-[100] transition-all duration-300"
      style={{ 
        // Lighter, more modern frosted glass instead of the darker gray
        background: "rgba(255, 255, 255, 0.08)", 
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
      }}
    >
      {/* Container: max-w-7xl and mx-auto pins the content so it aligns 
          vertically with your Quote and Bingo Card 
      */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
        
        {/* Logo Group */}
        <div className="flex items-center gap-3 group cursor-pointer">
          {/* The Donut Icon */}
          <div
            className="relative w-10 h-10 flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-110"
          >
            {/* The Outer Ring (Donut) */}
            <div
              className="absolute inset-0 border-[4px] border-[#F000A4] rounded-full shadow-[0_0_15px_rgba(240,0,164,0.4)] transition-all duration-300 group-hover:border-[#ff30bc]"
              style={{
                // Give the ring a slight metallic/jelly sheen
                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 70%)",
              }}
            />

            {/* The Center "Hole" - Small mark to give it a focal point without being heavy */}
            <div className="w-1.5 h-1.5 bg-[#F000A4] rounded-full opacity-40 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* The Typography Stack */}
          <div className="flex flex-col -space-y-1">
            <span
              className="font-geologica font-black text-2xl tracking-tighter text-[#F000A4] transition-colors group-hover:text-[#ff30bc]"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
            >
              HabitBingo
            </span>
            {/* New, more "functional" subline */}
            <span className="text-[9px] font-geologica font-bold uppercase tracking-[0.4em] text-black/40 ml-0.5">
              Gamify Your Growth
            </span>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          
          {/* Nav menu button */}
          <div ref={navRef} className="relative">
            <button
              onClick={() => { setNavOpen(!navOpen); setUserOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-geologica font-bold uppercase tracking-widest text-black/60 hover:text-black hover:bg-white/40 transition-all"
              aria-label="Navigation menu"
            >
              <span className="hidden sm:inline">Menu</span>
              <div className="p-1.5 rounded-lg bg-black/5 group-hover:bg-white/60">
                {navOpen ? <X size={18} /> : <Menu size={18} />}
              </div>
            </button>

            {navOpen && (
              <div
                className="absolute right-0 top-full mt-4 w-52 rounded-2xl overflow-hidden z-50 animate-dropdown-in"
                style={{
                  background: "rgba(255,255,255,0.90)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)",
                }}
              >
                <nav className="py-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setNavOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-geologica font-medium text-gray-800 hover:bg-[#F000A4]/5 hover:text-[#F000A4] transition-colors"
                      >
                        <Icon size={18} className="opacity-70" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}
          </div>

          {/* User icon button */}
          <div ref={userRef} className="relative">
            <button
              onClick={() => { setUserOpen(!userOpen); setNavOpen(false); }}
              className="flex items-center justify-center w-10 h-10 rounded-full text-black/60 hover:text-black hover:bg-white/40 transition-all"
              aria-label="User settings"
            >
              <User size={22} />
            </button>

            {userOpen && (
              <div
                className="absolute right-0 top-full mt-4 w-64 rounded-2xl overflow-hidden z-50 animate-dropdown-in"
                style={{
                  background: "rgba(255,255,255,0.90)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  className="px-5 py-4 border-b bg-black/5"
                  style={{ borderColor: "rgba(0,0,0,0.05)" }}
                >
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-geologica font-bold">Account</p>
                  <p className="text-sm font-geologica font-bold text-gray-800 truncate">
                    user@habitbingo.app
                  </p>
                </div>
                <div className="py-2">
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setUserOpen(false)}
                        className={`flex items-center gap-3 px-5 py-3 text-sm font-geologica font-medium transition-colors hover:bg-white/60 ${
                          item.danger ? "text-red-500" : "text-gray-800"
                        }`}
                      >
                        <Icon size={18} className="opacity-70" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}