# Guacamole Wrapper v1.0.0

A native Windows desktop application that wraps Apache Guacamole in a standalone Electron-powered interface. Features include a configurable settings panel with persistent storage, hardware acceleration toggle, network priority mode to prevent throttling when minimized, and fullscreen support (F11). The app bundles a dedicated Chromium engine, eliminating browser dependency while providing a seamless remote desktop experience.

## Key Features

- **Configurable Server URL** - Easy URL validation and persistent settings
- **Hardware Acceleration Control** - Toggle GPU rendering for optimal performance
- **High-Performance Network Mode** - Prevents throttling when app is minimized
- **Fullscreen Toggle** - Press F11 for immersive remote desktop sessions
- **Modern Dark-Themed UI** - Clean, professional interface with glassmorphism effects
- **Windows Installer** - NSIS-based installer with auto-update support
- **Secure IPC Communication** - Context-isolated renderer processes for enhanced security

## Installation

Download `GuacamoleWrapperSetup.exe` from the releases page and run the installer.

## Usage

1. Launch the application
2. Press `Ctrl+,` to open Settings
3. Configure your Guacamole server URL
4. Adjust hardware acceleration and network priority as needed
5. Press `F11` for fullscreen mode

## System Requirements

- Windows 10 or later (x64)
- 4 GB RAM minimum
- 200 MB disk space

## Technical Details

- **Framework**: Electron v28
- **Storage**: electron-store for persistent configuration
- **Packaging**: electron-winstaller (Squirrel.Windows)
- **Architecture**: Secure IPC with context isolation

## License

MIT License
