import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    password: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password && form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (form.password && form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    const payload = { name: form.name, email: form.email, bio: form.bio };
    if (form.password) payload.password = form.password;

    setLoading(true);
    try {
      const { data } = await API.put('api/user/profile', payload);
      updateUser(data);
      setSuccess('Profile updated successfully! ✅');
      setForm(f => ({ ...f, password: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Avatar */}
        <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
        <h2 style={styles.title}>{user?.name}</h2>
        <p style={styles.email}>{user?.email}</p>

        <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '20px 0' }} />

        <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>Edit Profile</h3>

        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { label: 'Full Name', name: 'name', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
          ].map(({ label, name, type }) => (
            <div key={name} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input type={type} name={name} value={form[name]} onChange={handleChange} style={styles.input} />
            </div>
          ))}

          <div style={styles.field}>
            <label style={styles.label}>Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us about yourself..."
              style={{ ...styles.input, resize: 'vertical' }}
              maxLength={200}
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />
          <p style={{ color: '#888', fontSize: '13px', margin: '0 0 8px' }}>Leave password fields blank to keep current password</p>

          {[
            { label: 'New Password', name: 'password' },
            { label: 'Confirm New Password', name: 'confirmPassword' },
          ].map(({ label, name }) => (
            <div key={name} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input type="password" name={name} value={form[name]} onChange={handleChange} placeholder="••••••••" style={styles.input} />
            </div>
          ))}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: { display: 'flex', justifyContent: 'center', padding: '40px 20px', minHeight: '90vh', background: '#f1f5f9' },
  card: { background: '#fff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '480px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' },
  avatar: { width: '72px', height: '72px', borderRadius: '50%', background: '#7c3aed', color: '#fff', fontSize: '30px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
  title: { margin: '0 0 4px', fontSize: '22px', fontWeight: 700 },
  email: { margin: 0, color: '#888', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontWeight: 600, fontSize: '14px', color: '#444' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '15px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  btn: { padding: '12px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginTop: '8px' },
  success: { background: '#d1fae5', color: '#065f46', padding: '10px 14px', borderRadius: '8px', marginBottom: '8px', fontSize: '14px' },
  error: { background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '8px', fontSize: '14px' },
};

export default Profile;
