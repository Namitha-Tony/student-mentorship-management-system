
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

function Meetings() {

  return (
    <div>

      <Navbar />

      <div className="dashboard-content">

        <Sidebar />

        <main>

          <h1>Meetings</h1>

          <Card title="My Meetings">
            <p>Your meetings will appear here.</p>
          </Card>

        </main>

      </div>

    </div>
  );
}

export default Meetings;

