import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
function Wrapper({ children }) {
  const { isLoading, error, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <>
    <div className="app-container">
        <div className="loading-state">
          <div className="loading-text">Loading...</div>
        </div>
      </div>
    </>;
  }

  if (error) {
    return <>
    <div className="app-container">
    <div className="error-state">
      <div className="error-title">Oops!</div>
      <div className="error-message">Something went wrong</div>
      <div className="error-sub-message">{error.message}</div>
      {/* toast.error({error.message}) */}
    </div>
  </div></>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default Wrapper;