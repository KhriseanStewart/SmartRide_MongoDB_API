# SmartRide Mongo API
Express + MongoDB backend scaffold for JUTC SmartRide with middleware/functions architecture and optional Cloudflare R2 profile-image uploads.

## Stack
- Node.js + Express
- MongoDB + Mongoose
- Zod request validation
- Cloudflare R2 (S3-compatible) for `user_profile` uploads

## Setup
1. Copy `.env.example` to `.env`
2. Fill in `MONGO_URI`
3. (Optional) configure R2 vars for image upload endpoint
4. Install and run:
```bash
npm install
npm run dev
```

## Main endpoints
- `GET /health`
- `POST /api/users` (upsert user)
- `GET /api/users/me` (`x-user-id` header)
- `POST /api/users/me/favorites`
- `DELETE /api/users/me/favorites/:routeId`
- `GET /api/users/me/favorites/live`
- `POST /api/users/me/profile-image` (multipart form field: `image`)
- `GET /api/routes`
- `GET /api/routes/:routeId/stops`
- `GET /api/routes/v2/live-eta`
- `GET /api/transactions`
- `POST /api/transactions`
- `POST /api/transactions/add`
- `GET /api/live/buses`
- `PATCH /api/live/buses/:id`
- `GET /api/live/bus-routes/markers`

## Notes for Flutter compatibility
- Keeps `assigned_driver.telephone` and `assigned_driver.telephone_number`.
- Returns `id` as an array of bus-position objects for live ETA payloads.
- Uses string user ids (`_id`) so they can match Supabase Auth ids directly.

---

## TODO — Admin Website Routes
> These endpoints need to be added to support the admin dashboard. Add them under `src/routes/admin.js` (or similar) and register with an `/api/admin` prefix.

### Users
- [ ] `GET /api/admin/users` — list all users (paginated)
- [ ] `GET /api/admin/users/:userId` — get a single user's full profile
- [ ] `PATCH /api/admin/users/:userId` — update user details (e.g. name, smart card)
- [ ] `DELETE /api/admin/users/:userId` — remove a user

### Routes & Stops
- [ ] `POST /api/admin/routes` — create a new bus route
- [ ] `PATCH /api/admin/routes/:routeId` — update route details (name, status, etc.)
- [ ] `DELETE /api/admin/routes/:routeId` — delete a route
- [ ] `POST /api/admin/routes/:routeId/stops` — add a stop to a route
- [ ] `PATCH /api/admin/routes/:routeId/stops/:stopId` — update a stop
- [ ] `DELETE /api/admin/routes/:routeId/stops/:stopId` — remove a stop

### Buses & Drivers
- [ ] `GET /api/admin/buses` — list all buses with assigned driver info
- [ ] `POST /api/admin/buses` — register a new bus
- [ ] `PATCH /api/admin/buses/:busId` — update bus details (plate, route assignment, etc.)
- [ ] `DELETE /api/admin/buses/:busId` — decommission a bus
- [ ] `POST /api/admin/buses/:busId/assign-driver` — assign a driver to a bus
- [ ] `GET /api/admin/drivers` — list all drivers

### Transactions
- [ ] `GET /api/admin/transactions` — list all transactions across all users (paginated, filterable by date/route/status)
- [ ] `GET /api/admin/transactions/:transactionId` — get a single transaction
- [ ] `PATCH /api/admin/transactions/:transactionId` — update transaction status

### Analytics / Dashboard
- [ ] `GET /api/admin/stats/overview` — total users, active buses, daily transactions count
- [ ] `GET /api/admin/stats/transactions` — transaction volume over time (for charts)
- [ ] `GET /api/admin/stats/routes` — ridership per route

### Notes for the admin routes
- Protect all `/api/admin/*` routes with an admin auth middleware (e.g. check a role claim or a separate admin token header).
- Pagination should follow a consistent shape: `{ data: [], total, page, limit }`.
- Filterable list endpoints should accept query params: `?page=1&limit=20&status=completed` etc.