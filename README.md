# Tech Salary Transparency

A minimalist, high-end platform for anonymous salary sharing, community verification, and statistical insights.

## Project Structure

-   `/IdentityService.Api`: .NET 10 Web API for Authentication and Identity (Port 5000).
-   `/SalaryService.Api`: .NET 10 Web API for Salary Submissions and Stats (Port 5001).
-   `/web`: Next.js 15 Frontend with Tailwind CSS (Port 3000).
-   `docker-compose.yml`: Infrastructure (PostgreSQL).

---

## 🛠️ Getting Started

### 1. Prerequisites
- Docker & Docker Compose
- .NET 10 SDK
- Node.js 18+ & npm

### 2. Infrastructure Setup (Database)
Start the PostgreSQL database using Docker:
```bash
docker-compose up -d
```

### 3. Backend Setup
You need to run both microservices in separate terminal windows:

**Identity Service (Auth)**
```bash
cd IdentityService.Api
dotnet run
```
- **Swagger**: `http://localhost:5000/swagger`

**Salary Service (Data)**
```bash
cd SalaryService.Api
dotnet run
```
- **Swagger**: `http://localhost:5001/swagger`

### 4. Frontend Setup
Navigate to the web directory and start the dev server:
```bash
cd web
npm install
npm run dev
```
- **App URL**: `http://localhost:3000`

---

## 🏁 Summary of Services
| Service | Technology | Port | Purpose |
| :--- | :--- | :--- | :--- |
| **Database** | PostgreSQL 15 | `5432` | Shared data storage |
| **Identity API** | .NET 10 | `5000` | Auth, Signup, Login |
| **Salary API** | .NET 10 | `5001` | Salary data & Stats |
| **Frontend** | Next.js 15 | `3000` | User Interface |

---

## 🚀 Key Features

### 💰 Salary Transparency
- **Anonymous Submission**: No login required to share salary data.
- **Community Voting**: Upvote or Downvote entries to establish a **Trust Score**.
- **Insights**: Aggregated statistics (Average, Median, P25, P75) based on approved data.

### 🛡️ Moderation
- Users can moderate submissions directly from the **Salary Details** page.
- Statuses: `PENDING` (Default), `APPROVED`, `REJECTED`.
- Only `APPROVED` data is included in the **Insights** calculations.

---

## 💾 Administration via CLI
To manually inspect data:
1. Connect to Docker container: `docker exec -it <container_id> psql -U admin -d identity_db`
2. List tables: `\dt`
3. View Salaries: `SELECT * FROM "SalarySubmissions";`

---

## 🎨 Design Principles
- **Minimalist Aesthetic**: Pure black and white design system.
- **Premium UX**: Smooth transitions, card-based layouts, and absolute clarity.
- **Security First**: JWT-based authentication for sensitive community actions.
