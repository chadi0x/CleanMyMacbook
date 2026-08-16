import React from 'react';
import { Play, Sparkles, Shield, AlertCircle } from 'lucide-react';

const ScanRing = ({ progress, scanning, label, onStartScan }) => {
  const radius = 100;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="scan-ring-container">
      <div className="ring-wrapper">
        {/* Ambient Back Glow Ring */}
        <div className={`ambient-glow ${scanning ? 'active' : ''}`} />

        <svg
          height={radius * 2}
          width={radius * 2}
          className="scan-svg"
        >
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF007F" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            
            <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track Ring */}
          <circle
            stroke="rgba(255, 255, 255, 0.06)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          {/* Progress Ring */}
          <circle
            stroke="url(#ringGradient)"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ 
              strokeDashoffset, 
              transition: scanning ? 'stroke-dashoffset 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'stroke-dashoffset 0.6s ease' 
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            filter="url(#ringGlow)"
          />
        </svg>

        {/* Center Content */}
        <div className="center-content">
          {scanning ? (
            <div className="scanning-metrics">
              <span className="progress-num">{Math.round(progress)}%</span>
              <span className="scanning-status-tag">DEEP AUDIT</span>
            </div>
          ) : (
            <div className="idle-state">
              {progress === 100 ? (
                <div className="ready-indicator">
                  <Sparkles size={28} className="ready-sparkle" />
                  <span className="ready-text">COMPLETE</span>
                </div>
              ) : (
                <button 
                  className="scan-activate-btn" 
                  onClick={onStartScan}
                  title="Activate Deep System Targeting"
                >
                  <Play size={26} fill="white" className="play-icon" />
                  <span className="btn-label">START SCAN</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sub Label */}
      <div className="scan-label-wrapper">
        <div className="scan-label-chip">
          <span className={`status-dot ${scanning ? 'pulsing' : ''}`} />
          <span className="scan-label-text">{label || 'System Core Ready for Crawl'}</span>
        </div>
      </div>

      <style>{`
        .scan-ring-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 20px 0;
        }

        .ring-wrapper {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scan-svg {
          transform: rotate(-90deg);
          overflow: visible;
        }

        .ambient-glow {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 0, 127, 0.25) 0%, rgba(139, 92, 246, 0.15) 50%, transparent 70%);
          filter: blur(25px);
          opacity: 0.4;
          transition: all 0.5s ease;
        }

        .ambient-glow.active {
          opacity: 1;
          transform: scale(1.15);
          animation: pulseGlowCircle 2s ease-in-out infinite alternate;
        }

        @keyframes pulseGlowCircle {
          0% { transform: scale(1.05); opacity: 0.7; }
          100% { transform: scale(1.25); opacity: 1; filter: blur(35px); }
        }

        .center-content {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }

        .scanning-metrics {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .progress-num {
          font-size: 42px;
          font-weight: 850;
          font-family: var(--font-mono);
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .scanning-status-tag {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--accent-pink);
          margin-top: -2px;
        }

        .idle-state {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scan-activate-btn {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: var(--accent-gradient);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 10px 30px rgba(255, 0, 127, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.4);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .scan-activate-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 15px 45px rgba(255, 0, 127, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.6);
        }

        .scan-activate-btn .play-icon {
          margin-left: 3px;
          transition: transform 0.2s ease;
        }

        .scan-activate-btn:hover .play-icon {
          transform: scale(1.15);
        }

        .scan-activate-btn .btn-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .ready-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .ready-sparkle {
          color: var(--accent-emerald);
          filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.6));
        }

        .ready-text {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--accent-emerald);
        }

        /* Sub label chip */
        .scan-label-wrapper {
          margin-top: 18px;
        }

        .scan-label-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-pink);
        }

        .status-dot.pulsing {
          animation: dotPulse 1.2s ease-in-out infinite alternate;
        }

        @keyframes dotPulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 10px var(--accent-pink); }
        }

        .scan-label-text {
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default ScanRing;
