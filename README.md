# ERP Lead Management Module

A professional React-based ERP Lead Management dashboard built for frontend assessment. Frontend-only with mock JSON data.

## Features

- **Dashboard** — Summary cards for Total, New, Contacted, Qualified, and Closed leads
- **Lead List** — Responsive table with 55 mock leads
- **Search** — Filter by name, mobile, or email (instant)
- **Filters** — Status, assigned employee, date range with reset
- **Pagination** — 10 / 25 / 50 records per page with Previous/Next
- **Lead Details Modal** — Full lead info with notes CRUD
- **Edit Lead Modal** — Form validation for name, email, and mobile
- **Loading, Empty & Error States**

## Tech Stack

- React 19 (Functional Components + Hooks)
- React Router v7
- Tailwind CSS v4
- Vite

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build for Production

```bash
npm run build
npm run preview
```

Deploy the `dist` folder to Vercel or Netlify.

## Project Structure

```
src/
├── components/
│   ├── common/       # Reusable UI (Modal, Button, Spinner, etc.)
│   ├── dashboard/    # Dashboard-specific components
│   └── leads/        # Lead table, filters, modals, notes
├── context/          # Global leads state
├── data/             # Mock JSON data
├── hooks/            # useLeads, useLeadFilters
├── layouts/          # Sidebar, Navbar, DashboardLayout
├── pages/            # Dashboard, Leads
├── services/         # Mock API service
└── utils/            # Validation, dates, stats
```
