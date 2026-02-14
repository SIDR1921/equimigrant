import React, { useState } from 'react';
import axios from 'axios';
import { Languages, X, Loader, ArrowRight, Globe, Copy, Check, Sparkles } from 'lucide-react';

const LANGUAGES = [
    { code: 'Hindi', emoji: '🇮🇳', label: 'हिन्दी' },
    { code: 'Arabic', emoji: '🇸🇦', label: 'العربية' },
    { code: 'Spanish', emoji: '🇪🇸', label: 'Español' },
    { code: 'French', emoji: '🇫🇷', label: 'Français' },
    { code: 'Bengali', emoji: '🇧🇩', label: 'বাংলা' },
    { code: 'Portuguese', emoji: '🇧🇷', label: 'Português' },
    { code: 'Urdu', emoji: '🇵🇰', label: 'اردو' },
    { code: 'Tamil', emoji: '🇮🇳', label: 'தமிழ்' },
    { code: 'Telugu', emoji: '🇮🇳', label: 'తెలుగు' },
    { code: 'German', emoji: '🇩🇪', label: 'Deutsch' },
    { code: 'Japanese', emoji: '🇯🇵', label: '日本語' },
    { code: 'Korean', emoji: '🇰🇷', label: '한국어' },
    { code: 'Chinese', emoji: '🇨🇳', label: '中文' },
    { code: 'Russian', emoji: '🇷🇺', label: 'Русский' },
    { code: 'Italian', emoji: '🇮🇹', label: 'Italiano' },
    { code: 'Thai', emoji: '🇹🇭', label: 'ไทย' },
    { code: 'Vietnamese', emoji: '🇻🇳', label: 'Tiếng Việt' },
    { code: 'Swahili', emoji: '🇰🇪', label: 'Kiswahili' },
];

