# Expense-Tracker

> A simple React & Vite app for uploading CSVs of your expenses and viewing monthly breakdowns.

## Features
- Drag-and-drop or browse for CSV upload
- Monthy spending summary table
- Aggregate stats: total expenses & average monthly spending

## Tech Stack
- **Frontend**: React + Vite
- **Styling**: CSS Custom Properies (MD-tokens)

## Project Structure
```text
expense-tracker/
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── src
│   ├── ExpenseTracker.css
│   ├── assets
│   ├── components
│   │   └── ExpenseTracker.jsx
│   ├── main.jsx
│   └── styles
│       ├── global.css
│       └── theme.css
├── vite.config.js
└── yarn.lock
```

## Getting Started
**Prerequisites**:
- `Node.js` (v16+)
- `npm` or `yarn`

### Install
```bash
npm install
# or
yarn install
```

### Run (dev)
```bash
npm run dev
# or
yarn dev
```
Open <http://localhost:5173> in your browser

### Build (prod)
```bash
npm run build
# or
yarn build
```
The static files will be generated in `dist/`
