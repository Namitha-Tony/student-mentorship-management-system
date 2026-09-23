import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

function MyStudents() {

  const { user, token } = useAuth();

  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {

    const getStudents = async () => {

      try {

        const mentorResponse = await fetch(
          'http://localhost:5000/api/mentors/me',
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const mentorData = await mentorResponse.json();

        if (!mentorResponse.ok) {
          setMessage(mentorData.message || 'Failed to load mentor');
          return;
        }

        const mentorId = mentorData.data._id;

        const response = await fetch(
          `http://localhost:5000/api/mentors/${mentorId}/students`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStudents(data.data);
        } else {
          setMessage(data.message || 'Failed to load students');
        }

      } catch {
        setMessage('Cannot connect to server');
      }
    };

    if (token && user) {
      getStudents();
    }

  }, [token, user]);

  return (
    <div>
      <Navbar />

      <div className="dashboard-content">

        <Sidebar />

        <main>

          <h1>My Students</h1>

          {message && (
            <p>{message}</p>
          )}

          {students.length === 0 && !message && (
            <Card title="Assigned Students">
              <p>No students assigned yet.</p>
            </Card>
          )}

          {students.map((student) => (
<Card
  key={student._id}
  title={
    <Link to={`/my-students/${student._id}`}>
      {student.user.name}
    </Link>
  }
>
              <p>
                <strong>Email:</strong> {student.user.email}
              </p>

              <p>
                <strong>Student ID:</strong> {student.studentId}
              </p>
            </Card>
          ))}

        </main>

      </div>
    </div>
  );
}

export default MyStudents;
