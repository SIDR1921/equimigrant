import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { Shield, Coins, MapPin, AlertTriangle, Info, FileSearch, Mic, Compass, Scale, ArrowRight, Sparkles, Languages } from 'lucide-react';
import JobForm from './components/JobForm';
import RiskMeter from './components/RiskMeter';
import AgentCard from './components/AgentCard';
import ContractScanner from './components/ContractScanner';
import VoiceAssistant from './components/VoiceAssistant';
import NegotiationPanel from './components/NegotiationPanel';
import RecommendationsPanel from './components/RecommendationsPanel';
import TranslateDialog from './components/TranslateDialog';

function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [translateOpen, setTranslateOpen] = useState(false);

  // Collect all visible text on the page for translation
  const getTranslatableText = () => {
    const parts = [];
    if (result) {
      parts.push(`Swarm Consensus: ${result.final_advice}`);
      parts.push(`Legal Risk Score: ${result.legal_risk}/100`);
      parts.push(`Economic Analysis: ${result.economic_verdict}`);
      if (result.hidden_costs?.length) parts.push(`Hidden Costs:\n${result.hidden_costs.map(c => `• ${c}`).join('\n')}`);
      if (result.culture_shocks?.length) parts.push(`Culture Shocks:\n${result.culture_shocks.map(s => `• ${s}`).join('\n')}`);
      if (result.living_conditions) {
        parts.push(`Living Conditions:\n${Object.entries(result.living_conditions).map(([k, v]) => `• ${k}: ${v}`).join('\n')}`);
      }
    }
    if (scanResult) {
      parts.push(`Contract Summary: ${scanResult.summary}`);
      if (scanResult.red_flags?.length) parts.push(`Red Flags:\n${scanResult.red_flags.map(f => `• ${f}`).join('\n')}`);
      if (scanResult.negotiation_points?.length) parts.push(`Negotiation Points:\n${scanResult.negotiation_points.map(p => `• ${p}`).join('\n')}`);
      if (scanResult.extracted_text) parts.push(`Extracted Text: ${scanResult.extracted_text}`);
    }
    return parts.join('\n\n') || 'No content available to translate. Please analyze a job offer or scan a contract first.';
  };

  const analyzeOffer = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setFormData(data);
    try {
      const response = await axios.post('http://localhost:8000/analyze-migration', data);
      setResult(response.data);
    } catch (err) {
      setError("Failed to connect to EquiMigrate Swarm. Ensure backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScanComplete = (data) => {
    setScanResult(data);
  };

  const tabs = [
    { id: 'analyze', label: 'Analyze', icon: Shield },
    { id: 'scan', label: 'Scan Contract', icon: FileSearch },
    { id: 'negotiate', label: 'Negotiate', icon: Scale },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'recommend', label: 'Alternatives', icon: Compass },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>

      {/* ═══ DECORATIVE ORBS ═══ */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* ═══ CINEMATIC HEADER ═══ */}
      <header style={{
        padding: '40px 24px 0',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
      }}>
        {/* Logo Row */}
        <div className="animate-fade-up" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Logo mark — larger with double ring */}
            <div style={{
              position: 'relative',
              width: '52px',
              height: '52px',
            }}>
              {/* Outer glow ring */}
              <div style={{
                position: 'absolute',
                inset: '-4px',
                borderRadius: '16px',
                border: '1px solid rgba(200, 149, 108, 0.15)',
                background: 'rgba(200, 149, 108, 0.03)',
              }} />
              {/* Inner logo */}
              <div style={{
                position: 'relative',
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, var(--accent-dim), var(--accent), var(--accent-bright))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 24px rgba(200, 149, 108, 0.3), 0 0 60px rgba(200, 149, 108, 0.08)',
              }}>
                <Shield style={{ width: 24, height: 24, color: 'var(--bg-deep)' }} />
              </div>
            </div>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '26px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>
                EquiMigrate
              </h1>
              <p style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: 'var(--accent-dim)',
                marginTop: '6px',
              }}>
                Global Migration Safety
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '999px',
            background: 'rgba(102, 187, 106, 0.06)',
            border: '1px solid rgba(102, 187, 106, 0.15)',
          }}>
            <div style={{
              width: '7px', height: '7px',
              borderRadius: '50%',
              background: 'var(--safe)',
              boxShadow: '0 0 12px var(--safe)',
              animation: 'pulseGlow 3s infinite',
            }} />
            <span style={{ fontSize: '11px', color: 'var(--safe)', fontWeight: 600, letterSpacing: '0.5px' }}>
              Swarm Online
            </span>
          </div>
        </div>

        {/* Divider line */}
        <div className="divider-gradient" style={{ marginBottom: '24px' }} />

        {/* ═══ TAB NAVIGATION ═══ */}
        <div className="tab-nav animate-fade-up delay-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon />
                <span className="tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main style={{
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '36px 24px 64px',
      }}>

        {/* ── ANALYZE TAB ── */}
        {activeTab === 'analyze' && (
          <div className="page-enter page-content-atmosphere" style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '32px',
          }}>
            {/* Two-column layout on desktop */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)',
              gap: '32px',
            }} className="responsive-grid">
              {/* Left: Form + Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <JobForm onSubmit={analyzeOffer} isLoading={loading} />

                {error && (
                  <div className="card-danger animate-fade-up" style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px'
                  }}>
                    <AlertTriangle style={{ width: 16, height: 16, color: 'var(--danger)', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: 'var(--danger)' }}>{error}</span>
                  </div>
                )}

                {/* How it works card */}
                <div className="card-surface-static animate-fade-up delay-2" style={{ padding: '28px' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '17px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--accent-glow)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Info style={{ width: 16, height: 16, color: 'var(--accent)' }} />
                    </div>
                    How Swarm Intelligence Works
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { color: 'var(--accent)', label: 'Legal Guardian', desc: 'checks vs Emigration Acts & Labor Laws' },
                      { color: 'var(--warning)', label: 'Economist', desc: 'calculates PPP-adjusted real value' },
                      { color: 'var(--safe)', label: 'Settler', desc: 'scans for hidden fines & lifestyle risks' },
                    ].map((agent, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.015)',
                        border: '1px solid rgba(255, 255, 255, 0.03)',
                      }}>
                        <div style={{
                          width: '8px', height: '8px',
                          borderRadius: '50%',
                          background: agent.color,
                          marginTop: '6px',
                          flexShrink: 0,
                          boxShadow: `0 0 8px ${agent.color}`,
                        }} />
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{agent.label}</strong>{' '}{agent.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Results */}
              <div>
                {!result && !loading && (
                  <div style={{
                    height: '100%',
                    minHeight: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px dashed var(--border-strong)',
                    borderRadius: 'var(--radius-xl)',
                    background: 'radial-gradient(ellipse at center, rgba(200, 149, 108, 0.03) 0%, var(--bg-surface) 60%)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {/* Decorative rings */}
                    <div style={{
                      position: 'absolute',
                      width: '240px',
                      height: '240px',
                      borderRadius: '50%',
                      border: '1px solid rgba(200, 149, 108, 0.06)',
                    }} />
                    <div style={{
                      position: 'absolute',
                      width: '180px',
                      height: '180px',
                      borderRadius: '50%',
                      border: '1px solid rgba(200, 149, 108, 0.08)',
                    }} />
                    <div style={{
                      width: '72px', height: '72px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, var(--bg-card), var(--bg-elevated))',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                      position: 'relative',
                      zIndex: 1,
                      boxShadow: 'var(--shadow-md)',
                    }}>
                      <Shield style={{ width: 30, height: 30, color: 'var(--text-muted)' }} />
                    </div>
                    <p style={{
                      fontSize: '18px',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      position: 'relative',
                      zIndex: 1,
                      marginBottom: '8px',
                    }}>
                      Awaiting job offer data
                    </p>
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      opacity: 0.7,
                      position: 'relative',
                      zIndex: 1,
                    }}>
                      Fill the form or click Demo to get started
                    </p>
                  </div>
                )}

                {loading && (
                  <div style={{
                    height: '100%',
                    minHeight: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-xl)',
                    background: 'radial-gradient(ellipse at center, rgba(200, 149, 108, 0.04) 0%, var(--bg-surface) 60%)',
                    border: '1px solid var(--border)',
                  }}>
                    <div style={{
                      position: 'relative',
                      width: '88px',
                      height: '88px',
                      marginBottom: '28px',
                    }}>
                      {/* Outer pulse ring */}
                      <div style={{
                        position: 'absolute',
                        inset: '-12px',
                        borderRadius: '50%',
                        border: '2px solid rgba(200, 149, 108, 0.15)',
                        animation: 'pulseRing 2s ease-out infinite',
                      }} />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        border: '3px solid var(--border)',
                        borderRadius: '50%',
                      }} />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        border: '3px solid transparent',
                        borderTopColor: 'var(--accent)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }} />
                      <Shield style={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 26, height: 26,
                        color: 'var(--accent)',
                      }} />
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '22px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '8px',
                    }}>
                      Swarm Intelligence Active
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Consulting Legal, Economic, and Social databases...
                    </p>
                  </div>
                )}

                {result && (
                  <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Top row: Risk meter + Consensus */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                      <RiskMeter riskScore={result.legal_risk} />
                      <div style={{
                        background: 'linear-gradient(135deg, var(--accent-dim), var(--accent), var(--accent-bright))',
                        borderRadius: 'var(--radius-md)',
                        padding: '28px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 12px 40px rgba(200, 149, 108, 0.25), 0 0 80px rgba(200, 149, 108, 0.06)',
                      }}>
                        {/* Decorative circles */}
                        <div style={{
                          position: 'absolute',
                          top: '-30px',
                          right: '-30px',
                          width: '120px',
                          height: '120px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.08)',
                        }} />
                        <div style={{
                          position: 'absolute',
                          bottom: '-20px',
                          left: '-20px',
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.04)',
                        }} />
                        <p style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '2.5px',
                          textTransform: 'uppercase',
                          color: 'rgba(0,0,0,0.45)',
                          marginBottom: '10px',
                        }}>
                          Swarm Consensus
                        </p>
                        <p style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '18px',
                          fontWeight: 700,
                          lineHeight: 1.5,
                          color: 'var(--bg-deep)',
                        }}>
                          {result.final_advice}
                        </p>
                      </div>
                    </div>

                    {/* Agent Reports */}
                    <div className="result-grid">
                      <AgentCard
                        title="Economic Analysis"
                        icon={Coins}
                        variant={result.economic_verdict?.toLowerCase().includes("poverty") ? "warning" : "default"}
                      >
                        <p style={{ fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.7 }}>
                          {result.economic_verdict}
                        </p>
                      </AgentCard>

                      <AgentCard title="Living Conditions" icon={MapPin}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {Object.entries(result.living_conditions || {}).map(([key, value]) => (
                            <div key={key} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              paddingBottom: '10px',
                              borderBottom: '1px solid var(--border)',
                            }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{key}</span>
                              <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value || 'N/A'}</span>
                            </div>
                          ))}
                        </div>
                      </AgentCard>

                      <AgentCard title="Hidden Costs" icon={AlertTriangle} variant="danger">
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {result.hidden_costs?.map((cost, i) => (
                            <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '14px' }}>
                              <span style={{ color: 'var(--danger)', flexShrink: 0 }}>⬤</span>
                              {cost}
                            </li>
                          ))}
                          {(!result.hidden_costs || result.hidden_costs.length === 0) && (
                            <li style={{ fontSize: '14px' }}>None detected.</li>
                          )}
                        </ul>
                      </AgentCard>

                      <AgentCard title="Culture Shocks" icon={Info}>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {result.culture_shocks?.map((shock, i) => (
                            <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '14px' }}>
                              <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
                              {shock}
                            </li>
                          ))}
                          {(!result.culture_shocks || result.culture_shocks.length === 0) && (
                            <li style={{ fontSize: '14px' }}>None detected.</li>
                          )}
                        </ul>
                      </AgentCard>
                    </div>

                    {/* Quick actions after analysis */}
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      flexWrap: 'wrap',
                      paddingTop: '8px',
                    }}>
                      <button
                        className="btn-ghost"
                        onClick={() => setActiveTab('negotiate')}
                      >
                        <Scale style={{ width: 14, height: 14 }} />
                        Negotiate this contract
                      </button>
                      <button
                        className="btn-ghost"
                        onClick={() => setActiveTab('recommend')}
                      >
                        <Compass style={{ width: 14, height: 14 }} />
                        Find better alternatives
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── SCAN CONTRACT TAB ── */}
        {activeTab === 'scan' && (
          <div className="page-enter page-content-atmosphere" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="animate-fade-up" style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'var(--accent-glow)',
                border: '1px solid rgba(200, 149, 108, 0.12)',
                marginBottom: '16px',
              }}>
                <FileSearch style={{ width: 14, height: 14, color: 'var(--accent)' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--accent)' }}>
                  Gemini Vision OCR
                </span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '32px',
                fontWeight: 700,
                marginBottom: '10px',
                lineHeight: 1.2,
              }}>
                Contract Scanner
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Upload a photo of any contract — handwritten or printed, in any language. Gemini Vision will analyze it instantly.
              </p>
            </div>
            <ContractScanner onScanComplete={handleScanComplete} />

            {scanResult && (
              <div style={{ marginTop: '24px' }}>
                <button
                  className="btn-primary"
                  style={{ maxWidth: '320px' }}
                  onClick={() => setActiveTab('negotiate')}
                >
                  <Scale style={{ width: 18, height: 18 }} />
                  Negotiate This Contract
                  <ArrowRight style={{ width: 18, height: 18 }} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── NEGOTIATE TAB ── */}
        {activeTab === 'negotiate' && (
          <div className="page-enter page-content-atmosphere" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="animate-fade-up" style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'var(--accent-glow)',
                border: '1px solid rgba(200, 149, 108, 0.12)',
                marginBottom: '16px',
              }}>
                <Sparkles style={{ width: 14, height: 14, color: 'var(--accent)' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--accent)' }}>
                  AI-Powered
                </span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '32px',
                fontWeight: 700,
                marginBottom: '10px',
                lineHeight: 1.2,
              }}>
                AI Negotiation
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Get a professional negotiation strategy customized for your contract, powered by Gemini AI.
              </p>
            </div>
            <NegotiationPanel
              contractText={scanResult?.extracted_text || formData?.offer_text || ''}
              detectedLanguage={scanResult?.detected_language || 'English'}
            />
          </div>
        )}

        {/* ── VOICE TAB ── */}
        {activeTab === 'voice' && (
          <div className="page-enter page-content-atmosphere" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="animate-fade-up" style={{ marginBottom: '32px', textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'var(--accent-glow)',
                border: '1px solid rgba(200, 149, 108, 0.12)',
                marginBottom: '16px',
              }}>
                <Mic style={{ width: 14, height: 14, color: 'var(--accent)' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--accent)' }}>
                  Multilingual
                </span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '32px',
                fontWeight: 700,
                marginBottom: '10px',
                lineHeight: 1.2,
              }}>
                Voice Assistant
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Speak in Hindi, Arabic, Spanish — or any language. Gemini responds in the same language.
              </p>
            </div>
            <VoiceAssistant />
          </div>
        )}

        {/* ── RECOMMEND TAB ── */}
        {activeTab === 'recommend' && (
          <div className="page-enter page-content-atmosphere" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="animate-fade-up" style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'var(--accent-glow)',
                border: '1px solid rgba(200, 149, 108, 0.12)',
                marginBottom: '16px',
              }}>
                <Compass style={{ width: 14, height: 14, color: 'var(--accent)' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--accent)' }}>
                  Smart Discovery
                </span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '32px',
                fontWeight: 700,
                marginBottom: '10px',
                lineHeight: 1.2,
              }}>
                Better Alternatives
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Discover safer destinations with better wages and stronger legal protections for migrants.
              </p>
            </div>
            <RecommendationsPanel
              analysisData={formData ? { ...formData, legal_risk: result?.legal_risk } : null}
            />
          </div>
        )}
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        padding: '24px 24px 28px',
        textAlign: 'center',
      }}>
        <div className="divider-gradient" style={{ marginBottom: '24px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Sparkles style={{ width: 13, height: 13, color: 'var(--accent-dim)' }} />
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            EquiMigrate — Powered by Google Gemini AI • No PII stored • Open source
          </p>
        </div>
      </footer>

      {/* ═══ FLOATING TRANSLATE BUTTON ═══ */}
      <button
        onClick={() => setTranslateOpen(true)}
        title="Translate content"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--accent-dim), var(--accent))',
          border: '1px solid rgba(200, 149, 108, 0.3)',
          color: 'var(--bg-deep)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(200, 149, 108, 0.3), 0 0 60px rgba(200, 149, 108, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 9990,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(200, 149, 108, 0.4), 0 0 80px rgba(200, 149, 108, 0.1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(200, 149, 108, 0.3), 0 0 60px rgba(200, 149, 108, 0.06)';
        }}
      >
        <Languages style={{ width: 24, height: 24 }} />
      </button>

      {/* ═══ TRANSLATE DIALOG ═══ */}
      <TranslateDialog
        isOpen={translateOpen}
        onClose={() => setTranslateOpen(false)}
        textToTranslate={getTranslatableText()}
      />

      {/* ═══ RESPONSIVE CSS ═══ */}
      <style>{`
        @media (max-width: 768px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
