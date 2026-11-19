import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function LoadingState() {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </Card>
  );
}
