import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import FormInput from '../components/FormInput';
import Button from '../components/Button';
import AuthLayout from '../components/AuthLayout';

function Signup() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e) => {

    e.preventDefault();

    setMessage('');

    if (!name || !email || !password) {
      setMessage('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    try {

      const response = await fetch(
        'https://gs0mhz0f-5000.inc1.devtunnels.ms/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            role: role
          })
        }
      );

      const data = await response.json();

      if (response.ok) {

        login(
          data.data.user,
          data.data.token
        );

        if (data.data.user.role === 'student') {

          navigate('/student-dashboard');

        } else if (data.data.user.role === 'mentor') {

          navigate('/mentor-dashboard');

        }

      } else {

        if (data.errors && data.errors.length > 0) {

          setMessage(data.errors[0].msg);

        } else {

          setMessage(data.message || 'Registration failed');

        }

      }

    } catch (error) {

      console.error(error);
      setMessage('Cannot connect to server');

    }
  };

  return (
    <AuthLayout title="Signup">

      <form onSubmit={handleSignup}>

        <FormInput
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />

        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <div>

          <label>Role</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
          </select>

        </div>

        <br />

        <Button type="submit">
          Signup
        </Button>

      </form>

      {message && (
        <p>
          {message}
        </p>
      )}

      <p>Already have an account?</p>

      <Button onClick={() => navigate('/login')}>
        Go to Login
      </Button>

    </AuthLayout>
  );
}

export default Signup;

