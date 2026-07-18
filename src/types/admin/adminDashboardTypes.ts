import type { TodoPriority, TodoStatus } from './adminEnumTypes';

export interface AdminPortfolioSummary {
  totalProjects: number;
  publishedProjects: number;
  totalTechnologies: number;
  activeTechnologies: number;
  totalCvProfiles: number;
  totalExperiences: number;
  publishedExperiences: number;
  totalCertificates: number;
  publishedCertificates: number;
}

export interface AdminTrackingSummary {
  totalDevLogs: number;
  importantDevLogs: number;
  totalLessons: number;
  completedLessons: number;
  totalEnglishPlans: number;
  activeEnglishPlans: number;
  totalRoadmaps: number;
}

export interface AdminTodoSummary {
  totalTodos: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  cancelledCount: number;
  highPriorityCount: number;
  overdueCount: number;
}

export interface AdminRoadmapSummary {
  plannedCount: number;
  inProgressCount: number;
  completedCount: number;
  pausedCount: number;
}

export interface AdminRecentDevLog {
  id: number;
  title: string;
  category: string | null;
  logDate: string;
  isImportant: boolean;
}

export interface AdminRecentTodo {
  id: number;
  title: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string | null;
  completedAt: string | null;
}

export interface AdminRecentLesson {
  id: number;
  title: string;
  topic: string;
  studyDate: string;
  durationMinutes: number;
  isCompleted: boolean;
}

export interface AdminActiveEnglishPlan {
  id: number;
  title: string;
  level: string;
  focusArea: string | null;
  targetDate: string | null;
  isActive: boolean;
}

export interface AdminDashboard {
  portfolioSummary: AdminPortfolioSummary;
  trackingSummary: AdminTrackingSummary;
  todoSummary: AdminTodoSummary;
  roadmapSummary: AdminRoadmapSummary;
  recentDevLogs: AdminRecentDevLog[];
  recentTodos: AdminRecentTodo[];
  recentLessons: AdminRecentLesson[];
  activeEnglishPlans: AdminActiveEnglishPlan[];
  generatedAt: string;
}
