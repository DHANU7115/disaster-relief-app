 Disaster Relief Volunteer Portal

## Project Overview
The Disaster Relief Volunteer Portal is a **full-stack web application** that enables users to submit help requests and volunteers to register and assist. The application supports offline-first functionality and can synchronize queued requests when back online. It is also **responsive** and **PWA-ready** for mobile usage.

---

## Folder Structure
disaster-relief-app/
├── backend/
│ ├── models/ # Database models
│ ├── routes/ # API routes
│ ├── database.sqlite # SQLite database file
│ ├── server.js # Main server
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── pages/ # Page components
│ │ ├── context/ # Context API for state management
│ │ ├── services/ # API and storage services
│ │ ├── App.jsx # Main React component
│ │ └── main.jsx # Entry point
│ ├── public/ # Static assets (logo, images)
│ └── package.json
├── docs/ # Documentation files
└── README.md



## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/disaster-relief-app.git
cd disaster-relief-app

2. Install Dependencies
Backend
cd backend
npm install

Frontend
cd ../frontend
npm install

3. Run the Application
Backend
cd backend
node server.js


The backend server will start on http://localhost:5000 (or port configured in server.js).

Frontend
cd frontend
npm run dev


The frontend will start on http://localhost:5173 (or the port shown in the console).

4. Using the Application

Open the frontend URL in your browser.

Navigate using the header links:

Home: Landing page with project info.

Submit Help: Fill out the help request form.

Volunteer: Register as a volunteer to help.

Offline Mode: Turn off your internet and submit a request; it will be queued locally.

Syncing: Once the internet is back, queued requests will automatically sync to the backend.

Check online/offline status in the header, along with any queued requests.

Features

Submit Help Request with Name, Location, Urgency, and Need Type

Volunteer Registration

Offline support with queued request synchronization

Real-time online/offline status indicators

Responsive design for desktop and mobile

PWA-ready for installation on mobile devices

Dependencies

Frontend: React 18, React Router DOM, Context API

Backend: Node.js, Express, SQLite, Sequelize ORM

Offline / PWA: Service Worker for caching and offline queue

Notes

All frontend components are modular for maintainability.

Offline-first logic ensures requests are never lost.

Documentation is available in the docs/ folder.