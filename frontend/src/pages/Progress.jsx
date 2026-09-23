import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

function Progress() {
  const { token, user } = useAuth();
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getProgress = async () => {
      try {
        const studentResponse = await fetch(
          'http://localhost:5000/api/students/me',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const studentData = await studentResponse.json();

        if (!studentResponse.ok) {
          setMessage(
            studentData.message || 'Failed to load student profile'
          );
          return;
        }

        setStudent(studentData.data);

        const progressResponse = await fetch(
          `http://localhost:5000/api/progress/student/${studentData.data._id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const progressData = await progressResponse.json();

        if (progressResponse.ok) {
          setProgress(progressData.data);
        } else {
          setMessage(
            progressData.message || 'Failed to load progress'
          );
        }
      } catch {
        setMessage('Cannot connect to server');
      }
    };

    if (token && user) {
      getProgress();
    }
  }, [token, user]);

  return (
    <div>
      <Navbar />

      <div className="dashboard-content">
        <Sidebar />

        <main>
          <h1>Progress Overview</h1>

          {message && <p>{message}</p>}

          {!student && !message && (
            <p>Loading progress...</p>
          )}

          {student && !progress && !message && (
            <Card title="My Progress">
              <p>No progress information available yet.</p>
            </Card>
          )}

          {progress && (
            <>
              <Card title="Academic Progress">
                <p>
                  <strong>Academic Progress:</strong>{' '}
                  {progress.academicProgress}%
                </p>
                <p>
                  <strong>Attendance:</strong>{' '}
                  {progress.attendancePercentage}%
                </p>
                <p>
                  <strong>Goal Completion:</strong>{' '}
                  {progress.goalCompletionPercentage}%
                </p>
              </Card>

              <Card title="Overall Progress">
                <p>
                  <strong>Overall Progress:</strong>{' '}
                  {progress.overallProgress}%
                </p>
                <p>
                  <strong>Mentor Remarks:</strong>{' '}
                  {progress.remarks || 'No remarks yet.'}
                </p>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Progress;
