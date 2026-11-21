# Car Show 2027 — Registration Dashboard (Frontend)

React (Vite) + Bootstrap 5 dashboard for event staff. It shows KPI cards, and lets staff search, filter and page through registrations from the C# API.

## Run it

```bash
cd frontend-Palon
npm install
npm run dev          # opens http://localhost:5173
```

The port is fixed to **5173** because the backend's CORS policy only allows `http://localhost:5173`.

To run against the real API, start the backend first (from the repo root):

```bash
cd Backend_Lagadia
dotnet run --project Api      # http://localhost:5205  (Scalar docs at /scalar/v1)
```

## Sample data vs. the real API

All settings live in `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:5205   # where the C# API is running
VITE_USE_SAMPLE_DATA=false                # false = real API, true = local sample data
```

| I want to… | Do this |
|---|---|
| Use the **real API** | `VITE_USE_SAMPLE_DATA=false`, then restart `npm run dev` |
| Use **sample data** (no backend needed) | `VITE_USE_SAMPLE_DATA=true`, then restart `npm run dev` |

An orange **"Using sample data"** badge appears in the header while sample mode is on.

How it works: `src/api/registrationsApi.js` (real `fetch` calls) and `src/api/sample-data.js` (28 in-browser registrations) export the **same functions with the same return shapes** (`getRegistrations`, `getSummary`, `getRegistrationById`, `createRegistration`). `src/api/index.js` picks one, and the rest of the app only imports from `src/api/index.js`. You can also switch by hand by changing the two import lines in `src/api/index.js`.

## Project structure

```
src/
├── api/
│   ├── ApiError.js            # one error type (status + per-field messages) for both modes
│   ├── registrationsApi.js    # real fetch calls to the C# API
│   ├── sample-data.js         # same functions, running on local sample data
│   └── index.js               # picks real API or sample data
├── hooks/useDebounce.js       # waits until the user stops typing (400 ms)
├── utils/format.js            # ₱ currency, dates, labels
├── components/
│   ├── KpiCard.jsx / KpiCards.jsx
│   ├── RegistrationFilters.jsx
│   ├── RegistrationTable.jsx  # also renders skeleton rows while loading
│   ├── Pagination.jsx
│   ├── StatusBadge.jsx / PaymentBadge.jsx
│   ├── StateMessages.jsx      # empty + error states
│   ├── Modal.jsx, RegistrationDetailsModal.jsx, NewRegistrationModal.jsx
├── pages/RegistrationsPage.jsx  # owns filter/page/data/loading/error state + layout
├── App.jsx, main.jsx, index.css
```

`RegistrationsPage` is the only component that holds state and talks to the API; the children receive values and callbacks as props.

## Features

- **KPI cards** (8) from `GET /api/registrations/summary`: total registrations, payments collected, uncollected, confirmed, checked in, pending, cancelled, collection rate.
- **Table** with registration no., date, participant (+ contact/email), car + plate, type, status badge, fee / paid (right-aligned ₱), payment badge.
- **Filters** sent to the API as query params: `participantName` (debounced 400 ms), `type`, `status`, plus **Clear filters**. Any filter change returns to page 1.
- **Paging**: Prev / Next, numbered buttons with the current page highlighted, "Showing x–y of N", page size 5 / 10 / 20, buttons disabled while loading and at the first/last page.
- **States**: skeleton rows + "Loading registrations…", empty state with *Clear filters*, error state with *Try again*.
- **Bonus**: New registration form (shows 400 validation errors and the 409 duplicate-plate error next to the right field), details modal (`GET /api/registrations/{id}`), skeleton loading.

## Things worth knowing (integration notes)

- Enum values are sent and received as strings: `Exhibitor | Competitor | VIP`, `Pending | Confirmed | CheckedIn | Cancelled`, `Unpaid | Partial | Paid`.
- Empty filters are **left out** of the query string (the API can't bind `status=` to an enum).
- The API caps `pageSize` at 50.
- SQLite returns dates without a trailing `Z`; `formatDate` adds it so the browser doesn't read UTC as local time.
- The backend's money totals ignore **Cancelled** registrations, so the KPI cards do too (they just display what the API returns).
