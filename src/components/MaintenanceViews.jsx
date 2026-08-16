import React from 'react';
import { 
  Activity, Wrench, Cpu, HardDrive, ShieldAlert, CheckCircle2, 
  Terminal, Lock, Zap, RefreshCw, Layers 
} from 'lucide-react';

const MaintenanceViews = ({ 
  activeTab, 
  sysInfo, 
  scanning, 
  scanLabel, 
  onRunMaintenanceTask,
  formatBytes 
}) => {
  const isOptimization = activeTab === 'Optimization';

  const diskPct = sysInfo ? Math.round((sysInfo.diskUsed / sysInfo.diskTotal) * 100) || 0 : 0;
  const memPct = sysInfo ? Math.round((sysInfo.memUsed / sysInfo.memTotal) * 100) || 0 : 0;

  return (
    <div className="maintenance-viewport animate-slide-up">
      {/* Header */}
      <div className="maint-header">
        <div>
          <h1 className="view-title">{activeTab}</h1>
          <p className="view-subtitle">
            {isOptimization 
              ? 'Execute native Administrator-tier scripts to liberate host system memory and reset OS cache state.' 
              : 'Force system structural commands rebuilding root databases directly via Apple system utilities.'
            }
          </p>
        </div>

        <div className="root-privilege-tag">
          <Lock size={13} color="var(--accent-amber)" />
          <span>Root Administrator Required</span>
        </div>
      </div>

      {/* Mac Hardware Telemetry Overview */}
      {sysInfo && (
        <div className="telemetry-grid">
          {/* Disk Card */}
          <div className="telemetry-card glass-card">
            <div className="card-header">
              <HardDrive size={22} className="card-icon disk" />
              <span className="card-title">HOST VOLUMES</span>
            </div>
            <div className="card-metric-group">
              <h2 className="card-big-metric">{diskPct}%</h2>
              <span className="card-sub-info">{formatBytes(sysInfo.diskUsed)} / {formatBytes(sysInfo.diskTotal)}</span>
            </div>
            <div className="card-bar-bg">
              <div className="card-bar-fill disk" style={{ width: `${diskPct}%` }} />
            </div>
          </div>

          {/* Memory Card */}
          <div className="telemetry-card glass-card">
            <div className="card-header">
              <Activity size={22} className="card-icon ram" />
              <span className="card-title">UNIFIED MEMORY</span>
            </div>
            <div className="card-metric-group">
              <h2 className="card-big-metric">{memPct}%</h2>
              <span className="card-sub-info">{formatBytes(sysInfo.memUsed)} / {formatBytes(sysInfo.memTotal)}</span>
            </div>
            <div className="card-bar-bg">
              <div className="card-bar-fill ram" style={{ width: `${memPct}%` }} />
            </div>
          </div>

          {/* CPU Card */}
          <div className="telemetry-card glass-card">
            <div className="card-header">
              <Cpu size={22} className="card-icon cpu" />
              <span className="card-title">HOST LOGIC</span>
            </div>
            <div className="card-metric-group">
              <h3 className="card-cpu-metric">{sysInfo.cpuModel}</h3>
              <span className="card-sub-info">Active Kernel Dispatcher</span>
            </div>
            <div className="card-bar-bg">
              <div className="card-bar-fill cpu" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}

      {/* Action Cards Grid */}
      <div className="action-cards-grid">
        {isOptimization ? (
          <>
            <div className="action-card glass-card">
              <div className="action-card-top">
                <div className="action-icon-box">
                  <Zap size={20} color="var(--accent-pink)" />
                </div>
                <div className="action-details">
                  <h3>Force Purge Inactive RAM</h3>
                  <p>Executes native macOS `purge` command to instantly liberate cached memory blocks allocated by terminated processes.</p>
                </div>
              </div>
              <button 
                className="btn btn-primary action-btn" 
                onClick={() => onRunMaintenanceTask('Force RAM Purge')}
                disabled={scanning}
              >
                {scanning ? <RefreshCw size={15} className="spin" /> : <Zap size={15} />}
                <span>Execute Purge RAM</span>
              </button>
            </div>

            <div className="action-card glass-card">
              <div className="action-card-top">
                <div className="action-icon-box cyan">
                  <RefreshCw size={20} color="var(--accent-cyan)" />
                </div>
                <div className="action-details">
                  <h3>Flush System DNS Cache</h3>
                  <p>Flushes local host `dscacheutil` and sends `HUP` signal to `mDNSResponder` daemon resolving stale domain sockets.</p>
                </div>
              </div>
              <button 
                className="btn btn-outline action-btn" 
                onClick={() => onRunMaintenanceTask('System DNS Flush')}
                disabled={scanning}
              >
                {scanning ? <RefreshCw size={15} className="spin" /> : <RefreshCw size={15} />}
                <span>Flush DNS Resolver</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="action-card glass-card">
              <div className="action-card-top">
                <div className="action-icon-box purple">
                  <Wrench size={20} color="var(--accent-purple)" />
                </div>
                <div className="action-details">
                  <h3>Rebuild Spotlight Search Index</h3>
                  <p>Triggers `mdutil -E /` to erase existing search index trees and forcefully initiate root index rebuilding.</p>
                </div>
              </div>
              <button 
                className="btn btn-primary action-btn" 
                onClick={() => onRunMaintenanceTask('Rebuild Spotlight Index')}
                disabled={scanning}
              >
                {scanning ? <RefreshCw size={15} className="spin" /> : <Wrench size={15} />}
                <span>Rebuild Spotlight DB</span>
              </button>
            </div>

            <div className="action-card glass-card">
              <div className="action-card-top">
                <div className="action-icon-box amber">
                  <Layers size={20} color="var(--accent-amber)" />
                </div>
                <div className="action-details">
                  <h3>Reconstruct Open-With Cache</h3>
                  <p>Invokes `lsregister` tool to reset LaunchServices associations and eliminate duplicated contextual menu handlers.</p>
                </div>
              </div>
              <button 
                className="btn btn-outline action-btn" 
                onClick={() => onRunMaintenanceTask('Clear Launch Services')}
                disabled={scanning}
              >
                {scanning ? <RefreshCw size={15} className="spin" /> : <Layers size={15} />}
                <span>Reset LaunchServices</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Output Console Banner */}
      {scanLabel && (
        <div className="console-status-banner">
          <Terminal size={18} className="console-icon" />
          <span className="console-text">{scanLabel}</span>
          {!scanning && <CheckCircle2 size={18} color="var(--accent-emerald)" />}
        </div>
      )}

      <style>{`
        .maintenance-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
          overflow-y: auto;
          padding-right: 4px;
        }

        .maint-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .root-privilege-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 99px;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.25);
          font-size: 12px;
          font-weight: 700;
          color: var(--accent-amber);
          flex-shrink: 0;
        }

        .telemetry-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .telemetry-card {
          padding: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 14px;
        }

        .telemetry-card .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .card-icon.disk { color: var(--accent-pink); }
        .card-icon.ram { color: var(--accent-purple); }
        .card-icon.cpu { color: var(--accent-cyan); }

        .card-title {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .card-metric-group {
          display: flex;
          flex-direction: column;
        }

        .card-big-metric {
          font-size: 32px;
          font-weight: 850;
          font-family: var(--font-mono);
          color: var(--text-primary);
        }

        .card-cpu-metric {
          font-size: 16px;
          font-weight: 750;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-sub-info {
          font-size: 11.5px;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .card-bar-bg {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 99px;
          overflow: hidden;
        }

        .card-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.6s ease;
        }

        .card-bar-fill.disk { background: var(--accent-gradient); }
        .card-bar-fill.ram { background: linear-gradient(90deg, #8b5cf6, #06b6d4); }
        .card-bar-fill.cpu { background: linear-gradient(90deg, #06b6d4, #10b981); }

        .action-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .action-card {
          padding: 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
        }

        .action-card-top {
          display: flex;
          gap: 16px;
        }

        .action-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 0, 127, 0.12);
          border: 1px solid rgba(255, 0, 127, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .action-icon-box.cyan {
          background: rgba(6, 182, 212, 0.12);
          border-color: rgba(6, 182, 212, 0.25);
        }

        .action-icon-box.purple {
          background: rgba(139, 92, 246, 0.12);
          border-color: rgba(139, 92, 246, 0.25);
        }

        .action-icon-box.amber {
          background: rgba(245, 158, 11, 0.12);
          border-color: rgba(245, 158, 11, 0.25);
        }

        .action-details h3 {
          font-size: 16px;
          font-weight: 750;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .action-details p {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .action-btn {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
        }

        .console-status-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid var(--border-light);
          color: var(--accent-pink);
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 600;
        }

        .console-text {
          flex: 1;
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

export default MaintenanceViews;
