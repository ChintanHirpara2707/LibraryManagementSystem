# Library Management System

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

## Deploying with Docker

Dockerfile (server) — example:
```dockerfile
# stage 1: build client
FROM node:20 AS client-build
WORKDIR /app
COPY client/package*.json client/
RUN cd client && npm install
COPY client/ client/
RUN cd client && npm run build

# stage 2: server
FROM node:20
WORKDIR /app
COPY server/package*.json server/
RUN cd server && npm install --production
COPY server/ server/
# copy build
COPY --from=client-build /app/client/build /app/server/client/build
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server/index.js"]
```

docker-compose.yml — example:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo
  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Start:
```
docker-compose up --build
```

---

## Deploying to Heroku (example)

1. Create Heroku app
```
heroku create tattva-library
```

2. Set environment variables on Heroku (or use `heroku config:set`)
```
heroku config:set MONGO_URI=... JWT_SECRET=...
```

3. If using single server that serves client build:
- Ensure `start` script in server package.json runs `node index.js`
- Commit and push to Heroku (root must contain a package.json or configure buildpacks)
```
git push heroku main
```

4. Alternatively, deploy front-end to Netlify/Vercel and backend to Heroku. Set `REACT_APP_API_URL` to backend URL.

Note: Heroku ephemeral filesystem — do not rely on local file persistence.

---

## Creating Admin / Seeding database

Implement a seed script or API endpoint to create default admin. Example seed script (server/scripts/seedAdmin.js):

```js
// pseudocode
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await User.findOne({ email: process.env.DEFAULT_ADMIN_EMAIL });
  if (existing) { console.log('Admin exists'); process.exit(0); }
  await User.create({
    name: 'Admin',
    email: process.env.DEFAULT_ADMIN_EMAIL,
    password: 'ChangeMe123!', // hashed in model pre-save
    role: 'admin'
  });
  console.log('Admin created');
  process.exit(0);
}
seed();
```

Run:
```
node server/scripts/seedAdmin.js
```

Make sure passwords are hashed in the model and then change the credentials immediately after first login.

---

## API docs

If you have Swagger, Postman collection, or API docs, include link or file in the repo (e.g., `docs/api.md` or `postman_collection.json`). Document endpoints for auth, books, loans, users, admin actions.

---

## Security & best practices

- Use HTTPS in production
- Store secrets in environment variables or secret managers
- Use strong password hashing (bcrypt)
- Validate and sanitize user input
- Implement rate limiting and helmet for Express
- Use CORS and restrict origins
- Keep dependencies updated and monitor vulnerabilities (npm audit, Dependabot)

---

## Troubleshooting

- Connection refused to MongoDB:
  - Verify MONGO_URI and that IP whitelist (Atlas) includes server IP or 0.0.0.0/0 for testing.
- CORS issues:
  - Ensure frontend origin is allowed in server CORS config or set CLIENT_URL env.
- 500 errors in production:
  - Inspect server logs (pm2 logs, docker logs, Heroku logs).
- React client can't reach API in production:
  - Confirm REACT_APP_API_URL is set to correct backend URL and that backend serves CORS or static build properly.

---

## Contributing

Contributions, issues, and feature requests are welcome. Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feat/xyz`)
3. Commit your changes (`git commit -m "feat: add ..."`)
4. Push to the branch (`git push origin feat/xyz`)
5. Open a Pull Request and describe your changes

Add tests where possible and keep the code style consistent.

---

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
