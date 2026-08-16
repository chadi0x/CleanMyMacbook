import React, { useState, useEffect } from 'react';
import { 
  Search, Trash2, FolderSearch, FileArchive, ShieldCheck, Fingerprint, 
  Radio, Zap, Box, PackageOpen, Activity, Wrench, Coffee, ArrowRight, AppWindow, Code2, HardDriveDownload 
} from 'lucide-react';

const COMMAND_ITEMS = [
  { id: 'System Junk', title: 'System Junk Scanner', category: 'CLEANUP', icon: Trash2 },
  { id: 'Large & Old', title: 'Large & Old Files Hunter', category: 'CLEANUP', icon: FolderSearch },
  { id: 'Residual Installers', title: 'Residual Installers Finder', category: 'CLEANUP', icon: FileArchive },
  { id: 'App Uninstaller', title: 'Smart App Uninstaller & Leftovers', category: 'CLEANUP', icon: AppWindow },
  { id: 'Privacy', title: 'Browser & Cache Privacy Cleaner', category: 'INTELLIGENCE', icon: ShieldCheck },
  { id: 'App Signatures', title: 'App Signature Verification', category: 'INTELLIGENCE', icon: Fingerprint },
  { id: 'Network Ports', title: 'Active Network Socket Listeners', category: 'INTELLIGENCE', icon: Radio },
  { id: 'Startup Daemons', title: 'LaunchAgents & Daemons Scraper', category: 'INTELLIGENCE', icon: Zap },
  { id: 'Brew Packages', title: 'Homebrew Package Dependencies', category: 'PACKAGES', icon: Box },
  { id: 'Python Pip', title: 'Python Pip Package Manager', category: 'PACKAGES', icon: PackageOpen },
  { id: 'Dev Caches', title: 'Developer & Power-User Cache Purger', category: 'PACKAGES', icon: Code2 },
  { id: 'Optimization', title: 'RAM & Memory Optimization', category: 'CORE ROOT', icon: Activity },
  { id: 'Maintenance', title: 'Spotlight & LaunchServices Repair', category: 'CORE ROOT', icon: Wrench },
  { id: 'Menu Bar Extra', title: 'Live macOS Menu Bar Extra Settings', category: 'CORE ROOT', icon: HardDriveDownload },
  { id: 'action-kofi', title: 'Support Developer on Ko-Fi', category: 'ACTION', icon: Coffee }
];

const CommandPalette = ({ isOpen, onClose, onSelectTab, onOpenLink }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredItems = COMMAND_ITEMS.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleExecute(filteredItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  if (!isOpen) return null;

  const handleExecute = (item) => {
    if (item.id === 'action-kofi') {
      onOpenLink('https://ko-fi.com/chadi0x');
    } else {
      onSelectTab(item.id);
    }
    onClose();
  };

  return (
    <div className="command-overlay animate-fade-in" onClick={onClose}>
      <div className="command-card glass-panel animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="command-search-header">
          <Search size={18} className="command-search-icon" />
          <input
            type="text"
            className="command-search-input"
            placeholder="Type a module name or action (e.g. Xcode, Uninstaller, Menu Bar)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <kbd className="esc-key">ESC</kbd>
        </div>

        <div className="command-results-list">
          {filteredItems.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = idx === selectedIndex;

            return (
              <div 
                key={item.id}
                className={`command-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleExecute(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="command-item-left">
                  <Icon size={16} className="command-item-icon" />
                  <span className="command-item-title">{item.title}</span>
                </div>

                <div className="command-item-right">
                  <span className="command-category-pill">{item.category}</span>
                  {isSelected && <ArrowRight size={14} className="select-arrow" />}
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="empty-command-state">
              <span>No matching modules or actions found.</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .command-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          z-index: 99999;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 120px;
        }

        .command-card {
          width: 100%;
          max-width: 580px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.2);
        }

        .command-search-header {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-light);
          gap: 12px;
          background: rgba(0, 0, 0, 0.3);
        }

        .command-search-icon {
          color: var(--accent-pink);
        }

        .command-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 16px;
          font-weight: 550;
        }

        .command-search-input::placeholder {
          color: var(--text-muted);
        }

        .esc-key {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
        }

        .command-results-list {
          max-height: 360px;
          overflow-y: auto;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .command-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
          color: var(--text-secondary);
        }

        .command-item.selected {
          background: var(--accent-gradient);
          color: #ffffff;
          box-shadow: var(--shadow-button);
        }

        .command-item-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .command-item-icon {
          flex-shrink: 0;
        }

        .command-item-title {
          font-size: 14px;
          font-weight: 600;
        }

        .command-item-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .command-category-pill {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 2px 8px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: inherit;
        }

        .select-arrow {
          color: #ffffff;
        }

        .empty-command-state {
          padding: 40px 20px;
          text-align: center;
          color: var(--text-muted);
          font-size: 13.5px;
        }
      `}</style>
    </div>
  );
};

export default CommandPalette;
