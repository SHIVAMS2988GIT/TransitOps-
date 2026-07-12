import { useNavigate, Link } from 'react-router-dom';

const Dashboard = ({ role, setToken, setRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <h1>TransitOps Dashboard</h1>
        <div>
          <span style={{ marginRight: '20px', fontWeight: 'bold' }}>Role: {role}</span>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
        <Link to="/vehicles" style={cardStyle}>
          <h2>🚛 Vehicle Registry</h2>
          <p>Manage fleet, capacity, and maintenance.</p>
        </Link>
        
        <Link to="/drivers" style={cardStyle}>
          <h2>🧑‍✈️ Driver Management</h2>
          <p>Track licenses, status, and availability.</p>
        </Link>
        
        <Link to="/trips" style={cardStyle}>
          <h2>🗺️ Trip Dispatch</h2>
          <p>Assign trips, monitor active routes, and log fuel.</p>
        </Link>
      </div>
    </div>
  );
};

const cardStyle = {
  flex: '1',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#333',
  background: '#f9f9f9',
  boxShadow: '2px 2px 5px rgba(0,0,0,0.1)'
};

export default Dashboard;