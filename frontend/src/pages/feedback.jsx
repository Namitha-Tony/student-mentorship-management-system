import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

function Feedback() {
  const { user, token } = useAuth();

  const [feedback, setFeedback] = useState([]);
  const [student, setStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    student: '',
    rating: 5,
    comments: '',
    strengths: '',
    areasForImprovement: '',
    recommendations: ''
  });

  // Student: get own profile and feedback
  useEffect(() => {
    if (!user || !token) return;

    if (user.role !== 'student') {
      setLoading(false);
      return;
    }

    const loadFeedback = async () => {
      try {
        const profileResponse = await fetch(
          `${API}/students/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
          throw new Error(
            profileData.message || 'Unable to load student profile'
          );
        }

        setStudent(profileData.data);

        const feedbackResponse = await fetch(
          `${API}/feedback/student/${profileData.data._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const feedbackData = await feedbackResponse.json();

        if (!feedbackResponse.ok) {
          throw new Error(
            feedbackData.message || 'Unable to load feedback'
          );
        }

        setFeedback(feedbackData.data || []);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [user, token]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Mentor: submit feedback for a student
  const submitFeedback = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          student: form.student,
          rating: Number(form.rating),
          comments: form.comments,
          strengths: form.strengths,
          areasForImprovement: form.areasForImprovement,
          recommendations: form.recommendations
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to submit feedback'
        );
      }

      setMessage('Feedback submitted successfully.');

      setForm({
        student: '',
        rating: 5,
        comments: '',
        strengths: '',
        areasForImprovement: '',
        recommendations: ''
      });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard-content">
        <Sidebar />

        <main>
          <div className="page-header">
            <div>
              <h1>Feedback</h1>

              <p>
                {user?.role === 'mentor'
                  ? 'Provide feedback to your students.'
                  : 'View feedback from your mentor.'}
              </p>
            </div>
          </div>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          {/* MENTOR VIEW */}
          {user?.role === 'mentor' && (
            <Card title="Give Student Feedback">
              <form
                onSubmit={submitFeedback}
                className="meeting-form"
              >
                <label>Student ID</label>

                <input
                  type="text"
                  name="student"
                  value={form.student}
                  onChange={handleChange}
                  placeholder="Enter student ID"
                  required
                />

                <label>Rating</label>

                <select
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Needs Improvement</option>
                  <option value="1">1 - Poor</option>
                </select>

                <label>Comments</label>

                <textarea
                  name="comments"
                  value={form.comments}
                  onChange={handleChange}
                  placeholder="General feedback..."
                />

                <label>Strengths</label>

                <textarea
                  name="strengths"
                  value={form.strengths}
                  onChange={handleChange}
                  placeholder="Student strengths..."
                />

                <label>Areas for Improvement</label>

                <textarea
                  name="areasForImprovement"
                  value={form.areasForImprovement}
                  onChange={handleChange}
                  placeholder="Areas where the student can improve..."
                />

                <label>Recommendations</label>

                <textarea
                  name="recommendations"
                  value={form.recommendations}
                  onChange={handleChange}
                  placeholder="Recommendations for the student..."
                />

                <button
                  type="submit"
                  className="primary-button"
                >
                  Submit Feedback
                </button>
              </form>
            </Card>
          )}

          {/* STUDENT VIEW */}
          {user?.role === 'student' && (
            <Card title="My Feedback">
              {loading ? (
                <p>Loading feedback...</p>
              ) : feedback.length === 0 ? (
                <p>No feedback received yet.</p>
              ) : (
                <div className="meetings-list">
                  {feedback.map((item) => (
                    <div
                      className="meeting-card"
                      key={item._id}
                    >
                      <h3>
                        Rating: {item.rating} / 5 ⭐
                      </h3>

                      {item.comments && (
                        <p>
                          <strong>Comments:</strong>{' '}
                          {item.comments}
                        </p>
                      )}

                      {item.strengths && (
                        <p>
                          <strong>Strengths:</strong>{' '}
                          {item.strengths}
                        </p>
                      )}

                      {item.areasForImprovement && (
                        <p>
                          <strong>
                            Areas for Improvement:
                          </strong>{' '}
                          {item.areasForImprovement}
                        </p>
                      )}

                      {item.recommendations && (
                        <p>
                          <strong>Recommendations:</strong>{' '}
                          {item.recommendations}
                        </p>
                      )}

                      {item.createdAt && (
                        <p>
                          <strong>Date:</strong>{' '}
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}

export default Feedback;