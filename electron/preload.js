const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  scanSystem: (folderType) => ipcRenderer.invoke('scan-system', folderType),
  cleanItems: (items) => ipcRenderer.invoke('clean-items', items),
  executeMaintenance: (type) => ipcRenderer.invoke('execute-maintenance', type),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  getPackages: (manager) => ipcRenderer.invoke('get-packages', manager),
  getProcesses: () => ipcRenderer.invoke('get-processes'),
  getNetworkPorts: () => ipcRenderer.invoke('get-network-ports'),
  getStartupDaemons: () => ipcRenderer.invoke('get-startup-daemons'),
  
  // NEW FEATURES 1, 2, 4
  getApplications: () => ipcRenderer.invoke('get-applications'),
  uninstallApp: (appData) => ipcRenderer.invoke('uninstall-app', appData),
  getDevCaches: () => ipcRenderer.invoke('get-dev-caches'),
  cleanDevCaches: (cachePaths) => ipcRenderer.invoke('clean-dev-caches', cachePaths),
  toggleMenuBar: (enabled) => ipcRenderer.invoke('toggle-menu-bar', enabled),
  getMenuBarStatus: () => ipcRenderer.invoke('get-menu-bar-status'),
  showMainWindow: () => ipcRenderer.invoke('show-main-window')
});
