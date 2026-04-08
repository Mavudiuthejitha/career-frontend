import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Fairs from './pages/Fairs';
import Booth from './pages/Booth';
import UploadResume from './pages/uploadResume';
import AdminDashboard from './pages/AdminDashboard';
import ViewResumes from './pages/ViewResumes';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/fairs" element={<Fairs />} />
        <Route path="/booths/:fairId" element={<Booth />} />

        {/* Protected - Candidate only */}
        <Route path="/upload-resume" element={
          <ProtectedRoute allowedRoles={['Candidate']}>
            <UploadResume />
          </ProtectedRoute>
        } />

        {/* Protected - Admin only */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Protected - Admin + Recruiter */}
        <Route path="/resumes" element={
          <ProtectedRoute allowedRoles={['Admin', 'Recruiter']}>
            <ViewResumes />
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}