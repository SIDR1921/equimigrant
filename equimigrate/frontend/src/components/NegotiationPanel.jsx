import React, { useState } from 'react';
import axios from 'axios';
import { Scale, ArrowRight, Copy, CheckCircle, Loader } from 'lucide-react';

const NegotiationPanel = ({ contractText, detectedLanguage }) => {
    const [concerns, setConcerns] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleNegotiate = async () => {
        if (!contractText && !concerns) return;
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('http://localhost:8000/negotiate', {
                contract_text: contractText || 'No contract text provided',
                user_concerns: concerns || 'General concerns about fairness and safety',
                detected_language: detectedLanguage || 'English'
            });
            setResult(res.data);
        } catch (err) {
            setError("Failed to generate negotiation strategy.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const copyScript = () => {
        if (result?.negotiation_script) {
            navigator.clipboard.writeText(result.negotiation_script);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Input */}
            <div className="card-surface-static" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <Scale style={{ width: 20, height: 20, color: 'var(--accent)' }} />
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700 }}>
                        AI Negotiation Strategy
                    </h2>
                </div>

                {contractText ? (
                    <div style={{
                        padding: '14px 16px',
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        marginBottom: '16px',
                        fontSize: '13px',
                        color: 'var(--text-muted)',
                        maxHeight: '100px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '40px',
                            background: 'linear-gradient(transparent, var(--bg-elevated))'
                        }} />
                        {contractText.substring(0, 300)}...
                    </div>
                ) : (
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                        Scan a contract first, or describe the contract terms below.
                    </p>
                )}

                <label className="field-label">Your Specific Concerns</label>
                <textarea
                    value={concerns}
                    onChange={(e) => setConcerns(e.target.value)}
                    placeholder="e.g. 'I'm worried about passport confiscation and the low salary. I want to make sure I get weekends off.'"
                    className="editorial-input"
                    style={{ height: '100px', resize: 'none', marginBottom: '20px' }}
                />

                <button
                    onClick={handleNegotiate}
                    disabled={loading}
                    className="btn-primary"
                >
                    {loading ? (
                        <>
                            <Loader style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                            Generating Strategy...
                        </>
                    ) : (
                        <>
                            Generate Negotiation Plan
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-up">
                    {/* Risk Reduction */}
                    <div className="card-safe" style={{ padding: '20px', textAlign: 'center' }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--safe)', marginBottom: '6px' }}>
                            Estimated Impact
                        </p>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {result.risk_reduction}
                        </p>
                    </div>

                    {/* Issues vs Fixes */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="card-danger" style={{ padding: '20px' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--danger)', marginBottom: '14px' }}>
                                Original Issues
                            </h3>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {result.original_issues.map((issue, i) => (
                                    <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', gap: '8px' }}>
                                        <span style={{ color: 'var(--danger)', flexShrink: 0 }}>✕</span>
                                        {issue}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="card-safe" style={{ padding: '20px' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--safe)', marginBottom: '14px' }}>
                                Suggested Changes
                            </h3>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {result.suggested_changes.map((change, i) => (
                                    <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', gap: '8px' }}>
                                        <span style={{ color: 'var(--safe)', flexShrink: 0 }}>✓</span>
                                        {change}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Negotiation Script */}
                    <div className="card-accent" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600 }}>
                                Ready-to-Use Script
                            </h3>
                            <button onClick={copyScript} className="btn-ghost" style={{ padding: '6px 14px' }}>
                                {copied ? (
                                    <><CheckCircle style={{ width: 14, height: 14, color: 'var(--safe)' }} /> Copied!</>
                                ) : (
                                    <><Copy style={{ width: 14, height: 14 }} /> Copy</>
                                )}
                            </button>
                        </div>
                        <div style={{
                            padding: '20px',
                            background: 'var(--bg-elevated)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '14px',
                            lineHeight: 1.8,
                            color: 'var(--text-secondary)',
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'var(--font-body)',
                        }}>
                            {result.negotiation_script}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NegotiationPanel;
