# Admin Page Route Reference

This file documents the admin APIs available for building the JUTC admin dashboard.

## Base Setup

- Base URL: `/api/admin`
- Auth header: `x-admin-token: <ADMIN_TOKEN>`
- Content type for write requests: `application/json`
- Public auth routes for app and driver login live under `/api/auth`
- Paginated responses use:

```json
{
  "success": true,
  "data": [],
  "total": 120,
  "page": 1,
  "limit": 20
}
```

- Non-paginated responses generally use:

```json
{
  "success": true,
  "data": {}
}
```

## Auth

### `POST /api/auth/signup`

App signup route. Any person created through this route becomes a `user`.

Required body:
- `email`
- `password`
- `full_name`

Optional body:
- `smart_card_num`

Example:

```json
{
  "email": "rider@example.com",
  "password": "secret123",
  "full_name": "Rider Brown"
}
```

Response includes:
- `role`
- `email`
- `user_id`
- `profile`

Use the returned `user_id` as the `x-user-id` header for existing user endpoints.

### `POST /api/auth/login`

Login route for both `user` and `driver` accounts.

Required body:
- `email`
- `password`

Example:

```json
{
  "email": "driver@example.com",
  "password": "reset123"
}
```

Response includes:
- `role`
- `email`
- `must_reset_password`
- `user_id`
- `driver_id`
- `profile`

### `POST /api/auth/change-password`

Change password for a `user` or `driver` account.

Required body:
- `email`
- `current_password`
- `new_password`

Example:

```json
{
  "email": "driver@example.com",
  "current_password": "reset123",
  "new_password": "newSecure123"
}
```

## Users

### `GET /api/admin/users`

List all users.

Query params:
- `page`
- `limit`

Example:

```http
GET /api/admin/users?page=1&limit=20
```

### `GET /api/admin/users/:userId`

Get a single user profile.

### `PATCH /api/admin/users/:userId`

Update a user.

Accepted body fields:
- `email`
- `full_name`
- `profile_url`
- `smart_card_cash`
- `smart_card_num`
- `fav_routes`

Example:

```json
{
  "full_name": "Alicia Brown",
  "smart_card_num": "JUTC-002918",
  "smart_card_cash": 1450
}
```

### `DELETE /api/admin/users/:userId`

Delete a user.

## Locations

### `GET /api/admin/locations`

List locations that can be used for `start_location_id`, `end_location_id`, and stop `location_id`.

Query params:
- `page`
- `limit`
- `search`

Example:

```http
GET /api/admin/locations?page=1&limit=20&search=downtown
```

### `POST /api/admin/locations`

Create a location.

Required body:
- `name`
- `lat`
- `long`

Optional body:
- `parish`

Example:

```json
{
  "name": "Half-Way Tree Transport Centre",
  "lat": 18.0123,
  "long": -76.7934,
  "parish": "Kingston"
}
```

### `PATCH /api/admin/locations/:locationId`

Update a location.

Accepted body fields:
- `name`
- `lat`
- `long`
- `parish`

### `DELETE /api/admin/locations/:locationId`

Delete a location.

## Routes

### `GET /api/admin/routes`

List routes for the admin dashboard.

Query params:
- `page`
- `limit`

Each route item includes:
- `start_location_id`
- `end_location_id`
- `start_location`
- `end_location`
- `display_name`

Example `display_name`:

```text
Half-Way Tree Transport Centre to Downtown Kingston
```

### `POST /api/admin/routes`

Create a route.

Required body:
- `route_code`
- `name`
- `start_location_id`
- `end_location_id`

Optional body:
- `is_active`

Example:

```json
{
  "route_code": "KN-01",
  "name": "Half-Way Tree to Downtown Kingston",
  "start_location_id": "660af0d0c102d88222f5d111",
  "end_location_id": "660af0d0c102d88222f5d222",
  "is_active": true
}
```

Create and update route responses also include:
- `start_location`
- `end_location`
- `display_name`

### `PATCH /api/admin/routes/:routeId`

Update a route.

Accepted body fields:
- `route_code`
- `name`
- `is_active`
- `start_location_id`
- `end_location_id`

### `DELETE /api/admin/routes/:routeId`

Delete a route and its stops.

## Route Stops

### `POST /api/admin/routes/:routeId/stops`

Add a stop to a route.

Required body:
- `location_id`
- `stop_order`

Optional body:
- `dwell_minutes`
- `is_pickup`
- `is_dropoff`

Example:

