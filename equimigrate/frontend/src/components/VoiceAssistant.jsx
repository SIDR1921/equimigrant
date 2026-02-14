import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Mic, MicOff, Volume2, Loader, Globe } from 'lucide-react';

const VoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const [error, setError] = useState(null);
    const [detectedLang, setDetectedLang] = useState('');
    const [history, setHistory] = useState([]);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;

            recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const t = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += t;
                        if (event.results[i][0].lang) {
                            setDetectedLang(event.results[i][0].lang);
                        }
                    } else {
                        interimTranscript += t;
                    }
                }
                setTranscript(finalTranscript || interimTranscript);
                if (finalTranscript) {
                    handleSendToGemini(finalTranscript, recognition.lang || 'auto');
                }
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                if (event.error === 'not-allowed') {
                    setError('Microphone access denied. Please allow microphone access.');
                }
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        } else {
            setError('Speech Recognition not supported in this browser. Use Chrome or Edge.');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            setResponse(null);
            setError(null);
            recognitionRef.current.lang = '';
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleSendToGemini = async (text, lang) => {
        setProcessing(true);
        setError(null);
        try {
            const res = await axios.post('http://localhost:8000/voice-respond', {
                text: text,
                language: lang || 'auto'
            });
            setResponse(res.data);
            setDetectedLang(res.data.detected_language);
            setHistory(prev => [...prev, {
                user: text,
                assistant: res.data.response_text,
                language: res.data.detected_language
            }]);
            speakText(res.data.response_text, res.data.detected_language);
        } catch (err) {
            setError("Failed to get response. Ensure backend is running.");
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const audioRef = useRef(null);

    const speakText = async (text, language) => {
        setSpeaking(true);
        try {
            // Call Gemini TTS endpoint
            const res = await axios.post('http://localhost:8000/tts', {
                text: text,
                voice_name: 'Kore'
            }, { responseType: 'blob' });

            // Create audio blob and play it
            const audioBlob = new Blob([res.data], { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);

            // Stop any currently playing audio
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }

            const audio = new Audio(audioUrl);
            audioRef.current = audio;
            audio.onended = () => {
                setSpeaking(false);
                URL.revokeObjectURL(audioUrl);
            };
            audio.onerror = () => {
                setSpeaking(false);
                URL.revokeObjectURL(audioUrl);
                // Fallback to browser TTS
                fallbackBrowserTTS(text, language);
            };
            audio.play();
        } catch (err) {
            console.error('Gemini TTS failed, falling back to browser TTS:', err);
            fallbackBrowserTTS(text, language);
        }
    };

    const fallbackBrowserTTS = (text, language) => {
        if (!window.speechSynthesis) { setSpeaking(false); return; }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const langMap = {
            'Hindi': 'hi-IN', 'Spanish': 'es-ES', 'French': 'fr-FR',
            'Arabic': 'ar-SA', 'Bengali': 'bn-IN', 'Portuguese': 'pt-BR',
            'Tamil': 'ta-IN', 'Telugu': 'te-IN', 'Urdu': 'ur-PK',
            'German': 'de-DE', 'Japanese': 'ja-JP', 'Korean': 'ko-KR',
            'Chinese': 'zh-CN', 'Mandarin': 'zh-CN', 'Russian': 'ru-RU',
            'Italian': 'it-IT', 'English': 'en-US',
        };
        utterance.lang = langMap[language] || 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Voice Control Card */}
            <div className="card-surface-static" style={{
                padding: '48px 32px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Atmospheric glow behind mic */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: isListening
                        ? 'radial-gradient(circle, rgba(200, 149, 108, 0.1) 0%, transparent 60%)'
                        : 'radial-gradient(circle, rgba(200, 149, 108, 0.04) 0%, transparent 60%)',
                    transition: 'all 0.5s',
                    pointerEvents: 'none',
                }} />

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    position: 'relative',
                }}>
                    <Globe style={{ width: 16, height: 16, color: 'var(--accent)' }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                        Multilingual Voice Assistant
                    </span>
                </div>

                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '26px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                    position: 'relative',
                }}>
                    Speak in your language
                </h2>
                <p style={{
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    maxWidth: '400px',
                    margin: '0 auto 36px',
                    position: 'relative',
                    lineHeight: 1.6,
                }}>
                    Ask about migration, contracts, or safety — in Hindi, Arabic, Spanish, or any language
                </p>

                {/* Big mic button with animated rings */}
                <div style={{
                    position: 'relative',
                    width: '112px',
                    height: '112px',
                    margin: '0 auto',
                }}>
                    {/* Pulsing outer rings */}
                    {isListening && (
                        <>
                            <div style={{
                                position: 'absolute',
                                inset: '-16px',
                                borderRadius: '50%',
                                border: '2px solid rgba(200, 149, 108, 0.2)',
                                animation: 'pulseRing 2s ease-out infinite',
                            }} />
                            <div style={{
                                position: 'absolute',
                                inset: '-16px',
                                borderRadius: '50%',
                                border: '2px solid rgba(200, 149, 108, 0.15)',
                                animation: 'pulseRing 2s ease-out infinite 0.5s',
                            }} />
                        </>
                    )}
                    {/* Static ring */}
                    <div style={{
                        position: 'absolute',
                        inset: '-6px',
                        borderRadius: '50%',
                        border: `1px solid ${isListening ? 'rgba(200, 149, 108, 0.2)' : 'rgba(200, 149, 108, 0.08)'}`,
                        transition: 'all 0.3s',
                    }} />
                    <button
                        onClick={toggleListening}
                        style={{
                            width: '112px',
                            height: '112px',
                            borderRadius: '50%',
                            border: isListening ? '2px solid var(--accent)' : '2px solid var(--border-strong)',
                            background: isListening
                                ? 'linear-gradient(135deg, rgba(200, 149, 108, 0.15), rgba(200, 149, 108, 0.05))'
                                : 'linear-gradient(135deg, var(--bg-elevated), var(--bg-hover))',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            animation: isListening ? 'pulseGlow 2s infinite' : 'none',
                            position: 'relative',
                            boxShadow: isListening
                                ? '0 0 40px rgba(200, 149, 108, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
                                : 'var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.03)',
                        }}
                    >
                        {processing ? (
                            <Loader style={{ width: 36, height: 36, color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
                        ) : isListening ? (
                            <MicOff style={{ width: 36, height: 36, color: 'var(--accent-bright)' }} />
                        ) : (
                            <Mic style={{ width: 36, height: 36, color: 'var(--text-muted)' }} />
                        )}
                    </button>
                </div>

                <p style={{
                    marginTop: '20px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: isListening ? 'var(--accent-bright)' : 'var(--text-muted)',
                    position: 'relative',
                }}>
                    {processing ? 'Processing with Gemini...' :
                        isListening ? 'Listening... speak now' :
                            'Tap to start speaking'}
                </p>

                {/* Waveform visualization */}
                {isListening && (
                    <div className="waveform-container" style={{ marginTop: '24px', position: 'relative' }}>
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="waveform-bar" />
                        ))}
                    </div>
                )}

                {/* Live transcript */}
                {transcript && (
                    <div style={{
                        marginTop: '28px',
                        padding: '16px 20px',
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        textAlign: 'left',
                        position: 'relative',
                    }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                            You said:
                        </span>
                        <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                            "{transcript}"
                        </p>
                    </div>
                )}
            </div>

            {/* Latest Response */}
            {response && (
                <div className="card-accent animate-fade-up" style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: 'var(--accent-glow)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Volume2 style={{
                                    width: 16, height: 16,
                                    color: speaking ? 'var(--accent-bright)' : 'var(--accent)',
                                }} />
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600 }}>
                                EquiMigrate Response
                            </h3>
                        </div>
                        {detectedLang && (
                            <span style={{
                                fontSize: '12px',
                                padding: '5px 12px',
                                borderRadius: '999px',
                                background: 'var(--accent-glow)',
                                border: '1px solid rgba(200, 149, 108, 0.1)',
                                color: 'var(--accent-bright)',
                                fontWeight: 600,
                            }}>
                                {detectedLang}
                            </span>
                        )}
                    </div>
                    <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                        {response.response_text}
                    </p>
                    <button
                        onClick={() => speakText(response.response_text, detectedLang)}
                        className="btn-ghost"
                        style={{ marginTop: '16px' }}
                    >
                        <Volume2 style={{ width: 14, height: 14 }} />
                        Replay Audio
                    </button>
                </div>
            )}

            {/* Conversation History */}
            {history.length > 1 && (
                <div>
                    <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '18px',
                        fontWeight: 600,
                        marginBottom: '16px',
                        color: 'var(--text-primary)',
                    }}>
                        Conversation History
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {history.slice(0, -1).reverse().map((item, i) => (
                            <div key={i} className="card-surface-static" style={{ padding: '18px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                                        You
                                    </span>
                                    <span style={{
                                        fontSize: '11px',
                                        padding: '2px 8px',
                                        borderRadius: '999px',
                                        background: 'var(--accent-glow)',
                                        color: 'var(--accent-dim)',
                                    }}>
                                        {item.language}
                                    </span>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '10px' }}>
                                    "{item.user}"
                                </p>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    {item.assistant}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="card-danger" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Mic style={{ width: 18, height: 18, color: 'var(--danger)', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: 'var(--danger)' }}>{error}</span>
                </div>
            )}
        </div>
    );
};

export default VoiceAssistant;
