import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { 
  CalendarIcon, 
  XMarkIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationCircleIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface Car {
  id: number
  brand: string
  model: string
  image: string
  year: number
  seats: number
  transmission: string
  fuelType: string
}

interface Booking {
  id: number
  car: Car
  car_details: Car
  start_date: string
  end_date: string
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
}

const statusConfig = {
  pending: {
    icon: ClockIcon,
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
  },
  confirmed: {
    icon: CheckCircleIcon,
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
  },
  cancelled: {
    icon: XMarkIcon,
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
  },
  completed: {
    icon: CheckCircleIcon,
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
  },
}

export default function Bookings() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: bookings, isLoading, error } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      try {
        // No need to get token from localStorage here, AuthContext sets axios defaults
        const response = await axios.get('http://localhost:8000/api/bookings/my_bookings/');
        return response.data;
      } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
    },
    enabled: !!user,
    refetchInterval: 3000,
    retry: 1,
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      try {
        // No need to get token from localStorage here, AuthContext sets axios defaults
        const response = await axios.patch(
          `http://localhost:8000/api/bookings/${bookingId}/`,
          { status: 'cancelled' },
        );
        return response.data;
      } catch (error) {
        console.error('Error cancelling booking:', error);
        throw error;
      }
    },
    onMutate: async (bookingId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['bookings'] });

      // Snapshot the previous value
      const previousBookings = queryClient.getQueryData<Booking[]>(['bookings']);

      // Optimistically update to the new value
      if (previousBookings) {
        queryClient.setQueryData<Booking[]>(['bookings'], (old) =>
          old?.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: 'cancelled' }
              : booking
          )
        );
      }

      return { previousBookings };
    },
    onError: (_err, _bookingId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousBookings) {
        queryClient.setQueryData(['bookings'], context.previousBookings);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600">Please log in to view your bookings</h3>
            <p className="mt-2 text-sm text-gray-500">You need to be logged in to access this page.</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
          <p className="mt-4 text-sm text-gray-500">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-red-600">Error loading bookings</h3>
            <p className="mt-1 text-sm text-gray-500">Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br rounded-2xl from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-sm text-gray-500">Manage your car rental bookings</p>
        </div>

        <div className="grid gap-8">
          <AnimatePresence>
            {bookings?.map((booking) => {
              const carDetails = booking.car_details || booking.car
              const status = statusConfig[booking.status]
              const StatusIcon = status.icon

              const parseDateString = (dateString: string) => {
                const [year, month, day] = dateString.split('-').map(Number);
                return new Date(year, month - 1, day);
              };

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.02]"
                >
                  <div className="md:flex">
                    {/* Image Section */}
                    <div className="md:w-1/2 relative">
                      <img
                        src={carDetails.image}
                        alt={`${carDetails.brand} ${carDetails.model}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/car-placeholder.jpg';
                        }}
                      />
                    </div>

                    {/* Content Section */}
                    <div className="md:w-1/2 p-6 md:p-8">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="space-y-4">
                              <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                  {carDetails.brand} {carDetails.model}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                  {carDetails.year} • {carDetails.seats} seats • {carDetails.transmission} • {carDetails.fuelType}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2 text-gray-600">
                                    <CalendarIcon className="h-5 w-5 text-accent" />
                                    <span className="text-sm">
                                      {parseDateString(booking.start_date).toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-gray-600">
                                    <CalendarIcon className="h-5 w-5 text-accent" />
                                    <span className="text-sm">
                                      {parseDateString(booking.end_date).toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2 text-gray-600">
                                    <CreditCardIcon className="h-5 w-5 text-accent" />
                                    <span className="text-sm">
                                      ${booking.total_price} total
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end space-y-3">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full ${status.bgColor} ${status.textColor} border ${status.borderColor}`}>
                                <StatusIcon className="h-4 w-4 mr-1.5" />
                                <span className="text-sm font-medium">
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                              </div>
                              {booking.status === 'pending' && (
                                <button
                                  onClick={() => cancelBookingMutation.mutate(booking.id)}
                                  disabled={cancelBookingMutation.isPending}
                                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                  <XMarkIcon className="h-4 w-4 mr-1.5" />
                                  Cancel Booking
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {bookings?.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <CalendarIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-2 text-sm text-gray-500">
              You haven't made any bookings yet. Start by browsing our available cars!
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 