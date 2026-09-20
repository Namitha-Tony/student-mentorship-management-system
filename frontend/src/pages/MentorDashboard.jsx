
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

function MentorDashboard() {

  return (
    <div>

      <Navbar />

      <div className="dashboard-content">

        <Sidebar />

        <main>

          <h1>Mentor Dashboard</h1>

          <Card title="Welcome">
            <p>Welcome to the mentor dashboard.</p>
          </Card>

          <Card title="Students">
            <p>Your assigned students will appear here.</p>
          </Card>

          <Card title="Meetings">
            <p>Your meetings will appear here.</p>
          </Card>

        </main>

      </div>

    </div>
  );
}

export default MentorDashboard;
