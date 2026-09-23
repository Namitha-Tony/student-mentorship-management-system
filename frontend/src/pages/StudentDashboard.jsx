import { useEffect, useState } from 'react';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

function StudentDashboard() {
  const { user, token } = useAuth();

  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getStudentProfile = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/students/me',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStudent(data.data);
        } else {
          setMessage(data.message || 'Failed to load student information');
        }
      } catch {
        setMessage('Cannot connect to server');
      }
    };

    if (token) {
      getStudentProfile();
    }
  }, [token]);

  return (
    <div>
      <Navbar />

      <div className="dashboard-content">
        <Sidebar />

        <main>
          <h1>Student Dashboard</h1>

          <Card title="Welcome">
            <p>
              Welcome, {user?.name || 'Student'}!
            </p>
            <p>
              This is your student mentorship dashboard.
            </p>
          </Card>

          <Card title="My Information">
            {message && <p>{message}</p>}

            {!student && !message && (
              <p>Loading student information...</p>
            )}

            {student && (
              <>
                <p>
                  <strong>Student ID:</strong>{' '}
                  {student.studentId}
                </p>

                <p>
                  <strong>Department:</strong>{' '}
                  {student.department || 'Not provided'}
                </p>

                <p>
                  <strong>Semester:</strong>{' '}
                  {student.semester || 'Not provided'}
                </p>
              </>
            )}
          </Card>

          <Card title="My Mentor">
            {student?.mentor ? (
              <>
                <p>
                  <strong>Name:</strong>{' '}
                  {student.mentor.user?.name}
                </p>

                <p>
                  <strong>Email:</strong>{' '}
                  {student.mentor.user?.email}
                </p>
              </>
            ) : (
              <p>No mentor assigned yet.</p>
            )}
          </Card>

          <Card title="Progress">
            <p>
              Your progress information will appear here.
            </p>
          </Card>

          <Card title="Goals">
            <p>
              Your mentorship goals will appear here.
            </p>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;
