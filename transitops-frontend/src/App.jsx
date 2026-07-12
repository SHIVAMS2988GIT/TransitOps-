import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Vehicles from './components/Vehicles';
import Drivers from './components/Drivers';
import Trips from './components/Trips';
import Reports from './components/Reports'; // Added the new Reports import

function ProtectedRoute({ children, token }) {
  if (!token) return <Navigate to="/login" />;
  return children;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute token={token}>
              <Dashboard role={role} setToken={setToken} setRole={setRole} />
            </ProtectedRoute>
          } />

          <Route path="/vehicles" element={
            <ProtectedRoute token={token}>
              <Vehicles />
            </ProtectedRoute>
          } />

          <Route path="/drivers" element={
            <ProtectedRoute token={token}>
              <Drivers />
            </ProtectedRoute>
          } />

          <Route path="/trips" element={
            <ProtectedRoute token={token}>
              <Trips />
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute token={token}>
              <Reports />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;