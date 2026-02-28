# TribeX eSports — Backend API Reference

> **Base URL**: `http://localhost:5000/api/v1`
> Auth via **httpOnly cookies** (`accessToken` + `refreshToken`), set automatically on login/signup.

---

## Auth — `/api/v1/auth`

### `POST /signup`

| Field | Type | Rules |
|-------|------|-------|
| `email` | string | valid email |
| `username` | string | 3–24 chars, lowercase + numbers + `_` only |
| `password` | string | min 8 chars |

```json
// ✅ 201
{ "success": true, "message": "Signup successful" }

// ❌ 400
{ "success": false, "message": "email: Invalid email format" }
```

---

### `POST /login`

| Field | Type | Rules |
|-------|------|-------|
| `emailOrUsername` | string | required |
| `password` | string | required |

```json
// ✅ 200
{ "success": true, "message": "Login successful" }
```

---

### `POST /google`

| Field | Type | Rules |
|-------|------|-------|
| `idToken` | string | Google ID token from GIS |

```json
// ✅ 200
{ "success": true, "message": "Google login successful" }
```

---

### `GET /me` 🔒 requireAuth

```json
// ✅ 200
{
  "success": true,
  "data": {
    "user": {
      "_id": "67a...",
      "email": "john@example.com",
      "username": "john_doe",
      "role": "user",
      "userProfileImage": "https://api.dicebear.com/...",
      "createdAt": "2026-02-10T...",
      "updatedAt": "2026-02-10T..."
    }
  }
}

// ❌ 401
{ "success": false, "message": "Not authenticated" }
```

---

### `POST /logout`

```json
// ✅ 200 — clears httpOnly cookies
{ "success": true, "message": "Logged out" }
```

---

### `GET /verify-email?token=xxx&email=xxx`

```json
// ✅ 200
{ "success": true, "message": "Email verified", "data": { ... } }
```

---

## Tournaments — `/api/v1/tournaments`

### `GET /` — List tournaments (public)

| Query Param | Type | Rules |
|-------------|------|-------|
| `page` | number | optional, min 1 |
| `limit` | number | optional, 1–50 |
| `game` | string | optional (BGMI, FreeFire) |
| `status` | string | optional |
| `mode` | string | optional (solo, duo, squad) |
| `search` | string | optional |
| `isVisible` | "true"/"false" | optional |

```json
// ✅ 200
{
  "success": true,
  "data": [ { ...tournament }, { ...tournament } ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## User — `/api/v1/user` 🔒 All require auth

### `PATCH /profile` — Update username/email

| Field | Type | Rules |
|-------|------|-------|
| `username` | string | optional, 3–24 chars, lowercase + numbers + `_` |
| `email` | string | optional, valid email |

At least one field must be provided. Returns `409` if username/email is already taken.

```json
// ✅ 200
{ "success": true, "message": "Profile updated successfully" }
```

---

### `PATCH /password` — Change password

| Field | Type | Rules |
|-------|------|-------|
| `currentPassword` | string | required |
| `newPassword` | string | required, min 8 chars |

Returns `400` if current password is wrong or account uses Google sign-in.

```json
// ✅ 200
{ "success": true, "message": "Password updated successfully" }
```

---

### `PATCH /avatar` — Upload profile picture

**Content-Type**: `multipart/form-data`

| Field | Type | Rules |
|-------|------|-------|
| `avatar` | file | required, image only, max 3MB |

```json
// ✅ 200
{
  "success": true,
  "message": "Profile image updated",
  "data": { "userProfileImage": "https://res.cloudinary.com/..." }
}
```

---

## Error Format (all endpoints)

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

HTTP status codes: `400` (validation), `401` (not authenticated), `403` (forbidden), `404` (not found), `500` (server error).

---

## Frontend Types (use in Next.js)

```typescript
// Store: store/auth.ts
type UserInfo = {
  _id: string;
  username?: string;
  email?: string;
  userProfileImage?: string;
  role?: string;
};

// Header: /me response
type MeResponse = {
  success: boolean;
  data: { user: UserInfo };
};

// Login/Signup/Google response
type AuthResponse = {
  success: boolean;
  message: string;
};
```
