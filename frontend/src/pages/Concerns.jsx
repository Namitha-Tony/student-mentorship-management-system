import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

function Concerns() {
  const { token } = useAuth();

  const [student, setStudent] = useState(null);
  const [concerns, setConcerns] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
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
    const getConcerns = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/concerns/student/${student._id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          setConcerns(data.data);
        } else {
          setMessage(data.message || 'Failed to load concerns');
        }
      } catch {
        setMessage('Cannot connect to server');
      }
    };

    if (token && student) {
      getConcerns();
    }
  }, [token, student]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch(
        'http://localhost:5000/api/concerns',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title,
            description,
            category
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setConcerns((current) => [data.data, ...current]);
        setTitle('');
        setDescription('');
        setCategory('');
        setMessage('Concern submitted successfully');
      } else {
        setMessage(data.message || 'Failed to submit concern');
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

      <main className="concern-page">
        <h1>My Concerns</h1>

        {message && (
          <p className="page-message">
            {message}
          </p>
        )}

        <section className="concern-form-card">
          <h2>Submit a Concern</h2>

          <form className="concern-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter your concern"
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
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe your concern..."
                required
              />
            </div>

            <button type="submit">Submit Concern</button>
          </form>
        </section>

        <h2 className="concern-section-title">
          Previous Concerns
        </h2>

        {student && concerns.length === 0 && (
          <div className="concern-card">
            <p>You have not submitted any concerns yet.</p>
          </div>
        )}

        {concerns.map((concern) => (
          <div className="concern-card" key={concern._id}>
            <h3>{concern.title}</h3>

            <p>
              <strong>Description:</strong>{' '}
              {concern.description}
            </p>

            <p>
              <strong>Category:</strong>{' '}
              {concern.category || 'Not specified'}
            </p>

            <p>
              <strong>Status:</strong>{' '}
              <span className="status-badge">
                {concern.status}
              </span>
            </p>

            <p>
              <strong>Mentor Response:</strong>{' '}
              {concern.mentorResponse || 'No response yet'}
            </p>

            <p>
              <strong>Submitted:</strong>{' '}
              {new Date(concern.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </main>
    </div>
  </div>
);

}

export default Concerns;
