export const apiRoutes = {
  auth: {
    login: '/api/auth/login',
    me: '/api/auth/me',
  },
  public: {
    projects: '/api/public/projects',
    technologies: '/api/public/technologies',
    cv: '/api/public/cv',
    experiences: '/api/public/experiences',
    certificates: '/api/public/certificates',
  },
  admin: {
    dashboard: '/api/admin/dashboard',
    projects: '/api/admin/projects',
    technologies: '/api/admin/technologies',
    cvProfiles: '/api/admin/cv-profiles',
    experiences: '/api/admin/experiences',
    certificates: '/api/admin/certificates',
    devlogs: '/api/admin/devlogs',
    todos: '/api/admin/todos',
    lessons: '/api/admin/lessons',
    englishPlans: '/api/admin/english-plans',
    learningRoadmaps: '/api/admin/learning-roadmaps',
  },
} as const;