const TranslateDialog = ({ isOpen, onClose, textToTranslate }) => {
    const [selectedLang, setSelectedLang] = useState(null);
    const [customLang, setCustomLang] = useState('');
    const [translating, setTranslating] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    const filteredLangs = LANGUAGES.filter(l =>
        l.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleTranslate = async (language) => {
        const targetLang = language || customLang;
        if (!targetLang) return;

        setTranslating(true);
        setError(null);
        setResult(null);
        setSelectedLang(targetLang);

        try {
            const res = await axios.post('http://localhost:8000/translate', {
                text: textToTranslate,
                target_language: targetLang,
            });
            setResult(res.data);
        } catch (err) {
            setError("Translation failed. Ensure backend is running with Gemini API key.");
            console.error(err);
        } finally {
            setTranslating(false);
        }
    };

    const handleCopy = () => {
        if (result?.translated_text) {
            navigator.clipboard.writeText(result.translated_text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleClose = () => {
        setResult(null);
        setError(null);
        setSelectedLang(null);
        setCustomLang('');
        setSearchQuery('');
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={handleClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    zIndex: 10000,
                    animation: 'fadeIn 0.25s ease',
                }}
            />

            {/* Dialog */}
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '580px',
                maxHeight: '85vh',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 32px 80px rgba(0, 0, 0, 0.6), 0 0 100px rgba(200, 149, 108, 0.06)',
                zIndex: 10001,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                animation: 'fadeSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
                {/* Header */}
                <div style={{
                    padding: '28px 28px 20px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, var(--accent-dim), var(--accent))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(200, 149, 108, 0.25)',
                        }}>
                            <Languages style={{ width: 22, height: 22, color: 'var(--bg-deep)' }} />
                        </div>
                        <div>
                            <h2 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '22px',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                            }}>
                                Translate
                            </h2>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                Powered by Gemini AI
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            border: '1px solid var(--border)',
                            background: 'var(--bg-elevated)',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                        <X style={{ width: 18, height: 18 }} />
                    </button>
                </div>

                {/* Content — scrollable */}
                <div style={{
                    padding: '24px 28px',
                    overflowY: 'auto',
                    flex: 1,
                }}>
                    {/* Source text preview */}
                    <div style={{
                        padding: '14px 18px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '24px',
                        maxHeight: '100px',
                        overflowY: 'auto',
                    }}>
                        <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                            display: 'block',
                            marginBottom: '6px',
                        }}>
                            Source Text
                        </span>
                        <p style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap',
                        }}>
                            {textToTranslate?.slice(0, 300)}{textToTranslate?.length > 300 ? '...' : ''}
                        </p>
                    </div>

                    {/* Result area (if translated) */}
                    {result && (
                        <div className="animate-fade-up" style={{ marginBottom: '24px' }}>
                            {/* Badge */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '12px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Sparkles style={{ width: 14, height: 14, color: 'var(--accent)' }} />
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        letterSpacing: '1.5px',
                                        textTransform: 'uppercase',
                                        color: 'var(--accent)',
                                    }}>
                                        Translated to {result.target_language}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="btn-ghost"
                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                >
                                    {copied ? <Check style={{ width: 12, height: 12, color: 'var(--safe)' }} /> : <Copy style={{ width: 12, height: 12 }} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>

                            {/* Translated text */}
                            <div style={{
                                padding: '20px',
                                background: 'rgba(200, 149, 108, 0.04)',
                                border: '1px solid rgba(200, 149, 108, 0.12)',
                                borderRadius: 'var(--radius-md)',
                                maxHeight: '250px',
                                overflowY: 'auto',
                            }}>
                                <p style={{
                                    fontSize: '15px',
                                    lineHeight: 1.9,
                                    color: 'var(--text-primary)',
                                    whiteSpace: 'pre-wrap',
                                }}>
                                    {result.translated_text}
                                </p>
                            </div>

                            {/* Source language tag */}
                            <div style={{
                                marginTop: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}>
                                <Globe style={{ width: 12, height: 12, color: 'var(--text-muted)' }} />
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                    Detected source: {result.source_language}
                                </span>
                            </div>

                            {/* Try another language */}
                            <button
                                onClick={() => { setResult(null); setSelectedLang(null); }}
                                className="btn-ghost"
                                style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}
                            >
                                <Languages style={{ width: 14, height: 14 }} />
                                Translate to another language
                            </button>
                        </div>
                    )}

                    {/* Loading state */}
                    {translating && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '40px 0',
                        }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: '-8px',
                                    borderRadius: '50%',
                                    border: '2px solid rgba(200, 149, 108, 0.15)',
                                    animation: 'pulseRing 1.5s ease-out infinite',
                                }} />
                                <Loader style={{ width: 32, height: 32, color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                Translating to <strong style={{ color: 'var(--accent-bright)' }}>{selectedLang}</strong>...
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="card-danger" style={{
                            padding: '14px 18px',
                            marginBottom: '20px',
                            fontSize: '14px',
                            color: 'var(--danger)',
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Language selection (shown when no result) */}
                    {!result && !translating && (
                        <>
                            {/* Search */}
                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    type="text"
                                    placeholder="Search languages..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="editorial-input"
                                    style={{ padding: '12px 16px', fontSize: '14px' }}
                                />
                            </div>

                            {/* Language grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '8px',
                                marginBottom: '20px',
                            }}>
                                {filteredLangs.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleTranslate(lang.code)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '14px 14px',
                                            background: 'var(--bg-card)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-sm)',
                                            cursor: 'pointer',
                                            transition: 'all 0.25s',
                                            color: 'var(--text-primary)',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '13px',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = 'var(--accent)';
                                            e.currentTarget.style.background = 'var(--accent-glow)';
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = 'var(--border)';
                                            e.currentTarget.style.background = 'var(--bg-card)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <span style={{ fontSize: '18px' }}>{lang.emoji}</span>
                                        <div style={{ textAlign: 'left' }}>
                                            <div style={{ fontWeight: 600, fontSize: '13px' }}>{lang.code}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lang.label}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Custom language input */}
                            <div style={{
                                display: 'flex',
                                gap: '10px',
                                padding: '16px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                            }}>
                                <input
                                    type="text"
                                    placeholder="Or type any language..."
                                    value={customLang}
                                    onChange={(e) => setCustomLang(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && customLang) handleTranslate(customLang); }}
                                    className="editorial-input"
                                    style={{ flex: 1, padding: '10px 14px', fontSize: '14px' }}
                                />
                                <button
                                    onClick={() => handleTranslate(customLang)}
                                    disabled={!customLang}
                                    className="btn-primary"
                                    style={{ width: 'auto', padding: '10px 20px' }}
                                >
                                    <ArrowRight style={{ width: 16, height: 16 }} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default TranslateDialog;
