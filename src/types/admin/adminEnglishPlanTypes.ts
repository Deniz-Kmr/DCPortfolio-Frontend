export interface AdminEnglishPlanListItem {
  id: number;
  title: string;
  level: string;
  focusArea: string | null;
  startDate: string;
  targetDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminEnglishPlanDetail {
  id: number;
  title: string;
  description: string | null;
  level: string;
  focusArea: string | null;
  dailyGoal: string | null;
  weeklyGoal: string | null;
  startDate: string;
  targetDate: string | null;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminEnglishPlanCreateRequest {
  title: string;
  description: string | null;
  level: string;
  focusArea: string | null;
  dailyGoal: string | null;
  weeklyGoal: string | null;
  startDate: string;
  targetDate: string | null;
  isActive: boolean;
  notes: string | null;
}

export interface AdminEnglishPlanUpdateRequest {
  title: string;
  description: string | null;
  level: string;
  focusArea: string | null;
  dailyGoal: string | null;
  weeklyGoal: string | null;
  startDate: string;
  targetDate: string | null;
  isActive: boolean;
  notes: string | null;
}
