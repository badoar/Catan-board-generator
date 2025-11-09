# Catan Board Generator

A React application built with TypeScript, TanStack Router, and Tailwind CSS, configured for deployment to GitHub Pages.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **TanStack Router** - Type-safe routing with hash-based history
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool and dev server
- **ESLint** - Code quality

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

## GitHub Pages Deployment

This project is configured to deploy to GitHub Pages automatically.

### Setup Instructions

1. Go to your repository settings on GitHub
2. Navigate to **Settings** > **Pages**
3. Under **Build and deployment**, select:
   - **Source**: GitHub Actions
4. Push to the `main` branch to trigger deployment

The site will be available at: `https://[username].github.io/Catan-board-generator/`

### Hash-based Routing

The application uses hash-based routing (e.g., `/#/about`) to work with GitHub Pages' static hosting limitations. This is configured in `src/main.tsx` using `createHashHistory()`.

## Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── src/
│   ├── routes/
│   │   ├── __root.tsx          # Root layout with navigation
│   │   ├── index.tsx           # Home page
│   │   └── about.tsx           # About page
│   ├── index.css               # Tailwind CSS imports
│   └── main.tsx                # App entry point
├── index.html
├── vite.config.ts              # Vite configuration with base URL
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── eslint.config.js            # ESLint configuration
```

## License

MIT
