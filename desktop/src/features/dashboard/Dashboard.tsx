import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Zap,
  GraduationCap,
  Target,
  Code2,
  Gamepad2,
  TrendingUp,
  Flame,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Your personalized typing command center. Pick up where you left off or jump into practice."
        actions={
          <Button
            onClick={() => navigate("/typing-test")}
            className="space-x-1.5 shadow-sm"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Start Practice Test</span>
          </Button>
        }
      />

      {/* Hero Quick Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Streak Card */}
        <Card className="border border-border bg-gradient-to-br from-card to-secondary/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-mono font-medium text-amber-500 flex items-center space-x-1">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
                <span>Daily Practice Streak</span>
              </CardDescription>
              <span className="text-xs font-mono font-bold text-amber-500">Day 7</span>
            </div>
            <CardTitle className="text-2xl font-bold font-mono">
              7 <span className="text-sm font-sans font-normal text-muted-foreground">Days Active</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            <p>Practice today to protect your weekly streak multiplier.</p>
          </CardContent>
        </Card>

        {/* Current Benchmark Card */}
        <Card className="border border-border bg-gradient-to-br from-card to-secondary/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-mono font-medium text-blue-500 flex items-center space-x-1">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>Speed Benchmark</span>
              </CardDescription>
              <span className="text-xs font-mono font-bold text-blue-500">60s Test</span>
            </div>
            <CardTitle className="text-2xl font-bold font-mono">
              -- <span className="text-sm font-sans font-normal text-muted-foreground">WPM</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            <p>Ready to record your baseline typing speed.</p>
          </CardContent>
        </Card>

        {/* Level Mastery Card */}
        <Card className="border border-border bg-gradient-to-br from-card to-secondary/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-mono font-medium text-emerald-500 flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Typist Rank</span>
              </CardDescription>
              <span className="text-xs font-mono font-bold text-emerald-500">Tier 2</span>
            </div>
            <CardTitle className="text-2xl font-bold font-mono">
              Level 14 <span className="text-sm font-sans font-normal text-muted-foreground">Apprentice</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            <p>320 XP remaining until Level 15 Journeyman.</p>
          </CardContent>
        </Card>
      </div>

      {/* Practice Arenas Direct Launch Grid */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 font-sans">
          Practice Arenas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Typing Test */}
          <Card
            className="border border-border hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => navigate("/typing-test")}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Zap className="w-4 h-4" />
                </div>
                <kbd className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                  Ctrl+2
                </kbd>
              </div>
              <CardTitle className="text-base pt-2">Typing Test Arena</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Standardized benchmarks (15s, 30s, 60s, custom text) with live accuracy and WPM graphs.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-xs font-medium text-primary group-hover:translate-x-1 transition-transform">
                <span>Enter Arena</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </CardContent>
          </Card>

          {/* Learning Mode */}
          <Card
            className="border border-border hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => navigate("/learning-mode")}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <kbd className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                  Ctrl+3
                </kbd>
              </div>
              <CardTitle className="text-base pt-2">Learning Mode</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Step-by-step curriculum teaching touch typing finger-by-finger from home row upwards.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>View Curriculum</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </CardContent>
          </Card>

          {/* Skill Drills */}
          <Card
            className="border border-border hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => navigate("/skill-drills")}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <Target className="w-4 h-4" />
                </div>
                <kbd className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                  Ctrl+4
                </kbd>
              </div>
              <CardTitle className="text-base pt-2">Skill Drills</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Isolate troublesome bigrams, strengthen pinky dexterity, and master punctuation reaches.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-xs font-medium text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                <span>Select Drills</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </CardContent>
          </Card>

          {/* Developer Mode */}
          <Card
            className="border border-border hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => navigate("/developer-mode")}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                  <Code2 className="w-4 h-4" />
                </div>
                <kbd className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                  Ctrl+5
                </kbd>
              </div>
              <CardTitle className="text-base pt-2">Developer Mode</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Programming syntax, braces, arrow functions, and language-specific code snippets.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-xs font-medium text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>Practice Code</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </CardContent>
          </Card>

          {/* Typing Games */}
          <Card
            className="border border-border hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => navigate("/typing-games")}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <kbd className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                  Ctrl+6
                </kbd>
              </div>
              <CardTitle className="text-base pt-2">Typing Games</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Arcade-style typing games designed to test reflexes, rhythm, and accuracy.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-xs font-medium text-pink-600 dark:text-pink-400 group-hover:translate-x-1 transition-transform">
                <span>Play Games</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </CardContent>
          </Card>

          {/* Analytics & Mastery */}
          <Card
            className="border border-border hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => navigate("/analytics")}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <kbd className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                  Ctrl+7
                </kbd>
              </div>
              <CardTitle className="text-base pt-2">Analytics & Heatmaps</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Finger speed heatmaps, historical progression curves, and error analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-xs font-medium text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>View Analytics</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
