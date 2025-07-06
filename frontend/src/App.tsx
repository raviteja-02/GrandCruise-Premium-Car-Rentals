import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { MaintenanceProvider } from './contexts/MaintenanceContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetails from './pages/CarDetails'
import Bookings from './pages/Bookings'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Maintenance from './pages/Maintenance'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminBookings from './pages/Admin/AdminBookings'
import CarManagement from './pages/Admin/CarManagement'
import AdminSettings from './pages/Admin/AdminSettings'
import BookingPage from './pages/BookingPage'

function App() {
  return (
    <AuthProvider>
      <MaintenanceProvider>
      <div className="min-h-screen bg-neutral w-full">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/managecars" element={<CarManagement />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/cars/:id/book" element={<BookingPage />} />
          </Routes>
          </main>
        </div>
      </MaintenanceProvider>
    </AuthProvider>
  )
}

export default App
