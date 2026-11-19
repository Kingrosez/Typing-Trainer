import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Trophy, Award, Flame, Zap, Shield, Target } from "lucide-react";

export function Achievements() {
  const achievements = [
    {
      title: "First Keystroke",
      description: "Complete your first test in Typing Arena",
      icon: Zap,
      unlocked: false,
      progress: "0/1",
      tier: "Bronze",
    },
    {
      title: "Clean Run",
      description: "Achieve 100% accuracy on any test over 30 seconds",
      icon: Shield,
      unlocked: false,
      progress: "0/1",
      tier: "Silver",
    },
    {
      title: "Speed Demon",
      description: "Surpass 80 WPM with at least 95% accuracy",
      icon: Award,
      unlocked: false,
      progress: "0/80 WPM",
      tier: "Gold",
    },
    {
      title: "Consistent Habit",
      description: "Maintain an active 7-day typing practice streak",
      icon: Flame,
      unlocked: true,
      progress: "7/7 Days",
      tier: "Streak",
    },
    {
      title: "Syntax Master",
      description: "Complete 10 Developer Mode programming syntax drills",
      icon: Target,
      unlocked: false,
      progress: "0/10",
      tier: "Specialist",
    },
    {
      title: "Century Club",
      description: "Break the elusive 100 WPM milestone",
      icon: Trophy,
      unlocked: false,
      progress: "0/100 WPM",
      tier: "Platinum",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Achievements & Trophies"
        subtitle="Badges, streak milestones, and progression accolades celebrating your typing mastery."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach, idx) => {
          const Icon = ach.icon;
          return (
            <Card
              key={idx}
              className={`border transition-all ${
                ach.unlocked
                  ? "border-amber-500/40 bg-amber-500/5 shadow-xs"
                  : "border-border/70 bg-card/60 opacity-80"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      ach.unlocked
                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {ach.tier}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {ach.progress}
                  </span>
                </div>
                <div className="flex items-center space-x-3 pt-2">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                      ach.unlocked
                        ? "bg-amber-500/20 text-amber-500"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{ach.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {ach.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      ach.unlocked ? "bg-amber-500 w-full" : "bg-muted-foreground/30 w-0"
                    }`}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default Achievements;
