import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Shell } from './Dashboard';

const initial = { registration_number:'', model:'', type:'Van', max_load_capacity:'', odometer:'', acquisition_cost:'' };

export default function Vehicles({ role }) {
  const [vehicles,setVehicles]=useState([]); const [error,setError]=useState(''); const [loading,setLoading]=useState(true); const [show,setShow]=useState(false); const [form,setForm]=useState(initial); const [saving,setSaving]=useState(false); const [query,setQuery]=useState(''); const [status,setStatus]=useState('');
  const load=useCallback(async()=>{setLoading(true);try{const r=await api.get('/vehicles');setVehicles(r.data)}catch(e){setError(e.response?.data?.error||'Failed to load vehicles.')}finally{setLoading(false)}},[]);
  useEffect(()=>{load()},[load]);
  const submit=async(e)=>{e.preventDefault();setSaving(true);setError('');try{await api.post('/vehicles',{...form,max_load_capacity:Number(form.max_load_capacity),odometer:Number(form.odometer||0),acquisition_cost:Number(form.acquisition_cost||0)});setShow(false);setForm(initial);load()}catch(e){setError(e.response?.data?.error||'Could not register vehicle.')}finally{setSaving(false)}};
  const visible=vehicles.filter(v=>(`${v.registration_number} ${v.model}`.toLowerCase().includes(query.toLowerCase()))&&(!status||v.status===status));
  return <Shell role={role} onLogout={()=>{localStorage.clear();location.href='/login'}} title="Vehicles" subtitle="Fleet registry and availability">
    <div className="page-heading"><div><h1>Vehicle Registry</h1><p>Track every vehicle, capacity, odometer and operational status.</p></div>{role==='Fleet Manager'&&<button className="primary-btn" onClick={()=>setShow(true)}>＋ Add vehicle</button>}</div>
    {error&&<div className="alert error-alert">{error}<button onClick={load}>Retry</button></div>}
    <div className="toolbar"><input placeholder="Search registration or model…" value={query} onChange={e=>setQuery(e.target.value)} /><select value={status} onChange={e=>setStatus(e.target.value)}><option value="">All statuses</option><option>Available</option><option>On Trip</option><option>In Shop</option></select><button className="secondary-btn" onClick={load}>↻ Refresh</button></div>
    <div className="panel table-panel">{loading?<div className="loading">Loading vehicles…</div>:<table className="data-table"><thead><tr><th>Registration</th><th>Vehicle</th><th>Capacity</th><th>Odometer</th><th>Status</th></tr></thead><tbody>{visible.map(v=><tr key={v.id}><td className="table-primary">{v.registration_number}</td><td>{v.model}<div className="muted">{v.type}</div></td><td>{Number(v.max_load_capacity).toLocaleString()} kg</td><td>{Number(v.odometer||0).toLocaleString()} km</td><td><span className={`status-badge ${v.status==='On Trip'?'blue-badge':''}`}>{v.status}</span></td></tr>)}{!vehicles.length&&<tr><td colSpan="5" className="loading">No vehicles registered.</td></tr>}</tbody></table>}</div>
    {show&&<div className="modal-backdrop"><div className="modal"><div className="modal-header"><h2>Register vehicle</h2><button className="close-btn" onClick={()=>setShow(false)}>×</button></div><form onSubmit={submit}><div className="form-grid">{[['registration_number','Registration'],['model','Model'],['type','Type'],['max_load_capacity','Max capacity (kg)'],['odometer','Odometer (km)'],['acquisition_cost','Acquisition cost']].map(([k,l])=><label className="form-stack" key={k}>{l}<input required={['registration_number','model','max_load_capacity'].includes(k)} type={['max_load_capacity','odometer','acquisition_cost'].includes(k)?'number':'text'} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/></label>)}</div><div className="form-actions"><button type="button" className="secondary-btn" onClick={()=>setShow(false)}>Cancel</button><button className="primary-btn" disabled={saving}>{saving?'Saving…':'Register vehicle'}</button></div></form></div></div>}
  </Shell>
}
