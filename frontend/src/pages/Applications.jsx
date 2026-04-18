import { useState, useEffect } from 'react'
import { getMyApplications, updateApplicationStatus } from '../services/api'
import ApplicationStatus from '../components/ApplicationStatus'

function Applications() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(null)

    useEffect(() => {
        getMyApplications()
            .then(res => setApplications(res.data.data || []))
            .catch(() => setApplications([]))
            .finally(() => setLoading(false))
    }, [])

    async function handleStatusChange(appId, newStatus) {
        try {
            await updateApplicationStatus(appId, newStatus)
            setApplications(prev =>
                prev.map(a => a._id === appId ? { ...a, status: newStatus } : a)
            )
        } catch (err) {
            alert('Failed to update status')
        }
    }

    function toggleExpand(id) {
        setExpanded(prev => prev === id ? null : id)
    }

    if (loading) {
        return <div className="page-container"><div className="loading-spinner">Loading applications...</div></div>
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>My Applications</h1>
                <p>{applications.length} application{applications.length !== 1 ? 's' : ''} tracked</p>
            </div>

            {applications.length === 0 ? (
                <div className="empty-state">
                    <p>No applications yet</p>
                    <p className="hint">Browse opportunities and click Apply to get started</p>
                </div>
            ) : (
                <div className="application-list">
                    {applications.map(app => (
                        <div key={app._id} className="application-card">
                            <div className="app-card-header" onClick={() => toggleExpand(app._id)}>
                                <div className="app-card-title">
                                    <h3>{app.opportunityId?.title || 'Untitled'}</h3>
                                    <ApplicationStatus status={app.status} />
                                </div>
                                <div className="app-card-meta">
                                    <span>{app.opportunityId?.type}</span>
                                    <span>{app.opportunityId?.organization}</span>
                                    <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                                </div>
                                <span className="expand-icon">{expanded === app._id ? '▾' : '▸'}</span>
                            </div>

                            {expanded === app._id && (
                                <div className="app-card-body">
                                    {app.coverLetter && (
                                        <div className="generated-content">
                                            <h4>Cover Letter</h4>
                                            <pre>{app.coverLetter}</pre>
                                        </div>
                                    )}
                                    {app.emailDraft && (
                                        <div className="generated-content">
                                            <h4>Email Draft</h4>
                                            <pre>{app.emailDraft}</pre>
                                        </div>
                                    )}
                                    <div className="status-actions">
                                        <span>Update status:</span>
                                        {['submitted', 'accepted', 'rejected'].map(s => (
                                            <button
                                                key={s}
                                                className={`status-btn status-${s} ${app.status === s ? 'current' : ''}`}
                                                onClick={() => handleStatusChange(app._id, s)}
                                                disabled={app.status === s}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Applications
