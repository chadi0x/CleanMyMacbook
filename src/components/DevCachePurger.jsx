import React, { useState, useEffect, useMemo } from 'react';
import { 
  Code2, Trash2, Search, RefreshCw, CheckSquare, Square, 
  Terminal, ShieldAlert, Cpu, Layers, AlertTriangle 
} from 'lucide-react';
import ScanRing from './ScanRing.jsx';

const DevCachePurger = ({ formatBytes }) => {
  const [devCaches, setDevCaches] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanLabel, setScanLabel] = useState('');
  const [selectedPaths, setSelectedPaths] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchDevCaches = async () => {
    setScanning(true);
    setScanLabel('Searching for developer caches (Xcode, Docker, Node, Cargo, Homebrew)...');
    setDevCaches([]);
    setSelectedPaths(new Set());

    if (window.electronAPI) {
      const res = await window.electronAPI.getDevCaches();
      setDevCaches(res || []);
      // Default select all detected caches
      setSelectedPaths(new Set((res || []).map(c => c.path)));
    }

    setScanning(false);
    setScanLabel('');
  };

  useEffect(() => {
    fetchDevCaches();
  }, []);

  const filteredCaches = useMemo(() => {
    if (!searchTerm.trim()) return devCaches;
    const term = searchTerm.toLowerCase();
    return devCaches.filter(c => 
      c.name.toLowerCase().includes(term) ||
      c.type.toLowerCase().includes(term) ||
      c.path.toLowerCase().includes(term)
    );
  }, [devCaches, searchTerm]);

  const toggleSelection = (pathStr) => {
    setSelectedPaths(prev => {
      const next = new Set(prev);
      if (next.has(pathStr)) next.delete(pathStr); else next.add(pathStr);
      return next;
    });
  };

  const allSelected = filteredCaches.length > 0 && filteredCaches.every(c => selectedPaths.has(c.path));

  const handleToggleAll = () => {
    if (allSelected) {
      filteredCaches.forEach(c => {
        if (selectedPaths.has(c.path)) toggleSelection(c.path);
      });
    } else {
      filteredCaches.forEach(c => {
        if (!selectedPaths.has(c.path)) toggleSelection(c.path);
      });
    }
  };

  const totalSelectedSize = useMemo(() => {
    return devCaches.reduce((acc, c) => selectedPaths.has(c.path) ? acc + c.size : acc, 0);
  }, [devCaches, selectedPaths]);

  const handlePurge = async () => {
    if (selectedPaths.size === 0) return;
    setScanning(true);
    setScanLabel('Purging selected developer cache directories...');

    if (window.electronAPI) {
      await window.electronAPI.cleanDevCaches(Array.from(selectedPaths));
    }

    setShowConfirmModal(false);
    await fetchDevCaches();
  };

  return (
    <div className="dev-purger-viewport animate-slide-up">
      {/* Header */}
      <div className="dev-header">
        <div>
          <h1 className="view-title">Developer & Power-User Cache Purger</h1>
          <p className="view-subtitle">
            Hunts and liberates tens of gigabytes of hidden build artifacts, indexing caches, simulator runtimes, and package tarballs (Xcode, Homebrew, Cargo, Node, Pip).
          </p>
        </div>

        <button className="btn-outline" onClick={fetchDevCaches} disabled={scanning}>
          <RefreshCw size={15} className={scanning ? 'spin' : ''} />
          <span>Rescan Dev Caches</span>
        </button>
      </div>

      {scanning ? (
        <div className="dev-scanning-box">
          <ScanRing progress={0} scanning={true} label={scanLabel} />
        </div>
      ) : (
        <>
          {/* Controls Bar */}
          <div className="dev-controls-bar">
            <div className="search-input-wrapper" style={{ maxWidth: '340px' }}>
              <Search size={15} />
              <input
                type="text"
                className="search-input"
                placeholder="Filter dev caches by Xcode, Node, Brew..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bulk-actions">
              <button className="btn-select-all" onClick={handleToggleAll}>
                {allSelected ? <CheckSquare size={15} color="var(--accent-pink)" /> : <Square size={15} />}
                <span>{allSelected ? 'Deselect All' : 'Select All'}</span>
              </button>
              <span className="selection-count">
                {selectedPaths.size} of {devCaches.length} Selected
              </span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="dev-cards-grid">
            {filteredCaches.map((cache) => {
              const isSelected = selectedPaths.has(cache.path);

              return (
                <div 
                  key={cache.id}
                  className={`dev-card glass-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleSelection(cache.path)}
                >
                  <div className="card-top">
                    <div className="card-top-left" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox"
                        className="custom-checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(cache.path)}
                      />
                      <Code2 size={18} className="dev-type-icon" />
                      <h3 className="cache-name">{cache.name}</h3>
                    </div>

                    <span className="cache-type-tag">{cache.type}</span>
                  </div>

                  <p className="cache-desc">{cache.description}</p>
                  <span className="cache-path-pill" title={cache.path}>{cache.path}</span>

                  <div className="card-bottom">
                    <span className="cache-size-label">LIBERATABLE SIZE</span>
                    <span className="cache-size-value">{formatBytes(cache.size)}</span>
                  </div>
                </div>
              );
            })}

            {filteredCaches.length === 0 && (
              <div className="empty-dev">
                <ShieldAlert size={36} color="var(--accent-emerald)" />
                <p>No developer cache accumulation detected.</p>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="purge-footer-bar">
            <div className="purge-summary">
              <span className="purge-label">DEVELOPER SPACE TO LIBERATE</span>
              <h2 className="purge-size-display">{formatBytes(totalSelectedSize)}</h2>
            </div>

            <button 
              className="btn btn-primary purge-dev-btn"
              disabled={selectedPaths.size === 0}
              onClick={() => setShowConfirmModal(true)}
            >
              <Trash2 size={16} />
              <span>Purge Selected Dev Caches</span>
            </button>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-card glass-panel animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle size={36} color="var(--accent-pink)" className="confirm-icon" />
            <h2 className="confirm-title">Purge {formatBytes(totalSelectedSize)} Dev Caches?</h2>
            <p className="confirm-text">
              This will safely clear <strong>{selectedPaths.size} developer build cache directories</strong>. Xcode projects and package managers will recreate required dependencies automatically on next build.
            </p>

            <div className="confirm-actions-row">
              <button className="btn btn-primary confirm-btn" onClick={handlePurge}>
                <Trash2 size={16} />
                <span>Purge Caches Now</span>
              </button>

              <button className="btn btn-outline cancel-btn" onClick={() => setShowConfirmModal(false)}>
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .dev-purger-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: 100%;
          overflow: hidden;
        }

        .dev-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .dev-scanning-box {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dev-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .bulk-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-select-all {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-select-all:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
        }

        .selection-count {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .dev-cards-grid {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .dev-card {
          padding: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 12px;
          cursor: pointer;
        }

        .dev-card.selected {
          border-color: rgba(255, 0, 127, 0.4);
          background: rgba(255, 0, 127, 0.04);
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .card-top-left {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }

        .dev-type-icon {
          color: var(--accent-pink);
          flex-shrink: 0;
        }

        .cache-name {
          font-size: 15px;
          font-weight: 750;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cache-type-tag {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 2px 8px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
          flex-shrink: 0;
        }

        .cache-desc {
          font-size: 12.5px;
          color: var(--text-secondary);
          line-height: 1.45;
          margin: 0;
        }

        .cache-path-pill {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--text-muted);
          background: rgba(0, 0, 0, 0.35);
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid var(--border-light);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid var(--border-light);
        }

        .cache-size-label {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .cache-size-value {
          font-size: 16px;
          font-weight: 850;
          font-family: var(--font-mono);
          color: var(--accent-pink);
        }

        .empty-dev {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          color: var(--text-muted);
          gap: 12px;
        }

        .purge-footer-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-radius: 16px;
          background: rgba(18, 14, 28, 0.7);
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-card);
        }

        .purge-summary {
          display: flex;
          flex-direction: column;
        }

        .purge-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .purge-size-display {
          font-size: 26px;
          font-weight: 850;
          font-family: var(--font-mono);
          background: linear-gradient(135deg, #ffffff 0%, var(--accent-pink) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .purge-dev-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          box-shadow: none !important;
          transform: none !important;
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

export default DevCachePurger;
