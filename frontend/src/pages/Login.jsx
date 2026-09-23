
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import FormInput from '../components/FormInput';
import Button from '../components/Button';
import AuthLayout from '../components/AuthLayout';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {

    e.preventDefault();

    setMessage('');

    if (!email || !password) {
      setMessage('Please enter email and password');
      return;
    }

    try {

      const response = await fetch(
  'https://gs0mhz0f-5000.inc1.devtunnels.ms/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password
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

          setMessage(data.message || 'Login failed');

        }

      }

    } catch (error) {

      setMessage('Cannot connect to server');

    }
  };

  return (
    <AuthLayout title="Login">

      <form onSubmit={handleLogin}>

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

        <Button type="submit">
          Login
        </Button>

      </form>

      {message && (
        <p>
          {message}
        </p>
      )}

      <p>Don't have an account?</p>

      <Button onClick={() => navigate('/signup')}>
        Sign Up
      </Button>

    </AuthLayout>
  );
}

export default Login;

