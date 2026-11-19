import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Play, Rocket, ShieldAlert, Sparkles } from "lucide-react";

export function TypingGames() {
  const games = [
    {
      title: "Meteor Descent",
      tagline: "Destroy descending word meteors before they strike the city shield.",
      icon: Rocket,
      difficulty: "Fast-Paced",
      status: "Arcade Arena",
    },
    {
      title: "Ghost Typist",
      tagline: "Race against your historical personal best recording in real-time.",
      icon: Sparkles,
      difficulty: "Competitive",
      status: "Race Arena",
    },
    {
      title: "Word Cascade",
      tagline: "High-accuracy cascade where typing errors accelerate the drop speed.",
      icon: ShieldAlert,
      difficulty: "Precision",
      status: "Survival Arena",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Typing Games"
        subtitle="Gamified typing mechanics designed to test speed and accuracy under pressure."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {games.map((g, idx) => {
          const Icon = g.icon;
          return (
            <Card key={idx} className="border border-border hover:border-primary/50 transition-all flex flex-col justify-between shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {g.difficulty}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">{g.status}</span>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-base">{g.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {g.tagline}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Button size="sm" className="w-full space-x-1.5">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Game</span>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default TypingGames;
