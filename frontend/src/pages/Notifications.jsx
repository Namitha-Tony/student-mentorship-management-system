import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

function Notifications() {
  const notifications = [
    {
      id: 1,
      title: 'Meeting Reminder',
      message: 'You have a mentorship meeting scheduled soon.',
      time: 'Today'
    },
    {
      id: 2,
      title: 'New Feedback',
      message: 'Your mentor has provided new feedback.',
      time: 'Yesterday'
    },
    {
      id: 3,
      title: 'Progress Update',
      message: 'Your mentorship progress has been updated.',
      time: '2 days ago'
    }
  ];

  return (
    <div>
      <Navbar />

      <div className="dashboard-content">
        <Sidebar />

        <main>
          <div className="page-header">
            <div>
              <h1>Notifications</h1>
              <p>Stay updated with your mentorship activities.</p>
            </div>
          </div>

          <Card title="Recent Notifications">
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div
                  className="notification-card"
                  key={notification.id}
                >
                  <div className="notification-icon">
                    🔔
                  </div>

                  <div className="notification-content">
                    <h3>{notification.title}</h3>

                    <p>{notification.message}</p>

                    <small>{notification.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default Notifications;