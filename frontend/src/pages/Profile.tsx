import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { CalendarIcon, UserCircleIcon } from '@heroicons/react/24/outline'

interface ProfileForm {
  first_name: string
  last_name: string
  email: string
  phone_number: string
}

interface Booking {
  id: number
  car: {
    brand: string
    model: string
    image: string
  }
  start_date: string
  end_date: string
  total_price: number
  status: string
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const queryClient = useQueryClient()
  const [form, setForm] = useState<ProfileForm>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone_number: user?.profile?.phone_number || '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await axios.get('/api/bookings/my_bookings/')
      return response.data
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileForm) => {
      const response = await axios.patch('/api/users/me/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      setSuccess('Profile updated successfully')
      setError('')
    },
    onError: () => {
      setError('Failed to update profile')
      setSuccess('')
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(form)
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <div className="rounded-xl bg-white p-8 shadow-lg">
        <div className="flex items-center space-x-4">
          <UserCircleIcon className="h-16 w-16 text-primary" />
          <div>
            <h1 className="font-playfair text-3xl font-bold text-primary">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-gray-600">@{user.username}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
              {success}
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={form.first_name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, first_name: e.target.value }))
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={form.last_name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, last_name: e.target.value }))
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent"
            />
          </div>
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={form.phone_number}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phone_number: e.target.value }))
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-xl bg-white p-8 shadow-lg">
        <h2 className="font-playfair text-2xl font-bold text-primary">Recent Bookings</h2>
        <div className="mt-6 space-y-4">
          {bookings?.slice(0, 3).map((booking) => (
            <div
              key={booking.id}
              className="flex items-center space-x-4 rounded-lg border p-4"
            >
              <img
                src={booking.car.image}
                alt={`${booking.car.brand} ${booking.car.model}`}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-primary">
                  {booking.car.brand} {booking.car.model}
                </h3>
                <div className="mt-1 flex items-center space-x-2 text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {new Date(booking.start_date).toLocaleDateString()} -{' '}
                    {new Date(booking.end_date).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-accent">
                  Total: ${booking.total_price}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          ))}
          {bookings?.length === 0 && (
            <p className="text-center text-gray-600">No bookings found</p>
          )}
          {bookings && bookings.length > 3 && (
            <button
              onClick={() => navigate('/bookings')}
              className="w-full rounded-lg border border-primary px-4 py-2 text-primary hover:bg-primary hover:text-white"
            >
              View All Bookings
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 