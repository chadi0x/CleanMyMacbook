import React, { useState, useMemo } from 'react';
import { 
  Trash2, AlertTriangle, Search, CheckSquare, Square, 
  FileText, Folder, FileArchive, ShieldAlert, Copy, Check 
} from 'lucide-react';

const ResultsTable = ({ 
  scanResults, 
  selectedItemIds, 
  onToggleSelection, 
  onCleanSystem,
  formatBytes 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!scanResults || !scanResults.items) return [];
    if (!searchTerm.trim()) return scanResults.items;
    const term = searchTerm.toLowerCase();
    return scanResults.items.filter(item => 
      item.name.toLowerCase().includes(term) || 
      item.path.toLowerCase().includes(term)
    );
  }, [scanResults, searchTerm]);

  // Calculate sizes
  const totalSelectedSize = useMemo(() => {
    if (!scanResults || !scanResults.items) return 0;
    return scanResults.items.reduce((acc, item) => 
      selectedItemIds.has(item.id) ? acc + item.size : acc, 0
    );
  }, [scanResults, selectedItemIds]);

  const allSelected = filteredItems.length > 0 && filteredItems.every(i => selectedItemIds.has(i.id));

  const handleToggleAll = () => {
    if (allSelected) {
      // Deselect all filtered items
      filteredItems.forEach(item => {
        if (selectedItemIds.has(item.id)) onToggleSelection(item.id);
      });
    } else {
      // Select all filtered items
      filteredItems.forEach(item => {
        if (!selectedItemIds.has(item.id)) onToggleSelection(item.id);
      });
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['dmg', 'pkg', 'iso'].includes(ext)) return <FileArchive size={16} className="file-type-icon dmg" />;
    if (['log', 'txt', 'crash'].includes(ext)) return <FileText size={16} className="file-type-icon log" />;
    return <Folder size={16} className="file-type-icon cache" />;
  };

  return (
    <div className="results-table-container animate-slide-up">
      {/* Search & Bulk Control Bar */}
      <div className="table-controls-bar">
        <div className="search-input-wrapper">
          <Search size={15} />
          <input
            type="text"
            className="search-input"
            placeholder="Filter target objects by name or path..."
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
            {selectedItemIds.size} of {scanResults.items.length} Selected
          </span>
        </div>
      </div>

      {/* File List */}
      <div className="file-rows-list">
        {filteredItems.map((item) => {
          const isSelected = selectedItemIds.has(item.id);
          const isCopied = copiedId === item.id;
          const fileName = item.name || item.path.split('/').pop();

          return (
            <div 
              key={item.id} 
              className={`file-row-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onToggleSelection(item.id)}
            >
              <div className="row-left" onClick={(e) => e.stopPropagation()}>
                <input 
                  type="checkbox" 
                  className="custom-checkbox" 
                  checked={isSelected} 
                  onChange={() => onToggleSelection(item.id)} 
                />
                {getFileIcon(fileName)}
                <div className="file-info-group">
                  <span className="file-name" title={fileName}>{fileName}</span>
                  <span className="file-path" title={item.path}>{item.path}</span>
                </div>
              </div>

              <div className="row-right" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="btn-copy-path" 
                  onClick={() => copyToClipboard(item.path, item.id)}
                  title="Copy Full File Path"
                >
                  {isCopied ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
                </button>
                <span className="file-size-badge">{formatBytes(item.size)}</span>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="empty-results">
            <ShieldAlert size={32} className="empty-icon" />
            <p className="empty-text">No target files found matching your search filter.</p>
          </div>
        )}
      </div>

      {/* Purge Footer Bar */}
      <div className="purge-footer-bar">
        <div className="purge-summary">
          <span className="purge-label">LIBERATABLE SPACE</span>
          <h2 className="purge-size-display">{formatBytes(totalSelectedSize)}</h2>
        </div>

        <button 
          className="btn btn-danger execute-purge-btn"
          disabled={selectedItemIds.size === 0}
          onClick={onCleanSystem}
        >
          <AlertTriangle size={18} />
          <span>Execute System Purge</span>
        </button>
      </div>

      <style>{`
        .results-table-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: 100%;
          overflow: hidden;
        }

        .table-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .bulk-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
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

        .file-rows-list {
          flex: 1;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 8px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: inset 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        .file-row-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid transparent;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .file-row-item:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .file-row-item.selected {
          background: rgba(255, 0, 127, 0.06);
          border-color: rgba(255, 0, 127, 0.2);
        }

        .row-left {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          overflow: hidden;
        }

        .file-type-icon.dmg { color: var(--accent-cyan); }
        .file-type-icon.log { color: var(--accent-amber); }
        .file-type-icon.cache { color: var(--accent-pink); }

        .file-info-group {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .file-name {
          font-size: 13.5px;
          font-weight: 650;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-path {
          font-size: 11px;
          color: var(--text-muted);
          font-family: var(--font-mono);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .row-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .btn-copy-path {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-copy-path:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        .file-size-badge {
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-mono);
          color: var(--text-primary);
          padding: 3px 8px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-light);
        }

        .empty-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: var(--text-muted);
          gap: 12px;
        }

        .empty-icon {
          opacity: 0.5;
        }

        .empty-text {
          font-size: 14px;
        }

        /* Purge Footer Bar */
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

        .execute-purge-btn {
          padding: 14px 28px;
        }

        .execute-purge-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          box-shadow: none !important;
          transform: none !important;
        }
      `}</style>
    </div>
  );
};

export default ResultsTable;
