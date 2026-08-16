import React from 'react';
import { 
  Trash2, FolderSearch, FileArchive, ShieldCheck, Fingerprint, 
  Radio, Zap, Box, PackageOpen, Activity, Wrench, Code2, Coffee, AppWindow, HardDriveDownload 
} from 'lucide-react';

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const NAV_GROUPS = [
  {
    title: 'CLEANUP',
    items: [
      { id: 'System Junk', label: 'System Junk', icon: Trash2, shortcut: '⌘1' },
      { id: 'Large & Old', label: 'Large & Old Files', icon: FolderSearch, shortcut: '⌘2' },
      { id: 'Residual Installers', label: 'Residual Installers', icon: FileArchive, shortcut: '⌘3' },
      { id: 'App Uninstaller', label: 'App Uninstaller', icon: AppWindow },
    ]
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { id: 'Privacy', label: 'Privacy', icon: ShieldCheck, shortcut: '⌘4' },
      { id: 'App Signatures', label: 'App Signatures', icon: Fingerprint, shortcut: '⌘5' },
      { id: 'Network Ports', label: 'Network Ports', icon: Radio, shortcut: '⌘6' },
      { id: 'Startup Daemons', label: 'Startup Daemons', icon: Zap, shortcut: '⌘7' },
    ]
  },
  {
    title: 'PACKAGES & DEV',
    items: [
      { id: 'Brew Packages', label: 'Brew Packages', icon: Box, shortcut: '⌘8' },
      { id: 'Python Pip', label: 'Python Pip', icon: PackageOpen, shortcut: '⌘9' },
      { id: 'Dev Caches', label: 'Dev Cache Purger', icon: Code2 },
    ]
  },
  {
    title: 'CORE ROOT',
    items: [
      { id: 'Optimization', label: 'Optimization', icon: Activity },
      { id: 'Maintenance', label: 'Maintenance', icon: Wrench },
      { id: 'Menu Bar Extra', label: 'Menu Bar Extra', icon: HardDriveDownload },
    ]
  }
];

const Sidebar = ({ activeTab, setActiveTab, onOpenLink, itemCounts }) => {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-scrollable">
        {NAV_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} className="nav-group">
            <h3 className="nav-group-title">{group.title}</h3>
            <div className="nav-items">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const count = itemCounts ? itemCounts[item.id] : null;

                return (
                  <button
                    key={item.id}
                    className={`nav-button ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    {isActive && <div className="active-pill-glow" />}
                    <Icon size={16} className="nav-icon" />
                    <span className="nav-label">{item.label}</span>

                    {count > 0 && (
                      <span className="nav-badge">{count}</span>
                    )}

                    {item.shortcut && (
                      <span className="nav-shortcut">{item.shortcut}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Developer Footer */}
      <div className="sidebar-footer">
        <div className="dev-branding">
          <div className="dev-avatar">
            <Code2 size={14} color="#FF007F" />
          </div>
          <div className="dev-info">
            <span className="dev-author">Chadi0x</span>
            <span className="dev-role">System Architect</span>
          </div>
        </div>

        <div className="dev-actions">
          <button 
            className="sidebar-social-btn" 
            title="GitHub Repository"
            onClick={() => onOpenLink('https://github.com/chadi0x')}
          >
            <GithubIcon />
          </button>
          <button 
            className="sidebar-social-btn kofi" 
            title="Support on Ko-Fi"
            onClick={() => onOpenLink('https://ko-fi.com/chadi0x')}
          >
            <Coffee size={13} />
          </button>
        </div>
      </div>

      <style>{`
        .sidebar-container {
          width: 250px;
          flex-shrink: 0;
          height: 100%;
          background: var(--glass-sidebar);
          backdrop-filter: blur(50px);
          -webkit-backdrop-filter: blur(50px);
          border-right: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          z-index: 10;
        }

        .sidebar-scrollable {
          flex: 1;
          overflow-y: auto;
          padding: 14px 10px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .nav-group {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .nav-group-title {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          padding: 0 10px;
          margin-bottom: 3px;
        }

        .nav-items {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 550;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          width: 100%;
          text-align: left;
          outline: none;
        }

        .nav-button:hover:not(.active) {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.04);
          transform: translateX(3px);
        }

        .nav-button.active {
          color: #ffffff;
          background: var(--accent-gradient);
          box-shadow: var(--shadow-button);
          font-weight: 650;
        }

        .active-pill-glow {
          position: absolute;
          inset: 0;
          border-radius: 10px;
          background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.3), transparent 70%);
          pointer-events: none;
        }

        .nav-icon {
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .nav-button.active .nav-icon {
          transform: scale(1.1);
        }

        .nav-label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nav-badge {
          font-size: 10px;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          font-family: var(--font-mono);
        }

        .nav-shortcut {
          font-size: 9px;
          font-family: var(--font-mono);
          color: rgba(255, 255, 255, 0.4);
          opacity: 0.7;
        }

        .nav-button.active .nav-shortcut {
          color: rgba(255, 255, 255, 0.7);
        }

        .sidebar-footer {
          padding: 12px 14px;
          border-top: 1px solid var(--border-light);
          background: rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dev-branding {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .dev-avatar {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(255, 0, 127, 0.12);
          border: 1px solid rgba(255, 0, 127, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dev-info {
          display: flex;
          flex-direction: column;
        }

        .dev-author {
          font-size: 12px;
          font-weight: 750;
          color: var(--text-primary);
        }

        .dev-role {
          font-size: 9.5px;
          color: var(--text-muted);
        }

        .dev-actions {
          display: flex;
          gap: 6px;
        }

        .sidebar-social-btn {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar-social-btn:hover {
          background: var(--accent-pink);
          border-color: var(--accent-pink);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: var(--pink-glow);
        }

        .sidebar-social-btn.kofi:hover {
          background: #00b9fe;
          border-color: #00b9fe;
          box-shadow: 0 0 15px rgba(0, 185, 254, 0.5);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
