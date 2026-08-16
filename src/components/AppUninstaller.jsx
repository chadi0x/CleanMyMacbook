import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trash2, Search, RefreshCw, AlertTriangle, Layers, 
  Folder, ShieldAlert, CheckSquare, Square, ChevronDown, ChevronUp 
} from 'lucide-react';
import ScanRing from './ScanRing.jsx';

const AppUninstaller = ({ formatBytes }) => {
  const [apps, setApps] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanLabel, setScanLabel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchApps = async () => {
    setScanning(true);
    setScanLabel('Scanning installed applications & residual folders...');
    setApps([]);
    if (window.electronAPI) {
      const res = await window.electronAPI.getApplications();
      setApps(res || []);
    }
    setScanning(false);
    setScanLabel('');
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const filteredApps = useMemo(() => {
    if (!searchTerm.trim()) return apps;
    const term = searchTerm.toLowerCase();
    return apps.filter(app => 
      app.name.toLowerCase().includes(term) ||
      app.path.toLowerCase().includes(term)
    );
  }, [apps, searchTerm]);

  const handleUninstall = async () => {
    if (!selectedApp) return;
    setScanning(true);
    setScanLabel(`Uninstalling ${selectedApp.name} & clearing residual files...`);

    if (window.electronAPI) {
      await window.electronAPI.uninstallApp(selectedApp);
    }

    setShowConfirmModal(false);
    setSelectedApp(null);
    await fetchApps();
  };

  return (
    <div className="uninstaller-viewport animate-slide-up">
      {/* Header */}
      <div className="uninstaller-header">
        <div>
          <h1 className="view-title">Smart App Uninstaller</h1>
          <p className="view-subtitle">
            Drag-and-drop to Trash leaves gigabytes of hidden residual files behind. Hunt down `.app` bundles and deep `~/Library` application support residue natively.
          </p>
        </div>

        <button className="btn-outline" onClick={fetchApps} disabled={scanning}>
          <RefreshCw size={15} className={scanning ? 'spin' : ''} />
          <span>Rescan Applications</span>
        </button>
      </div>

      {scanning ? (
        <div className="uninstaller-scanning-box">
          <ScanRing progress={0} scanning={true} label={scanLabel} />
        </div>
      ) : (
        <>
          {/* Search & Meta Bar */}
          <div className="uninstaller-controls">
            <div className="search-input-wrapper" style={{ maxWidth: '340px' }}>
              <Search size={15} />
              <input
                type="text"
                className="search-input"
                placeholder="Search installed applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="uninstaller-meta">
              <Layers size={14} color="var(--accent-pink)" />
              <span>{filteredApps.length} Applications Detected</span>
            </div>
          </div>

          {/* Applications Grid */}
          <div className="apps-grid-list">
            {filteredApps.map((appItem) => {
              const isSelected = selectedApp && selectedApp.id === appItem.id;

              return (
                <div 
                  key={appItem.id} 
                  className={`app-card glass-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedApp(appItem)}
                >
                  <div className="app-card-top">
                    <div className="app-icon-wrapper">
                      <Trash2 size={20} color="var(--accent-pink)" />
                    </div>

                    <div className="app-info">
                      <h3 className="app-name" title={appItem.name}>{appItem.name}</h3>
                      <span className="app-path" title={appItem.path}>{appItem.path}</span>
                    </div>

                    <span className="app-total-size">{formatBytes(appItem.totalSize)}</span>
                  </div>

                  {/* Leftover Breakdown */}
                  <div className="leftovers-breakdown">
                    <span className="leftovers-label">
                      RESIDUAL FILES ({appItem.leftovers.length} Items): {formatBytes(appItem.leftoverSize)}
                    </span>
                    {appItem.leftovers.length > 0 ? (
                      <div className="leftover-paths-list">
                        {appItem.leftovers.map((l, idx) => (
                          <div key={idx} className="leftover-path-item">
                            <span className="path-text" title={l.path}>{l.path}</span>
                            <span className="path-size">{formatBytes(l.size)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="no-leftovers">No extra library residue detected.</span>
                    )}
                  </div>

                  <div className="app-card-footer">
                    <button 
                      className="btn btn-danger uninstall-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApp(appItem);
                        setShowConfirmModal(true);
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Uninstall App & Clean Residue</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredApps.length === 0 && (
              <div className="empty-apps">
                <ShieldAlert size={36} color="var(--text-muted)" />
                <p>No applications found matching search criteria.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Uninstall Confirmation Modal */}
      {showConfirmModal && selectedApp && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-card glass-panel animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle size={36} color="var(--accent-rose)" className="confirm-icon" />
            <h2 className="confirm-title">Uninstall {selectedApp.name}?</h2>
            <p className="confirm-text">
              This action will completely remove the <strong>{selectedApp.name}.app</strong> bundle ({formatBytes(selectedApp.appSize)}) along with <strong>{selectedApp.leftovers.length} residual folders</strong> ({formatBytes(selectedApp.leftoverSize)}) from your Mac.
            </p>

            <div className="confirm-actions-row">
              <button className="btn btn-danger confirm-btn" onClick={handleUninstall}>
                <Trash2 size={16} />
                <span>Confirm Uninstall</span>
              </button>

              <button className="btn btn-outline cancel-btn" onClick={() => setShowConfirmModal(false)}>
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .uninstaller-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 18px;
          height: 100%;
          overflow: hidden;
        }

        .uninstaller-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .uninstaller-scanning-box {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .uninstaller-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .uninstaller-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .apps-grid-list {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 16px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .app-card {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          cursor: pointer;
        }

        .app-card.selected {
          border-color: rgba(255, 0, 127, 0.4);
          background: rgba(255, 0, 127, 0.04);
        }

        .app-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .app-icon-wrapper {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255, 0, 127, 0.12);
          border: 1px solid rgba(255, 0, 127, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .app-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .app-name {
          font-size: 15px;
          font-weight: 750;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .app-path {
          font-size: 11px;
          color: var(--text-muted);
          font-family: var(--font-mono);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .app-total-size {
          font-size: 13px;
          font-weight: 800;
          font-family: var(--font-mono);
          color: var(--accent-pink);
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(255, 0, 127, 0.12);
          border: 1px solid rgba(255, 0, 127, 0.25);
          flex-shrink: 0;
        }

        .leftovers-breakdown {
          padding: 10px;
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .leftovers-label {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .leftover-paths-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-height: 80px;
          overflow-y: auto;
        }

        .leftover-path-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 10.5px;
          font-family: var(--font-mono);
          color: var(--text-secondary);
        }

        .path-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 260px;
        }

        .path-size {
          color: var(--text-muted);
        }

        .no-leftovers {
          font-size: 11px;
          color: var(--text-muted);
        }

        .app-card-footer {
          display: flex;
          justify-content: flex-end;
        }

        .uninstall-btn {
          padding: 8px 16px;
          font-size: 12px;
          border-radius: 8px;
        }

        .empty-apps {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          color: var(--text-muted);
          gap: 12px;
        }

        .confirm-icon {
          margin-bottom: 12px;
        }

        .confirm-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .confirm-text {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 24px;
        }

        .confirm-actions-row {
          display: flex;
          gap: 12px;
          width: 100%;
        }

        .confirm-btn, .cancel-btn {
          flex: 1;
          padding: 12px;
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

export default AppUninstaller;
