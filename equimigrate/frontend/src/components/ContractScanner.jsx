import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Camera, Upload, FileText, AlertTriangle, CheckCircle, Loader, Eye } from 'lucide-react';

const ContractScanner = ({ onScanComplete }) => {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState(null);
    const fileRef = useRef(null);

    const processFile = async (file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);

        setScanning(true);
        setError(null);
        setResult(null);

        try {
            const base64 = await new Promise((resolve) => {
                const r = new FileReader();
                r.onload = () => resolve(r.result.split(',')[1]);
                r.readAsDataURL(file);
            });

            const response = await axios.post('http://localhost:8000/scan-contract', {
                image_data: base64,
                file_name: file.name
            });
            setResult(response.data);
            if (onScanComplete) onScanComplete(response.data);
        } catch (err) {
            setError("Failed to scan contract. Ensure backend is running.");
            console.error(err);
        } finally {
            setScanning(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer?.files?.[0];
        if (file) processFile(file);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    return (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Upload Zone */}
            <div
                className={`drop-zone ${dragActive ? 'active' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
            >
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />

                {preview ? (
                    <div style={{ position: 'relative' }}>
                        <img
                            src={preview}
                            alt="Contract preview"
                            style={{
                                maxHeight: '260px',
                                borderRadius: 'var(--radius-md)',
                                objectFit: 'contain',
                                opacity: scanning ? 0.3 : 1,
                                transition: 'opacity 0.4s',
                                boxShadow: 'var(--shadow-lg)',
                            }}
                        />
                        {scanning && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '14px',
                            }}>
                                {/* Scanning animation */}
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        inset: '-10px',
                                        borderRadius: '50%',
                                        border: '2px solid rgba(200, 149, 108, 0.2)',
                                        animation: 'pulseRing 1.5s ease-out infinite',
                                    }} />
                                    <Loader style={{ width: 36, height: 36, color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
                                </div>
                                <span style={{
                                    color: 'var(--accent-bright)',
                                    fontWeight: 600,
                                    fontSize: '15px',
                                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                }}>
                                    Gemini Vision Analyzing...
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', position: 'relative' }}>
                        {/* Upload icon with glow ring */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                inset: '-8px',
                                borderRadius: '20px',
                                border: '1px solid rgba(200, 149, 108, 0.1)',
                            }} />
                            <div style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '18px',
                                background: 'linear-gradient(135deg, var(--accent-glow), rgba(200, 149, 108, 0.06))',
                                border: '1px solid rgba(200, 149, 108, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 16px rgba(200, 149, 108, 0.1)',
                            }}>
                                <Upload style={{ width: 30, height: 30, color: 'var(--accent)' }} />
                            </div>
                        </div>
                        <div>
                            <p style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '20px',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                marginBottom: '8px',
                            }}>
                                Drop your contract here
                            </p>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                Photograph, scan, or upload — handwritten or printed, any language
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <span className="btn-ghost" style={{ pointerEvents: 'none' }}>
                                <Camera style={{ width: 14, height: 14 }} /> Camera
                            </span>
                            <span className="btn-ghost" style={{ pointerEvents: 'none' }}>
                                <FileText style={{ width: 14, height: 14 }} /> File
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="card-danger" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AlertTriangle style={{ width: 18, height: 18, color: 'var(--danger)', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: 'var(--danger)' }}>{error}</span>
                </div>
            )}

            {/* Results */}
            {result && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-up">
                    {/* Summary */}
                    <div className="card-surface-static" style={{ padding: '28px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: 'var(--accent-glow)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <FileText style={{ width: 16, height: 16, color: 'var(--accent)' }} />
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>
                                Contract Summary
                            </h3>
                            <span style={{
                                marginLeft: 'auto',
                                fontSize: '12px',
                                padding: '5px 12px',
                                borderRadius: '999px',
                                background: 'var(--accent-glow)',
                                border: '1px solid rgba(200, 149, 108, 0.1)',
                                color: 'var(--accent-bright)',
                                fontWeight: 600,
                            }}>
                                {result.detected_language}
                            </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.8 }}>
                            {result.summary}
                        </p>
                    </div>

                    {/* Red Flags */}
                    {result.red_flags?.length > 0 && (
                        <div className="card-danger" style={{ padding: '28px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: 'var(--danger-bg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <AlertTriangle style={{ width: 16, height: 16, color: 'var(--danger)' }} />
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--danger)' }}>
                                    Red Flags Detected
                                </h3>
                            </div>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {result.red_flags.map((flag, i) => (
                                    <li key={i} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '10px',
                                        fontSize: '14px',
                                        color: 'var(--text-secondary)',
                                        lineHeight: 1.7,
                                        padding: '8px 12px',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'rgba(239, 83, 80, 0.03)',
                                    }}>
                                        <span style={{ color: 'var(--danger)', fontWeight: 700, flexShrink: 0, fontSize: '10px', marginTop: '4px' }}>⬤</span>
                                        {flag}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Negotiation Points */}
                    {result.negotiation_points?.length > 0 && (
                        <div className="card-accent" style={{ padding: '28px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: 'var(--accent-glow)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <CheckCircle style={{ width: 16, height: 16, color: 'var(--accent)' }} />
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>
                                    Negotiation Points
                                </h3>
                            </div>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {result.negotiation_points.map((point, i) => (
                                    <li key={i} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '10px',
                                        fontSize: '14px',
                                        color: 'var(--text-secondary)',
                                        lineHeight: 1.7,
                                        padding: '8px 12px',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'rgba(200, 149, 108, 0.03)',
                                    }}>
                                        <span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>→</span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Extracted Text */}
                    <details style={{ cursor: 'pointer' }}>
                        <summary style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            padding: '12px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            <Eye style={{ width: 14, height: 14 }} />
                            View Extracted Text
                        </summary>
                        <div className="card-surface-static" style={{
                            padding: '24px',
                            marginTop: '8px',
                            fontFamily: 'monospace',
                            fontSize: '13px',
                            lineHeight: 1.8,
                            color: 'var(--text-secondary)',
                            whiteSpace: 'pre-wrap',
                            maxHeight: '300px',
                            overflowY: 'auto'
                        }}>
                            {result.extracted_text}
                        </div>
                    </details>
                </div>
            )}
        </div>
    );
};

export default ContractScanner;
