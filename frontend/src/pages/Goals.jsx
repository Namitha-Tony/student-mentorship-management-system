import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

function Goals() {
  const { token } = useAuth();

  const [student, setStudent] = useState(null);
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('not_started');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getStudent = async () => {
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
          setMessage(data.message || 'Failed to load student');
        }
      } catch {
        setMessage('Cannot connect to server');
      }
    };

    if (token) {
      getStudent();
    }
  }, [token]);

  useEffect(() => {
    const getGoals = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/goals/student/${student._id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          setGoals(data.data);
        } else {
          setMessage(data.message || 'Failed to load goals');
        }
      } catch {
        setMessage('Cannot connect to server');
      }
    };

    if (token && student) {
      getGoals();
    }
  }, [token, student]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch(
        'http://localhost:5000/api/goals',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title,
            description,
            category,
            deadline,
            status,
            progressPercentage: Number(progressPercentage)
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setGoals((current) => [...current, data.data]);
        setTitle('');
        setDescription('');
        setCategory('');
        setDeadline('');
        setStatus('not_started');
        setProgressPercentage(0);
        setMessage('Goal created successfully');
      } else {
        setMessage(data.message || 'Failed to create goal');
      }
    } catch {
      setMessage('Cannot connect to server');
    }
  };

  return (
  <div>
    <Navbar />

    <div className="dashboard-content">
      <Sidebar />

      <main className="goal-page">
        <h1>My Goals</h1>

        {message && (
          <p className="page-message">
            {message}
          </p>
        )}

        <section className="goal-form-card">
          <h2>Create a Goal</h2>

          <form className="goal-form" onSubmit={handleSubmit}>
            <div className="goal-form-grid">
              <div>
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Enter your goal"
                  required
                />
              </div>

              <div>
                <label htmlFor="category">Category</label>
                <input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  placeholder="Academic, Career, Personal..."
                />
              </div>

              <div>
                <label htmlFor="deadline">Deadline</label>
                <input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label htmlFor="progressPercentage">
                  Progress Percentage
                </label>
                <input
                  id="progressPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={progressPercentage}
                  onChange={(event) =>
                    setProgressPercentage(event.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe your goal..."
              />
            </div>

            <button type="submit">Add Goal</button>
          </form>
        </section>

        <h2 className="goal-section-title">My Goals</h2>

        {student && goals.length === 0 && (
          <div className="goal-card">
            <p>You have not created any goals yet.</p>
          </div>
        )}

        {goals.map((goal) => (
          <div className="goal-card" key={goal._id}>
            <h3>{goal.title}</h3>

            <p>
              <strong>Description:</strong>{' '}
              {goal.description || 'Not provided'}
            </p>

            <p>
              <strong>Category:</strong>{' '}
              {goal.category || 'Not specified'}
            </p>

            <p>
              <strong>Deadline:</strong>{' '}
              {new Date(goal.deadline).toLocaleDateString()}
            </p>

            <p>
              <strong>Status:</strong>{' '}
              <span className="status-badge">
                {goal.status}
              </span>
            </p>

            <p>
              <strong>Progress:</strong>{' '}
              {goal.progressPercentage}%
            </p>
          </div>
        ))}
      </main>
    </div>
  </div>
  );
}

export default Goals;
