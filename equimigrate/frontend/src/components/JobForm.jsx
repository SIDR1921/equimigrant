import React, { useState } from 'react';
import { ArrowRight, Zap, Globe, Briefcase, DollarSign, FileText } from 'lucide-react';

const JobForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        job_description: '',
        salary: '',
        offer_text: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const fillDemo = () => {
        setFormData({
            origin: "India",
            destination: "Dubai, UAE",
            job_description: "Domestic Helper",
            salary: "800 AED",
            offer_text: "Urgent requirement for housemaid in Dubai. Salary 800 AED. Passport must be submitted to employer upon arrival. No holidays for first 6 months. Visa costs deducted from salary."
        });
    };

    return (
        <form onSubmit={handleSubmit} className="card-surface-static animate-fade-up" style={{
            padding: '32px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Top accent bar */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, var(--accent-dim), var(--accent), var(--accent-bright), var(--accent-dim))',
                backgroundSize: '200% 100%',
                animation: 'gradientShift 4s ease infinite',
            }} />

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '28px',
            }}>
                <div>
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.6rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        lineHeight: 1.2,
                    }}>
                        Job Offer Details
                    </h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '13px',
                        marginTop: '6px',
                    }}>
                        Enter or paste the offer to analyze
                    </p>
                </div>
                <button
                    type="button"
                    onClick={fillDemo}
                    className="btn-ghost"
                    style={{ flexShrink: 0 }}
                >
                    <Zap style={{ width: 14, height: 14 }} />
                    Demo
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Globe style={{ width: 11, height: 11, color: 'var(--accent-dim)' }} />
                        Origin Country
                    </label>
                    <input
                        name="origin"
                        placeholder="e.g. India"
                        value={formData.origin}
                        onChange={handleChange}
                        className="editorial-input"
                        required
                    />
                </div>
                <div>
                    <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Globe style={{ width: 11, height: 11, color: 'var(--accent-dim)' }} />
                        Destination
                    </label>
                    <input
                        name="destination"
                        placeholder="e.g. Dubai, UAE"
                        value={formData.destination}
                        onChange={handleChange}
                        className="editorial-input"
                        required
                    />
                </div>
                <div>
                    <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Briefcase style={{ width: 11, height: 11, color: 'var(--accent-dim)' }} />
                        Job Role
                    </label>
                    <input
                        name="job_description"
                        placeholder="e.g. Domestic Helper"
                        value={formData.job_description}
                        onChange={handleChange}
                        className="editorial-input"
                        required
                    />
                </div>
                <div>
                    <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <DollarSign style={{ width: 11, height: 11, color: 'var(--accent-dim)' }} />
                        Salary Offered
                    </label>
                    <input
                        name="salary"
                        placeholder="e.g. 800 AED per month"
                        value={formData.salary}
                        onChange={handleChange}
                        className="editorial-input"
                        required
                    />
                </div>
            </div>

            <div style={{ marginTop: '20px' }}>
                <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText style={{ width: 11, height: 11, color: 'var(--accent-dim)' }} />
                    Full Offer / Contract Text
                </label>
                <textarea
                    name="offer_text"
                    placeholder="Paste the full contract or job offer text here for deep analysis..."
                    value={formData.offer_text}
                    onChange={handleChange}
                    className="editorial-input"
                    style={{ height: '140px', resize: 'none', lineHeight: 1.6 }}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{ marginTop: '24px' }}
            >
                {isLoading ? (
                    <>
                        <div style={{ width: 20, height: 20, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: 'var(--bg-deep)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Swarm Intelligence Active...
                    </>
                ) : (
                    <>
                        Analyze Offer Risk
                        <ArrowRight style={{ width: 18, height: 18 }} />
                    </>
                )}
            </button>
        </form>
    );
};

export default JobForm;
