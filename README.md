# SoniScribe

Welcome to the **SoniScribe**, a cutting-edge tool designed to streamline your audio transcription workflow. Leveraging modern web technologies, this application offers a seamless experience for uploading, playing, and annotating audio files with precision.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Scripts](#scripts)
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

Start Development Server

```bash
npm run dev
```

Build for Production

```bash
npm run build
```

Lint the Codebase

```bash
npm run lint
```

Preview the Production Build

```bash
npm run preview
```

## Project Structure

Here's a brief overview of the project's structure:

```file
transcription-app/
├── src/
│ ├── components/
│ ├── helpers/
│ ├── hooks/
│ ├── stores/
│ ├── App.css
│ ├── App.tsx
│ └── main.tsx
├── public/
│ └── index.html
├── eslint.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

- `components/`: Reusable UI components like AudioPlayer, FileDropArea, etc.
- `helpers/`: Utility functions for file handling and object manipulation.
- `hooks/`: Custom React hooks for enhanced functionality.
- `stores/`: State management using Zustand.
- `public/`: Static assets and the main `index.html` file.
