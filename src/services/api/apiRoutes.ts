export const apiRoutes = {
  auth: {
    createAdmin: '/api/auth/create-admin',
    login: '/api/auth/login',
    me: '/api/auth/me',
  },
  public: {
    projects: '/api/public/projects',
    featuredProjects: '/api/public/projects/featured',
    projectBySlug: (slug: string) => `/api/public/projects/${encodeURIComponent(slug)}`,
    technologies: '/api/public/technologies',
    groupedTechnologies: '/api/public/technologies/grouped',
    cv: '/api/public/cv',
    experiences: '/api/public/experiences',
    certificates: '/api/public/certificates',
  },
  admin: {
    dashboard: '/api/admin/dashboard',

    projects: '/api/admin/projects',
    projectById: (id: number) => `/api/admin/projects/${id}`,

    technologies: '/api/admin/technologies',
    technologyById: (id: number) => `/api/admin/technologies/${id}`,

    cvProfiles: '/api/admin/cv-profiles',
    cvProfileById: (id: number) => `/api/admin/cv-profiles/${id}`,

    experiences: '/api/admin/experiences',
    experienceById: (id: number) => `/api/admin/experiences/${id}`,

    certificates: '/api/admin/certificates',
    certificateById: (id: number) => `/api/admin/certificates/${id}`,

    devLogs: '/api/admin/dev-logs',
    devLogById: (id: number) => `/api/admin/dev-logs/${id}`,

    todos: '/api/admin/todos',
    todoById: (id: number) => `/api/admin/todos/${id}`,

    lessons: '/api/admin/lessons',
    lessonById: (id: number) => `/api/admin/lessons/${id}`,

    englishPlans: '/api/admin/english-plans',
    englishPlanById: (id: number) => `/api/admin/english-plans/${id}`,

    learningRoadmaps: '/api/admin/learning-roadmaps',
    learningRoadmapById: (id: number) => `/api/admin/learning-roadmaps/${id}`,
  },
} as const;
