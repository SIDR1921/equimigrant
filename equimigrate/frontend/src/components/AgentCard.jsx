import React from 'react';

const AgentCard = ({ title, icon: Icon, children, variant = "default" }) => {
    const cardClass =
        variant === "danger" ? "card-danger" :
            variant === "warning" ? "card-warning" :
                variant === "safe" ? "card-safe" :
                    "card-accent";

    const iconBg =
        variant === "danger" ? 'rgba(217, 79, 79, 0.15)' :
            variant === "warning" ? 'rgba(212, 168, 75, 0.15)' :
                variant === "safe" ? 'rgba(93, 186, 114, 0.15)' :
                    'var(--accent-glow)';

    const iconColor =
        variant === "danger" ? 'var(--danger)' :
            variant === "warning" ? 'var(--warning)' :
                variant === "safe" ? 'var(--safe)' :
                    'var(--accent)';

    return (
        <div
            className={cardClass}
            style={{
                padding: '24px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '16px'
            }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <Icon style={{ width: 18, height: 18, color: iconColor }} />
                </div>
                <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '18px',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em'
                }}>
                    {title}
                </h3>
            </div>
            <div style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                lineHeight: 1.7,
            }}>
                {children}
            </div>
        </div>
    );
};

export default AgentCard;
