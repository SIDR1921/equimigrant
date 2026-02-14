import React, { useEffect, useState } from 'react';

const RiskMeter = ({ riskScore }) => {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 1200;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedScore(Math.round(eased * riskScore));
            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [riskScore]);

    // SVG arc gauge
    const size = 200;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = Math.PI * radius; // semicircle
    const fillPercent = animatedScore / 100;
    const dashOffset = circumference * (1 - fillPercent);

    let color = '#5dba72'; // safe green
    let label = 'LOW RISK';
    if (riskScore > 70) {
        color = '#d94f4f';
        label = 'CRITICAL';
    } else if (riskScore > 30) {
        color = '#d4a84b';
        label = 'MODERATE';
    }

    return (
        <div className="card-surface-static" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 24px 24px',
        }}>
            <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '20px'
            }}>
                Legal Risk Score
            </p>

            <div style={{ position: 'relative', width: size, height: size / 2 + 10 }}>
                <svg
                    width={size}
                    height={size / 2 + 10}
                    viewBox={`0 0 ${size} ${size / 2 + 10}`}
                >
                    {/* Background arc */}
                    <path
                        d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                        fill="none"
                        stroke="var(--bg-elevated)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />
                    {/* Filled arc */}
                    <path
                        d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        style={{
                            transition: 'stroke-dashoffset 0.1s linear',
                            filter: `drop-shadow(0 0 8px ${color}40)`
                        }}
                    />
                </svg>

                {/* Score text */}
                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center'
                }}>
                    <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '48px',
                        fontWeight: 800,
                        color: color,
                        lineHeight: 1,
                        display: 'block'
                    }}>
                        {animatedScore}
                    </span>
                </div>
            </div>

            <p style={{
                marginTop: '12px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '2px',
                color: color,
                textTransform: 'uppercase'
            }}>
                {label}
            </p>
        </div>
    );
};

export default RiskMeter;
