
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

function Goals() {

  return (
    <div>

      <Navbar />

      <div className="dashboard-content">

        <Sidebar />

        <main>

          <h1>Goals</h1>

          <Card title="My Goals">
            <p>Your goals will appear here.</p>
          </Card>

        </main>

      </div>

    </div>
  );
}

export default Goals;

