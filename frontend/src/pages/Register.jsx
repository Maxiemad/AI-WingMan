import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/api'

function Register() {
    const [form, setForm] = useState({
        name: '', email: '', password: '',
        skills: '', interests: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    function updateField(field, value) {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const payload = {
                name: form.name,
                email: form.email,
                password: form.password,
                skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
                interests: form.interests.split(',').map(s => s.trim()).filter(Boolean)
            }
            const res = await register(payload)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.errors?.join(', ') || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Join AI WingMan</h1>
                    <p>Start discovering opportunities</p>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-box">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="reg-name">Full Name</label>
                        <input
                            id="reg-name"
                            type="text"
                            value={form.name}
                            onChange={e => updateField('name', e.target.value)}
                            placeholder="Your name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-email">Email</label>
                        <input
                            id="reg-email"
                            type="email"
                            value={form.email}
                            onChange={e => updateField('email', e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-password">Password</label>
                        <input
                            id="reg-password"
                            type="password"
                            value={form.password}
                            onChange={e => updateField('password', e.target.value)}
                            placeholder="Min 6 characters"
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-skills">Skills</label>
                        <input
                            id="reg-skills"
                            type="text"
                            value={form.skills}
                            onChange={e => updateField('skills', e.target.value)}
                            placeholder="python, react, machine learning"
                        />
                        <span className="hint">Comma separated</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-interests">Interests</label>
                        <input
                            id="reg-interests"
                            type="text"
                            value={form.interests}
                            onChange={e => updateField('interests', e.target.value)}
                            placeholder="hackathons, open-source, AI"
                        />
                        <span className="hint">Comma separated</span>
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    )
}

export default Register
