# NOVA — Team Productivity Platform
Plan. Collaborate. Deliver.

NOVA (Version 1) was independently developed by me within a one‑week assignment deadline, so the UI prioritizes functionality over elegance.

> **Plan. Collaborate. Deliver.**

NOVA is a full-stack project management and team productivity platform designed to help teams organize projects, manage tasks, collaborate with members, and track overall progress from a centralized workspace.

The application provides secure authentication, project management, task management, team roles, task assignment, Kanban-style workflow management, filtering, and dashboard analytics.

---

## 🚀 Features

### Authentication & User Management

- User registration and login
- Secure password hashing with bcrypt
- JWT-based authentication
- HTTP-only authentication cookies
- Protected application routes
- Logout functionality
- Profile management
- Password change functionality

### Project Management

- Create projects
- View all accessible projects
- View individual project details
- Update project information
- Delete projects
- Project status management
- Project start and due dates
- Project ownership

### Team Collaboration

- Add members to projects using email
- Assign project roles
- Owner and Admin permissions
- Member permissions
- Remove project members
- Protected project-level actions

### Task Management

- Create tasks
- Edit tasks
- Delete tasks
- Assign tasks to team members
- Set task priority
- Set task status
- Set task due dates
- Task descriptions
- Overdue task detection

### Task Workflow

Tasks can move through four workflow stages:

- Todo
- In Progress
- Review
- Done

The project details page provides a Kanban-style board for visual task management.

### Search & Filtering

Tasks can be filtered by:

- Search query
- Status
- Priority
- Project

### Dashboard

The dashboard provides an overview of:

- Total projects
- Active projects
- Completed projects
- Total tasks
- Pending tasks
- Completed tasks
- High-priority tasks
- Overall task completion percentage
- Recent projects

### UI/UX

- Responsive design
- Mobile navigation
- Modern SaaS-style interface
- Reusable UI components
- Consistent design system
- Loading states
- Error states
- Empty states
- Responsive task layouts

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- React Context API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Zod

### Security

- HTTP-only cookies
- Helmet
- Express Rate Limit
- Password hashing
- Protected API routes
- Role-based authorization
- Input validation

### Development

- Git
- GitHub
- Nodemon


## 📁 Project Structure

nova/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── EditTaskModal.jsx
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProjectMembers.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── TaskCard.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── layouts/
│   │   │   └── AppLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Tasks.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── dashboardService.js
│   │   │   ├── memberService.js
│   │   │   ├── projectService.js
│   │   │   └── taskService.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── memberController.js
│   │   │   ├── projectController.js
│   │   │   └── taskController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   ├── rateLimiter.js
│   │   │   └── validate.js
│   │   │
│   │   ├── models/
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   └── User.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── memberRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   └── taskRoutes.js
│   │   │
│   │   ├── utils/
│   │   │   ├── AppError.js
│   │   │   ├── asyncHandler.js
│   │   │   └── projectPermissions.js
│   │   │
│   │   └── validators/
│   │       ├── authValidator.js
│   │       ├── projectValidator.js
│   │       └── taskValidator.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── README.md


---

## ⚙️ Installation

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB / MongoDB Atlas
- Git

---

## 🔧 Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Start the development server:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:5000
```

---

## 💻 Frontend Setup

Open another terminal and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | Port used by the Express server |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | JWT expiration duration |
| `CLIENT_URL` | Frontend URL used for CORS |


---

## 🔌 API Overview

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get authenticated user |
| POST | `/api/auth/logout` | Logout |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/projects` | Create project |
| GET | `/api/projects` | Get projects |
| GET | `/api/projects/:id` | Get project |
| PATCH | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/projects/:projectId/tasks` | Create task |
| GET | `/api/projects/:projectId/tasks` | Get project tasks |
| GET | `/api/projects/tasks/:id` | Get task |
| PATCH | `/api/projects/tasks/:id` | Update task |
| DELETE | `/api/projects/tasks/:id` | Delete task |

### Members

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/projects/:projectId/members` | Add member |
| GET | `/api/projects/:projectId/members` | Get members |
| DELETE | `/api/projects/:projectId/members/:userId` | Remove member |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Get dashboard statistics |

---

## 🔒 Authorization Model

NOVA uses project-level roles.

### Owner

The project owner has full control over the project.

### Admin

Admins can manage project members and perform authorized project actions.

### Member

Members can collaborate on projects and work with assigned tasks according to the application's permissions.

Authorization is enforced on the backend rather than relying only on frontend visibility.

---

## 🔄 Application Flow

```text
User
 │
 ▼
React Frontend
 │
 │ Axios + HTTP-only Cookie
 ▼
Express REST API
 │
 ├── Authentication
 ├── Validation
 ├── Authorization
 ├── Project Management
 ├── Task Management
 └── Member Management
 │
 ▼
MongoDB
```

---

## 🧪 Health Check

The backend provides a health endpoint:

```text
GET /api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is healthy"
}
```

---


## 🎯 Project Objective

NOVA was developed as a full-stack project management application to demonstrate practical implementation of:

- Frontend development
- REST API development
- Database design
- Authentication
- Authorization
- CRUD operations
- State management
- Form validation
- Responsive UI development
- Security practices
- Full-stack application architecture

---

## 🚀 Future Improvements

Potential future improvements include:

- Real-time team collaboration
- Notifications
- File attachments
- Comments on tasks
- Activity history
- Advanced analytics
- Drag-and-drop Kanban tasks
- Email notifications
- Dark mode
- Automated testing
- CI/CD pipeline

---

## 👨‍💻 Author

Krishna

GitHub: `https://github.com/krishna10-dev`

---

## 📄 License

This project is developed for educational and internship purposes.