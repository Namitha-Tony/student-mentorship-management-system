import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

function MyMentor() {

  const { token } = useAuth();

  const [mentor, setMentor] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {

    const getMentor = async () => {

      try {

        const response = await fetch(
          'http://localhost:5000/api/mentors/me',
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          setMentor(data.data);
        } else {
          setMessage(data.message || 'Failed to load mentor');
        }

      } catch (error) {
        setMessage('Cannot connect to server');
      }
    };

    if (token) {
      getMentor();
    }

  }, [token]);

  return (
    <div>
      <Navbar />

      <div className="dashboard-content">

        <Sidebar />

        <main>

          <h1>My Mentor</h1>

          {message && (
            <p>{message}</p>
          )}

          {mentor && (
            <Card title="Mentor Information">

              <p>
                <strong>Name:</strong> {mentor.user.name}
              </p>

              <p>
                <strong>Email:</strong> {mentor.user.email}
              </p>

              <p>
                <strong>Role:</strong> {mentor.user.role}
              </p>

              <p>
                <strong>Employee ID:</strong> {mentor.employeeId}
              </p>

            </Card>
          )}

        </main>

      </div>
    </div>
  );
}

export default MyMentor;