
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDashboard = () => {

    if (user.role === 'student') {
      navigate('/student-dashboard');
    } else if (user.role === 'mentor') {
      navigate('/mentor-dashboard');
    }

  };

  return (
    <aside className="sidebar">

      <h3>Menu</h3>

      <button onClick={handleDashboard}>
        Dashboard
      </button>

      {user.role === 'student' && (
        <NavLink to="/my-mentor">
          My Mentor
        </NavLink>
      )}

      {user.role === 'mentor' && (
        <NavLink to="/my-students">
          My Students
        </NavLink>
      )}

      <NavLink to="/goals">
        Goals
      </NavLink>

      <NavLink to="/meetings">
        Meetings
      </NavLink>

      <NavLink to="/progress">
        Progress
      </NavLink>

    </aside>
  );
}

export default Sidebar;

