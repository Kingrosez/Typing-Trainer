import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface LoadingStateProps {
  cardCount?: number;
}

export function LoadingState({ cardCount = 3 }: LoadingStateProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Grid of skeleton cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: cardCount }).map((_, i) => (
          <Card key={i} className="border border-border/80">
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
