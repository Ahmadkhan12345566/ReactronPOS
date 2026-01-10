# ReactronPOS

Modern point-of-sale system for retail management with inventory, sales, purchasing, and reporting.

## Features

- POS checkout workflow with cart, payment, and receipt support
- Product, category, brand, unit, supplier, and customer management
- Inventory tracking with variants and store-level quantities
- Sales, purchases, invoices, and return workflows
- Reporting with PDF/Excel exports
- Role-based access for admin and biller users

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Headless UI, Heroicons
- Backend: Node.js, Express, MongoDB (Mongoose)
- Utilities: jsPDF, SheetJS

## Getting Started

1) Install dependencies:

```bash
npm install
```

2) Configure environment variables (see below).

3) Run the app:

```bash
npm run dev
```

This runs both the backend and frontend workspaces.

### Optional: Seed data

```bash
npm run seed --workspace backend
```

## Environment Variables

Create `.env` files as needed:

### Backend (`backend/.env`)

```bash
MONGODB_URI=mongodb://localhost:27017/posb
JWT_SECRET=your-secret
CORS_ORIGIN=http://localhost:5173
PORT=3000
HOST=0.0.0.0
```

### Frontend (`frontend/.env`)

```bash
VITE_API_URL=http://localhost:3000
```

## Project Structure

```
backend/      # API, models, routes, database config
frontend/     # React app, components, pages, assets
seed.js       # root seed helper
```

## Scripts

- `npm run dev` - start backend + frontend
- `npm run build` - build frontend
- `npm run dist` - build frontend + package electron app
- `npm run start:electron` - run electron dev shell

## License

MIT
