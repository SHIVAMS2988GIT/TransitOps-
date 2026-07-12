import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/drivers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDrivers(res.data);
      } catch {
        setError('Failed to fetch drivers.');
      }
    };
    fetchDrivers();
  }, [token]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff' }}>← Back to Dashboard</Link>
      <h2 style={{ marginTop: '20px' }}>Driver Management</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {(role === 'Fleet Manager' || role === 'Safety Officer') && (
        <button style={{ padding: '10px 15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', marginBottom: '20px', cursor: 'pointer' }}>
          + Add New Driver
        </button>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>License No.</th>
            <th style={thStyle}>Safety Score</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((d) => (
            <tr key={d.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={tdStyle}>{d.name}</td>
              <td style={tdStyle}>{d.license_number}</td>
              <td style={tdStyle}>
                <span style={{ color: d.safety_score >= 80 ? 'green' : d.safety_score >= 50 ? 'orange' : 'red', fontWeight: 'bold' }}>
                  {d.safety_score}/100
                </span>
              </td>
              <td style={tdStyle}>
                <span style={{ 
                  padding: '6px 10px', 
                  borderRadius: '12px', 
                  fontSize: '0.85em',
                  fontWeight: 'bold',
                  color: '#333',
                  background: d.status === 'Available' ? '#d4edda' : d.status === 'Suspended' ? '#f8d7da' : '#cce5ff' 
                }}>
                  {d.status}
                </span>
              </td>
            </tr>
          ))}
          {drivers.length === 0 && (
            <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No drivers registered yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = { padding: '12px', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px' };

export default Drivers;