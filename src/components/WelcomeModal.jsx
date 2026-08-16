import React from 'react';
import { Coffee, ShieldCheck, Heart, Sparkles, X } from 'lucide-react';

const WelcomeModal = ({ onClose, onSupportDeveloper }) => {
  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="modal-card glass-panel animate-slide-up">
        <button className="modal-close-btn" onClick={onClose} title="Dismiss">
          <X size={16} />
        </button>

        <div className="modal-icon-container">
          <img 
            src="./icon.png" 
            alt="CleanMyMacbook Icon" 
            className="app-modal-logo" 
          />
          <div className="logo-pulse-ring" />
        </div>

        <h2 className="modal-title">Welcome to CleanMyMacbook</h2>
        <span className="modal-subtitle">macOS Sequoia Security & Optimization Suite</span>

        <div className="modal-info-box">
          <div className="info-item">
            <ShieldCheck size={18} className="info-icon green" />
            <p>
              To ensure native file targeting efficiency, optionally verify 
              <strong> Full Disk Access</strong> in <em>System Settings &gt; Privacy & Security</em>.
            </p>
          </div>
        </div>

        <div className="developer-story-card">
          <Heart size={16} color="var(--accent-pink)" />
          <p>
            Developed organically by <strong>Chadi0x</strong>. If CleanMyMacbook helps keep your Mac fast and secure, consider supporting independent development!
          </p>
        </div>

        <div className="modal-actions-row">
          <button className="btn btn-kofi support-btn" onClick={onSupportDeveloper}>
            <Coffee size={18} />
            <span>Support on Ko-fi</span>
          </button>
          
          <button className="btn btn-outline dismiss-btn" onClick={onClose}>
            <span>Continue to App</span>
          </button>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-card {
          width: 100%;
          max-width: 480px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.2);
        }

        .modal-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: var(--text-primary);
        }

        .modal-icon-container {
          position: relative;
          margin-bottom: 20px;
        }

        .app-modal-logo {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
          position: relative;
          z-index: 2;
        }

        .logo-pulse-ring {
          position: absolute;
          inset: -10px;
          border-radius: 28px;
          background: radial-gradient(circle, rgba(255, 0, 127, 0.4), transparent 70%);
          filter: blur(15px);
          z-index: 1;
        }

        .modal-title {
          font-size: 26px;
          font-weight: 850;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .modal-subtitle {
          font-size: 13px;
          font-weight: 600;
          color: var(--accent-pink);
          margin-bottom: 24px;
        }

        .modal-info-box {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          margin-bottom: 16px;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          text-align: left;
        }

        .info-icon.green {
          color: var(--accent-emerald);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .info-item p {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .developer-story-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          border-radius: 14px;
          background: rgba(255, 0, 127, 0.05);
          border: 1px solid rgba(255, 0, 127, 0.2);
          text-align: left;
          margin-bottom: 28px;
        }

        .developer-story-card p {
          font-size: 12.5px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .modal-actions-row {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
        }

        .support-btn, .dismiss-btn {
          flex: 1;
          padding: 14px;
        }
      `}</style>
    </div>
  );
};

export default WelcomeModal;
