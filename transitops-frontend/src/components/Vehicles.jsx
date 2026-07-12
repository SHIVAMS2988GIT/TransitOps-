import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/vehicles', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVehicles(res.data);
      } catch {
        setError('Failed to fetch vehicles. Ensure your server is running.');
      }
    };
    fetchVehicles();
  }, [token]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff' }}>← Back to Dashboard</Link>
      <h2 style={{ marginTop: '20px' }}>Vehicle Registry</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {role === 'Fleet Manager' && (
        <button style={{ padding: '10px 15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', marginBottom: '20px', cursor: 'pointer' }}>
          + Add New Vehicle
        </button>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={thStyle}>Registration</th>
            <th style={thStyle}>Model</th>
            <th style={thStyle}>Capacity</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={tdStyle}>{v.registration_number}</td>
              <td style={tdStyle}>{v.model}</td>
              <td style={tdStyle}>{v.max_load_capacity} kg</td>
              <td style={tdStyle}>
                <span style={{ 
                  padding: '6px 10px', 
                  borderRadius: '12px', 
                  fontSize: '0.85em',
                  fontWeight: 'bold',
                  color: '#333',
                  background: v.status === 'Available' ? '#d4edda' : v.status === 'In Shop' ? '#f8d7da' : '#fff3cd' 
                }}>
                  {v.status}
                </span>
              </td>
            </tr>
          ))}
          {vehicles.length === 0 && (
            <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No vehicles registered yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = { padding: '12px', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px' };

export default Vehicles;