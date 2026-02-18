# ⚡ TaskApp — JWT Auth + Dashboard

A full-stack web app with JWT authentication, task CRUD, and a responsive dashboard.

## 🛠 Tech Stack
- **Frontend**: React.js, React Router v6
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT + bcryptjs

---

## 📁 Project Structure

```
project/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/authMiddleware.js
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/axios.js
│       ├── context/AuthContext.jsx
│       ├── components/
│       └── pages/
└── TaskApp-API.postman_collection.json
```

---

## 🚀 Setup & Run

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:3000`, API at `http://localhost:5000`.

---

## 🔑 API Endpoints

| Method | URL                  | Auth | Description         |
|--------|----------------------|------|---------------------|
| POST   | /api/auth/register   | No   | Register user       |
| POST   | /api/auth/login      | No   | Login user          |
| GET    | /api/user/profile    | Yes  | Get user profile    |
| PUT    | /api/user/profile    | Yes  | Update user profile |
| GET    | /api/tasks           | Yes  | Get all tasks       |
| POST   | /api/tasks           | Yes  | Create task         |
| PUT    | /api/tasks/:id       | Yes  | Update task         |
| DELETE | /api/tasks/:id       | Yes  | Delete task         |

**Auth header format**: `Authorization: Bearer <token>`

**Query params for GET /api/tasks**: `?search=title&status=todo&priority=high`

---

## 🔐 Security Features
- Passwords hashed with **bcryptjs** (salt rounds: 10)
- JWT tokens expire in **7 days**
- **Protected routes** on both frontend and backend
- Token sent via **Authorization header** (not cookies)
- **Ownership check** on task update/delete

---

## 📈 Scaling Notes

For production scaling, the following changes are recommended:

1. **Environment-specific configs** — separate `.env` files for dev/staging/prod
2. **Refresh tokens** — add refresh token rotation so access tokens can be short-lived (15 min)
3. **Rate limiting** — add `express-rate-limit` on auth routes to prevent brute force
4. **Redis caching** — cache user sessions and task lists for faster reads
5. **Helmet.js** — add HTTP security headers
6. **API versioning** — prefix routes with `/api/v1/` for future compatibility
7. **Load balancing** — deploy behind nginx or a cloud load balancer
8. **Pagination** — add `?page=1&limit=20` to task queries for large datasets
9. **CI/CD pipeline** — automate tests and deployment on push
