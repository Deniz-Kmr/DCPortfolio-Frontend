import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { appConfig } from '../../config';
import { AdminDisabledPage } from '../../pages/common/AdminDisabledPage';
import { ProtectedAdminRoute } from './ProtectedAdminRoute';
import { RouteLoadingFallback } from './RouteLoadingFallback';
import { routePaths } from './routePaths';

const PublicLayout = lazy(() =>
  import('../../components/layout/PublicLayout').then((module) => ({
    default: module.PublicLayout,
  })),
);

const AdminLayout = lazy(() =>
  import('../../components/layout/AdminLayout').then((module) => ({
    default: module.AdminLayout,
  })),
);

const HomePage = lazy(() =>
  import('../../pages/public/HomePage').then((module) => ({
    default: module.HomePage,
  })),
);

const ProjectsPage = lazy(() =>
  import('../../pages/public/ProjectsPage').then((module) => ({
    default: module.ProjectsPage,
  })),
);

const ProjectDetailPage = lazy(() =>
  import('../../pages/public/ProjectDetailPage').then((module) => ({
    default: module.ProjectDetailPage,
  })),
);

const NotFoundPage = lazy(() =>
  import('../../pages/common/NotFoundPage').then((module) => ({
    default: module.NotFoundPage,
  })),
);

const AdminLoginPage = lazy(() =>
  import('../../pages/admin/AdminLoginPage').then((module) => ({
    default: module.AdminLoginPage,
  })),
);

const AdminDashboardPage = lazy(() =>
  import('../../pages/admin/AdminDashboardPage').then((module) => ({
    default: module.AdminDashboardPage,
  })),
);

const AdminProjectsPage = lazy(() =>
  import('../../pages/admin/AdminProjectsPage').then((module) => ({
    default: module.AdminProjectsPage,
  })),
);

const AdminTechnologiesPage = lazy(() =>
  import('../../pages/admin/AdminTechnologiesPage').then((module) => ({
    default: module.AdminTechnologiesPage,
  })),
);

const AdminCvPage = lazy(() =>
  import('../../pages/admin/AdminCvPage').then((module) => ({
    default: module.AdminCvPage,
  })),
);

const AdminExperiencesPage = lazy(() =>
  import('../../pages/admin/AdminExperiencesPage').then((module) => ({
    default: module.AdminExperiencesPage,
  })),
);

const AdminCertificatesPage = lazy(() =>
  import('../../pages/admin/AdminCertificatesPage').then((module) => ({
    default: module.AdminCertificatesPage,
  })),
);

const AdminDevLogsPage = lazy(() =>
  import('../../pages/admin/AdminDevLogsPage').then((module) => ({
    default: module.AdminDevLogsPage,
  })),
);

const AdminTodosPage = lazy(() =>
  import('../../pages/admin/AdminTodosPage').then((module) => ({
    default: module.AdminTodosPage,
  })),
);

const AdminLessonsPage = lazy(() =>
  import('../../pages/admin/AdminLessonsPage').then((module) => ({
    default: module.AdminLessonsPage,
  })),
);

const AdminEnglishPlansPage = lazy(() =>
  import('../../pages/admin/AdminEnglishPlansPage').then((module) => ({
    default: module.AdminEnglishPlansPage,
  })),
);

const AdminLearningRoadmapsPage = lazy(() =>
  import('../../pages/admin/AdminLearningRoadmapsPage').then((module) => ({
    default: module.AdminLearningRoadmapsPage,
  })),
);

const adminRoutes = appConfig.enableAdminUi
  ? [
      {
        path: routePaths.admin.login,
        element: <AdminLoginPage />,
      },
      {
        path: '/admin',
        element: (
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        ),
        children: [
          { index: true, element: <Navigate to={routePaths.admin.dashboard} replace /> },
          { path: 'dashboard', element: <AdminDashboardPage /> },
          { path: 'projects', element: <AdminProjectsPage /> },
          { path: 'technologies', element: <AdminTechnologiesPage /> },
          { path: 'cv', element: <AdminCvPage /> },
          { path: 'experiences', element: <AdminExperiencesPage /> },
          { path: 'certificates', element: <AdminCertificatesPage /> },
          { path: 'devlogs', element: <AdminDevLogsPage /> },
          { path: 'todos', element: <AdminTodosPage /> },
          { path: 'lessons', element: <AdminLessonsPage /> },
          { path: 'english-plans', element: <AdminEnglishPlansPage /> },
          { path: 'learning-roadmaps', element: <AdminLearningRoadmapsPage /> },
        ],
      },
    ]
  : [
      {
        path: '/admin/*',
        element: <AdminDisabledPage />,
      },
    ];

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:slug', element: <ProjectDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  ...adminRoutes,
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export function AppRouter() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
