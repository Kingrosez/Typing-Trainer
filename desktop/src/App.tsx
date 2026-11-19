import { Routes, Route } from "react-router-dom";
import { AppProviders } from "./app/providers/AppProviders";
import { AppShell } from "./components/layout/AppShell";
import Dashboard from "./features/dashboard/Dashboard";
import TypingTestRoute from "./features/typing-test/TypingTestRoute";
import TypingTestSelector from "./features/typing-test/TypingTestSelector";

export function App() {
  return (
    <AppProviders>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/typing-test" element={<TypingTestRoute />} />
          <Route path="/test-selector" element={<TypingTestSelector />} />
        </Route>
      </Routes>
    </AppProviders>
  );
}

export default App;
