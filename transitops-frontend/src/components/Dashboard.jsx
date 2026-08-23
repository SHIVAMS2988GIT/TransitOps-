import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import './Dashboard.css';

const navItems = [
  ['/dashboard', 'Overview', '⌂'],
  ['/vehicles', 'Vehicles', '▣'],
  ['/drivers', 'Drivers', '♙'],
  ['/trips', 'Trip Dispatch', '↗'],
  ['/reports', 'Analytics', '◉'],
];

const emptyStats = { total_vehicles: 0, available: 0, on_trip: 0, in_shop: 0, total_drivers: 0, available_drivers: 0, active_trips: 0, completed_trips: 0, maintenance: 0 };

function Shell({ children, role, onLogout, title = 'Overview', subtitle = 'Fleet command center' }) {
  const navigate = useNavigate();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand"><div className="brand-mark">TO</div><div><strong>TransitOps</strong><span>Fleet command center</span></div></div>
        <div className="live-pill"><i /> LIVE OPERATIONS</div>
        <div className="nav-label">WORKSPACE</div>
        <nav>{navItems.map(([path, label, icon]) => <NavLink key={path} to={path} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><span>{icon}</span>{label}</NavLink>)}</nav>
        <div className="sidebar-bottom">
          <div className="system-card"><span className="system-dot">✓</span><div><strong>Systems operational</strong><small>API & fleet data synced</small></div></div>
          <div className="profile"><div className="avatar">{(role || 'F')[0]}</div><div><strong>{role || 'Fleet Manager'}</strong><small>Authorized user</small></div><button onClick={onLogout} title="Log out">↪</button></div>
        </div>
      </aside>
      <div className="main-area">
        <header className="topbar"><div><div className="breadcrumbs">Operations <span>/</span> <strong>{title}</strong></div><div className="top-title">{title}</div><div className="top-subtitle">{subtitle}</div></div><div className="top-actions"><span className="sync"><i /> Synced</span><button className="icon-btn" onClick={() => navigate(0)} title="Refresh">↻</button></div></header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

export default function Dashboard({ role, onLogout }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const res = await api.get('/dashboard/summary'); setData(res.data); }
    catch (err) { setError(err.response?.data?.error || 'Unable to load live fleet data.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats = data?.fleet || emptyStats;
  const utilization = Number(data?.utilization || 0);
  const trips = data?.recentTrips || [];

  return <Shell role={role} onLogout={onLogout}>
    <section className="hero-row"><div><div className="eyebrow">FLEET OPERATIONS · TODAY</div><h1>Good morning, Fleet Manager.</h1><p>Monitor your fleet, dispatch activity and operational health from one place.</p></div><Link className="primary-btn" to="/trips">＋ Dispatch a trip</Link></section>
    {error && <div className="alert error-alert"><span>!</span>{error}<button onClick={load}>Retry</button></div>}
    <section className="metrics-grid">
      <Metric icon="▣" label="Total vehicles" value={stats.total_vehicles} note={`${stats.available} available now`} tone="blue" />
      <Metric icon="↗" label="Active trips" value={stats.active_trips} note={`${stats.completed_trips} completed`} tone="violet" />
      <Metric icon="◉" label="Fleet utilization" value={`${utilization.toFixed(1)}%`} note={`${stats.on_trip} vehicles on route`} tone="green" />
      <Metric icon="⚙" label="Maintenance" value={stats.in_shop} note={stats.in_shop ? 'Vehicles need attention' : 'No vehicles in shop'} tone="amber" />
    </section>

    <section className="dashboard-grid">
      <div className="panel utilization-panel"><PanelHeader title="Fleet utilization" subtitle="Current vehicle allocation" link="/reports" linkText="View analytics →" /><div className="util-body"><div className="donut" style={{ '--progress': `${utilization}%` }}><div><strong>{utilization.toFixed(1)}%</strong><span>utilized</span></div></div><div className="legend"><Legend label="Available" value={stats.available} percent={stats.total_vehicles ? (stats.available / stats.total_vehicles) * 100 : 0} tone="blue" /><Legend label="On trip" value={stats.on_trip} percent={stats.total_vehicles ? (stats.on_trip / stats.total_vehicles) * 100 : 0} tone="violet" /><Legend label="In maintenance" value={stats.in_shop} percent={stats.total_vehicles ? (stats.in_shop / stats.total_vehicles) * 100 : 0} tone="amber" /></div></div></div>
      <div className="panel"><PanelHeader title="Operational status" subtitle="People and fleet availability" /><StatusRow label="Vehicles available" value={stats.available} badge="Healthy" /><StatusRow label="Drivers available" value={stats.available_drivers} badge="Ready" /><StatusRow label="Vehicles in shop" value={stats.in_shop} badge={stats.in_shop ? 'Attention' : 'Clear'} /></div>
    </section>

    <section className="panel"><PanelHeader title="Active dispatches" subtitle="Trips currently on the road" link="/trips" linkText="Open dispatch board →" />
      {loading ? <div className="empty-state">Loading live dispatches…</div> : trips.length ? <div className="trip-list">{trips.map(t => <div className="trip-row" key={t.id}><div><strong>{t.source} → {t.destination}</strong><span>{t.registration_number} · {t.driver_name}</span></div><StatusBadge status={t.status} /></div>)}</div> : <div className="empty-state"><div className="check-circle">✓</div><strong>All clear</strong><span>No active trips are currently dispatched.</span><Link to="/trips">Dispatch a trip →</Link></div>}
    </section>

    <section className="quick-grid"><QuickLink to="/vehicles" icon="▣" title="Manage vehicles" text={`${stats.total_vehicles} vehicles registered`} /><QuickLink to="/drivers" icon="♙" title="Manage drivers" text={`${stats.total_drivers} drivers in registry`} /><QuickLink to="/trips" icon="↗" title="Dispatch center" text="Assign vehicles & drivers" /></section>
    <footer className="footer"><strong>TransitOps</strong><span>Fleet operations intelligence</span><span>v1.1 · API connected</span></footer>
  </Shell>;
}

function Metric({ icon, label, value, note, tone }) { return <div className={`metric-card ${tone}`}><div className="metric-icon">{icon}</div><div className="metric-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>; }
function PanelHeader({ title, subtitle, link, linkText }) { return <div className="panel-header"><div><h2>{title}</h2><p>{subtitle}</p></div>{link && <Link to={link}>{linkText}</Link>}</div>; }
function Legend({ label, value, percent, tone }) { return <div className="legend-row"><div><i className={tone} />{label}</div><strong>{value}</strong><span>{percent.toFixed(0)}%</span></div>; }
function StatusRow({ label, value, badge }) { return <div className="status-row"><div><i />{label}</div><strong>{value}</strong><span className="status-badge">{badge}</span></div>; }
function StatusBadge({ status }) { return <span className={`status-badge ${status === 'Dispatched' ? 'blue-badge' : ''}`}>{status}</span>; }
function QuickLink({ to, icon, title, text }) { return <Link to={to} className="quick-link"><span className="quick-icon">{icon}</span><div><strong>{title}</strong><small>{text}</small></div><b>→</b></Link>; }

export { Shell };
