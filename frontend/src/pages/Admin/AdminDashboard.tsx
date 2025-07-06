import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/bookings" className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Bookings</h2>
          <p className="text-gray-600">Manage all bookings</p>
        </Link>
        
        <Link to="/admin/managecars" className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Cars</h2>
          <p className="text-gray-600">Manage car inventory</p>
        </Link>
        
        <Link to="/admin/settings" className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p className="text-gray-600">System settings</p>
        </Link>
      </div>
    </div>
  )
} 