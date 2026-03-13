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
  ChevronDown,
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
      <<header
  className="sticky top-0 w-full py-6 px-4 md:px-6 flex items-center justify-center z-[100] overflow-visible transition-all duration-300"
  style={{ 
    background: "rgba(217,217,217,0.15)", // Dropped from 0.50 to 0.15 for more transparency
    backdropFilter: "blur(12px)",         // Increased blur for a "thicker glass" feel
    WebkitBackdropFilter: "blur(12px)" 
  }}
>
      {/* Outer pill */}
      <div
        className="w-full max-w-5xl flex items-center px-3 py-2 rounded-3xl"
        style={{
          background: "rgba(217,217,217,0.45)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "inset 0 4px 4px rgba(0,0,0,0.25), 0 4px 4px rgba(0,0,0,0.25)",
        }}
      >
        {/* Logo pill */}
        <Link
          to="/"
          className="flex items-center px-4 py-2 shrink-0 hover:opacity-80 transition-opacity"
        >
          <span
            className="font-geologica font-bold text-xl md:text-2xl tracking-[0.25em]"
            style={{ color: "#F000A4" }}
          >
            HabitBingo
          </span>
        </Link>
        {/* Spacer */}
        <div className="flex-1" />

        {/* Nav menu button */}
        <div ref={navRef} className="relative mr-2">
          <button
            onClick={() => { setNavOpen(!navOpen); setUserOpen(false); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-geologica font-medium text-gray-700 hover:bg-white/30 transition-colors"
            aria-label="Navigation menu"
          >
            <span className="hidden sm:inline">Menu</span>
            {navOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {navOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-50 animate-dropdown-in"
              style={{
                background: "rgba(240,240,240,0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
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
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-geologica text-gray-800 hover:bg-white/60 transition-colors"
                    >
                      <Icon size={16} className="text-gray-500" />
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
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/30 transition-colors"
            aria-label="User settings"
          >
            <User size={22} className="text-gray-700" />
          </button>

          {userOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 rounded-2xl overflow-hidden z-50 animate-dropdown-in"
              style={{
                background: "rgba(240,240,240,0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
              }}
            >
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
              >
                <p className="text-xs text-gray-500 font-geologica">Signed in as</p>
                <p className="text-sm font-geologica font-semibold text-gray-800 truncate">
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
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-geologica transition-colors hover:bg-white/60 ${
                        item.danger ? "text-red-500" : "text-gray-800"
                      }`}
                    >
                      <Icon size={16} className={item.danger ? "text-red-400" : "text-gray-500"} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
