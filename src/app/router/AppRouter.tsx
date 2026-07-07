import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { appConfig } from '../../config';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { PublicLayout } from '../../components/layout/PublicLayout';
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
import { NotFoundPage } from '../../pages/common/NotFoundPage';
import { AboutPage } from '../../pages/public/AboutPage';
import { CertificatesPage } from '../../pages/public/CertificatesPage';
import { ContactPage } from '../../pages/public/ContactPage';
import { CvPage } from '../../pages/public/CvPage';
import { ExperiencePage } from '../../pages/public/ExperiencePage';
import { HomePage } from '../../pages/public/HomePage';
import { ProjectDetailPage } from '../../pages/public/ProjectDetailPage';
import { ProjectsPage } from '../../pages/public/ProjectsPage';
import { TechnologiesPage } from '../../pages/public/TechnologiesPage';
import { ProtectedAdminRoute } from './ProtectedAdminRoute';
import { routePaths } from './routePaths';

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
      { path: 'about', element: <AboutPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:slug', element: <ProjectDetailPage /> },
      { path: 'technologies', element: <TechnologiesPage /> },
      { path: 'cv', element: <CvPage /> },
      { path: 'experience', element: <ExperiencePage /> },
      { path: 'certificates', element: <CertificatesPage /> },
      { path: 'contact', element: <ContactPage /> },
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
  return <RouterProvider router={router} />;
}
