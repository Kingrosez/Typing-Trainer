import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Target, Zap, Shield, Sparkles } from "lucide-react";

export function SkillDrills() {
  const drillCategories = [
    {
      title: "Trigram & Bigram Isolation",
      subtitle: "Frequent English syllables (TH, HE, IN, ER, AN, RE, ND)",
      icon: Target,
      tag: "Muscle Memory",
      drills: "12 Drills",
    },
    {
      title: "Weak Finger Precision",
      subtitle: "Dedicated drills for left and right pinky and ring finger reaches",
      icon: Shield,
      tag: "Biomechanics",
      drills: "8 Drills",
    },
    {
      title: "Speed Bursts & Accelerators",
      subtitle: "Short 10-second rapid bursts designed to break WPM speed barriers",
      icon: Zap,
      tag: "Velocity",
      drills: "15 Drills",
    },
    {
      title: "Punctuation & Capitalization",
      subtitle: "Shift-key rhythm, quotation marks, parentheses, and compound hyphens",
      icon: Sparkles,
      tag: "Accuracy",
      drills: "10 Drills",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Drills"
        subtitle="Targeted micro-practice modules designed to eliminate specific typing bottlenecks."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drillCategories.map((drill, idx) => {
          const Icon = drill.icon;
          return (
            <Card key={idx} className="border border-border hover:border-primary/50 transition-all shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {drill.tag}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">{drill.drills}</span>
                </div>
                <CardTitle className="text-base flex items-center space-x-2 pt-1">
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{drill.title}</span>
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {drill.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">
                  Select Drill Set
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default SkillDrills;
