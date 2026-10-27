import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { selectIsAuthChecked, selectUser } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

import type { ReactNode } from 'react';

type TProtectedRouteProps = {
  children: ReactNode;
  onlyUnauthorized?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnauthorized = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnauthorized && user) {
    return <Navigate to="/" replace />;
  }

  if (!onlyUnauthorized && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
