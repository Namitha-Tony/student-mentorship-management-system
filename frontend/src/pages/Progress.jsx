
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

function Progress() {

  return (
    <div>

      <Navbar />

      <div className="dashboard-content">

        <Sidebar />

        <main>

          <h1>Progress</h1>

          <Card title="My Progress">
            <p>Your progress information will appear here.</p>
          </Card>

        </main>

      </div>

    </div>
  );
}

export default Progress;

