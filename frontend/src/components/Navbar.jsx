
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {

    logout();

    navigate('/login');

  };

  return (
    <nav className="navbar">

      <h2>Student Mentorship System</h2>

      {user && (
        <div className="navbar-user">

          <span>
            Welcome, {user.name}
          </span>

          <span>
            Role: {user.role}
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>
      )}

    </nav>
  );
}

export default Navbar;

