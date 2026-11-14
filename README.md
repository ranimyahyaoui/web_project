# SC2 – Cybersecurity Community Platform

## 1. Project Overview

SC2 is a web platform designed to bring together cybersecurity enthusiasts and students. Its purpose is to provide an interactive space where users can discover cybersecurity fields, explore technical topics, and join a cybersecurity community.

The platform focuses on six main cybersecurity domains:

- Web Exploitation
- Cryptography
- OSINT
- Digital Forensics
- Pwn
- Reverse Engineering

## 2. Technologies Used

### Frontend
- **Angular:** Chosen to build a dynamic, component-based web application.
- **TypeScript:** Used to implement application logic.
- **HTML5:** Used to structure web pages.
- **CSS3:** Used to design and style the interface.

### Backend
- **Node.js:** JavaScript runtime environment.
- **Express.js:** Used to develop the REST API.
- **Prisma ORM:** Used to communicate with the database.
- **SQLite:** Used to store user information.
- **JWT:** Used for authentication.
- **bcryptjs:** Used to hash passwords.

## 3. Main Features

### Home Page
- Introduction to the SC2 platform.
- Presentation of the six cybersecurity domains.
- Navigation to the different sections.

### User Authentication
- User registration with name, email, and password.
- User login with email and password.
- Password hashing using bcryptjs.
- JWT-based authentication.

### User Profile
- User Profile interface created.
- The profile component is currently under development.
- Backend integration and profile functionality are not implemented yet.

### Dynamic Navigation
The navigation bar adapts to the authentication status:

- **Guest users:** Login and Register.
- **Authenticated users:** Profile and Logout.

### Not Found Page
- Custom 404 page for unknown routes.

## 4. Project Structure

```text
SC2/
│
├── frontend/
│   └── src/
│       └── app/
│           ├── home/
│           ├── login/
│           ├── register/
│           ├── profile/
│           ├── navbar/
│           ├── notfound/
│           ├── core/
│           ├── app.routes.ts
│           └── app.config.ts
│
└── backend/
    ├── controllers/
    │   └── authController.js
    ├── routes/
    │   └── authRoutes.js
    ├── middlewares/
    │   └── authMiddleware.js
    ├── lib/
    │   └── prisma.js
    ├── prisma/
    │   └── schema.prisma
    ├── .env
    ├── server.js
    └── package.json
```

## 5. Backend API

The backend provides the following REST API endpoints:

| HTTP Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Retrieve authenticated user information |

## 6. Installation and Execution

### Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Angular CLI
- Git
- Visual Studio Code

### Step 1 – Clone the Project

```bash
git clone YOUR_REPOSITORY_URL
cd SC2
```

### Step 2 – Start the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_key"
PORT=3000
```

Initialize the database:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the backend server:

```bash
node server.js
```

Backend URL:

```text
http://localhost:3000
```

### Step 3 – Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start Angular:

```bash
ng serve
```

Frontend URL:

```text
http://localhost:4200
```

## 7. Testing

The application should be tested to verify:

- Navigation between pages.
- User registration and login.
- Form validation.
- Communication between Angular and the Express API.
- Authentication and protected routes.
- Responsive design on desktop, tablet, and mobile.
- Compatibility with different browsers.

## 8. Project Objective

SC2 aims to provide a functional and accessible cybersecurity community platform while applying the main concepts of web development:

- Frontend development with Angular.
- Backend development with Express.js.
- REST API integration.
- Database management.
- User authentication.
- Dynamic navigation and responsive design.

---

**SC2 – Learn. Explore. Secure.**

