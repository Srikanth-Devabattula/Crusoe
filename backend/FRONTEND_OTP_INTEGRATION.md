# Frontend OTP Integration Guide

## API Endpoints

### 1. Request OTP

**Endpoint:** `POST /api/auth/request-otp`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "email": "user@example.com",
    "expiresIn": 300,
    "message": "Please check your email for the verification code"
  }
}
```

**Error Response (400/429/500):**
```json
{
  "success": false,
  "message": "Error message"
}
```

### 2. Verify OTP

**Endpoint:** `POST /api/auth/verify-otp`

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user"
    },
    "token": "jwt_token_here",
    "loginMethod": "otp"
  }
}
```

**Error Response (400/404/500):**
```json
{
  "success": false,
  "message": "Error message"
}
```

### 3. Resend OTP

**Endpoint:** `POST /api/auth/resend-otp`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP resent successfully",
  "data": {
    "email": "user@example.com",
    "expiresIn": 300,
    "message": "Please check your email for the new verification code"
  }
}
```

**Error Response (400/404/429/500):**
```json
{
  "success": false,
  "message": "Error message"
}
```

## Rate Limiting

- **OTP Request:** 3 requests per hour per IP+email
- **OTP Verify:** 10 attempts per 15 minutes per IP+email
- **Resend:** 1 minute cooldown between requests

## Authentication

JWT token is returned in response and set as httpOnly cookie. Include token in Authorization header for protected routes:

```
Authorization: Bearer <jwt_token>
```

## Error Codes

- **400:** Bad request (invalid input, wrong OTP, expired OTP)
- **404:** User not found
- **429:** Too many requests (rate limited)
- **500:** Internal server error
- **503:** Email service unavailable