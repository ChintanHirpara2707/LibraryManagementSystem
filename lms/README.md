# Library Management System (LMS)

A full-stack Library Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring both user and admin interfaces.

## Features

### User Side
- **Authentication**: Login and registration system
- **Dashboard**: Personal library overview and statistics
- **Profile Management**: View and update personal information
- **Book Catalog**: Browse, search, and filter books
- **Book Details**: View comprehensive book information
- **Book Actions**: Borrow, purchase, and preview books
- **Transaction History**: Track borrowing and purchase history

### Admin Side
- **Authentication**: Secure admin login and registration
- **Dashboard**: Library overview with key statistics
- **Profile Management**: Admin profile settings
- **Book Management**: Add, edit, delete, and manage books
- **User Management**: Manage library members and their status
- **Transaction Management**: Monitor all library transactions

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (with MongoDB Atlas)
- **Mongoose** - Object Data Modeling (ODM)
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Multer** - File upload handling

### Frontend
- **React.js** - User interface library
- **React Router DOM** - Client-side routing
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **Styled Components** - CSS-in-JS styling
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **React Hook Form** - Form management

## Prerequisites

Before running this project, make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB)

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd lms2
```

### 2. Backend Setup
```bash
cd server
npm install
```

### 3. Frontend Setup
```bash
cd ../lms
npm install
```

### 4. Environment Configuration

#### Backend Environment Variables
Create a `config.env` file in the `server` directory:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/lms_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

**Important**: Replace the placeholder values with your actual MongoDB Atlas credentials and a secure JWT secret.

### 5. Database Setup
- Create a MongoDB Atlas cluster
- Create a database named `lms_db`
- Ensure your IP address is whitelisted in Atlas

## Running the Application

### 1. Start the Backend Server
```bash
cd server
npm run dev
```
The backend will start on `http://localhost:5000`

### 2. Start the Frontend Application
```bash
cd lms
npm start
```
The frontend will start on `http://localhost:3000`

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Project Structure

```
lms2/
├── server/                 # Backend
│   ├── config.env         # Environment variables
│   ├── server.js          # Main server file
│   ├── models/            # Database models
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Transaction.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── books.js
│   │   ├── users.js
│   │   └── transactions.js
│   └── middleware/        # Custom middleware
│       └── auth.js
├── lms/                   # Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   └── common/
│   │   ├── contexts/      # React contexts
│   │   │   └── AuthContext.js
│   │   ├── pages/         # Page components
│   │   │   ├── user/      # User pages
│   │   │   └── admin/     # Admin pages
│   │   └── App.js         # Main app component
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Books
- `GET /api/books` - Get all books (with search/pagination)
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Add new book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)
- `POST /api/books/:id/borrow` - Borrow book
- `POST /api/books/:id/return` - Return book
- `POST /api/books/:id/purchase` - Purchase book

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `POST /api/users` - Add new user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Transactions
- `GET /api/transactions` - Get all transactions (admin only)
- `GET /api/transactions/my` - Get user's transactions
- `GET /api/transactions/:id` - Get transaction by ID

## Usage

### For Users
1. **Register/Login**: Create an account or sign in
2. **Browse Books**: Explore the book catalog with search and filters
3. **View Book Details**: Click on any book to see detailed information
4. **Borrow/Purchase**: Use the action buttons to borrow or buy books
5. **Track Transactions**: Monitor your borrowing and purchase history
6. **Manage Profile**: Update personal information and change password

### For Administrators
1. **Admin Login**: Access the admin panel with admin credentials
2. **Dashboard Overview**: View library statistics and recent activity
3. **Book Management**: Add, edit, and remove books from the library
4. **User Management**: Manage library members and their accounts
5. **Transaction Monitoring**: Track all library activities and overdue books

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Separate user and admin permissions
- **Password Hashing**: Secure password storage with bcrypt
- **Input Validation**: Server-side validation for all inputs
- **Protected Routes**: Authentication required for sensitive operations

## Development

### Available Scripts

#### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

#### Frontend
```bash
npm start        # Start development server
npm build        # Build for production
npm test         # Run tests
npm eject        # Eject from Create React App
```

### Adding New Features
1. **Backend**: Add new models, routes, and middleware in the `server` directory
2. **Frontend**: Create new components and pages in the `lms/src` directory
3. **Database**: Update models and create migrations as needed

## Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Use a process manager like PM2
3. Set up environment variables on your hosting platform
4. Configure MongoDB Atlas for production use

### Frontend Deployment
1. Run `npm run build` to create production build
2. Deploy the `build` folder to your hosting service
3. Configure environment variables for production API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Future Enhancements

- **File Upload**: Book cover images and PDF files
- **Advanced Search**: Full-text search and filters
- **Notifications**: Email and SMS notifications
- **Reports**: Advanced analytics and reporting
- **Mobile App**: React Native mobile application
- **Real-time Updates**: WebSocket integration
- **Payment Integration**: Online payment processing
- **Multi-language Support**: Internationalization

---

**Note**: This is a development version. For production use, ensure all security measures are properly configured and tested.
