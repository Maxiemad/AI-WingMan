function OpportunityCard({ opportunity, onApply, isApplying, applied }) {
    const daysLeft = Math.ceil(
        (new Date(opportunity.deadline) - new Date()) / (1000 * 60 * 60 * 24)
    )

    const urgencyClass = daysLeft <= 3 ? 'urgent' : daysLeft <= 7 ? 'soon' : ''

    function typeColor(type) {
        const colors = {
            hackathon: '#7c3aed',
            internship: '#2563eb',
            grant: '#059669',
            fellowship: '#d97706',
            competition: '#dc2626',
            job: '#0891b2',
            collaboration: '#6366f1'
        }
        return colors[type] || '#6b7280'
    }

    return (
        <div className={`opportunity-card ${urgencyClass}`}>
            <div className="opp-card-top">
                <span className="opp-type" style={{ backgroundColor: typeColor(opportunity.type) }}>
                    {opportunity.type}
                </span>
                {opportunity.relevanceScore > 0 && (
                    <span className="relevance-badge">
                        {opportunity.relevanceScore} pts
                    </span>
                )}
            </div>

            <h3 className="opp-title">{opportunity.title}</h3>
            <p className="opp-org">{opportunity.organization || opportunity.source}</p>
            <p className="opp-desc">{opportunity.description.substring(0, 150)}...</p>

            <div className="opp-tags">
                {(opportunity.tags || []).slice(0, 4).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>

            <div className="opp-footer">
                <div className="opp-meta">
                    <span className={`deadline ${urgencyClass}`}>
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                    </span>
                    {opportunity.location && <span className="location">📍 {opportunity.location}</span>}
                    {opportunity.stipend && <span className="stipend">💰 {opportunity.stipend}</span>}
                </div>
                <button
                    className={`btn-apply ${applied ? 'applied' : ''}`}
                    onClick={onApply}
                    disabled={isApplying || applied || daysLeft <= 0}
                >
                    {applied ? '✓ Applied' : isApplying ? 'Generating...' : 'Apply'}
                </button>
            </div>
        </div>
    )
}

export default OpportunityCard
