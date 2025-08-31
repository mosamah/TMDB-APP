# TMDB Backend Project – Detailed Design Document

This document provides an in-depth explanation of the architecture, design decisions, and principles applied in the TMDB Backend project. It explains every aspect of the system including principles (SOLID, KISS, YAGNI, DRY), database schema, caching, authentication, and deployment.

---

## 1. High-Level Overview

The TMDB Backend is a **NestJS RESTful API** designed to synchronize, store, and expose data from the **TMDB (The Movie Database) API**. It supports features like:

- Listing, searching, pagination, filtering of movies.
- Caching for improved performance and reduced DB load.
- User authentication (JWT-based).
- User-specific lists: **Favorites** and **Watchlists**.
- Movie ratings (with aggregate average and count).
- Automated background synchronization with TMDB.
- Full **Docker + Docker Compose** setup for containerized deployment with **PostgreSQL + Redis**.
- Swagger API documentation (`/docs` endpoint).

---

## 2. Applied Principles

While building this backend, a few guiding principles were subtly kept in mind to ensure the design remained maintainable and future-proof. For example, services like `RatingsService` were written with just one clear job, and repositories like `MoviePrismaRepository` were designed in such a way that you can extend them later without rewriting their foundations. Interfaces for repositories allow us to swap implementations if we ever wanted to switch away from Prisma.  

At the same time, we avoided making things more complex than needed—controllers map directly to REST routes, and we didn’t introduce extra event buses or CQRS layers since the problem space doesn’t need them. Similarly, only the features actually required were implemented; there are no unused endpoints hanging around. Shared helpers such as `normalizePage()` and cache key utilities prevented duplication across services.

---

## 3. Database Schema (PostgreSQL via Prisma)

The schema is modeled for **movies, genres, ratings, favorites, and watchlists**.

### Entities
- **User**: Authentication, relationships to ratings, watchlists, favorites.  
- **Movie**: Core TMDB data + aggregates (`avgRating`, `ratingCount`).  
- **Genre**: Linked to movies (many-to-many).  
- **Rating**: User’s rating for a movie (`1–10`).  
- **Watchlist**: Movies a user wants to watch.  
- **Favorite**: Movies a user marked as favorite.

### Relationships
- `Movie ↔ Genre`: Many-to-Many.  
- `Movie ↔ Rating`: One-to-Many.  
- `User ↔ Watchlist`: Many-to-Many (composite key).  
- `User ↔ Favorite`: Many-to-Many (composite key).

### Why PostgreSQL?
- Strong relational integrity (FKs, cascades).  
- Rich JSON support (future extensibility).  
- Mature ecosystem with Prisma ORM.

---

## 4. Caching (Redis + Cache Manager)

Caching is implemented to minimize DB queries:

- **Movie lists** (`movieListKey`): Cached for 60s.  
- **Movie details** (`movieDetailKey`): Cached for 300s.  
- **Invalidation**: On rating updates, relevant cache entries are cleared.  

Redis was chosen here because it’s a well-tested, low-latency store that handles request-heavy APIs smoothly.

---

## 5. Authentication & Authorization

Authentication is **JWT-based**, and the tokens carry the user ID (`sub`) and email. Guards ensure endpoints are accessible only by authenticated users. For example, list and rating endpoints require a valid JWT, while movie and genre endpoints remain public. This design keeps things simple but secure.

---

## 6. API Endpoints

### Public
- `GET /api/movies`: List, search, filter movies.  
- `GET /api/movies/:id`: Get details of a movie.  
- `GET /api/genres`: List genres.

### Authenticated
- `POST /auth/register`: Create user.  
- `POST /auth/login`: Authenticate and get JWT.  
- `GET/POST/DELETE /lists/watchlist`: Manage user watchlist.  
- `GET/POST/DELETE /lists/favorites`: Manage favorites.  
- `POST /api/movies/:id/ratings`: Add/update rating.  
- `GET /api/movies/:id/ratings`: Fetch ratings for a movie.

---

## 7. Sync Service (TMDB → Local DB)

A scheduled job keeps data up-to-date. It runs daily, fetching genres and popular movies from TMDB and upserting them into the local DB. This way, the local database remains aligned without manual intervention.

---

## 8. Testing

Unit tests are written using **Jest** with coverage across services, controllers, and repositories. The TMDB integration is mocked with axios to isolate external dependencies. This ensures confidence in code changes without slowing down development.

---

## 9. Deployment

- **Dockerfile**: Multi-stage build (dependencies, build, runtime).  
- **docker-compose.yml**: Spins up API, PostgreSQL, Redis.  
- API runs at: `http://localhost:8080`.  
- Swagger docs available at: `http://localhost:8080/docs`.

---

## 10. Why This Design?

The decisions were made with a balance in mind. NestJS provides structure and testability, Prisma brings safety and clean migrations, Redis ensures performance, and JWT secures the app without too much ceremony. By keeping the design simple yet modular, it remains flexible enough to evolve but avoids unnecessary over-engineering.

---

## 11. Future Improvements

- Role-based access control.  
- Full-text search using Postgres `tsvector`.  
- Rate limiting for abuse protection.  
- Cloud deployment (AWS ECS, etc.).  
- CI/CD integration.  

---

# Conclusion

The TMDB Backend is a production-ready NestJS application with a clean architecture, practical use of caching and JWT auth, and a schema designed for core movie features. It balances simplicity with scalability and is written with maintainability in mind.
