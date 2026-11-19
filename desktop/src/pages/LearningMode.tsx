import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { GraduationCap, BookOpen, CheckCircle2, Lock, ArrowRight } from "lucide-react";

export function LearningMode() {
  const modules = [
    {
      id: "module-1",
      title: "Home Row Mastery",
      keys: "A S D F • J K L ;",
      description: "Foundational finger placement and anchor keys F and J homing bumps.",
      status: "Available",
      progress: 0,
      locked: false,
    },
    {
      id: "module-2",
      title: "Top Row Extensions",
      keys: "Q W E R T • Y U I O P",
      description: "Vertical finger reaches from home row to top row vowel clusters.",
      status: "Upcoming",
      progress: 0,
      locked: true,
    },
    {
      id: "module-3",
      title: "Bottom Row & Lateral Reaches",
      keys: "Z X C V B • N M , . /",
      description: "Downwards diagonal key navigation and pinky lateral extensions.",
      status: "Upcoming",
      progress: 0,
      locked: true,
    },
    {
      id: "module-4",
      title: "Number Row & Symbols",
      keys: "1 2 3 4 5 • 6 7 8 9 0",
      description: "Upper tier numeral reaches and essential punctuation symbols.",
      status: "Upcoming",
      progress: 0,
      locked: true,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Mode"
        subtitle="Progressive touch typing curriculum designed for anatomical precision and speed."
        actions={
          <Button className="space-x-1.5" size="sm">
            <BookOpen className="w-4 h-4" />
            <span>Resume Current Lesson</span>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((m) => (
          <Card
            key={m.id}
            className={`border transition-all ${
              m.locked
                ? "bg-card/40 border-border/50 opacity-80"
                : "border-border hover:border-primary/50 shadow-xs"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {m.keys}
                </span>
                {m.locked ? (
                  <span className="flex items-center space-x-1 text-[11px] text-muted-foreground font-medium">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{m.status}</span>
                  </span>
                )}
              </div>
              <CardTitle className="text-base flex items-center space-x-2 pt-1">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span>{m.title}</span>
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                {m.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant={m.locked ? "secondary" : "default"}
                size="sm"
                className="w-full justify-between"
                disabled={m.locked}
              >
                <span>{m.locked ? "Complete Previous Stage" : "Start Module"}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default LearningMode;
