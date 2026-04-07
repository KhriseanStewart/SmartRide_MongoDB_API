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
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/change-password`
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

## Admin Website Routes

Admin dashboard endpoints are available under `/api/admin` and are protected with the `x-admin-token` header.
Driver invites are available through `POST /api/admin/drivers/invite`.
