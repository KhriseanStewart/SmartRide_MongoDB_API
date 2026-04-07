# Switch Prompt For A JUTC Admin Dashboard

Use this prompt in v0, Lovable, Bolt, Cursor, or any UI/code generator after switching into build mode.

```text
Build a production-quality admin dashboard for JUTC in Jamaica.

Context:
- JUTC is a public transportation system in Jamaica.
- This admin dashboard is for managing riders, routes, buses, drivers, transactions, and analytics.
- The backend API already exists and is exposed under /api/admin.
- Every request must include the x-admin-token header.
- Use Jamaican public transit context in the writing, labels, and visuals without making it feel gimmicky.

Design direction:
- Make it feel like a serious transport operations platform, not a generic SaaS template.
- Use a clean civic-transport visual language inspired by Kingston bus terminals, route signage, transit maps, ticketing systems, and road markings.
- Prioritize confidence, clarity, and operational visibility.
- Keep the UI polished, modern, and responsive on desktop and tablet.
- Avoid purple-heavy startup styling.
- Prefer a palette influenced by Jamaica and JUTC operations:
  - deep green
  - gold accents
  - dark asphalt charcoal
  - off-white / warm gray surfaces
  - signal colors for status: green active, amber warning, red issue
- Use clear hierarchy, strong tables, map-like route visuals, KPI cards, and chart panels.
- Add subtle motion for loading and page transitions, but keep it professional.

Information architecture:
- Create a left sidebar with:
  - Dashboard
  - Users
  - Routes
  - Fleet
  - Transactions
  - Analytics
  - Settings
- Add a top bar with:
  - page title
  - global search
  - date range filter where useful
  - admin profile menu

Core pages and API integration:

1. Dashboard
- Show KPI cards using GET /api/admin/stats/overview
- Show a transaction trend chart using GET /api/admin/stats/transactions
- Show route performance using GET /api/admin/stats/routes
- Include quick action buttons for:
  - Add Route
  - Register Bus
  - Review Transactions

2. Users
- Build a paginated users table from GET /api/admin/users?page=1&limit=20
- Add row click to open a user details drawer or page using GET /api/admin/users/:userId
- Add edit user form using PATCH /api/admin/users/:userId
- Add delete confirmation flow using DELETE /api/admin/users/:userId
- Editable fields:
  - email
  - full_name
  - profile_url
  - smart_card_cash
  - smart_card_num
  - fav_routes

3. Routes
- Build route creation flow using POST /api/admin/routes
- Build route update flow using PATCH /api/admin/routes/:routeId
- Build delete route flow using DELETE /api/admin/routes/:routeId
- Build stop management UI:
  - add stop with POST /api/admin/routes/:routeId/stops
  - edit stop with PATCH /api/admin/routes/:routeId/stops/:stopId
  - delete stop with DELETE /api/admin/routes/:routeId/stops/:stopId
- Present routes in a way that feels transit-native:
  - route badges
  - direction labels
  - stop sequence panels
  - active vs inactive states

4. Fleet
- Build a paginated buses table from GET /api/admin/buses
- Show route and assigned driver info in the table
- Add bus creation modal using POST /api/admin/buses
- Add bus editing with PATCH /api/admin/buses/:busId
- Add bus deletion with DELETE /api/admin/buses/:busId
- Add assign-driver flow using POST /api/admin/buses/:busId/assign-driver
- Load available drivers from GET /api/admin/drivers
- Make fleet views feel operational, like dispatch software

5. Transactions
- Build a paginated transaction table from GET /api/admin/transactions
- Support filters:
  - page
  - limit
  - status
  - route
  - from
  - to
- Add a transaction details view using GET /api/admin/transactions/:transactionId
- Add status update UI using PATCH /api/admin/transactions/:transactionId
- Show statuses clearly:
  - pending
  - completed
  - canceled

6. Analytics
- Reuse GET /api/admin/stats/transactions for time-series charts
- Reuse GET /api/admin/stats/routes for route performance tables and charts
- Add date filters and comparison cards

API requirements:
- Centralize API calls in a small client layer
- Attach x-admin-token to every /api/admin request
- Handle loading, empty, error, and retry states well
- Use optimistic UI only where safe
- Respect paginated response shape:
  - success
  - data
  - total
  - page
  - limit

UX requirements:
- Include confirmation dialogs for destructive actions
- Use drawers or modals for editing where it improves speed
- Keep tables fast and readable
- Use badges, chips, and status pills consistently
- Make the app feel trustworthy for daily transport operations staff
- Write clean helper text in Jamaican context where appropriate, but keep the tone professional

Technical requirements:
- Build with reusable components
- Separate layout, API, feature modules, and charts cleanly
- Use realistic mock data shape matching these APIs if a live backend is unavailable
- Generate all necessary pages, components, and sample state
- Ensure accessibility, keyboard support, and good responsive behavior

Important:
- Do not build a generic admin template.
- Make the dashboard feel like it belongs to JUTC and public transport operations in Jamaica.
- Use all listed API routes in meaningful ways across the interface.
```
