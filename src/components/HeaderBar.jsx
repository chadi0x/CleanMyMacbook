import React from 'react';
import { Cpu, HardDrive, Search, Sparkles } from 'lucide-react';

const HeaderBar = ({ sysInfo, activeTab, onOpenCommandPalette }) => {
  const formatBytes = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 GB';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const diskUsedPct = sysInfo ? Math.round((sysInfo.diskUsed / sysInfo.diskTotal) * 100) || 0 : 0;
  const memUsedPct = sysInfo ? Math.round((sysInfo.memUsed / sysInfo.memTotal) * 100) || 0 : 0;

  return (
    <header className="header-bar">
      <div className="header-drag-zone drag-region"></div>
      
      {/* Title & Section Indicator */}
      <div className="header-left no-drag">
        <div className="app-brand-pill">
          <div className="app-brand-icon">
            <Sparkles size={12} color="#FF007F" />
          </div>
          <span className="app-brand-title">CleanMyMacbook</span>
          <span className="app-brand-version">v1.0 Pro</span>
        </div>
        
        <div className="header-divider"></div>
        <div className="active-tab-breadcrumb">
          <span>{activeTab}</span>
        </div>
      </div>

      {/* Center Command Palette Search Trigger */}
      <div className="header-center no-drag">
        <button 
          className="command-trigger-btn"
          onClick={onOpenCommandPalette}
          title="Search tabs & tools (⌘K)"
        >
          <Search size={13} className="search-icon" />
          <span className="trigger-text">Search modules or tasks...</span>
          <kbd className="key-shortcut">⌘K</kbd>
        </button>
      </div>

      {/* Right Telemetry Bar */}
      <div className="header-right no-drag">
        {sysInfo ? (
          <div className="telemetry-bar">
            {/* Disk Telemetry */}
            <div className="telemetry-chip" title={`Disk Usage: ${formatBytes(sysInfo.diskUsed)} / ${formatBytes(sysInfo.diskTotal)}`}>
              <HardDrive size={13} className="chip-icon disk" />
              <div className="chip-content">
                <span className="chip-label">DISK</span>
                <span className="chip-value">{diskUsedPct}%</span>
              </div>
              <div className="mini-progress-bg">
                <div 
                  className="mini-progress-fill disk" 
                  style={{ width: `${diskUsedPct}%` }}
                ></div>
              </div>
            </div>

            {/* RAM Telemetry */}
            <div className="telemetry-chip" title={`Memory Usage: ${formatBytes(sysInfo.memUsed)} / ${formatBytes(sysInfo.memTotal)}`}>
              <Cpu size={13} className="chip-icon ram" />
              <div className="chip-content">
                <span className="chip-label">RAM</span>
                <span className="chip-value">{memUsedPct}%</span>
              </div>
              <div className="mini-progress-bg">
                <div 
                  className="mini-progress-fill ram" 
                  style={{ width: `${memUsedPct}%` }}
                ></div>
              </div>
            </div>

            {/* CPU Model Telemetry */}
            <div className="telemetry-chip cpu-chip" title={sysInfo.cpuModel}>
              <Cpu size={13} className="chip-icon cpu" />
              <span className="cpu-text">{sysInfo.cpuModel.replace('Apple ', '').split(' ')[0]}</span>
            </div>
          </div>
        ) : (
          <div className="telemetry-loading">
            <span>Connecting OS Kernel...</span>
          </div>
        )}
      </div>

      <style>{`
        .header-bar {
          width: 100%;
          height: 48px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px 0 82px; /* Space for macOS traffic light buttons */
          background: rgba(10, 7, 18, 0.6);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-bottom: 1px solid var(--border-light);
          position: relative;
          z-index: 100;
        }

        .header-drag-zone {
          position: absolute;
          inset: 0;
          z-index: -1;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .app-brand-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 3px 10px 3px 5px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          border-radius: 99px;
        }

        .app-brand-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255, 0, 127, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 0, 127, 0.3);
        }

        .app-brand-title {
          font-size: 12px;
          font-weight: 750;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .app-brand-version {
          font-size: 9.5px;
          font-weight: 700;
          color: var(--accent-pink);
          background: rgba(255, 0, 127, 0.12);
          padding: 1px 5px;
          border-radius: 5px;
        }

        .header-divider {
          width: 1px;
          height: 14px;
          background: var(--border-light);
        }

        .active-tab-breadcrumb {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .header-center {
          flex: 1;
          max-width: 300px;
          margin: 0 16px;
        }

        .command-trigger-btn {
          width: 100%;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .command-trigger-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--border-highlight);
          color: var(--text-secondary);
        }

        .search-icon {
          margin-right: 6px;
        }

        .trigger-text {
          font-size: 11.5px;
          font-weight: 500;
          flex: 1;
          text-align: left;
        }

        .key-shortcut {
          font-family: var(--font-mono);
          font-size: 9.5px;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-light);
          padding: 1px 4px;
          border-radius: 4px;
          color: var(--text-secondary);
        }

        .header-right {
          display: flex;
          align-items: center;
        }

        .telemetry-bar {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .telemetry-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 3px 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          border-radius: 7px;
          height: 26px;
        }

        .chip-icon.disk { color: var(--accent-pink); }
        .chip-icon.ram { color: var(--accent-purple); }
        .chip-icon.cpu { color: var(--accent-cyan); }

        .chip-content {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .chip-label {
          font-size: 9px;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .chip-value {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-primary);
          font-family: var(--font-mono);
        }

        .mini-progress-bg {
          width: 28px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 99px;
          overflow: hidden;
        }

        .mini-progress-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.5s ease;
        }

        .mini-progress-fill.disk { background: var(--accent-pink); }
        .mini-progress-fill.ram { background: var(--accent-purple); }

        .cpu-chip .cpu-text {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .telemetry-loading {
          font-size: 11px;
          color: var(--text-muted);
        }
      `}</style>
    </header>
  );
};

export default HeaderBar;
