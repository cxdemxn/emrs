import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layout Components
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';
import AuthLayout from './layouts/AuthLayout';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import FacultyManagement from './pages/admin/FacultyManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import CourseManagement from './pages/admin/CourseManagement';
// import TimetableCreation from './pages/admin/TimetableCreation';
import TimetableView from './pages/admin/TimetableView';
import CreateTimetableForm from './pages/admin/CreateTimetableForm';
import TimetableScheduler from './pages/admin/TimetableScheduler';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentTimetable from './pages/student/Timetable';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentRegister from './pages/auth/StudentRegister';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole: string }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading authentication...</div>;
  }
  
  if (!isAuthenticated || userRole !== requiredRole) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } />
          <Route path="/register" element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          } />
          <Route path="/student-register/:departmentId/:registrationCode" element={
            <AuthLayout>
              <StudentRegister />
            </AuthLayout>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/faculties" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <FacultyManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/departments" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <DepartmentManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <CourseManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          {/* <Route path="/admin/timetables/create" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <TimetableCreation />
              </AdminLayout>
            </ProtectedRoute>
          } /> */}
          <Route path="/admin/timetables/view" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <TimetableView />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/timetables/create" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <CreateTimetableForm />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/timetables/scheduler" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <TimetableScheduler />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentLayout>
                <StudentDashboard />
              </StudentLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/timetable" element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentLayout>
                <StudentTimetable />
              </StudentLayout>
            </ProtectedRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
