import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap, GraduationCap, Target, Code2, Gamepad2, ArrowRight } from "lucide-react";

interface PracticeCard {
  id: string;
  title: string;
  description: string;
  route: string;
  shortcut: string;
  shortcutKey: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  badgeColor: string;
}

const PRACTICE_CARDS: PracticeCard[] = [
  {
    id: "typing-test",
    title: "Typing Test Arena",
    description: "Standardized benchmarks (15s, 30s, 60s, custom text) with live accuracy and WPM graphs.",
    route: "/typing-test",
    shortcut: "Ctrl+2",
    shortcutKey: "2",
    icon: Zap,
    iconColor: "text-primary bg-primary/10",
    badgeColor: "text-primary",
  },
  {
    id: "learning-mode",
    title: "Learning Mode",
    description: "Step-by-step curriculum teaching touch typing finger-by-finger from home row upwards.",
    route: "/learning-mode",
    shortcut: "Ctrl+3",
    shortcutKey: "3",
    icon: GraduationCap,
    iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    badgeColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "skill-drills",
    title: "Skill Drills",
    description: "Isolate troublesome bigrams, strengthen pinky dexterity, and master punctuation reaches.",
    route: "/skill-drills",
    shortcut: "Ctrl+4",
    shortcutKey: "4",
    icon: Target,
    iconColor: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
    badgeColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "developer-mode",
    title: "Developer Mode",
    description: "Programming syntax, braces, arrow functions, and language-specific code snippets.",
    route: "/developer-mode",
    shortcut: "Ctrl+5",
    shortcutKey: "5",
    icon: Code2,
    iconColor: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
    badgeColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    id: "typing-games",
    title: "Typing Games",
    description: "Arcade-style typing games designed to test reflexes, rhythm, and accuracy.",
    route: "/typing-games",
    shortcut: "Ctrl+6",
    shortcutKey: "6",
    icon: Gamepad2,
    iconColor: "text-pink-600 dark:text-pink-400 bg-pink-500/10",
    badgeColor: "text-pink-600 dark:text-pink-400",
  },
];

export const QuickPracticeCards: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section aria-label="Practice Arenas">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-sans">
          Practice Arenas
        </h2>
        <span className="text-[11px] font-mono text-muted-foreground">
          Press Ctrl + 2..6 to quick-launch
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {PRACTICE_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => navigate(card.route)}
              className="flex flex-col justify-between p-4 text-left rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer group shadow-sm"
              aria-label={`${card.title} - Shortcut: ${card.shortcut}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg ${card.iconColor} group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <kbd className="text-[10px] font-mono font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                    {card.shortcut}
                  </kbd>
                </div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="flex items-center text-xs font-medium text-primary mt-3 group-hover:translate-x-0.5 transition-transform">
                <span>Enter Arena</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
