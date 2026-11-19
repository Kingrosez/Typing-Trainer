import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { QueryProvider } from "./QueryProvider";
import { BrowserRouter as Router } from "react-router-dom";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <Router>{children}</Router>
      </QueryProvider>
    </ThemeProvider>
  );
}
