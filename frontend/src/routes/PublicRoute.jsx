
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PublicRoute({ children }) {

  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (user) {

    if (user.role === 'student') {
      return <Navigate to="/student-dashboard" replace />;
    }

    if (user.role === 'mentor') {
      return <Navigate to="/mentor-dashboard" replace />;
    }

  }

  return children;
}

export default PublicRoute;

