<div align="center">
  <img src="public/icon.png" width="128" height="128" alt="CleanMyMacbook Icon" />
  <h1>CleanMyMacbook</h1>
  <p><b>A commercial-grade, deep macOS Sequoia system cleaner & security suite designed for advanced users.</b></p>
  
  <a href="https://github.com/chadi0x/CleanMyMacbook/releases/latest">
    <img src="https://img.shields.io/badge/Download_CleanMyMacbook-V1.0.0-blue?style=for-the-badge&logo=apple" alt="Download Release"/>
  </a>
  <br/><br/>

  <a href="https://ko-fi.com/chadi0x">
    <img src="https://storage.ko-fi.com/cdn/kofi2.png?v=3" height="40" alt="Support Me on Ko-fi">
  </a>
</div>

<br/>

## ⚡ Why CleanMyMacbook?

The traditional "macOS Maintenance" market is a monopoly. Corporate utility apps charge recurring $80/year subscriptions for software that performs basic system cleanups. That ends today.

**CleanMyMacbook** is a completely free, native-feeling macOS Sequoia optimization and security suite. Built with high-performance Electron, React 19, and Vite, it delivers advanced system auditing, developer cache purging, app uninstallation, process authority signatures, and live menu bar monitoring in an obsidian dark glassmorphism interface.

---

## ⚡ Apple Silicon (M1/M2/M3/M4) Support

Developing natively across architectures requires deep cross-compiling hardware that I simply don't have. I only use and test on Intel (x64) hardware natively.

Building, verifying, and packaging the **Apple Silicon (ARM64)** version of CleanMyMacbook organically required renting cloud computing infrastructure and architectural adjustments. If you are running a modern M-Series processor and want the 100% native, ultra-fast Silicon build of this application, you can purchase the proprietary **Silicon ARM `.dmg` version exclusively on my Ko-Fi Store below!**

<br/>
<div align="center">
  <a href="https://ko-fi.com/chadi0x">
    <img src="https://img.shields.io/badge/Get_Apple_Silicon_Version-Ko--Fi-FF5E5B?style=for-the-badge&logo=kofi" alt="Ko-fi ARM Version"/>
  </a>
</div>
<br/>

*The standard Intel (x64) build attached to the releases tab remains 100% free.*

---

## 🌟 The Features Competitors Won't Build

I didn't stop at emptying the trash. CleanMyMacbook provides genuine system intelligence and power tools:

### 🧹 System Cleanup & Leftovers
- **Smart App Uninstaller**: Completely removes `.app` bundles alongside hidden `~/Library` application support, cache, preferences, and container residue.
- **System Junk**: Surgical targeting of system caches, log archives, and temp structures.
- **Large & Old Files**: Hunts massive abandoned files (>200MB) choking root volume storage.
- **Residual Installers**: Locates forgotten `.dmg`, `.pkg`, and `.iso` disk image payloads wasting drive space.

### ⚡ Developer & Power-User Cache Purger
- **Developer Cache Purger**: Reclaims tens of gigabytes from **Xcode** (`DerivedData`, device logs, archives, simulator runtimes), **Homebrew**, **CocoaPods**, **Cargo (Rust)**, **npm**, **Yarn**, and **Pip**.
- **Package Manager Auditing**: Homebrew formulae & Python Pip package inventory and version tracking.

### 🛡️ Security & Kernel Intelligence
- **App Signatures**: Deep Kernel `.app` Developer Authority verification mapping explicit origins, code signatures, and suspicion metrics via `codesign`.
- **Active Network Ports**: Exposed TCP/UDP listening services mapped natively to background daemons via `lsof`.
- **Startup Daemons**: Deep verification of background LaunchAgents and Plists configured to auto-execute on boot.
- **Privacy Cleaner**: Aggressively filters local browser caches and global `Saved Application State` files.

### 📊 Live macOS Menu Bar Extra & Health Monitor
- **Dynamic Telemetry Status**: Sits directly in the macOS top status bar displaying live `⚡ RAM X% | DISK Y%` with 3-second background polling.
- **Sequoia Glass Popover Sheet**: Interactive Control-Center style popover with live memory/disk gauges, CPU hardware details, and 1-click RAM Purge actions.

### ⌨️ Modern UX & Productivity
- **Command Palette (`⌘K`)**: Instant search and task launcher.
- **Hotkeys**: `⌘1`–`⌘9` tab navigation shortcuts and `Esc` dismiss handlers.
- **Obsidian Glass Design System**: Layered backdrop blur (`blur(45px)`), depth shadows, and electric pink/purple neon lighting.

---

## 📥 Installation

1. Download the `CleanMyMacbook-1.0.0-Intel.dmg` executable from the [Releases](https://github.com/chadi0x/CleanMyMacbook/releases/latest) tab.
2. Open it and drag the `CleanMyMacbook.app` into your `/Applications` folder.
3. *Note: If you receive a security prompt on your first launch, simply right-click the Application and select "Open" manually.*

> **Maximize Power**: Ensure you go to `System Settings > Privacy & Security > Full Disk Access` and explicitly grant CleanMyMacbook permissions to let it natively scan the entire system!

---

## 🛠️ Build & Developer Instructions

To run or build the project from source code:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/chadi0x/CleanMyMacbook.git
   cd CleanMyMacbook
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Development Mode**:
   ```bash
   npm run dev
   ```

4. **Build Production Release**:
   ```bash
   npm run build
   ```

---

## ❤️ Support The Project

Building software that directly challenges multi-million dollar corporate markets takes intense effort.

If this application saves your gigabytes, identifies an unwanted tracking app on your laptop, or you simply love that you don't have to pay a monthly subscription anymore, please consider supporting the development!

<a href="https://ko-fi.com/chadi0x">
  <img src="https://storage.ko-fi.com/cdn/kofi2.png?v=3" height="40" alt="Support Me on Ko-fi">
</a>

<br/><hr/>

<i>"Why pay rent on your own hardware?"</i> — **Chadi0x**
