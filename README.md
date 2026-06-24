# 🚦 Redis Rate Limiter — Node.js + Express

A lightweight **API Rate Limiter** built with **Node.js**, **Express**, and **Redis** using the **Fixed Window algorithm**. Limits each IP to a configurable number of requests per time window, with built-in **IP masking** for privacy.

---

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [How It Works](#-how-it-works)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [API Usage](#-api-usage)
- [Interview Insights](#-interview-insights)
- [License](#-license)

---

## ✨ Features

- ✅ Fixed Window Rate Limiting using Redis `INCR` + `EXPIRE`
- ✅ Per-IP rate limiting (max 5 requests per 30 seconds)
- ✅ **IP Masking** — only the first octet is stored (e.g., `192.*.*.*`) for user privacy
- ✅ Returns `HTTP 429 Too Many Requests` when limit is exceeded
- ✅ Redis event listeners for connection monitoring (`ready`, `connect`, `error`, `close`)
- ✅ Clean modular structure — middleware, helpers separated

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework & middleware |
| Redis (Cloud/Local) | In-memory counter store |
| ioredis | Redis client for Node.js |
| ip | Get server/client IP address |

---

## ⚙️ How It Works

```
Incoming Request
      │
      ▼
  Rate Limiter Middleware (index.js)
      │
      ├── 1. Get client IP via ip.address()
      ├── 2. Mask IP → hideIp()  →  "192.*.*.*"
      ├── 3. Redis INCR(maskedIp)  →  increment request count
      │
      ├── count === 1?
      │     └── YES → Redis EXPIRE(maskedIp, 30s)  ← start window
      │
      ├── count <= 5? ──YES──► next()  ──► Route Handler ──► 200 OK
      │
      └── count > 5?  ──YES──► 429 Too Many Requests
```

### Redis Commands Used

```bash
INCR   "192.*.*.*"    # Atomically increment request count for this IP
EXPIRE "192.*.*.*" 30 # Set 30s TTL on first request (starts the window)
```

**IP Masking Logic (`hideip.js`):**

The IP is split into 4 octets. Only the first octet is kept; the rest are replaced with `***`:

```
Input:   192.168.1.105
Output:  192.***.***.***.
```

This means Redis never stores a full IP — improving user privacy while still rate-limiting per network.

---

## 📁 Project Structure

```
redis-rate-limiter/
├── helpers/
│   ├── hideip.js        # IP masking utility
│   └── redis.js         # ioredis client with event listeners
├── index.js             # Express app + rate limiter middleware
├── .env                 # Environment variables (not committed)
├── .env.example         # Template for environment setup
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A Redis instance — [Redis Cloud](https://redis.io/cloud/) (free tier) or local Redis

### 1. Clone the repository

```bash
git clone https://github.com/your-username/redis-rate-limiter.git
cd redis-rate-limiter
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Fill in your Redis credentials in `.env`:

```env
REDIS_HOST=your-redis-host
REDIS_PORT=your-redis-port
REDIS_USERNAME=your-redis-username
REDIS_PASSWORD=your-redis-password
```

> 💡 Using [Redis Cloud](https://redis.io/cloud/)? Copy the host, port, username, and password from your database dashboard.

### 4. Start the server

```bash
node index.js
```

Server runs at: `http://localhost:8000`

You should see:

```
Server is running on port 8000
Redis client connected
Redis client is ready
```

---

## 🔧 Configuration

These values are hardcoded in `index.js` and can be adjusted:

| Constant | Default | Description |
|---|---|---|
| `MAX_ALLOWED_REQUESTS` | `5` | Max requests allowed per window |
| `MAX_TIME` | `30` | Window duration in seconds |

Environment variables (set in `.env`):

| Variable | Description |
|---|---|
| `REDIS_HOST` | Redis server hostname |
| `REDIS_PORT` | Redis server port |
| `REDIS_USERNAME` | Redis username (for auth) |
| `REDIS_PASSWORD` | Redis password (for auth) |

---

## 📡 API Usage

### Test with curl

```bash
# Single request
curl http://localhost:8000/

# Fire 7 requests quickly to trigger the rate limit
for i in {1..7}; do curl -s -o /dev/null -w "Request $i: %{http_code}\n" http://localhost:8000/; done
```

### Expected output

```
Request 1: 200
Request 2: 200
Request 3: 200
Request 4: 200
Request 5: 200
Request 6: 429   ← rate limit hit
Request 7: 429
```

### Response — Within limit

```http
HTTP/1.1 200 OK

ok
```

### Response — Limit exceeded

```http
HTTP/1.1 429 Too Many Requests

{
  "message": "too many requests"
}
```

---

## 🎯 Interview Insights

This project directly maps to common **System Design** and **Backend interview** questions:

| Question | What this project demonstrates |
|---|---|
| How do you rate limit an API? | Fixed window with Redis `INCR` + `EXPIRE` |
| How do you handle concurrency? | Redis atomic `INCR` — no race conditions |
| How do you protect user privacy? | IP masking via `hideIp()` |
| What's the time complexity? | O(1) per request |
| What are the tradeoffs of fixed window? | Burst at window boundary (vs sliding window) |

**Follow-up questions to explore:**
- Fixed Window vs Sliding Window vs Token Bucket — which to use when?
- How would you distribute this across multiple servers?
- How would you rate limit per user/API key instead of IP?

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙋‍♂️ Author

**Sourav** — CSE Student | Backend Developer | DSA | System Design

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/sourav-kumar-panda-8a3524274/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat&logo=github)](https://github.com/souravkumarpanda/)

---

⭐ If this helped you, consider giving the repo a star!
