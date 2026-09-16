# Student Mentorship Management System API

A college-level REST API that connects students with mentors. Students manage profiles, goals, concerns and meeting requests. Mentors manage assigned students, concerns, meetings, feedback and progress.

## Features

- JWT authentication with student and mentor roles
- Secure bcryptjs password hashing
- Student-mentor assignment
- Goals, concerns, meetings, feedback and progress modules
- MongoDB relationships with Mongoose population
- Request validation, centralized errors, CORS, Helmet and rate limiting

## Technology Stack

Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, dotenv, cors, express-validator, Helmet and nodemon.

## Structure

```text
backend/
├── config/          # Database connection
├── controllers/     # Business logic
├── middleware/      # Auth, role, validation and error middleware
├── models/          # Mongoose schemas
├── routes/          # REST route definitions
├── utils/           # JWT and async helpers
├── seed.js
├── server.js
└── package.json
```

## Installation

1. Install Node.js and MongoDB.
2. Start MongoDB locally, or provide a hosted MongoDB URI.
3. From the `backend` folder run:

```bash
npm install
```

4. Copy `.env.example` to `.env` and set a strong `JWT_SECRET`.
5. Start in development mode:

```bash
npm run dev
```

Start normally with:

```bash
npm start
```

The API runs at `http://localhost:5000` by default.

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/student_mentorship
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Seed Data

The optional seed script clears the database and creates two students, two mentors and sample records:

```bash
npm run seed
```

Local sample credentials, for development only:

- Student: `aisha@example.com` / `Password123`
- Student: `ravi@example.com` / `Password123`
- Mentor: `meera@example.com` / `Password123`
- Mentor: `arjun@example.com` / `Password123`

Passwords are hashed by the User model before storage.

## Authentication

Register or log in to receive a JWT. Send it on protected requests:

```http
Authorization: Bearer <token>
```

Example login:

```http
POST /api/auth/login
Content-Type: application/json

{"email":"aisha@example.com","password":"Password123"}
```

Example response:

```json
{"success":true,"message":"Login successful","data":{"user":{"id":"...","name":"Aisha Student","email":"aisha@example.com","role":"student"},"token":"..."}}
```

## API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/health` | Public |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| GET, PUT | `/api/students/:id` | Relevant student or mentor / owner for PUT |
| GET | `/api/students/:id/mentor` | Relevant student or mentor |
| PUT | `/api/students/:studentId/mentor` | Mentor; a mentor may assign themselves |
| GET | `/api/mentors/:id` | Relevant user |
| GET | `/api/mentors/:id/students` | That mentor |
| POST | `/api/goals` | Student |
| GET | `/api/goals/student/:studentId` | Owner or assigned mentor |
| GET, PUT, DELETE | `/api/goals/:id` | Owner; GET also assigned mentor |
| POST | `/api/concerns` | Student |
| GET | `/api/concerns/student/:studentId` | Owner |
| GET | `/api/concerns/mentor/:mentorId` | That mentor |
| GET, PUT | `/api/concerns/:id` | Relevant student or mentor |
| POST | `/api/meetings` | Student with assigned mentor |
| GET | `/api/meetings/student/:studentId` | Owner |
| GET | `/api/meetings/mentor/:mentorId` | That mentor |
| GET, PUT, DELETE | `/api/meetings/:id` | Relevant users |
| POST | `/api/feedback` | Assigned mentor |
| GET | `/api/feedback/student/:studentId` | Owner |
| GET | `/api/feedback/mentor/:mentorId` | That mentor |
| GET, PUT | `/api/feedback/:id` | Relevant user; PUT author only |
| GET | `/api/progress/student/:studentId` | Student or assigned mentor |
| PUT | `/api/progress/student/:studentId` | Assigned mentor |

All responses use `{ success, message?, data? }`. Validation failures return HTTP 400, authentication failures 401, permission failures 403, missing resources 404 and conflicts 409.

## Assignment Decision

There is no Admin role. A mentor-authenticated user can assign themselves to a student by calling `PUT /api/students/:studentId/mentor` with `{ "mentorId": "their Mentor document id" }`. A mentor cannot assign another mentor. This keeps assignment simple and explainable for the project while preserving authorization.

## Future Improvements

Add email notifications, calendar integration, pagination, refresh tokens, audit logs, mentor availability and automated tests with a test database.
