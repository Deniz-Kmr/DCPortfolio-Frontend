export const routePaths = {
  public: {
    home: '/',
    projects: '/projects',
    projectDetail: '/projects/:slug',
  },
  admin: {
    login: '/admin/login',
    dashboard: '/admin/dashboard',
    monitoring: '/admin/monitoring',
    projects: '/admin/projects',
    homeProjects: '/admin/home-projects',
    technologies: '/admin/technologies',
    cv: '/admin/cv',
    experiences: '/admin/experiences',
    certificates: '/admin/certificates',
    devlogs: '/admin/devlogs',
    todos: '/admin/todos',
    lessons: '/admin/lessons',
    englishPlans: '/admin/english-plans',
    learningRoadmaps: '/admin/learning-roadmaps',
  },
} as const;