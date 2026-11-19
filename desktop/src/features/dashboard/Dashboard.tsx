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
  Target,
  Trophy,
  Settings,
  Activity,
  Clock,
  TargetIcon,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to your typing practice dashboard"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Current Test
            </CardTitle>
            <CardDescription>Continue your typing practice</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Start Typing Test
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest typing sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              Achievements
            </CardTitle>
            <CardDescription>Your progress and accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No achievements yet</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start a new typing session</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3">
            <Button variant="secondary" className="w-full justify-start">
              <TargetIcon className="mr-2 h-4 w-4" />
              15 Second Test
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <Clock className="mr-2 h-4 w-4" />
              30 Second Test
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <Target className="mr-2 h-4 w-4" />
              Custom Text Test
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure your typing practice</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Open Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
