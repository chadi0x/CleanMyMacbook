import React, { useState, useEffect } from 'react';
import { 
  Zap, HardDrive, Cpu, Activity, RefreshCw, AppWindow, Power, Sparkles, CheckCircle2 
} from 'lucide-react';

const MenuBarPopover = () => {
  const [sysInfo, setSysInfo] = useState(null);
  const [purging, setPurging] = useState(false);
  const [purgeStatus, setPurgeStatus] = useState('');

  const fetchStats = () => {
    if (window.electronAPI) {
      window.electronAPI.getSystemInfo().then(res => setSysInfo(res));
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 GB';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleQuickPurgeRAM = async () => {
    setPurging(true);
    setPurgeStatus('Purging RAM...');
    if (window.electronAPI) {
      await window.electronAPI.executeMaintenance('Force RAM Purge');
      setPurgeStatus('RAM Purged Successfully!');
      fetchStats();
    }
    setPurging(false);
    setTimeout(() => setPurgeStatus(''), 2500);
  };

  const handleOpenMainWindow = () => {
    if (window.electronAPI && window.electronAPI.showMainWindow) {
      window.electronAPI.showMainWindow();
    }
  };

  const diskPct = sysInfo ? Math.round((sysInfo.diskUsed / sysInfo.diskTotal) * 100) || 0 : 0;
  const memPct = sysInfo ? Math.round((sysInfo.memUsed / sysInfo.memTotal) * 100) || 0 : 0;

  return (
    <div className="popover-container glass-panel animate-fade-in">
      {/* Top Header */}
      <div className="popover-header">
        <div className="brand-group">
          <div className="brand-icon">
            <Sparkles size={13} color="#FF007F" />
          </div>
          <span className="brand-name">CleanMyMacbook</span>
          <span className="brand-badge">Health</span>
        </div>

        <button 
          className="btn-open-app"
          onClick={fetchStats}
          title="Refresh Metrics"
        >
          <RefreshCw size={13} className={purging ? 'spin' : ''} />
        </button>
      </div>

      {/* Main Gauges Row */}
      <div className="gauges-row">
        {/* RAM Card */}
        <div className="gauge-card glass-card">
          <div className="gauge-header">
            <Cpu size={14} className="card-icon ram" />
            <span className="card-title">RAM USAGE</span>
          </div>

          <div className="gauge-body">
            <h2 className="gauge-number">{memPct}%</h2>
            <span className="gauge-sub">
              {sysInfo ? `${formatBytes(sysInfo.memUsed)} / ${formatBytes(sysInfo.memTotal)}` : 'Loading...'}
            </span>
          </div>

          <div className="progress-bar-bg">
            <div className="progress-bar-fill ram" style={{ width: `${memPct}%` }} />
          </div>

          <button 
            className="btn btn-primary quick-purge-btn"
            onClick={handleQuickPurgeRAM}
            disabled={purging}
          >
            <Zap size={13} />
            <span>{purging ? 'Purging...' : 'Purge RAM'}</span>
          </button>
        </div>

        {/* Disk Card */}
        <div className="gauge-card glass-card">
          <div className="gauge-header">
            <HardDrive size={14} className="card-icon disk" />
            <span className="card-title">DISK VOLUMES</span>
          </div>

          <div className="gauge-body">
            <h2 className="gauge-number">{diskPct}%</h2>
            <span className="gauge-sub">
              {sysInfo ? `${formatBytes(sysInfo.diskUsed)} / ${formatBytes(sysInfo.diskTotal)}` : 'Loading...'}
            </span>
          </div>

          <div className="progress-bar-bg">
            <div className="progress-bar-fill disk" style={{ width: `${diskPct}%` }} />
          </div>

          <div className="disk-status-tag">
            <CheckCircle2 size={12} color="var(--accent-emerald)" />
            <span>Volume Healthy</span>
          </div>
        </div>
      </div>

      {/* CPU Hardware Chip */}
      <div className="cpu-hardware-card glass-card">
        <div className="cpu-card-left">
          <Activity size={16} color="var(--accent-cyan)" />
          <div className="cpu-card-text">
            <span className="cpu-label">HOST LOGIC</span>
            <span className="cpu-model">{sysInfo ? sysInfo.cpuModel : 'Apple Silicon Processor'}</span>
          </div>
        </div>
        <span className="kernel-tag">KERNEL ACTIVE</span>
      </div>

      {/* Status Output Notice */}
      {purgeStatus && (
        <div className="purge-notice">
          <span>{purgeStatus}</span>
        </div>
      )}

      {/* Footer Controls */}
      <div className="popover-footer">
        <button 
          className="btn btn-outline footer-btn"
          onClick={handleOpenMainWindow}
        >
          <AppWindow size={14} />
          <span>Open CleanMyMacbook</span>
        </button>

        <button 
          className="btn-disable-tray"
          onClick={() => {
            if (window.electronAPI) window.electronAPI.toggleMenuBar(false);
          }}
          title="Turn off Menu Bar Icon"
        >
          <Power size={13} />
        </button>
      </div>

      <style>{`
        .popover-container {
          width: 330px;
          height: 420px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(14, 10, 24, 0.85);
          backdrop-filter: blur(50px) saturate(190%);
          -webkit-backdrop-filter: blur(50px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.2);
          overflow: hidden;
          margin: 0 auto;
        }

        .popover-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-light);
        }

        .brand-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .brand-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(255, 0, 127, 0.15);
          border: 1px solid rgba(255, 0, 127, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-name {
          font-size: 13px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .brand-badge {
          font-size: 9.5px;
          font-weight: 700;
          color: var(--accent-pink);
          background: rgba(255, 0, 127, 0.12);
          padding: 1px 6px;
          border-radius: 5px;
        }

        .btn-open-app {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-open-app:hover {
          background: rgba(255, 255, 255, 0.15);
          color: var(--text-primary);
        }

        .gauges-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .gauge-card {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .gauge-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .card-icon.ram { color: var(--accent-purple); }
        .card-icon.disk { color: var(--accent-pink); }

        .card-title {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .gauge-body {
          display: flex;
          flex-direction: column;
        }

        .gauge-number {
          font-size: 24px;
          font-weight: 850;
          font-family: var(--font-mono);
          color: var(--text-primary);
        }

        .gauge-sub {
          font-size: 10px;
          font-family: var(--font-mono);
          color: var(--text-muted);
        }

        .progress-bar-bg {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 99px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.5s ease;
        }

        .progress-bar-fill.ram { background: var(--accent-purple); }
        .progress-bar-fill.disk { background: var(--accent-pink); }

        .quick-purge-btn {
          width: 100%;
          padding: 6px 10px;
          font-size: 11px;
          border-radius: 8px;
        }

        .disk-status-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 8px;
          border-radius: 6px;
          background: rgba(16, 185, 129, 0.1);
          font-size: 10.5px;
          font-weight: 700;
          color: var(--accent-emerald);
        }

        .cpu-hardware-card {
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cpu-card-left {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }

        .cpu-card-text {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .cpu-label {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .cpu-model {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
        }

        .kernel-tag {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--accent-cyan);
          background: rgba(6, 182, 212, 0.12);
          padding: 3px 6px;
          border-radius: 5px;
          flex-shrink: 0;
        }

        .purge-notice {
          padding: 6px 10px;
          border-radius: 8px;
          background: rgba(255, 0, 127, 0.15);
          border: 1px solid rgba(255, 0, 127, 0.3);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          text-align: center;
        }

        .popover-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: auto;
        }

        .footer-btn {
          flex: 1;
          padding: 9px 14px;
          font-size: 12px;
          border-radius: 10px;
        }

        .btn-disable-tray {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: var(--accent-rose);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-disable-tray:hover {
          background: var(--accent-rose);
          color: white;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MenuBarPopover;
