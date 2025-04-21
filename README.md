# 📘 Full Stack Notes App

This project is a full-stack application developed for managing **notes** and **categories**, with secure authentication and integration between a Java Spring Boot backend and an Angular 19 frontend.

---

## 📦 Tech Stack

### 🔧 Backend
- Java 21
- Spring Boot 3.2.x
- Spring Security (JWT-based Authentication)
- PostgreSQL (via Docker Compose)
- Maven Wrapper (`./mvnw`)
- Docker + Docker Compose

### 🌐 Frontend
- Angular 19
- Angular Material
- Node.js `>=18.17.0`
- npm `>=9.6.7`
- Standalone Angular Components
- Lazy Loading

---

## 🚀 Requirements

Before running the app, ensure the following tools are installed:

| Tool             | Version          | Notes                          |
|------------------|------------------|--------------------------------|
| **Node.js**      | 18.17.0 or above | Required for Angular CLI       |
| **npm**          | 9.6.7 or above   | Comes with Node.js             |
| **Angular CLI**  | 19.x             | `npm install -g @angular/cli`  |
| **Java**         | 21               | Required for backend           |
| **Maven Wrapper**| Provided         | No global Maven required       |
| **Docker**       | Latest           | Docker Desktop (with Compose)  |
| **Git**          | Recommended      | For version control            |

---

## 📂 Project Structure

```
ensolvers-challenge/
├── backend/          # Spring Boot API
├── frontend/         # Angular SPA
├── start-app.sh      # Unix/Linux/macOS start script
└── README.md
```

---

## 📣 Start the App with One Command

### ✅ For Linux/macOS

```bash
chmod +x start-app.sh
./start-app.sh
```

---

## 📅 Running Backend Manually

If you prefer to run the backend manually:

1. Ensure PostgreSQL is running (via Docker Compose or local)
2. Navigate to `/backend`:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

---

## 🌐 Running Frontend Manually

1. Navigate to `/frontend`:
   ```bash
   cd frontend
   npm install
   ng serve
   ```

2. Visit: [http://localhost:4200](http://localhost:4200)

---

## 🔐 Authentication Notes

- You **can** create a user before logging in.
- On the login page, click on **"Create new user"** to register a new user. _(Also, there's a default user 'user' with password 'user')_
- JWT tokens are used to secure all backend routes.

---

## 📚 API Overview

The backend exposes a RESTful API for:

- ✅ User authentication (`/api/auth/login`, `/api/auth/register`)
- 📒 Notes management (`/api/notes`)
- 🏇 Categories (`/api/categories`)

All routes except `/auth/**` are **protected via JWT**.

---

## 🐘 Database (PostgreSQL)

The database is managed via Docker and configured automatically.

**Connection Info:**
- Host: `localhost`
- Port: `5432`
- User: `ensolvers_user`
- Password: `ensolvers_password`
- DB Name: `ensolvers_db`

---


## ✅ Final Notes

- This application was designed for easy setup and portability.
- All sensitive endpoints are protected.
- You can adjust environment settings via `application.properties` and `environment.ts`.
