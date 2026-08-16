import React, { useState, useEffect } from 'react';
import HeaderBar from './components/HeaderBar.jsx';
import Sidebar from './components/Sidebar.jsx';
import ScanRing from './components/ScanRing.jsx';
import ResultsTable from './components/ResultsTable.jsx';
import { 
  AppSignaturesView, 
  NetworkPortsView, 
  StartupDaemonsView 
} from './components/IntelligenceViews.jsx';
import PackageViews from './components/PackageViews.jsx';
import MaintenanceViews from './components/MaintenanceViews.jsx';
import WelcomeModal from './components/WelcomeModal.jsx';
import CommandPalette from './components/CommandPalette.jsx';

// NEW POWER FEATURES
import AppUninstaller from './components/AppUninstaller.jsx';
import DevCachePurger from './components/DevCachePurger.jsx';
import MenuBarSettings from './components/MenuBarSettings.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('System Junk');
  const [sysInfo, setSysInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // SHARED SCAN STATE
  const [scanning, setScanning] = useState(false);
  const [scanLabel, setScanLabel] = useState('');
  const [scanProgress, setScanProgress] = useState(0);

  // CORE SCANS & SELECTION
  const [scanResults, setScanResults] = useState(null);
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());

  // INTELLIGENCE & PACKAGE DATA OBJECTS
  const [packages, setPackages] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [networkPorts, setNetworkPorts] = useState([]);
  const [startupDaemons, setStartupDaemons] = useState([]);

  // System Telemetry polling
  useEffect(() => {
    const hasSeenModal = localStorage.getItem('seenSupportModal');
    if (!hasSeenModal) setShowModal(true);

    const fetchSysInfo = () => {
      if (window.electronAPI) {
        window.electronAPI.getSystemInfo().then(res => setSysInfo(res));
      }
    };

    fetchSysInfo();
    const infoInterval = setInterval(fetchSysInfo, 10000);
    return () => clearInterval(infoInterval);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }

      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '9') {
        const tabsMap = [
          'System Junk', 'Large & Old', 'Residual Installers', 
          'Privacy', 'App Signatures', 'Network Ports', 
          'Startup Daemons', 'Brew Packages', 'Python Pip'
        ];
        const tabIndex = parseInt(e.key, 10) - 1;
        if (tabsMap[tabIndex]) {
          e.preventDefault();
          setActiveTab(tabsMap[tabIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeWelcomeModal = () => {
    localStorage.setItem('seenSupportModal', 'true');
    setShowModal(false);
  };

  const supportDeveloper = () => {
    openLink('https://ko-fi.com/chadi0x');
    closeWelcomeModal();
  };

  const formatBytes = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const openLink = (url) => {
    if (window.electronAPI) window.electronAPI.openExternal(url);
  };

  // --- CORE SYSTEM SCANS ---
  const startScan = async (tabName) => {
    setScanning(true);
    setScanProgress(0);
    setScanResults(null);
    setSelectedItemIds(new Set());
    setScanLabel('Initiating Deep Core Crawl...');

    const interval = setInterval(() => setScanProgress(p => p < 92 ? p + 4 : 92), 120);
    let results = { size: 0, count: 0, items: [] };

    if (window.electronAPI && ['System Junk', 'Large & Old', 'Privacy', 'Residual Installers'].includes(tabName)) {
      setScanLabel(`Surgical Targeting ${tabName}...`);
      const targetMap = {
        'System Junk': 'system-junk',
        'Large & Old': 'large-old-files',
        'Privacy': 'privacy',
        'Residual Installers': 'residual-installers'
      };
      results = await window.electronAPI.scanSystem(targetMap[tabName]);
    }

    clearInterval(interval);
    setScanProgress(100);

    setTimeout(() => {
      setScanLabel('Scan Complete');
      setScanResults(results);
      setSelectedItemIds(new Set(results.items.map(i => i.id)));
      setScanning(false);
    }, 400);
  };

  const toggleSelection = (id) => {
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const cleanSystem = async () => {
    if (selectedItemIds.size === 0) return;
    const filesToDelete = scanResults.items.filter(i => selectedItemIds.has(i.id));
    setScanLabel('Executing System Purge...');
    setScanning(true);

    if (window.electronAPI) {
      await window.electronAPI.cleanItems(filesToDelete);
    }

    setScanning(false);
    setScanResults({ size: 0, count: 0, items: [] });
    setScanLabel('System Purged Clean');
  };

  const runMaintenanceTask = async (taskName) => {
    setScanning(true);
    setScanLabel('Requesting Root Administrator Privileges...');
    if (window.electronAPI) {
      const result = await window.electronAPI.executeMaintenance(taskName);
      setScanLabel(result.success ? 'System Command Executed Successfully' : 'Action Cancelled or Failed');
    }
    setScanning(false);
  };

  // --- INTELLIGENCE AUDITING ---
  const auditPackages = async (manager) => {
    setScanning(true);
    setPackages([]);
    setScanLabel(`Auditing installed ${manager} dependencies...`);
    if (window.electronAPI) {
      const res = await window.electronAPI.getPackages(manager);
      setPackages(res || []);
    }
    setScanning(false);
    setScanLabel('');
  };

  const auditSignatures = async () => {
    setScanning(true);
    setProcesses([]);
    setScanLabel('Running deep `codesign -dv` OS verifications on active daemons...');
    if (window.electronAPI) {
      const res = await window.electronAPI.getProcesses();
      setProcesses(res || []);
    }
    setScanning(false);
    setScanLabel('');
  };

  const auditNetwork = async () => {
    setScanning(true);
    setNetworkPorts([]);
    setScanLabel('Mapping Live TCP Socket bindings via `lsof`...');
    if (window.electronAPI) {
      const res = await window.electronAPI.getNetworkPorts();
      setNetworkPorts(res || []);
    }
    setScanning(false);
    setScanLabel('');
  };

  const auditStartup = async () => {
    setScanning(true);
    setStartupDaemons([]);
    setScanLabel('Analyzing active LaunchDaemon & LaunchAgent plists...');
    if (window.electronAPI) {
      const res = await window.electronAPI.getStartupDaemons();
      setStartupDaemons(res || []);
    }
    setScanning(false);
    setScanLabel('');
  };

  // Tab switch listener
  useEffect(() => {
    setScanResults(null);
    setPackages([]);
    setProcesses([]);
    setNetworkPorts([]);
    setStartupDaemons([]);
    setScanLabel('');

    if (activeTab === 'Brew Packages') auditPackages('brew');
    if (activeTab === 'Python Pip') auditPackages('pip');
    if (activeTab === 'App Signatures') auditSignatures();
    if (activeTab === 'Network Ports') auditNetwork();
    if (activeTab === 'Startup Daemons') auditStartup();
  }, [activeTab]);

  return (
    <div className="app-container">
      {/* Top Telemetry HeaderBar */}
      <HeaderBar 
        sysInfo={sysInfo} 
        activeTab={activeTab} 
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Split Body */}
      <div className="app-body">
        {/* Left Navigation Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenLink={openLink}
          itemCounts={{
            'System Junk': scanResults && activeTab === 'System Junk' ? scanResults.items.length : null,
            'Large & Old': scanResults && activeTab === 'Large & Old' ? scanResults.items.length : null,
            'Residual Installers': scanResults && activeTab === 'Residual Installers' ? scanResults.items.length : null,
            'Privacy': scanResults && activeTab === 'Privacy' ? scanResults.items.length : null,
            'Brew Packages': packages.length > 0 && activeTab === 'Brew Packages' ? packages.length : null,
            'Python Pip': packages.length > 0 && activeTab === 'Python Pip' ? packages.length : null,
          }}
        />

        {/* Right Viewport Workspace */}
        <main className="main-content">
          <div className="glass-panel">
            
            {/* FILE SCANNERS */}
            {['System Junk', 'Large & Old', 'Privacy', 'Residual Installers'].includes(activeTab) && (
              <div className="view-viewport animate-slide-up">
                <div style={{ textAlign: 'center' }}>
                  <h1 className="view-title" style={{ marginBottom: '4px' }}>{activeTab}</h1>
                  <p className="view-subtitle" style={{ margin: '0 auto 14px' }}>
                    {activeTab === 'System Junk' && 'Surgical targeting mapping known heavy macOS temp structures, caches, and system log archives.'}
                    {activeTab === 'Large & Old' && 'Hunts massive abandoned artifacts unconditionally choking root disk storage volume.'}
                    {activeTab === 'Residual Installers' && 'Explicitly hunts forgotten .dmg, .pkg, and .iso installer payloads wasting storage.'}
                    {activeTab === 'Privacy' && 'Aggressively filters local browser caches and global Saved Application State files.'}
                  </p>

                  {(!scanResults || scanning) && (
                    <ScanRing 
                      progress={scanProgress} 
                      scanning={scanning} 
                      label={scanLabel} 
                      onStartScan={() => startScan(activeTab)} 
                    />
                  )}
                </div>

                {/* Scan Results Viewport */}
                {scanResults && !scanning && (
                  <ResultsTable
                    scanResults={scanResults}
                    selectedItemIds={selectedItemIds}
                    onToggleSelection={toggleSelection}
                    onCleanSystem={cleanSystem}
                    formatBytes={formatBytes}
                  />
                )}
              </div>
            )}

            {/* FEATURE 1: SMART APP UNINSTALLER */}
            {activeTab === 'App Uninstaller' && (
              <div className="view-viewport">
                <AppUninstaller formatBytes={formatBytes} />
              </div>
            )}

            {/* PACKAGE MANAGERS */}
            {['Brew Packages', 'Python Pip'].includes(activeTab) && (
              <div className="view-viewport">
                <PackageViews
                  activeTab={activeTab}
                  packages={packages}
                  scanning={scanning}
                  scanLabel={scanLabel}
                  onAudit={auditPackages}
                />
              </div>
            )}

            {/* FEATURE 2: DEV CACHE PURGER */}
            {activeTab === 'Dev Caches' && (
              <div className="view-viewport">
                <DevCachePurger formatBytes={formatBytes} />
              </div>
            )}

            {/* INTELLIGENCE: APP SIGNATURES */}
            {activeTab === 'App Signatures' && (
              <div className="view-viewport">
                <AppSignaturesView
                  processes={processes}
                  scanning={scanning}
                  scanLabel={scanLabel}
                  onAudit={auditSignatures}
                />
              </div>
            )}

            {/* INTELLIGENCE: NETWORK PORTS */}
            {activeTab === 'Network Ports' && (
              <div className="view-viewport">
                <NetworkPortsView
                  networkPorts={networkPorts}
                  scanning={scanning}
                  scanLabel={scanLabel}
                  onAudit={auditNetwork}
                />
              </div>
            )}

            {/* INTELLIGENCE: STARTUP DAEMONS */}
            {activeTab === 'Startup Daemons' && (
              <div className="view-viewport">
                <StartupDaemonsView
                  startupDaemons={startupDaemons}
                  scanning={scanning}
                  scanLabel={scanLabel}
                  onAudit={auditStartup}
                />
              </div>
            )}

            {/* CORE ROOT: OPTIMIZATION & MAINTENANCE */}
            {['Optimization', 'Maintenance'].includes(activeTab) && (
              <div className="view-viewport">
                <MaintenanceViews
                  activeTab={activeTab}
                  sysInfo={sysInfo}
                  scanning={scanning}
                  scanLabel={scanLabel}
                  onRunMaintenanceTask={runMaintenanceTask}
                  formatBytes={formatBytes}
                />
              </div>
            )}

            {/* FEATURE 4: MENU BAR EXTRA SETTINGS */}
            {activeTab === 'Menu Bar Extra' && (
              <div className="view-viewport">
                <MenuBarSettings
                  sysInfo={sysInfo}
                  formatBytes={formatBytes}
                />
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Welcome & Support Modal */}
      {showModal && (
        <WelcomeModal
          onClose={closeWelcomeModal}
          onSupportDeveloper={supportDeveloper}
        />
      )}

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenLink={openLink}
      />
    </div>
  );
}

export default App;
