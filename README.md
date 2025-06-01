# EMRS - Exam Management and Reporting System

A comprehensive web application for managing faculty exams, creating timetables, and providing students with access to their exam schedules.

## Overview

The Exam Management and Reporting System (EMRS) is designed to manage faculty exams with a focus on department-level scheduling. The system allows administrators to create faculties, departments, and courses, and then automatically or manually schedule exams while adhering to scheduling constraints.

## Key Features

### Admin Management
- Create faculties with duration (years: 3 or 4)
- Create departments under faculties
- Add courses to departments (with level/year)

### Timetable Creation
- Input exam start/end dates (weekdays only)
- Fixed daily structure: 4 exam slots (8-10AM, 10AM-12PM, 1-3PM, 3-5PM) with mandatory 12-1PM break
- Auto-scheduling with max 2 exams/day per department-level (3 in conflicts)
- Manual scheduling with drag-and-drop and conflict alerts

### Access Control
- Department-specific registration links/QR codes
- Student registration under department/level

### Timetable Views
- Admin: General timetable, department filters, draft mode, printable formats
- Students: Department-level timetable with option for general view

### Notifications
- Real-time updates when admin publishes changes

## Tech Stack

- **Frontend**: React + TypeScript (Vite)
- **Backend**: Express + TypeScript
- **Database**: PostgreSQL + Prisma
- **Key Libraries**: 
  - react-dnd (drag-and-drop)
  - react-to-print (PDF export)

## Project Structure

```
emrs/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React context providers
│   │   ├── layouts/      # Page layouts
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   └── ...
├── server/               # Express backend
│   ├── prisma/           # Prisma schema and migrations
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   └── utils/        # Utility functions
│   └── ...
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/emrs.git
cd emrs
```

2. Install dependencies for both client and server

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up the database

```bash
# In the server directory
cd ../server

# Create a .env file with your database connection string
echo "DATABASE_URL=postgresql://username:password@localhost:5432/emrs" > .env
echo "JWT_SECRET=your_jwt_secret_key" >> .env

# Run Prisma migrations
npx prisma migrate dev --name init
```

4. Start the development servers

```bash
# Start the backend server (in the server directory)
npm run dev

# In another terminal, start the frontend server (in the client directory)
cd ../client
npm run dev
```

5. Access the application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Usage Flow

1. Admin creates faculties with a year duration
2. Admin creates departments under faculties
3. Admin adds courses under departments for specific levels
4. Admin creates a timetable by providing start and end dates
5. Admin can auto-schedule exams or manually create the timetable using drag-and-drop
6. Admin publishes the timetable when ready
7. Students register using department-specific registration links/QR codes
8. Students can view their department's exam timetable and receive updates

## Constraints

- No room assignments or invigilators
- Focus on department-level scheduling
- Multiple departments can have exams on the same day
- Max 2-3 exams per day per department-level
- Exams scheduled on weekdays only
- Faculties have different level ranges (100-300 or 100-400)

## License

ISC
