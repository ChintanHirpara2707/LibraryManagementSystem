import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/colors.css';
import './styles/theme.css';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ResetPassword from './components/common/ResetPassword';

// User Pages
import UserLogin from './pages/user/UserLogin';
import UserRegister from './pages/user/UserRegister';
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import BookCatalog from './pages/user/BookCatalog';
import BookDetail from './pages/user/BookDetail';
import UserTransactions from './pages/user/UserTransactions';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import BookManagement from './pages/admin/BookManagement';
import UserManagement from './pages/admin/UserManagement';
import TransactionManagement from './pages/admin/TransactionManagement';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';

// Simple Redirect component to avoid Navigate
const Redirect = ({ to }) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(to, { replace: true });
  }, [to, navigate]);
  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = ['user', 'admin'] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Redirect to="/login" />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Redirect to="/" />;
  }
  
  return children;
};

// User Protected Route
const UserRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['user']}>
    {children}
  </ProtectedRoute>
);

// Admin Protected Route
const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']}>
    {children}
  </ProtectedRoute>
);

// App Content Component
const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            
            {/* User Authentication Routes */}
            <Route path="/login" element={user ? <Redirect to="/dashboard" /> : <UserLogin />} />
            <Route path="/register" element={user ? <Redirect to="/dashboard" /> : <UserRegister />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Admin Authentication Routes */}
            <Route path="/admin/login" element={user?.role === 'admin' ? <Redirect to="/admin/dashboard" /> : <AdminLogin />} />
            <Route path="/admin/register" element={user?.role === 'admin' ? <Redirect to="/admin/dashboard" /> : <AdminRegister />} />
            
            {/* User Protected Routes */}
            <Route path="/dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />
            <Route path="/profile" element={<UserRoute><UserProfile /></UserRoute>} />
            <Route path="/books" element={<BookCatalog />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/transactions" element={<UserRoute><UserTransactions /></UserRoute>} />
            
            {/* Admin Protected Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
            <Route path="/admin/books" element={<AdminRoute><BookManagement /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
            <Route path="/admin/transactions" element={<AdminRoute><TransactionManagement /></AdminRoute>} />
            
            {/* Catch all route */}
            <Route path="*" element={<Redirect to="/" />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
};

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
