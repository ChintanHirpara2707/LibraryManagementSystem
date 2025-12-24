# Library Management System ( MERN Stack )

This Library Management System is a full-stack MERN project designed for colleges and universities. It supports book management, student accounts, issuing/returning books, fines, and admin reports.

Tattva Library Management System is a MERN-stack (MongoDB, Express, React, Node.js) application that provides a complete library management experience with separate interfaces for Users and Admins. This README explains how to run and deploy the project locally and to production (Docker, Heroku, VPS, or static hosting + server), environment variable configuration, seeding the database, and common troubleshooting steps.

> Repository: ChintanHirpara2707/LibraryManagementSystem

---

## Project overview

Tattva Library Management System provides:
- User side: browse/search books, borrow/return books (or request), view borrowing history, profile management.
- Admin side: manage books, categories, users, loans, reservations, and reports.

This README focuses on deployment and developer setup. Adjust commands to match the actual folder names and scripts in your repo if they differ (for example `client/` and `server/`).

---

## Features

- Authentication (User and Admin roles)
- Book catalog with CRUD operations (admin)
- Borrow / return workflows
- Search and filter books
- Dashboard for admin metrics
- REST API (Express) consumed by React front-end
- MongoDB for persistence (Atlas or self-hosted)

---

## Tech stack

- Frontend: React (Create React App / Vite)
- Backend: Node.js, Express.js
- Database: MongoDB (MongoDB Atlas or local)
- Dev tooling: nodemon, concurrently (optional)
- Optional deployment: Docker, PM2, Nginx, Heroku, Vercel/Netlify (frontend)

---

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (Atlas URI or local `mongod`)
- (Optional) Docker & docker-compose
- (Optional for VPS) Nginx, PM2

---

## Repository structure (typical)

Adjust to your repo layout if different.

- /client — React application
- /server (or /api) — Express API
- README.md
- docker-compose.yml
- Dockerfile (for server or combined)

---

## Environment variables

Create `.env` files in server and client (if needed):

Sample server `.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/tattva?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=ChangeMe123!
```

Sample client `.env` (React):
```
REACT_APP_API_URL=http://localhost:5000/api
```

Notes:
- Never commit secrets to Git. Use GitHub Secrets for CI/CD or environment variables in hosting providers.
- Use strong JWT_SECRET and rotate credentials in production.

---

## Local development (full-stack)

Assuming separate `client` and `server` folders.

1. Clone the repo
```
git clone https://github.com/ChintanHirpara2707/LibraryManagementSystem.git
cd LibraryManagementSystem
```

2. Install server dependencies
```
cd server
npm install
```

3. Configure server `.env` (see above)

4. Install client dependencies
```
cd ../lms
npm install
```

5. Start both in development (option A — two terminals)
Terminal 1:
```
cd server
npm run dev    # or `nodemon index.js`
```
Terminal 2:
```
cd lms
npm start
```

Option B — use `concurrently` from repo root (if configured):
```
npm install -g concurrently
# or from repo root if package.json configured to run both
npm run dev:all
```

Your React app should be available at http://localhost:3000 and the API at http://localhost:5000 (adjust ports as configured).

---

## Production build and serve (one server)

If you want Express to serve the React production build:

1. Build the client
```
cd client
npm run build
# This produces client/build or dist depending on setup
```

2. Configure server to serve static files. Example Express snippet (server/app.js or server/index.js):
```js
const path = require('path');
// ... express setup
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}
```

3. Start server in production mode
```
NODE_ENV=production node server/index.js
# or use pm2
pm2 start server/index.js --name tattva-server
```

Consider using Nginx as reverse proxy for SSL and serving static assets.

---
<img width="1352" height="680" alt="1" src="https://github.com/user-attachments/assets/08544811-627f-4aeb-bf7e-1eca2b3a6861" />
<img width="1350" height="768" alt="2" src="https://github.com/user-attachments/assets/81d02c6c-0002-4479-8dfc-e252ffe306c9" />
<img width="1344" height="768" alt="3" src="https://github.com/user-attachments/assets/7e6bd264-488a-408b-aa1e-2d55ee1bc7d7" />

## License

Specify your license here (e.g., MIT). Example:
```
MIT License
```

---

## Contact

Repository owner: ChintanHirpara2707  
For questions, open an issue or reach out via GitHub.

---
