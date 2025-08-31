# TMDB Backend

A **NestJS-based RESTful API** that integrates with [TMDB](https://www.themoviedb.org/) to fetch and sync movies and genres, store them in a **PostgreSQL** database, and expose endpoints for listing, searching, rating, watchlists, and favorites.

---

## 🚀 Features
- **Movie & Genre Sync**: Cron job fetches data from TMDB daily.
- **CRUD APIs**: List, search, filter, and paginate movies.
- **User Ratings**: Add ratings and update average ratings dynamically.
- **Watchlist & Favorites**: Users can manage personal lists.
- **Authentication**: JWT-based auth with protected endpoints.
- **Caching**: Redis for movie details and listings.
- **Swagger Docs**: Auto-generated API documentation at `/docs`.
- **Dockerized**: Run with `docker-compose up`.

---

## 🛠 Tech Stack
- **NestJS** (Node.js framework)
- **Prisma ORM** (DB abstraction)
- **PostgreSQL** (persistent storage)
- **Redis** (cache layer)
- **Jest** (unit testing)
- **Swagger** (API documentation)
- **Docker & Docker Compose**

---

## ⚙️ Setup Instructions

### 1. Clone Repo
```bash
git clone https://github.com/mosamah/TMDB-APP.git
cd tmdb-backend
```

### 2. Environment Variables
Create a `.env` file:
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres
REDIS_HOST=redis
TMDB_API_KEY=your_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3
JWT_SECRET=supersecret
SYNC_CRON=0 3 * * *
SEED_PAGES=3
PORT=8080
```

### 3. Run with Docker
```bash
docker compose up -d --build
```
App available at: [http://localhost:8080](http://localhost:8080)  
Swagger Docs: [http://localhost:8080/docs](http://localhost:8080/docs)

---

## 📡 API Endpoints

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Movies
- `GET /api/movies`
- `GET /api/movies/:id`

### Ratings
- `POST /api/movies/:id/ratings`
- `GET /api/movies/:id/ratings`

### Lists
- `GET /lists/watchlist`
- `POST /lists/watchlist`
- `DELETE /lists/watchlist`
- `GET /lists/favorites`
- `POST /lists/favorites`
- `DELETE /lists/favorites`

---

## 🧪 Testing
Run unit tests:
```bash
npm run test
```
