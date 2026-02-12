# KITHU Identity & Salary Platform

A minimalist, high-end platform for anonymous salary sharing, community verification, and statistical insights.

## Project Structure

-   `/IdentityService.Api`: .NET 10 Web API Backend.
-   `/web`: Next.js 15 Frontend with Tailwind CSS.
-   `docker-compose.yml`: Infrastructure (PostgreSQL).

---

## 🛠️ Getting Started

### 1. Prerequisites
- Docker & Docker Compose
- .NET 10 SDK
- Node.js 18+ & npm

### 2. Database Setup
Start the PostgreSQL database using Docker:
```bash
docker-compose up -d
```

### 3. Backend Setup
Navigate to the API directory and run the service:
```bash
cd IdentityService.Api
dotnet run
```
- **Swagger UI**: Accessible at `http://localhost:5000/swagger`
- **Database Reset**: If you update models, run `docker-compose down -v && docker-compose up -d` to refresh the schema.

### 4. Frontend Setup
Navigate to the web directory and start the dev server:
```bash
cd web
npm install
npm run dev
```
- **App URL**: `http://localhost:3000`

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