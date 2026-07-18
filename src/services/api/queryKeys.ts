export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  public: {
    projects: ['public', 'projects'] as const,
    featuredProjects: ['public', 'projects', 'featured'] as const,
    projectDetail: (slug: string) => ['public', 'projects', slug] as const,
    technologies: ['public', 'technologies'] as const,
    groupedTechnologies: ['public', 'technologies', 'grouped'] as const,
    cv: ['public', 'cv'] as const,
    experiences: ['public', 'experiences'] as const,
    certificates: ['public', 'certificates'] as const,
  },
  admin: {
    dashboard: ['admin', 'dashboard'] as const,

    monitoringSummary: ['admin', 'monitoring', 'summary'] as const,
    monitoringTraffic: ['admin', 'monitoring', 'traffic'] as const,
    monitoringHealth: ['admin', 'monitoring', 'health'] as const,
    monitoringHistory: (days: number) =>
      ['admin', 'monitoring', 'history', days] as const,

    projects: ['admin', 'projects'] as const,
    projectDetail: (id: number) => ['admin', 'projects', id] as const,

    technologies: ['admin', 'technologies'] as const,
    technologyDetail: (id: number) =>
      ['admin', 'technologies', id] as const,

    cvProfiles: ['admin', 'cv-profiles'] as const,
    cvProfileDetail: (id: number) =>
      ['admin', 'cv-profiles', id] as const,

    experiences: ['admin', 'experiences'] as const,
    experienceDetail: (id: number) =>
      ['admin', 'experiences', id] as const,

    certificates: ['admin', 'certificates'] as const,
    certificateDetail: (id: number) =>
      ['admin', 'certificates', id] as const,

    devLogs: ['admin', 'dev-logs'] as const,
    devLogDetail: (id: number) => ['admin', 'dev-logs', id] as const,

    todos: ['admin', 'todos'] as const,
    todoDetail: (id: number) => ['admin', 'todos', id] as const,

    lessons: ['admin', 'lessons'] as const,
    lessonDetail: (id: number) => ['admin', 'lessons', id] as const,

    englishPlans: ['admin', 'english-plans'] as const,
    englishPlanDetail: (id: number) =>
      ['admin', 'english-plans', id] as const,

    learningRoadmaps: ['admin', 'learning-roadmaps'] as const,
    learningRoadmapDetail: (id: number) =>
      ['admin', 'learning-roadmaps', id] as const,
  },
} as const;