import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Vehicles from './components/Vehicles';
import Drivers from './components/Drivers';
import Trips from './components/Trips';
import Reports from './components/Reports';

function ProtectedRoute({ children, token }) {
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
        <Route path="/dashboard" element={<ProtectedRoute token={token}><Dashboard role={role} onLogout={logout} /></ProtectedRoute>} />
        <Route path="/vehicles" element={<ProtectedRoute token={token}><Vehicles role={role} /></ProtectedRoute>} />
        <Route path="/drivers" element={<ProtectedRoute token={token}><Drivers role={role} /></ProtectedRoute>} />
        <Route path="/trips" element={<ProtectedRoute token={token}><Trips role={role} /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute token={token}><Reports role={role} /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </Router>
  );
}
