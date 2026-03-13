import { useState, type ElementType } from "react";
import { cn } from "@/lib/utils";

export type TileState = "default" | "complete" | "streak" | "skipped";

const tileStyles: Record<TileState, { bg: string; iconColor: string; textColor: string; shadow: string }> = {
  default: {
    bg: "rgba(120, 120, 120, 0.20)",
    iconColor: "rgba(0,0,0,0.08)",
    textColor: "rgba(0,0,0,0.80)",
    shadow: "0 4px 4px rgba(0,0,0,0.25)",
  },
  complete: {
    // Your App's Teal Gradient feel
    bg: "rgba(79, 209, 197, 0.65)",
    iconColor: "rgba(255,255,255,0.3)",
    textColor: "rgba(255,255,255,1)",
    shadow: "0 4px 4px rgba(79,209,197,0.4), inset 0 0 10px rgba(255,255,255,0.2)",
  },
};

const stateOrder: TileState[] = ["default", "complete", "streak", "skipped"];

interface HabitTileProps {
  label: string;
  icon: ElementType;
  borderColor?: string;
  initialState?: TileState;
}

export default function HabitTile({
  label,
  icon: Icon,
  borderColor,
  initialState = "default",
}: HabitTileProps) {
  const [state, setState] = useState<TileState>(initialState);
  const [popping, setPopping] = useState(false);

  const handleClick = () => {
    // Simple toggle logic: if it's default, make it complete. Otherwise, make it default.
    setState((currentState) => (currentState === "default" ? "complete" : "default"));

    // Keep your popping animation
    setPopping(true);
    setTimeout(() => setPopping(false), 350);
  };

  const style = tileStyles[state];

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-3xl cursor-pointer select-none w-full aspect-[112/143] focus:outline-none focus-visible:ring-2 focus-visible:ring-habit-pink",
        popping && "animate-tile-pop"
      )}
      style={{
        background: style.bg,
        boxShadow: style.shadow,
        border: borderColor ? `1px solid ${borderColor}` : "1px solid rgba(217,217,217,0.20)",
        transition: "background 0.4s ease, box-shadow 0.4s ease",
      }}
      aria-label={label}
    >
      {/* Label */}
      <span
        className="relative z-10 text-center font-geologica font-medium leading-tight tracking-wide px-3 text-[0.85rem] sm:text-base"
        style={{
          color: style.textColor,
          letterSpacing: "0.02em",
          transition: "color 0.4s ease",
        }}
      >
        {label}
      </span>
    </button>
  );
}
