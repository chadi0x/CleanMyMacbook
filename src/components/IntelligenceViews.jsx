import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, AlertTriangle, Fingerprint, Radio, Zap, 
  Search, CheckCircle2, ShieldAlert, Cpu, Terminal, RefreshCw 
} from 'lucide-react';
import ScanRing from './ScanRing.jsx';

export const AppSignaturesView = ({ processes, scanning, scanLabel, onAudit }) => {
  const [filter, setFilter] = useState('all'); // all, suspicious, verified
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProcesses = useMemo(() => {
    return processes.filter(proc => {
      const matchSearch = proc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          proc.authority.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;
      if (filter === 'suspicious') return proc.score >= 50;
      if (filter === 'verified') return proc.score <= 15;
      return true;
    });
  }, [processes, searchTerm, filter]);

  return (
    <div className="intelligence-viewport animate-slide-up">
      <div className="intel-header">
        <div>
          <h1 className="view-title">App Signatures</h1>
          <p className="view-subtitle">
            Deep Kernel `.app` Developer Authority verification mapping explicit origins, code signatures, and suspicion metrics natively via `codesign`.
          </p>
        </div>

        <button className="btn-outline" onClick={onAudit} disabled={scanning}>
          <RefreshCw size={15} className={scanning ? 'spin' : ''} />
          <span>Re-Audit Signatures</span>
        </button>
      </div>

      {scanning ? (
        <div className="intel-scanning-box">
          <ScanRing progress={0} scanning={true} label={scanLabel} />
        </div>
      ) : (
        <>
          {/* Filter Bar */}
          <div className="intel-filter-bar">
            <div className="search-input-wrapper" style={{ maxWidth: '320px' }}>
              <Search size={15} />
              <input
                type="text"
                className="search-input"
                placeholder="Search app or developer authority..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-pill-group">
              <button 
                className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({processes.length})
              </button>
              <button 
                className={`filter-pill suspicious ${filter === 'suspicious' ? 'active' : ''}`}
                onClick={() => setFilter('suspicious')}
              >
                High Risk ({processes.filter(p => p.score >= 50).length})
              </button>
              <button 
                className={`filter-pill verified ${filter === 'verified' ? 'active' : ''}`}
                onClick={() => setFilter('verified')}
              >
                Apple Verified ({processes.filter(p => p.score <= 15).length})
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="intel-cards-grid">
            {filteredProcesses.map((proc, i) => {
              const isDanger = proc.score >= 80;
              const isWarning = proc.score >= 50 && proc.score < 80;
              const isVerified = proc.score <= 15;

              return (
                <div key={i} className={`intel-card glass-card ${isDanger ? 'border-danger' : isWarning ? 'border-warning' : ''}`}>
                  <div className="card-top">
                    <div className="process-title-group">
                      <Fingerprint size={18} className={`proc-icon ${isDanger ? 'danger' : isVerified ? 'verified' : 'warning'}`} />
                      <b className="process-name" title={proc.name}>{proc.name}</b>
                    </div>
                    <span className={`badge ${isDanger ? 'badge-danger' : isVerified ? 'badge-verified' : 'badge-warning'}`}>
                      {proc.score}% SUS
                    </span>
                  </div>

                  <div className="card-meta">
                    <span>PID: <strong className="mono-text">{proc.pid}</strong></span>
                    <span>Status: <strong>{proc.signature}</strong></span>
                  </div>

                  <div className="authority-box">
                    <span className="auth-label">AUTHORITY ROOT</span>
                    <span className="auth-value" title={proc.authority}>{proc.authority}</span>
                  </div>

                  <div className="suspicion-track">
                    <div 
                      className={`suspicion-fill ${isDanger ? 'danger' : isVerified ? 'verified' : 'warning'}`}
                      style={{ width: `${proc.score}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {filteredProcesses.length === 0 && (
              <div className="empty-intel">
                <ShieldCheck size={36} color="var(--accent-emerald)" />
                <p>No active daemons matched your security filter criteria.</p>
              </div>
            )}
          </div>
        </>
      )}

      <style>{intelStyles}</style>
    </div>
  );
};

export const NetworkPortsView = ({ networkPorts, scanning, scanLabel, onAudit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPorts = useMemo(() => {
    return networkPorts.filter(net => 
      net.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
      net.port.includes(searchTerm) ||
      net.user.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [networkPorts, searchTerm]);

  return (
    <div className="intelligence-viewport animate-slide-up">
      <div className="intel-header">
        <div>
          <h1 className="view-title">Network Ports</h1>
          <p className="view-subtitle">
            Exposed TCP/UDP listening services mapped natively to underlying background daemons via `lsof`.
          </p>
        </div>

        <button className="btn-outline" onClick={onAudit} disabled={scanning}>
          <RefreshCw size={15} className={scanning ? 'spin' : ''} />
          <span>Rescan Listening Ports</span>
        </button>
      </div>

      {scanning ? (
        <div className="intel-scanning-box">
          <ScanRing progress={0} scanning={true} label={scanLabel} />
        </div>
      ) : (
        <>
          <div className="intel-filter-bar">
            <div className="search-input-wrapper" style={{ maxWidth: '320px' }}>
              <Search size={15} />
              <input
                type="text"
                className="search-input"
                placeholder="Search process, port or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span className="selection-count">{filteredPorts.length} Active Listeners</span>
          </div>

          <div className="intel-cards-grid">
            {filteredPorts.map((net, i) => {
              const isHighPort = net.score > 50;

              return (
                <div key={i} className={`intel-card glass-card ${isHighPort ? 'border-warning' : ''}`}>
                  <div className="card-top">
                    <div className="process-title-group">
                      <Radio size={18} className="proc-icon cyan" />
                      <b className="process-name">{net.command}</b>
                    </div>
                    <span className="badge badge-info">
                      PORT {net.port}
                    </span>
                  </div>

                  <div className="card-meta">
                    <span>User: <strong>{net.user}</strong></span>
                    <span>PID: <strong className="mono-text">{net.pid}</strong></span>
                  </div>

                  <div className="suspicion-track" style={{ marginTop: '14px' }}>
                    <div 
                      className={`suspicion-fill ${isHighPort ? 'warning' : 'verified'}`}
                      style={{ width: `${net.score}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {filteredPorts.length === 0 && (
              <div className="empty-intel">
                <ShieldCheck size={36} color="var(--accent-emerald)" />
                <p>No active network socket listeners detected.</p>
              </div>
            )}
          </div>
        </>
      )}

      <style>{intelStyles}</style>
    </div>
  );
};

export const StartupDaemonsView = ({ startupDaemons, scanning, scanLabel, onAudit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDaemons = useMemo(() => {
    return startupDaemons.filter(d => 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [startupDaemons, searchTerm]);

  return (
    <div className="intelligence-viewport animate-slide-up">
      <div className="intel-header">
        <div>
          <h1 className="view-title">Startup Daemons</h1>
          <p className="view-subtitle">
            Deep verification of background LaunchAgents and Plists configured to auto-execute on System Boot.
          </p>
        </div>

        <button className="btn-outline" onClick={onAudit} disabled={scanning}>
          <RefreshCw size={15} className={scanning ? 'spin' : ''} />
          <span>Rescan LaunchAgents</span>
        </button>
      </div>

      {scanning ? (
        <div className="intel-scanning-box">
          <ScanRing progress={0} scanning={true} label={scanLabel} />
        </div>
      ) : (
        <>
          <div className="intel-filter-bar">
            <div className="search-input-wrapper" style={{ maxWidth: '320px' }}>
              <Search size={15} />
              <input
                type="text"
                className="search-input"
                placeholder="Search daemon plist or directory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span className="selection-count">{filteredDaemons.length} Launch Items</span>
          </div>

          <div className="intel-cards-grid">
            {filteredDaemons.map((daemon, i) => {
              const isDanger = daemon.score > 70;

              return (
                <div key={i} className={`intel-card glass-card ${isDanger ? 'border-danger' : ''}`}>
                  <div className="card-top">
                    <div className="process-title-group">
                      <Zap size={18} className={`proc-icon ${isDanger ? 'danger' : 'purple'}`} />
                      <b className="process-name" title={daemon.name}>{daemon.name}</b>
                    </div>
                  </div>

                  <span className="daemon-location-pill" title={daemon.location}>{daemon.location}</span>

                  <div className="suspicion-track" style={{ marginTop: '14px' }}>
                    <div 
                      className={`suspicion-fill ${isDanger ? 'danger' : 'verified'}`}
                      style={{ width: `${daemon.score}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {filteredDaemons.length === 0 && (
              <div className="empty-intel">
                <ShieldCheck size={36} color="var(--accent-emerald)" />
                <p>No startup daemons found matching criteria.</p>
              </div>
            )}
          </div>
        </>
      )}

      <style>{intelStyles}</style>
    </div>
  );
};

const intelStyles = `
  .intelligence-viewport {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
    overflow: hidden;
  }

  .intel-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  }

  .intel-scanning-box {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .intel-filter-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .filter-pill-group {
    display: flex;
    gap: 6px;
  }

  .filter-pill {
    padding: 6px 14px;
    border-radius: 99px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border-light);
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-pill:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-primary);
  }

  .filter-pill.active {
    background: var(--accent-pink);
    border-color: var(--accent-pink);
    color: #fff;
    box-shadow: 0 4px 12px rgba(255, 0, 127, 0.4);
  }

  .intel-cards-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    overflow-y: auto;
    padding-right: 4px;
  }

  .intel-card {
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .intel-card.border-danger {
    border-color: rgba(239, 68, 68, 0.4);
  }

  .intel-card.border-warning {
    border-color: rgba(245, 158, 11, 0.4);
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .process-title-group {
    display: flex;
    align-items: center;
    gap: 10px;
    overflow: hidden;
  }

  .proc-icon.danger { color: var(--accent-rose); }
  .proc-icon.warning { color: var(--accent-amber); }
  .proc-icon.verified { color: var(--accent-emerald); }
  .proc-icon.cyan { color: var(--accent-cyan); }
  .proc-icon.purple { color: var(--accent-purple); }

  .process-name {
    font-size: 14.5px;
    font-weight: 700;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11.5px;
    color: var(--text-muted);
  }

  .authority-box {
    padding: 8px 10px;
    background: rgba(0, 0, 0, 0.35);
    border-radius: 8px;
    border: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .auth-label {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: var(--text-muted);
  }

  .auth-value {
    font-size: 11.5px;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .daemon-location-pill {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-secondary);
    background: rgba(0, 0, 0, 0.3);
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid var(--border-light);
    word-break: break-all;
  }

  .suspicion-track {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 99px;
    overflow: hidden;
  }

  .suspicion-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .suspicion-fill.danger { background: var(--accent-gradient-danger); }
  .suspicion-fill.warning { background: linear-gradient(90deg, #f59e0b, #ef4444); }
  .suspicion-fill.verified { background: var(--accent-gradient-success); }

  .empty-intel {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    color: var(--text-muted);
    gap: 12px;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
