import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

function MentorDashboard() {
  const { token } = useAuth();

  const [mentor, setMentor] = useState(null);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const getMentor = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/mentors/me',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          setMentor(data.data);
        } else {
          setMessage(data.message || 'Failed to load mentor');
        }
      } catch {
        setMessage('Cannot connect to server');
      }
    };

    if (token) {
      getMentor();
    }
  }, [token]);
  useEffect(() => {
    const getStudents = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/mentors/${mentor._id}/students`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
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

    if (token && mentor) {
      getStudents();
    }
  }, [token, mentor]);
  return (
    <div>

      <Navbar />

      <div className="dashboard-content">

        <Sidebar />

        <main>

<h1>Mentor Dashboard</h1>

{message && <p>{message}</p>}

{!mentor && !message && (
  <p>Loading mentor information...</p>
)}

{mentor && (
  <Card title="My Information">
    <p>
      <strong>Name:</strong> {mentor.user?.name}
    </p>

    <p>
      <strong>Email:</strong> {mentor.user?.email}
    </p>

    <p>
      <strong>Employee ID:</strong> {mentor.employeeId}
    </p>
  </Card>
)}

{mentor && (
  <Card title="My Students">
    <p>
      <strong>Total Students:</strong> {students.length}
    </p>

    {students.length === 0 ? (
      <p>No students assigned yet.</p>
    ) : (
      students.map((student) => (
        <div key={student._id}>
          <p>
            <strong>Name:</strong> {student.user?.name}
          </p>

          <p>
            <strong>Student ID:</strong> {student.studentId}
          </p>

          <p>
            <strong>Department:</strong>{' '}
            {student.department || 'Not provided'}
          </p>

          <hr />
        </div>
      ))
    )}
  </Card>
)}

<Card title="Meetings">
  <p>Your meetings will appear here.</p>
</Card>
        </main>

      </div>

    </div>
  );
}

export default MentorDashboard;
