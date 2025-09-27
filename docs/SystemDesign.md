# System Design: Disaster Relief Volunteer Portal

## 1. Overview
The Disaster Relief Volunteer Portal is a **full-stack web application** with frontend and backend components. The system is designed to be **offline-first**, responsive, and modular for maintainability.

**Frontend:**  
- Built using React 18 with functional components and hooks.  
- Uses Context API for global state management (online/offline status, queued requests).  
- React Router DOM handles client-side navigation.  
- PWA-ready for offline use and mobile installation.  

**Backend:**  
- Node.js with Express.js server.  
- SQLite database using Sequelize ORM for persistence (optional if offline-only mode).  
- RESTful API endpoints handle CRUD operations and bulk synchronization.

---

## 2. Architecture

