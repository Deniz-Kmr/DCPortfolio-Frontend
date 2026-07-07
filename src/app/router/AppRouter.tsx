import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { appConfig } from '../../config';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminCertificatesPage } from '../../pages/admin/AdminCertificatesPage';
import { AdminCvPage } from '../../pages/admin/AdminCvPage';
import { AdminDashboardPage } from '../../pages/admin/AdminDashboardPage';
import { AdminDevLogsPage } from '../../pages/admin/AdminDevLogsPage';
import { AdminEnglishPlansPage } from '../../pages/admin/AdminEnglishPlansPage';
import { AdminExperiencesPage } from '../../pages/admin/AdminExperiencesPage';
import { AdminLearningRoadmapsPage } from '../../pages/admin/AdminLearningRoadmapsPage';
import { AdminLessonsPage } from '../../pages/admin/AdminLessonsPage';
import { AdminLoginPage } from '../../pages/admin/AdminLoginPage';
import { AdminProjectsPage } from '../../pages/admin/AdminProjectsPage';
import { AdminTechnologiesPage } from '../../pages/admin/AdminTechnologiesPage';
import { AdminTodosPage } from '../../pages/admin/AdminTodosPage';
import { AdminDisabledPage } from '../../pages/common/AdminDisabledPage';
import { ProtectedAdminRoute } from './ProtectedAdminRoute';
import { RouteLoadingFallback } from './RouteLoadingFallback';
import { routePaths } from './routePaths';

const PublicLayout = lazy(() =>
  import('../../components/layout/PublicLayout').then((module) => ({
    default: module.PublicLayout,
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
