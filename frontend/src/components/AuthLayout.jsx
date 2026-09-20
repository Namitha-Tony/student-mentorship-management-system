
function AuthLayout({ title, children }) {

  return (
    <div className="auth-layout">

      <div className="auth-card">

        <h1>Student Mentorship Management System</h1>

        <h2>{title}</h2>

        {children}

      </div>

    </div>
  );
}

export default AuthLayout;
