import { useState, useEffect } from 'react'
import { getOpportunities, applyToOpportunity } from '../services/api'
import OpportunityCard from '../components/OpportunityCard'

function Opportunities() {
    const [opportunities, setOpportunities] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('')
    const [applying, setApplying] = useState(null)
    const [result, setResult] = useState(null)

    useEffect(() => {
        fetchOpportunities()
    }, [filter])

    function fetchOpportunities() {
        setLoading(true)
        const params = filter ? { type: filter } : {}
        getOpportunities(params)
            .then(res => setOpportunities(res.data.data || []))
            .catch(() => setOpportunities([]))
            .finally(() => setLoading(false))
    }

    async function handleApply(oppId) {
        setApplying(oppId)
        setResult(null)
        try {
            const res = await applyToOpportunity(oppId)
            setResult({ type: 'success', id: oppId, data: res.data })
        } catch (err) {
            setResult({ type: 'error', id: oppId, message: err.response?.data?.error || 'Failed to apply' })
        } finally {
            setApplying(null)
        }
    }

    function closeResult() {
        setResult(null)
    }

    const types = ['hackathon', 'internship', 'grant', 'fellowship', 'competition', 'job']

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Opportunities</h1>
                <p>Ranked by relevance to your profile</p>
            </div>

            <div className="filter-bar">
                <button
                    className={`filter-btn ${filter === '' ? 'active' : ''}`}
                    onClick={() => setFilter('')}
                >
                    All
                </button>
                {types.map(t => (
                    <button
                        key={t}
                        className={`filter-btn ${filter === t ? 'active' : ''}`}
                        onClick={() => setFilter(t)}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {result && (
                <div className={`result-banner ${result.type}`}>
                    {result.type === 'success' ? (
                        <div>
                            <strong>Application created!</strong> Check your applications page for the generated cover letter and email.
                            <button className="close-btn" onClick={closeResult}>✕</button>
                        </div>
                    ) : (
                        <div>
                            <strong>Error:</strong> {result.message}
                            <button className="close-btn" onClick={closeResult}>✕</button>
                        </div>
                    )}
                </div>
            )}

            {loading ? (
                <div className="loading-spinner">Loading opportunities...</div>
            ) : opportunities.length === 0 ? (
                <div className="empty-state">No opportunities found</div>
            ) : (
                <div className="opportunity-list">
                    {opportunities.map(opp => (
                        <OpportunityCard
                            key={opp._id}
                            opportunity={opp}
                            onApply={() => handleApply(opp._id)}
                            isApplying={applying === opp._id}
                            applied={result?.type === 'success' && result?.id === opp._id}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Opportunities
