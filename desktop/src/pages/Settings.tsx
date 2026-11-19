import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useTheme } from "../app/providers/ThemeProvider";
import { useShellStore } from "../store/useShellStore";
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Keyboard,
  ShieldCheck,
  Check,
} from "lucide-react";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const {
    mechanicalSoundEnabled,
    toggleMechanicalSound,
    keyboardLayout,
    setKeyboardLayout,
  } = useShellStore();

  const layouts = [
    { id: "QWERTY • US", label: "QWERTY (US Standard)" },
    { id: "QWERTY • UK", label: "QWERTY (UK Extended)" },
    { id: "Dvorak", label: "Dvorak (Simplified)" },
    { id: "Colemak", label: "Colemak" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Settings"
        subtitle="Manage appearance, sound, keyboard layouts, and desktop behavior."
      />

      <div className="space-y-4">
        {/* Appearance & Themes */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Sun className="w-4 h-4 text-primary" />
              <span>Appearance & Color Theme</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Select your preferred visual aesthetic conforming to D2 Design System contrast standards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex items-center justify-between p-3.5 rounded-lg border text-left transition-all ${
                  theme === "dark"
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                    : "border-border hover:bg-secondary/60"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0B0F19] text-[#F8FAFC] border border-[#1E293B]">
                    <Moon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">Midnight Slate (Dark)</div>
                    <div className="text-[11px] text-muted-foreground">High contrast dark canvas (#0B0F19)</div>
                  </div>
                </div>
                {theme === "dark" && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex items-center justify-between p-3.5 rounded-lg border text-left transition-all ${
                  theme === "light"
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                    : "border-border hover:bg-secondary/60"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0]">
                    <Sun className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">Daylight Studio (Light)</div>
                    <div className="text-[11px] text-muted-foreground">Crisp daylight canvas (#F8FAFC)</div>
                  </div>
                </div>
                {theme === "light" && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Audio Simulation */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-primary" />
              <span>Audio Feedback Simulation</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Simulate mechanical keyboard acoustics on each keystroke in real time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center space-x-3">
                {mechanicalSoundEnabled ? (
                  <Volume2 className="w-5 h-5 text-primary" />
                ) : (
                  <VolumeX className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    Mechanical Key Sound
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Tactile Cherry MX click sound simulation
                  </div>
                </div>
              </div>
              <Button
                variant={mechanicalSoundEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleMechanicalSound}
              >
                {mechanicalSoundEnabled ? "Enabled" : "Muted"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Layout */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Keyboard className="w-4 h-4 text-primary" />
              <span>Keyboard Layout & Biometrics</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Select your keyboard arrangement to properly map visual keys and finger guidance zones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {layouts.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setKeyboardLayout(l.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-all ${
                    keyboardLayout === l.id
                      ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                      : "border-border hover:bg-secondary/60 text-foreground"
                  }`}
                >
                  <span>{l.label}</span>
                  {keyboardLayout === l.id && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Desktop System & Security */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Security & Offline Baseline</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Typing Trainer runs 100% locally on your machine with zero external tracking.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="font-medium text-foreground">Desktop Architecture</span>
              <span className="font-mono text-[11px]">Tauri 2 + Rust + React 19</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="font-medium text-foreground">Persistence</span>
              <span className="font-mono text-[11px]">Local SQLite (Offline-First)</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="font-medium text-foreground">External Telemetry / LLMs</span>
              <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">Strictly Disabled (0 Remote Calls)</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="font-medium text-foreground">Keystroke Processing</span>
              <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">In-Memory (0 HTTP Overhead)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
