import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';

import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';

import MyMentor from './pages/MyMentor';
import MyStudents from './pages/MyStudents';
import MentorStudentProfile from './pages/MentorStudentProfile';
import Goals from './pages/Goals';
import Concerns from './pages/Concerns';
import Meetings from './pages/Meetings';
import Progress from './pages/Progress';

import AuthProvider from './context/AuthContext';

import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import PublicRoute from './routes/PublicRoute';

function App() {

  return (
    <AuthProvider>

      <BrowserRouter>

        <Routes>

          {/* Public Pages */}

          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />


          {/* Student Dashboard */}

          <Route
            path="/student-dashboard"
            element={
              <RoleRoute role="student">
                <StudentDashboard />
              </RoleRoute>
            }
          />


          {/* Mentor Dashboard */}

          <Route
            path="/mentor-dashboard"
            element={
              <RoleRoute role="mentor">
                <MentorDashboard />
              </RoleRoute>
            }
          />


          {/* Student Only */}

          <Route
            path="/my-mentor"
            element={
              <RoleRoute role="student">
                <MyMentor />
              </RoleRoute>
            }
          />


          {/* Mentor Only */}

          <Route
            path="/my-students"
            element={
              <RoleRoute role="mentor">
                <MyStudents />
              </RoleRoute>
            }
          />
<Route
  path="/my-students/:studentId"
  element={
    <RoleRoute role="mentor">
      <MentorStudentProfile />
    </RoleRoute>
  }
/>

          {/* Protected Pages */}

<Route
  path="/goals"
  element={
    <RoleRoute role="student">
      <Goals />
    </RoleRoute>
  }
/>
<Route
  path="/concerns"
  element={
    <RoleRoute role="student">
      <Concerns />
    </RoleRoute>
  }
/>
          <Route
            path="/meetings"
            element={
              <ProtectedRoute>
                <Meetings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;