```json
{
  "location_id": "660af0d0c102d88222f5d333",
  "stop_order": 3,
  "dwell_minutes": 2,
  "is_pickup": true,
  "is_dropoff": false
}
```

### `PATCH /api/admin/routes/:routeId/stops/:stopId`

Update a stop.

Accepted body fields:
- `location_id`
- `stop_order`
- `dwell_minutes`
- `is_pickup`
- `is_dropoff`

### `DELETE /api/admin/routes/:routeId/stops/:stopId`

Remove a stop.

## Buses

### `GET /api/admin/buses`

List buses with route and assigned driver data populated through the route.

Query params:
- `page`
- `limit`

### `POST /api/admin/buses`

Register a bus.

Required body:
- `id`
- `current_lat`
- `current_long`
- `route`

Optional body:
- `bearing`

The `route` field can be:
- a `BusRoute` id
- or a route id returned from `GET /api/admin/routes`

Example:

```json
{
  "id": "BUS-104",
  "current_lat": 18.0179,
  "current_long": -76.8099,
  "bearing": 90,
  "route": "660af0d0c102d88222f5d444"
}
```

### `PATCH /api/admin/buses/:busId`

Update a bus.

Accepted body fields:
- `id`
- `current_lat`
- `current_long`
- `bearing`
- `route`

### `DELETE /api/admin/buses/:busId`

Delete a bus.

### `POST /api/admin/buses/:busId/assign-driver`

Assign a driver to the bus route used by that bus.

Required body:
- `driverId`

Example:

```json
{
  "driverId": "660af0d0c102d88222f5d555"
}
```

## Drivers

### `GET /api/admin/drivers`

List drivers.

Query params:
- `page`
- `limit`

### `POST /api/admin/drivers/invite`

Create a driver profile and login account from the admin website.

Required body:
- `email`
- `driver_first_name`

Optional body:
- `driver_last_name`
- `driver_age`
- `telephone`
- `telephone_number`
- `password`

If `password` is not provided, the API uses `DRIVER_INVITE_PASSWORD`, which defaults to `reset123`.

Example:

```json
{
  "email": "driver@example.com",
  "driver_first_name": "Marlon",
  "driver_last_name": "Smith",
  "telephone": "876-555-1234"
}
```

Response includes:
- `driver_id`
- `email`
- `role`
- `must_reset_password`
- `temporary_password`

## Transactions

### `GET /api/admin/transactions`

List transactions across all users.

Query params:
- `page`
- `limit`
- `status`
- `route`
- `from`
- `to`
- `startDate`
- `endDate`

Examples:

```http
GET /api/admin/transactions?page=1&limit=20&status=completed
```

```http
GET /api/admin/transactions?page=1&limit=50&from=2026-04-01&to=2026-04-30
```

### `GET /api/admin/transactions/:transactionId`

Get one transaction.

### `PATCH /api/admin/transactions/:transactionId`

Update a transaction.

Accepted body fields:
- `status`
- `receiver_id`
- `driver_id`

Example:

```json
{
  "status": "completed"
}
```

## Dashboard Stats

### `GET /api/admin/stats/overview`

Returns:
- `total_users`
- `active_buses`
- `daily_transactions`

### `GET /api/admin/stats/transactions`

Transaction chart data grouped by day.

Optional query params:
- `from`
- `to`
- `startDate`
- `endDate`

Response item shape:

```json
{
  "_id": "2026-04-01",
  "count": 24,
  "amount": 12850
}
```

### `GET /api/admin/stats/routes`

Ridership and amount totals grouped by route string.

Response item shape:

```json
{
  "_id": "Half-Way Tree",
  "rides": 81,
  "amount": 24300
}
```

## Suggested Admin Pages

- Dashboard
  Shows `stats/overview`, `stats/transactions`, and `stats/routes`
- Users
  Uses users list, user details, update, and delete
- Routes
  Uses route create, route update, delete, and stop management
- Fleet
  Uses buses list, create, update, delete, assign driver, and drivers list
- Transactions
  Uses transaction list, filters, detail view, and status updates

## Frontend Notes

- Keep the `x-admin-token` in a secure admin-only config flow
- For app login, use `/api/auth/signup` and `/api/auth/login`
- For existing user-protected endpoints, keep sending `x-user-id` with the `user_id` returned from auth
- For invited drivers, prompt them to change the default password after first login when `must_reset_password` is `true`
- Build paginated tables around `data`, `total`, `page`, and `limit`
- For forms, send only editable fields instead of full objects
- For `assign-driver`, the current backend assigns the driver to the related `BusRoute`, not directly to the `Bus`
