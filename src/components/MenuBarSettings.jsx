import React, { useState, useEffect } from 'react';
import { Radio, ShieldCheck, Zap, Power, Cpu, HardDrive } from 'lucide-react';

const MenuBarSettings = ({ sysInfo, formatBytes }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getMenuBarStatus().then(res => setIsEnabled(!!res));
    }
  }, []);

  const handleToggle = async () => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);
    if (window.electronAPI) {
      const updated = await window.electronAPI.toggleMenuBar(nextState);
      setIsEnabled(!!updated);
    }
  };

  const diskPct = sysInfo ? Math.round((sysInfo.diskUsed / sysInfo.diskTotal) * 100) || 0 : 0;
  const memPct = sysInfo ? Math.round((sysInfo.memUsed / sysInfo.memTotal) * 100) || 0 : 0;

  return (
    <div className="menubar-viewport animate-slide-up">
      <div className="menubar-header">
        <div>
          <h1 className="view-title">Live macOS Menu Bar Extra</h1>
          <p className="view-subtitle">
            Sit a live telemetry monitor directly in your macOS top Menu Bar. Monitor RAM & Disk utilization at a glance and trigger quick 1-click RAM purges without opening the app window.
          </p>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="menubar-settings-card glass-card">
        <div className="setting-row">
          <div className="setting-info">
            <div className="setting-icon-box">
              <Zap size={22} color="var(--accent-pink)" />
            </div>
            <div>
              <h3 className="setting-title">Enable Menu Bar Status Icon</h3>
              <p className="setting-desc">
                Places a lightweight status indicator in your Mac top menu bar. You can turn this off anytime.
              </p>
            </div>
          </div>

          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={isEnabled} 
              onChange={handleToggle} 
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Status Indicator */}
        <div className="status-banner">
          <Power size={16} className={isEnabled ? 'active-icon' : 'inactive-icon'} />
          <span>Status: <strong>{isEnabled ? 'ACTIVE in macOS Menu Bar' : 'DISABLED (No menu bar item)'}</strong></span>
        </div>
      </div>

      {/* Preview Mockup */}
      <div className="menubar-preview-card glass-card">
        <h3 className="preview-heading">MENU BAR LIVE PREVIEW</h3>
        <div className="mac-menu-bar-mockup">
          <div className="mockup-left">
            <span></span>
            <span className="app-title-bold">CleanMyMacbook</span>
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Window</span>
            <span>Help</span>
          </div>

          <div className="mockup-right">
            <div className={`mockup-tray-item ${isEnabled ? 'highlight' : ''}`}>
              <Zap size={13} color="var(--accent-pink)" />
              <span className="tray-text">⚡ RAM: {memPct}% | DISK: {diskPct}%</span>
            </div>
            <span className="mockup-time">Sun 6:35 PM</span>
          </div>
        </div>
      </div>

      <style>{`
        .menubar-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
          overflow-y: auto;
          padding-right: 4px;
        }

        .menubar-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .menubar-settings-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .setting-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .setting-icon-box {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: rgba(255, 0, 127, 0.12);
          border: 1px solid rgba(255, 0, 127, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .setting-title {
          font-size: 16px;
          font-weight: 750;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .setting-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.45;
          margin: 0;
        }

        /* Toggle Switch */
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 26px;
          flex-shrink: 0;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: rgba(255, 255, 255, 0.12);
          border: 1px solid var(--border-light);
          transition: 0.3s;
          border-radius: 99px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: var(--accent-pink);
          border-color: var(--accent-pink);
          box-shadow: 0 0 15px rgba(255, 0, 127, 0.5);
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }

        .status-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid var(--border-light);
          font-size: 13px;
          color: var(--text-secondary);
        }

        .active-icon { color: var(--accent-emerald); }
        .inactive-icon { color: var(--text-muted); }

        .menubar-preview-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .preview-heading {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .mac-menu-bar-mockup {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          background: rgba(10, 7, 18, 0.85);
          border: 1px solid var(--border-light);
          border-radius: 10px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .mockup-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .app-title-bold {
          font-weight: 700;
          color: var(--text-primary);
        }

        .mockup-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mockup-tray-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 3px 8px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
          transition: all 0.3s ease;
        }

        .mockup-tray-item.highlight {
          background: rgba(255, 0, 127, 0.15);
          border: 1px solid rgba(255, 0, 127, 0.3);
        }

        .tray-text {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .mockup-time {
          font-size: 11.5px;
        }
      `}</style>
    </div>
  );
};

export default MenuBarSettings;
