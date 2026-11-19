import { Component } from "react";
import type { ReactNode } from "react";
import { Button } from "../ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center max-w-md mx-auto">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/15 text-destructive mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Workspace Render Error
          </h2>
          <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
            {this.state.error?.message ||
              "An unexpected client rendering error occurred in this view."}
          </p>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleReset}
            >
              Try Again
            </Button>
            <Button
              size="sm"
              onClick={() => window.location.reload()}
              className="space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload App</span>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
