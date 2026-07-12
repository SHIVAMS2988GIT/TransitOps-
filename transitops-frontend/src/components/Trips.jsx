import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    source: '', destination: '', vehicle_id: '', driver_id: '', cargo_weight: '', planned_distance: ''
  });

  const token = localStorage.getItem('token');

  const fetchData = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const tripsRes = await axios.get('http://localhost:5000/api/trips', { headers });
      setTrips(tripsRes.data);

      const vehiclesRes = await axios.get('http://localhost:5000/api/vehicles?status=Available', { headers });
      setAvailableVehicles(vehiclesRes.data);

      const driversRes = await axios.get('http://localhost:5000/api/drivers?status=Available', { headers });
      setAvailableDrivers(driversRes.data);
    } catch {
      setError('Failed to load dispatch data.');
    }
  }, [token]);

  useEffect(() => {
    // Defer fetching to avoid synchronous setState inside effect
    const id = setTimeout(() => {
      fetchData();
    }, 0);

    return () => clearTimeout(id);
  }, [fetchData]);

  const handleDispatch = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/trips/dispatch', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ source: '', destination: '', vehicle_id: '', driver_id: '', cargo_weight: '', planned_distance: '' });
      fetchData(); 
    } catch (err) {
      alert(err.response?.data?.error || 'Dispatch failed. Check cargo weight capacity.');
    }
  };

  const handleComplete = async (tripId) => {
    const final_odometer = window.prompt("Enter the vehicle's final odometer reading:");
    const fuel_liters = window.prompt("Enter fuel consumed (in liters):");
    const fuel_cost = window.prompt("Enter total fuel cost:");

    if (final_odometer && fuel_liters && fuel_cost) {
      try {
        await axios.put(`http://localhost:5000/api/trips/${tripId}/complete`, {
          final_odometer, fuel_liters, fuel_cost
        }, { headers: { Authorization: `Bearer ${token}` } });
        fetchData();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to complete trip.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff' }}>← Back to Dashboard</Link>
      <h2 style={{ marginTop: '20px' }}>Trip Dispatch Command</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #ddd' }}>
        <h3>Dispatch New Trip</h3>
        <form onSubmit={handleDispatch} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          <input type="text" placeholder="Source" required value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} style={inputStyle} />
          <input type="text" placeholder="Destination" required value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} style={inputStyle} />
          <input type="number" placeholder="Cargo Weight (kg)" required value={formData.cargo_weight} onChange={e => setFormData({...formData, cargo_weight: e.target.value})} style={inputStyle} />
          <input type="number" placeholder="Distance (km)" required value={formData.planned_distance} onChange={e => setFormData({...formData, planned_distance: e.target.value})} style={inputStyle} />
          
          <select required value={formData.vehicle_id} onChange={e => setFormData({...formData, vehicle_id: e.target.value})} style={inputStyle}>
            <option value="">-- Select Available Vehicle --</option>
            {availableVehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number} (Max: {v.max_load_capacity}kg)</option>)}
          </select>
          
          <select required value={formData.driver_id} onChange={e => setFormData({...formData, driver_id: e.target.value})} style={inputStyle}>
            <option value="">-- Select Available Driver --</option>
            {availableDrivers.map(d => <option key={d.id} value={d.id}>{d.name} (Score: {d.safety_score})</option>)}
          </select>

          <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            🚀 Dispatch Trip
          </button>
        </form>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#343a40', color: 'white', textAlign: 'left' }}>
            <th style={thStyle}>Route</th>
            <th style={thStyle}>Vehicle</th>
            <th style={thStyle}>Driver</th>
            <th style={thStyle}>Cargo</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((t) => (
            <tr key={t.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={tdStyle}>{t.source} → {t.destination}</td>
              <td style={tdStyle}>{t.registration_number}</td>
              <td style={tdStyle}>{t.driver_name}</td>
              <td style={tdStyle}>{t.cargo_weight} kg</td>
              <td style={tdStyle}>
                <span style={{ fontWeight: 'bold', color: t.status === 'Dispatched' ? '#17a2b8' : t.status === 'Completed' ? '#28a745' : '#dc3545' }}>
                  {t.status}
                </span>
              </td>
              <td style={tdStyle}>
                {t.status === 'Dispatched' && (
                  <button onClick={() => handleComplete(t.id)} style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                    Complete & Log Fuel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: '1 1 200px' };
const thStyle = { padding: '12px' };
const tdStyle = { padding: '12px' };

export default Trips;