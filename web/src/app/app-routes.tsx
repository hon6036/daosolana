import { lazy } from 'react';
import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import { UiLayout } from './ui/ui-layout';

const AccountListFeature = lazy(() => import('./account/account-list-feature'));
const ClusterFeature = lazy(() => import('./cluster/cluster-feature'));
const DashboardFeature = lazy(() => import('./dashboard/dashboard-feature'));

const links: { label: string; path: string }[] = [
  { label: 'Account', path: '/account' },
  { label: 'Clusters', path: '/clusters' },
];

const routes: RouteObject[] = [
  { path: '/account/', element: <AccountListFeature /> },
  { path: '/clusters', element: <ClusterFeature /> },
];

export function AppRoutes() {
  return (
    <UiLayout links={links}>
      {useRoutes([
        { index: true, element: <Navigate to={'/dashboard'} replace={true} /> },
        { path: '/dashboard', element: <DashboardFeature /> },
        { path: '*', element: <Navigate to={'/dashboard'} replace={true} /> },
      ])}
    </UiLayout>
  );
}