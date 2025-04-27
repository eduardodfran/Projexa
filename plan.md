- **EXECUTE COMMANDS USING ; TO SEPERATE, INSTEAD OF &&**
- add a simple comment on each component/divs so that i know what that component/divs is all about

✅ Goal
Build a fully functional project management web app.

🗂️ Core Features (MVP – Minimum Viable Product)
User Authentication

Project Creation

Task Management (CRUD)

Kanban Board View

Team Collaboration (Invite, Assign tasks)

Deadlines and Priorities

Notifications/Reminders (Basic)

Comments / Chat on tasks

File Upload (Basic – attachments to tasks)

📅 Development Plan (5 Phases)
📍 Phase 1: Setup & Authentication ✅
Goal: Establish your environment and login system.

Setup project structure (React frontend, Express backend) ✅

Configure MongoDB or PostgreSQL (MongoDB is easier to start) ✅

Implement user registration, login (JWT-based authentication) ✅

Protect routes with middleware ✅

Create user roles (admin, team member) ✅

📍 Phase 2: Project & Task Management 🔄
Goal: CRUD system for projects and tasks

Users can create projects and add descriptions

Each project has:

Title, description, deadline

Tasks associated with it

Tasks:

Title, description, status (To Do, In Progress, Done)

Assignee, deadline, priority

Task CRUD operations via API ✅

📍 Phase 3: Kanban Board UI 🔄
Goal: Implement drag-and-drop interface for task management

Use @dnd-kit library for drag-and-drop (https://dndkit.com)

Tasks move across columns (To Do → In Progress → Done)

Auto-update task status in backend

📍 Phase 4: Team & Collaboration
Goal: Invite team members and assign tasks

Add/remove users to a project (with permissions)

Assign users to tasks

View team list in each project

Optional: Basic in-task comments

📍 Phase 5: Polish & Extra Features
Goal: Improve UX and add enhancements

Notifications system (basic email or frontend alerts)

File upload to tasks (e.g., upload attachments using Multer)

Filter/search tasks by status, priority, assignee

Real-time updates (Socket.IO)

📘 Tech Stack

Layer Tech
Frontend React + Tailwind and shadcn
State Mgmt React Context or Redux
Backend Node.js + Express
Auth JWT + Bcrypt
DB MongoDB
File Upload Multer
Real-time Socket.IO
Deployment Vercel (frontend), render (backend)

**USE SHADCN**

color pallete:

Background:

Dark Gray: #1A202C (Very dark gray with a hint of blue)

Black: #111827 (A pure black background)

Text:

Light Gray: #E2E8F0 (Light gray for text to ensure it's readable on dark background)

White: #FFFFFF (For important text or headings)

Primary Buttons/Highlights:

Blue: #3182CE (A calm and vibrant blue for primary buttons and highlights)

Dark Blue: #2B6CB0 (A darker shade of blue for hover effects or secondary buttons)

Secondary Buttons/Highlights:

Orange: #F6AD55 (A warm, inviting color for secondary buttons or important notifications)

Borders/Dividers:

Light Gray: #4A5568 (For dividing sections or subtle borders)

Error or Alert States:

Red: #E53E3E (To indicate error states or alerts)
