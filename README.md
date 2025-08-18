# SoniScribe

SoniScribe is a modern web-based audio transcription tool built with React, TypeScript, and advanced audio visualization libraries. The application enables users to upload, play, and annotate audio files with precision timing and waveform visualization.

[![CI](https://github.com/isfopo/SonicScribe/actions/workflows/ci.yml/badge.svg)](https://github.com/isfopo/SonicScribe/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/isfopo/SonicScribe/branch/main/graph/badge.svg)](https://codecov.io/gh/isfopo/SonicScribe)
[![Coverage Status](https://coveralls.io/repos/github/isfopo/SonicScribe/badge.svg?branch=main)](https://coveralls.io/github/isfopo/SonicScribe?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

- [SoniScribe](#soniscribe)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Scripts](#scripts)
    - [Start Development Server](#start-development-server)
    - [Start Https Tunnel](#start-https-tunnel)
    - [Build for Production](#build-for-production)
    - [Lint the Codebase](#lint-the-codebase)
    - [Preview the Production Build](#preview-the-production-build)
    - [Run Tests](#run-tests)
    - [Generate Coverage Report](#generate-coverage-report)
  - [Testing](#testing)
  - [Project Structure](#project-structure)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Version 16 or higher. [Download Node.js](https://nodejs.org/)
- **Git**: Installed on your machine. [Download Git](https://git-scm.com/)
- **Microsoft Dev Tunnels**: [Install Dev Tunnels](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/transcription-app.git
   cd transcription-app
   ```

2. Install Dependencies

   ```bash
   npm install
   ```

3. Start the Development Server

   ```bash
   npm run dev
   ```

4. Developing with HTTPS

- Usage of the File System API requires the app to be hosted on HTTPS. Go to [Microsoft Dev Tunnels](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started) to install Dev Tunnels on your machine. Then start the tunnel using:

  ```bash
  npm run tunnel
  ```

## Scripts

The project includes several npm scripts to streamline development and deployment:

### Start Development Server

```bash
npm run dev
```

### Start Https Tunnel

This script will start a https tunnel in order for the File System API to work locally.

```bash
npm run tunnel
```

### Build for Production

```bash
npm run build
```

### Lint the Codebase

```bash
npm run lint
```

### Preview the Production Build

```bash
npm run preview
```

### Run Tests

Run the test suite with Vitest:

```bash
npm test
```

Run tests in watch mode during development:

```bash
npm run test:watch
```

Open the interactive test UI:

```bash
npm run test:ui
```

### Generate Coverage Report

Generate a comprehensive test coverage report:

```bash
npm run test:coverage
```

### Serve Coverage Report Locally

View the detailed HTML coverage report in your browser:

```bash
npm run test:coverage:serve
```

This serves the coverage report at `http://localhost:8080` where you can:
- Browse file-by-file coverage details
- See highlighted uncovered lines
- Navigate through your codebase with coverage metrics
- View coverage statistics and charts

### Generate and Serve Coverage in One Command

Generate coverage and immediately serve it locally:

```bash
npm run test:coverage:open
```

## Testing

SonicScribe uses **Vitest + React Testing Library** for comprehensive testing:

- **Unit Tests**: Individual component and hook testing
- **Integration Tests**: Multi-component workflow testing  
- **Coverage Reports**: Detailed code coverage analysis
- **CI/CD Integration**: Automated testing in GitHub Actions

### Test Structure

```
src/
├── test/
│   ├── setup.ts              # Global test configuration
│   ├── utils.tsx              # Custom testing utilities
│   ├── integration/           # Integration tests
│   └── README.md              # Detailed testing docs
├── components/
│   └── **/*.test.tsx          # Component tests
└── hooks/
    └── **/*.test.tsx          # Hook tests
```

### Key Features

- **Audio-specific mocking**: AudioContext, MediaElement APIs
- **Browser API mocks**: matchMedia, ResizeObserver, IntersectionObserver  
- **Custom utilities**: Audio file creation, waveform simulation
- **Keyboard testing**: Comprehensive shortcut testing
- **Coverage thresholds**: Enforced quality standards

### Running Tests

```bash
# Run all tests once
npm test

# Watch mode for development  
npm run test:watch

# Interactive UI mode
npm run test:ui

# Coverage report
npm run test:coverage

# Serve coverage report locally at http://localhost:8080
npm run test:coverage:serve

# Generate and serve coverage in one command
npm run test:coverage:open
```

For detailed testing documentation, see [`src/test/README.md`](./src/test/README.md).

#### Waveform Audio Engine
•  Peaks.js Integration: Advanced waveform visualization with zoom, overview, and detailed views
•  Point & Segment Management: Create, edit, and manage audio markers and segments
•  Playback Controls: Full transport controls (play/pause, seek, speed adjustment)
•  Context Menus: Right-click functionality for audio elements
•  Keyboard Shortcuts: Comprehensive keyboard navigation and control

#### Project Management System
•  File System Integration: Direct browser-based file system access using modern APIs
•  Project Persistence: Save and load transcription projects with all annotations
•  Drag & Drop Interface: Intuitive file upload with validation and error handling
•  Project List Management: Multiple project handling with rename/delete functionality

#### Advanced UI Components
•  Modal System: Centralized dialog management with responsive design
•  Theme Support: Dynamic theme system with light/dark mode capabilities
•  Responsive Design: Mobile-friendly interface with touch support
•  Context Menus: Custom right-click menus for workflow efficiency

#### Transcription Workflow Features
•  Subdivision Controls: Configurable audio segment divisions (quarters, eighths, etc.)
•  Multi-tap Interface: Touch-friendly controls for mobile devices
•  Segment Annotation: Name and color-code audio segments
•  Point Navigation: Quick jumping between marked positions

🛠️ Technical Highlights

#### State Management
•  Zustand Stores: Lightweight state management for settings, dialogs, context menus, and segments
•  Persistent Storage: Local storage integration for user preferences
•  Context Management: Centralized state for complex UI interactions

#### Custom Hooks Architecture
•  usePeaks: Core audio waveform management
•  useProjects: Project file system operations
•  useKeyPress: Keyboard shortcut handling
•  useEventListener: Efficient event management with cleanup
•  useMediaQuery: Responsive design support

#### File System Integration
•  Modern File APIs: Utilizes cutting-edge browser file system access
•  HTTPS Requirement: Configured with dev tunnels for secure local development
•  Error Handling: Comprehensive file operation error management
