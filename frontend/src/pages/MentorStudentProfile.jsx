import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

function MentorStudentProfile() {
  const { studentId } = useParams();
  const { token } = useAuth();
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getStudent = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/students/${studentId}`,
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
          setMessage(data.message || 'Failed to load student');
        }
      } catch {
        setMessage('Cannot connect to server');
      }
    };

    if (token && studentId) {
      getStudent();
    }
  }, [token, studentId]);

  return (
    <div>
      <Navbar />

      <div className="dashboard-content">
        <Sidebar />

        <main>
          <h1>Student Profile</h1>

          {message && <p>{message}</p>}

          {!student && !message && (
            <p>Loading student profile...</p>
          )}

          {student && (
            <>
              <Card title="Personal Information">
                <p>
                  <strong>Name:</strong> {student.user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {student.user?.email}
                </p>
                <p>
                  <strong>Phone:</strong>{' '}
                  {student.phone || 'Not provided'}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{' '}
                  {student.dateOfBirth
                    ? new Date(student.dateOfBirth).toLocaleDateString()
                    : 'Not provided'}
                </p>
              </Card>

              <Card title="Academic Information">
                <p>
                  <strong>Student ID:</strong> {student.studentId}
                </p>
                <p>
                  <strong>Department:</strong>{' '}
                  {student.department || 'Not provided'}
                </p>
                <p>
                  <strong>Semester:</strong>{' '}
                  {student.semester || 'Not provided'}
                </p>
                <p>
                  <strong>Academic Year:</strong>{' '}
                  {student.academicYear || 'Not provided'}
                </p>
              </Card>

              <Card title="Mentor">
                <p>
                  <strong>Mentor:</strong>{' '}
                  {student.mentor?.user?.name || 'Not available'}
                </p>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default MentorStudentProfile;
