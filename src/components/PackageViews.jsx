import React, { useState, useMemo } from 'react';
import { Box, PackageOpen, Search, RefreshCw, Layers } from 'lucide-react';
import ScanRing from './ScanRing.jsx';

const PackageViews = ({ activeTab, packages, scanning, scanLabel, onAudit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const isBrew = activeTab.includes('Brew');
  const ManagerIcon = isBrew ? Box : PackageOpen;

  const filteredPackages = useMemo(() => {
    if (!searchTerm.trim()) return packages;
    const term = searchTerm.toLowerCase();
    return packages.filter(pkg => 
      pkg.name.toLowerCase().includes(term) || 
      (pkg.version && pkg.version.toLowerCase().includes(term))
    );
  }, [packages, searchTerm]);

  return (
    <div className="package-viewport animate-slide-up">
      <div className="package-header">
        <div>
          <h1 className="view-title">{activeTab}</h1>
          <p className="view-subtitle">
            Mapping underlying software dependencies & version states inherently tied to the host architecture environment.
          </p>
        </div>

        <button 
          className="btn-outline"
          onClick={() => onAudit(isBrew ? 'brew' : 'pip')}
          disabled={scanning}
        >
          <RefreshCw size={15} className={scanning ? 'spin' : ''} />
          <span>Reload Repository</span>
        </button>
      </div>

      {scanning ? (
        <div className="package-scanning-box">
          <ScanRing progress={0} scanning={true} label={scanLabel} />
        </div>
      ) : (
        <>
          {/* Controls Bar */}
          <div className="package-controls-bar">
            <div className="search-input-wrapper" style={{ maxWidth: '340px' }}>
              <Search size={15} />
              <input
                type="text"
                className="search-input"
                placeholder={`Filter ${isBrew ? 'Homebrew' : 'Pip'} packages...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="package-count-badge">
              <Layers size={14} color="var(--accent-pink)" />
              <span>{filteredPackages.length} Packages Installed</span>
            </div>
          </div>

          {/* Package Grid */}
          <div className="package-grid-list">
            {filteredPackages.map((pkg, i) => (
              <div key={i} className="package-card glass-card">
                <div className="card-header">
                  <div className="pkg-icon-box">
                    <ManagerIcon size={18} color="var(--accent-pink)" />
                  </div>
                  <h3 className="pkg-name" title={pkg.name}>{pkg.name}</h3>
                </div>

                <div className="card-footer">
                  <span className="version-label">VERSION</span>
                  <span className="version-pill">{pkg.version || 'Latest'}</span>
                </div>
              </div>
            ))}

            {filteredPackages.length === 0 && (
              <div className="empty-packages">
                <ManagerIcon size={38} className="empty-icon" />
                <p>No active dependencies identified natively.</p>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        .package-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
          overflow: hidden;
        }

        .package-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .package-scanning-box {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .package-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .package-count-badge {
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

        .package-grid-list {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .package-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
        }

        .pkg-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(255, 0, 127, 0.12);
          border: 1px solid rgba(255, 0, 127, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pkg-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid var(--border-light);
        }

        .version-label {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .version-pill {
          font-family: var(--font-mono);
          font-size: 11.5px;
          font-weight: 600;
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.06);
          padding: 2px 8px;
          border-radius: 6px;
          border: 1px solid var(--border-light);
        }

        .empty-packages {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          color: var(--text-muted);
          gap: 12px;
        }

        .empty-icon {
          opacity: 0.4;
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

export default PackageViews;
