import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('auth/login/', form);
      // if SimpleJWT: res.data has { access, refresh }
      if (res.data.access) {
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh || '');
        toast.success('Logged in');
        navigate('/member');
      } else {
        toast.error('Unexpected auth response');
      }
    } catch (err) {
      toast.error('Login failed');
    }
  };

  return (
    <div style={{ maxWidth:420, margin:'40px auto' }}>
      <form onSubmit={submit} style={{ display:'grid', gap:10 }}>
        <h2>Member Login</h2>
        <input placeholder="Email or username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
        <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        <button className="btn" type="submit">Login</button>
      </form>
    </div>
  );
}
