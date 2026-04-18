function ApplicationStatus({ status }) {
    const statusConfig = {
        pending: { label: 'Pending', color: '#f59e0b' },
        submitted: { label: 'Submitted', color: '#3b82f6' },
        accepted: { label: 'Accepted', color: '#10b981' },
        rejected: { label: 'Rejected', color: '#ef4444' }
    }

    const config = statusConfig[status] || statusConfig.pending

    return (
        <span
            className="status-pill"
            style={{
                backgroundColor: config.color + '20',
                color: config.color,
                borderColor: config.color
            }}
        >
            {config.label}
        </span>
    )
}

export default ApplicationStatus
