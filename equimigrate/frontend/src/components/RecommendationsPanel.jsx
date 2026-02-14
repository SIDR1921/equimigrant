import React, { useState } from 'react';
import axios from 'axios';
import { Compass, ArrowRight, Shield, Loader, MapPin, Star } from 'lucide-react';

const RecommendationsPanel = ({ analysisData }) => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRecommendations = async () => {
        if (!analysisData) return;
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('http://localhost:8000/recommend', {
                origin: analysisData.origin || 'Unknown',
                destination: analysisData.destination || 'Unknown',
                job_description: analysisData.job_description || 'Unknown',
                salary: analysisData.salary || 'Unknown',
                legal_risk: analysisData.legal_risk || null
            });
            setResult(res.data);
        } catch (err) {
            setError("Failed to generate recommendations.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const safetyColor = (score) => {
        const s = score?.toLowerCase() || '';
        if (s.includes('very high') || s.includes('excellent')) return 'var(--safe)';
        if (s.includes('high')) return 'var(--safe)';
        if (s.includes('moderate') || s.includes('medium')) return 'var(--warning)';
        return 'var(--text-secondary)';
    };

    return (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div className="card-surface-static" style={{ padding: '32px', textAlign: 'center' }}>
                <Compass style={{ width: 32, height: 32, color: 'var(--accent)', margin: '0 auto 16px' }} />
                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '24px',
                    fontWeight: 700,
                    marginBottom: '8px'
                }}>
                    Better Alternatives
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 24px' }}>
                    Based on your profile, we'll find safer destinations with better opportunities
                </p>

                {analysisData ? (
                    <div style={{
                        display: 'inline-flex',
                        gap: '20px',
                        padding: '14px 24px',
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        marginBottom: '24px',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>Current</span>
                            <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{analysisData.destination}</span>
                        </div>
                        <div style={{ width: '1px', background: 'var(--border)' }} />
                        <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>Role</span>
                            <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{analysisData.job_description}</span>
                        </div>
                        <div style={{ width: '1px', background: 'var(--border)' }} />
                        <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>Salary</span>
                            <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{analysisData.salary}</span>
                        </div>
                    </div>
                ) : (
                    <p style={{ fontSize: '14px', color: 'var(--warning)', marginBottom: '24px' }}>
                        Analyze a job offer first to get personalized recommendations.
                    </p>
                )}

                <button
                    onClick={fetchRecommendations}
                    disabled={loading || !analysisData}
                    className="btn-primary"
                    style={{ maxWidth: '300px', margin: '0 auto' }}
                >
                    {loading ? (
                        <>
                            <Loader style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                            Searching alternatives...
                        </>
                    ) : (
                        <>
                            Find Better Options
                            <ArrowRight style={{ width: 18, height: 18 }} />
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="card-danger" style={{ padding: '16px', fontSize: '14px', color: 'var(--danger)' }}>
                    {error}
                </div>
            )}

            {/* Results */}
            {result && (
                <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Summary */}
                    <div className="card-accent" style={{ padding: '20px' }}>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            {result.summary}
                        </p>
                    </div>

                    {/* Alternative Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                        {result.alternatives?.map((alt, i) => (
                            <div
                                key={i}
                                className="card-surface"
                                style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <MapPin style={{ width: 18, height: 18, color: 'var(--accent)' }} />
                                        <h3 style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '20px',
                                            fontWeight: 700,
                                            color: 'var(--text-primary)'
                                        }}>
                                            {alt.destination}
                                        </h3>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '4px 10px',
                                        borderRadius: '999px',
                                        background: `${safetyColor(alt.safety_score)}15`,
                                        border: `1px solid ${safetyColor(alt.safety_score)}30`,
                                    }}>
                                        <Shield style={{ width: 12, height: 12, color: safetyColor(alt.safety_score) }} />
                                        <span style={{ fontSize: '11px', fontWeight: 600, color: safetyColor(alt.safety_score) }}>
                                            {alt.safety_score}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div>
                                        <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Role</span>
                                        <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{alt.role}</span>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Salary</span>
                                        <span style={{ fontSize: '14px', color: 'var(--accent-bright)', fontWeight: 600 }}>{alt.salary_range}</span>
                                    </div>
                                </div>

                                <div style={{
                                    padding: '12px 14px',
                                    background: 'var(--bg-elevated)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '13px',
                                    lineHeight: 1.6,
                                    color: 'var(--text-secondary)',
                                }}>
                                    <Star style={{ width: 12, height: 12, color: 'var(--accent)', display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                                    {alt.why_better}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecommendationsPanel;
