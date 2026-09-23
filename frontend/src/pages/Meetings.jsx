import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

function Meetings() {
  const { user, token } = useAuth();

  const [meetings, setMeetings] = useState([]);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    type: 'academic',
    purpose: ''
  });

  // Get the Student/Mentor profile first
  useEffect(() => {
    if (!user || !token) return;

    const loadProfile = async () => {
      try {
        const endpoint =
  user.role === 'student'
    ? `${API}/students/me`
    : `${API}/mentors/${user._id}`;

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load profile');
        }

        setProfile(data.data);
      } catch (error) {
        setMessage(error.message);
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, token]);

  // Once profile is loaded, get meetings
  useEffect(() => {
    if (!profile || !user || !token) return;

    const loadMeetings = async () => {
      try {
        setLoading(true);

        const endpoint =
          user.role === 'student'
            ? `${API}/meetings/student/${profile._id}`
            : `${API}/meetings/mentor/${profile._id}`;

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load meetings');
        }

        setMeetings(data.data || []);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMeetings();
  }, [profile, user, token]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const requestMeeting = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API}/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to request meeting');
      }

      setMeetings((prev) => [...prev, data.data]);

      setForm({
        date: '',
        startTime: '',
        endTime: '',
        type: 'academic',
        purpose: ''
      });

      setShowForm(false);
      setMessage('Meeting requested successfully.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const cancelMeeting = async (id) => {
    try {
      const response = await fetch(`${API}/meetings/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel meeting');
      }

      setMeetings((prev) =>
        prev.filter((meeting) => meeting._id !== id)
      );

      setMessage('Meeting cancelled successfully.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const statusClass = (status) => {
    return `status ${status}`;
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard-content">
        <Sidebar />

        <main>
          <div className="page-header">
            <div>
              <h1>Meetings</h1>
              <p>Manage your mentorship meetings.</p>
            </div>

            {user?.role === 'student' && (
              <button
                className="primary-button"
                onClick={() => setShowForm(!showForm)}
              >
                + Request Meeting
              </button>
            )}
          </div>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          {showForm && user?.role === 'student' && (
            <Card title="Request a Meeting">
              <form onSubmit={requestMeeting} className="meeting-form">

                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />

                <label>Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                />

                <label>End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                />

                <label>Meeting Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="academic">Academic</option>
                  <option value="career">Career</option>
                  <option value="personal">Personal</option>
                  <option value="other">Other</option>
                </select>

                <label>Purpose</label>
                <textarea
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  placeholder="What would you like to discuss?"
                  required
                />

                <button
                  type="submit"
                  className="primary-button"
                >
                  Submit Request
                </button>

              </form>
            </Card>
          )}

          <Card
            title={
              user?.role === 'mentor'
                ? 'Student Meetings'
                : 'My Meetings'
            }
          >
            {loading ? (
              <p>Loading meetings...</p>
            ) : meetings.length === 0 ? (
              <p>No meetings found.</p>
            ) : (
              <div className="meetings-list">

                {meetings.map((meeting) => (
                  <div
                    className="meeting-card"
                    key={meeting._id}
                  >

                    <div className="meeting-header">
                      <h3>{meeting.purpose}</h3>

                      <span className={statusClass(meeting.status)}>
                        {meeting.status}
                      </span>
                    </div>

                    <p>
                      <strong>Date:</strong>{' '}
                      {new Date(
                        meeting.date
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      <strong>Time:</strong>{' '}
                      {meeting.startTime} - {meeting.endTime}
                    </p>

                    <p>
                      <strong>Type:</strong>{' '}
                      {meeting.type}
                    </p>

                    {meeting.discussion && (
                      <p>
                        <strong>Discussion:</strong>{' '}
                        {meeting.discussion}
                      </p>
                    )}

                    {meeting.actionItems && (
                      <p>
                        <strong>Action Items:</strong>{' '}
                        {meeting.actionItems}
                      </p>
                    )}

                    {user?.role === 'student' &&
                      meeting.status === 'requested' && (
                        <button
                          className="danger-button"
                          onClick={() =>
                            cancelMeeting(meeting._id)
                          }
                        >
                          Cancel Meeting
                        </button>
                      )}

                  </div>
                ))}

              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
}

export default Meetings;