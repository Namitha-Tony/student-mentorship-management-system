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

  const ProgressBar = ({ label, value }) => {
    const percentage = Math.min(
      100,
      Math.max(0, Number(value) || 0)
    );

    return (
      <div className="progress-item">
        <div className="progress-label">
          <strong>{label}</strong>
          <span>{percentage}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard-content">
        <Sidebar />

        <main>
          <div className="page-header">
            <div>
              <h1>Progress Overview</h1>
              <p>
                Track your academic and mentorship progress.
              </p>
            </div>
          </div>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          {!student && !message && (
            <p>Loading progress...</p>
          )}

          {student && !progress && !message && (
  <Card title="Progress Charts">
    <p>No progress data available yet.</p>

    <div className="progress-chart">
      <ProgressBar
        label="Academic Progress"
        value={0}
      />

      <ProgressBar
        label="Attendance"
        value={0}
      />

      <ProgressBar
        label="Goal Completion"
        value={0}
      />

      <ProgressBar
        label="Overall Progress"
        value={0}
      />
    </div>
  </Card>
)}
          {progress && (
            <>
              <Card title="Progress Charts">
                <div className="progress-chart">
                  <ProgressBar
                    label="Academic Progress"
                    value={progress.academicProgress}
                  />

                  <ProgressBar
                    label="Attendance"
                    value={progress.attendancePercentage}
                  />

                  <ProgressBar
                    label="Goal Completion"
                    value={progress.goalCompletionPercentage}
                  />

                  <ProgressBar
                    label="Overall Progress"
                    value={progress.overallProgress}
                  />
                </div>
              </Card>

              <Card title="Progress Details">
                <div className="progress-details">
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

                  <p>
                    <strong>Overall Progress:</strong>{' '}
                    {progress.overallProgress}%
                  </p>

                  <p>
                    <strong>Mentor Remarks:</strong>{' '}
                    {progress.remarks || 'No remarks yet.'}
                  </p>
                </div>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Progress;