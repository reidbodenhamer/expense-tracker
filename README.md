# Expense Tracker

> A full-stack application for uploading CSVs of your expenses and viewing monthly breakdowns.

## Features
- Drag-and-drop or browse for CSV upload
- Monthly spending summary table
- Aggregate stats: total expenses & average monthly spending

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express (planned)
- **Styling**: CSS Custom Properties (Material Design tokens)

## Project Structure
```text
expense-tracker/
├── client/                    # Frontend React application
│   ├── __tests__/            # Test files
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── styles/           # CSS styles
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions
│   │   ├── main.tsx          # App entry point
│   │   └── setupTests.js     # Test setup
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                    # Backend Express application (planned)
│   ├── src/
│   │   └── server.js
│   └── package.json
├── README.md
└── LICENSE.txt
```

## Getting Started

**Prerequisites**:
- Node.js (v16+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies** (when ready)
   ```bash
   cd ../server
   npm install
   ```

### Development

**Start the frontend development server:**
```bash
cd client
npm run dev
```

**Start the backend server:** (when implemented)
```bash
cd server
npm run dev
```

The frontend will be available at: http://localhost:5173

### Scripts

**Client (Frontend)**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Lint code

**Server (Backend)** - Coming soon
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm test` - Run tests
Open <http://localhost:5173> in your browser

### Build (prod)
```bash
npm run build
# or
yarn build
```
The static files will be generated in `dist/`
