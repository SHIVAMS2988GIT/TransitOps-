import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Reports = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reports/kpis', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch {
        setError('Failed to load analytics. Check your permissions.');
      }
    };
    fetchKPIs();
  }, [token]);

  if (!data) return <div style={{ padding: '20px' }}>Loading analytics...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff' }}>← Back to Dashboard</Link>
      <h2 style={{ marginTop: '20px' }}>Operational Reports & KPIs</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
        {/* Fleet Utilization Card */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Fleet Utilization</h3>
          <p style={{ fontSize: '2.5rem', margin: '0', fontWeight: 'bold', color: '#007bff' }}>
            {data.utilization}%
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem' }}>
            {data.fleet.on_trip} of {data.fleet.total_vehicles} vehicles active
          </p>
        </div>

        {/* Fleet Status Card */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Fleet Status</h3>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0', lineHeight: '1.8' }}>
            <li>🟢 Available: <strong>{data.fleet.available}</strong></li>
            <li>🔵 On Trip: <strong>{data.fleet.on_trip}</strong></li>
            <li>🟠 In Shop: <strong>{data.fleet.in_shop}</strong></li>
          </ul>
        </div>

        {/* Operational Costs Card */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Total Operational Cost</h3>
          <p style={{ fontSize: '2.5rem', margin: '0', fontWeight: 'bold', color: '#dc3545' }}>
            ${data.costs.total.toLocaleString()}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.9rem' }}>
            <span>Fuel: ${Number(data.costs.fuel).toLocaleString()}</span>
            <span>Maintenance: ${Number(data.costs.maintenance).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  flex: '1',
  minWidth: '250px',
  padding: '25px',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  background: '#fff',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
};

export default Reports;