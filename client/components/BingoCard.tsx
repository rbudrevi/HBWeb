import HabitTile from "./HabitTile";
import {
  TreePine,
  PersonStanding,
  UtensilsCrossed,
  NotebookPen,
  Droplets,
  Footprints,
  BookOpen,
  Sunrise,
  Dumbbell,
} from "lucide-react";

const habits = [
  { label: "Explore in Nature", icon: TreePine },
  { label: "Try a Yoga Class", icon: PersonStanding },
  { label: "Cook a Healthy Meal", icon: UtensilsCrossed },
  { label: "Journal", icon: NotebookPen },
  { label: "Drink Water", icon: Droplets },
  { label: "Go for a Walk", icon: Footprints },
  { label: "Read 10 pages", icon: BookOpen },
  { label: "Rise with the Sun", icon: Sunrise },
  { label: "A gentle Stretch", icon: Dumbbell },
];

interface BingoCardProps {
  title?: string;
}

export default function BingoCard({ title = "Stillness Sanctuary" }: BingoCardProps) {
  return (
    <div
      className="rounded-3xl p-4 sm:p-5 w-full max-w-sm sm:max-w-md"
      style={{
        background: "rgba(200, 200, 200, 0.30)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
      }}
    >
      {/* Card title */}
      <h2
        className="text-center font-geologica font-normal mb-4 tracking-wide"
        style={{
          color: "rgba(0,0,0,0.80)",
          fontSize: "clamp(0.9rem, 2vw, 1.25rem)",
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </h2>

      {/* 3x3 Bingo Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {habits.map((habit) => (
          <HabitTile
            key={habit.label}
            label={habit.label}
            icon={habit.icon}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
        <LegendItem color="rgba(120,120,120,0.3)" label="Pending" />
        <LegendItem color="rgba(52,199,89,0.5)" label="Complete" />
        <LegendItem color="rgba(240,0,164,0.45)" label="Streak" />
        <LegendItem color="rgba(255,149,0,0.45)" label="Skipped" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block w-3 h-3 rounded-sm"
        style={{ background: color }}
      />
      <span className="text-[10px] sm:text-xs font-geologica text-black/50">
        {label}
      </span>
    </div>
  );
}
