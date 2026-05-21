# FullStack Store Rating Application

This document outlines the proposed implementation plan for the Store Rating Web Application coding challenge. 

## To Answer Your Question: What should we do first?
I recommend starting with the **Database Schema and Backend API**. 
Building the backend first establishes the data models and how the frontend will interact with the system. Once the APIs are ready and tested (e.g., via Postman or Swagger), we can smoothly build the React frontend and integrate the real APIs from the start, avoiding the need to write and later replace mock data.

**Development Phases:**
1. **Phase 1: Backend & Database (Start Here)** - Setup Express server, PostgreSQL connection, models, and authentication.
2. **Phase 2: Core API Routes** - Build endpoints for users, stores, and ratings.
3. **Phase 3: Frontend Setup & Auth** - Setup React, build login/signup, and role-based routing.
4. **Phase 4: Frontend Dashboards** - Build the Admin, Store Owner, and Normal User views.

## User Review Required

> [!IMPORTANT]
> Based on your request, we will proceed with:
> - **Backend:** ExpressJS with plain JavaScript using an **MVC Architecture** (Models, Views/Controllers).
> - **Database ORM:** Prisma ORM with PostgreSQL.
> - **Frontend:** We will decide on the frontend tech stack later, focusing entirely on the backend for now.

## Open Questions

1. Do you have PostgreSQL installed locally on your machine, or should we set it up using Docker?
2. Can we use TailwindCSS for styling later, or would you prefer another approach? (We can decide this later as you mentioned, but feel free to let me know).

## Proposed Architecture

### Database Schema (PostgreSQL)

**User Table**
- `id` (PK)
- `name` (String, 20-60 chars)
- `email` (String, Unique)
- `password` (String, Hashed)
- `address` (String, Max 400 chars)
- `role` (Enum: ADMIN, NORMAL, STORE_OWNER)
- `createdAt`, `updatedAt`

**Store Table**
- `id` (PK)
- `name` (String)
- `email` (String)
- `address` (String)
- `ownerId` (FK -> User.id) - *If a store is associated with a specific store owner.*
- `createdAt`, `updatedAt`

**Rating Table**
- `id` (PK)
- `score` (Int, 1 to 5)
- `userId` (FK -> User.id)
- `storeId` (FK -> Store.id)
- *Unique constraint on [userId, storeId] so a user can only rate a store once (though they can modify it).*
- `createdAt`, `updatedAt`

### Backend (ExpressJS)
Will be set up in a `backend/` directory.
- **Auth Routes:** `/api/auth/register`, `/api/auth/login`, `/api/auth/update-password`
- **Admin Routes:** `/api/admin/users`, `/api/admin/stores` (with sorting & filtering)
- **Store Routes:** `/api/stores`, `/api/stores/:id`, `/api/stores/:id/ratings`
- **Rating Routes:** `/api/ratings` (Create/Update ratings)

### Frontend (ReactJS)
Will be set up in a `frontend/` directory.
- **Pages:**
  - `Login` & `Register`
  - `AdminDashboard` (User & Store lists, creation forms)
  - `StoreOwnerDashboard` (Store stats, rating list)
  - `NormalUserDashboard` (Store listings, search, submit/edit ratings)
- **State Management:** React Context API or Zustand.
- **Data Fetching:** Axios or React Query.

## Verification Plan

### Automated/Manual Testing
- Verify validation rules (password complexity, lengths, email format) on both Frontend and Backend.
- Test role-based access control (e.g., Normal users shouldn't access Admin routes).
- Ensure tables support sorting and filtering as requested.
