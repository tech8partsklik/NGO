import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function Register() {
  const [form, setForm] = useState({ username:'', email:'', password:'' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('member-register/', form); // backend endpoint we prepared earlier
      toast.success('Registration submitted. Wait for approval.');
      setForm({ username:'', email:'', password:'' });
    } catch {
      toast.error('Registration failed');
    }
  };

  return (
    <div style={{ maxWidth:520, margin:'40px auto' }}>
      <form onSubmit={submit} style={{ display:'grid', gap:10 }}>
        <h2>Become a Member</h2>
        <input placeholder="Full name" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        <button className="btn" type="submit">Register</button>
      </form>
    </div>
  );
}
