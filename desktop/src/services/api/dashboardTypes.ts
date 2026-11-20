/**
 * Dashboard API Data Transfer Objects (DTOs)
 * Strictly aligned with backend Spring Boot models:
 * com.typingtrainer.dashboard.dto.DashboardSummaryResponse
 * com.typingtrainer.dashboard.dto.DailyGoalUpdateRequest
 */

export interface UserStatusDto {
  displayName: string;
  currentLevel: number;
  currentTier: string;
  totalXp: number;
  xpProgressInLevel: number;
  xpRequiredForNextLevel: number;
  currentStreakDays: number;
  longestStreakDays: number;
  freezeShieldsAvailable: number;
}

export interface DailyGoalDto {
  targetMinutes: number;
  completedSecondsToday: number;
  remainingSecondsToday: number;
  progressPercentage: number;
  isCompletedToday: boolean;
}

export interface PrimaryMetricsDto {
  bestWpm: number | null;
  averageWpm: number | null;
  accuracy: number | null;
  totalPracticeSeconds: number;
  completedSessionCount: number;
  currentSessionWpm: number | null;
}

export interface WeeklyActivityDayDto {
  dayOfWeek: string;
  date: string;
  durationSeconds: number;
  goalMet: boolean;
  isToday: boolean;
}

export interface WpmTrendPointDto {
  sessionId: string;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  totalErrors: number;
  completedAt: string;
}

export interface WeakKeyDto {
  keyChar: string;
  errorRate: number;
  accuracy: number;
  opportunities: number;
  errors: number;
  wpi: number;
  tier: string;
  explanation: string;
  consecutiveCleanSessions?: number;
  isMastered?: boolean;
}

export type WeakKeyStatus =
  | "INSUFFICIENT_DATA"
  | "WEAK"
  | "DEVELOPING"
  | "STABLE"
  | "MASTERED"
  | "NO_RECOMMENDATIONS";

export interface WeakKeyOverviewDto {
  overallStatus: WeakKeyStatus;
  headline: string;
  explanation: string;
  weakKeyCount: number;
  developingKeyCount: number;
  stableKeyCount: number;
  masteredKeyCount: number;
}

export interface PersonalBestsDto {
  best15sWpm: number | null;
  best60sWpm: number | null;
  bestDevModeWpm: number | null;
  longestSessionSeconds: number | null;
}

export interface RecentSessionSummaryDto {
  id: string;
  sessionMode: string;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  totalErrors: number;
  durationSeconds: number;
  xpEarned: number;
  completedAt: string;
}

export interface DashboardSummaryResponse {
  userStatus: UserStatusDto;
  dailyGoal: DailyGoalDto;
  primaryMetrics: PrimaryMetricsDto;
  weeklyActivity: WeeklyActivityDayDto[];
  wpmTrend: WpmTrendPointDto[];
  weakKeyRecommendations: WeakKeyDto[];
  personalBests: PersonalBestsDto;
  recentSessions: RecentSessionSummaryDto[];
  weakKeyOverview?: WeakKeyOverviewDto;
}

export interface DailyGoalUpdateRequest {
  targetMinutes: number;
}

// Semantic aliases matching frontend widget terminology
export type UserStatus = UserStatusDto;
export type DailyGoal = DailyGoalDto;
export type PrimaryMetrics = PrimaryMetricsDto;
export type WeeklyActivity = WeeklyActivityDayDto;
export type WpmTrend = WpmTrendPointDto;
export type WeakKeyRecommendation = WeakKeyDto;
export type PersonalBests = PersonalBestsDto;
export type RecentSession = RecentSessionSummaryDto;
