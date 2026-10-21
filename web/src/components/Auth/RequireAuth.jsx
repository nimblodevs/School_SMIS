import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth.js';

export function RequireAuth({ children }) {
  const user = useAuth((state) => state.user);
  const isLoading = useAuth((state) => state.isLoading);
  const initializationError = useAuth((state) => state.initializationError);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="grid min-h-svh place-items-center text-sm font-medium text-muted" role="status">
        Checking your session…
      </div>
    );
  }

  if (initializationError) {
    return (
      <div className="grid min-h-svh place-items-center px-5">
        <p role="alert" className="max-w-lg rounded-2xl border border-error-border bg-error-soft p-5 text-sm text-error">
          {initializationError}
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return children;
}
