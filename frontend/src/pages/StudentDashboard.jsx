
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

function StudentDashboard() {

  return (
    <div>

      <Navbar />

      <div className="dashboard-content">

        <Sidebar />

        <main>

          <h1>Student Dashboard</h1>

          <Card title="Welcome">
            <p>Welcome to the student dashboard.</p>
          </Card>

          <Card title="My Mentor">
            <p>Your mentor information will appear here.</p>
          </Card>

          <Card title="Progress">
            <p>Your progress information will appear here.</p>
          </Card>

        </main>

      </div>

    </div>
  );
}

export default StudentDashboard;

