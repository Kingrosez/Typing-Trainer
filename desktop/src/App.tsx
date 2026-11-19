import { Routes, Route, Navigate } from "react-router-dom";
import { AppProviders } from "./app/providers/AppProviders";
import { AppShell } from "./components/layout/AppShell";
import Dashboard from "./features/dashboard/Dashboard";
import TypingTestRoute from "./features/typing-test/TypingTestRoute";
import TypingTestSelector from "./features/typing-test/TypingTestSelector";
import LearningMode from "./pages/LearningMode";
import SkillDrills from "./pages/SkillDrills";
import DeveloperMode from "./pages/DeveloperMode";
import TypingGames from "./pages/TypingGames";
import Analytics from "./pages/Analytics";
import Achievements from "./pages/Achievements";
import Settings from "./pages/Settings";

export function App() {
  return (
    <AppProviders>
      <Routes>
        <Route element={<AppShell />}>
          {/* Overview */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />

          {/* Practice Arenas */}
          <Route path="/typing-test" element={<TypingTestRoute />} />
          <Route path="/test-selector" element={<TypingTestSelector />} />
          <Route path="/learning-mode" element={<LearningMode />} />
          <Route path="/skill-drills" element={<SkillDrills />} />
          <Route path="/developer-mode" element={<DeveloperMode />} />
          <Route path="/typing-games" element={<TypingGames />} />

          {/* Mastery */}
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/achievements" element={<Achievements />} />

          {/* System */}
          <Route path="/settings" element={<Settings />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AppProviders>
  );
}

export default App;
