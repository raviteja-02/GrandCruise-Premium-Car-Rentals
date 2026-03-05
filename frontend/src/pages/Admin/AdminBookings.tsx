import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { CalendarIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

// Updated to match nested JSON structure
interface Booking {
  id: number
  user: number
  user_details: { username: string; email: string }
  car: number
  car_details: { brand: string; model: string; image: string }
  start_date: string
  end_date: string
  total_price: number | string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
}

export default function AdminBookings() {
  const { user, loading: authLoading } = useAuth()
  const queryClient = useQueryClient()

  const { data: bookings = [], error } = useQuery<Booking[]>({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      // No need to get token from localStorage here, AuthContext sets axios defaults
      const response = await axios.get('http://localhost:8000/api/bookings/');
      return response.data;
    },
    enabled: !!user?.is_staff && !authLoading,
    refetchInterval: 5000,
    retry: 1,
  })

  const updateStatus = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: number; status: 'pending' | 'confirmed' | 'cancelled' | 'completed' }) => {
      // No need to get token from localStorage here, AuthContext sets axios defaults
      return axios.patch(
        `http://localhost:8000/api/bookings/${bookingId}/update_status/`,
        { status },
      );
    },
    onMutate: async ({ bookingId, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['admin-bookings'] });

      // Snapshot the previous value
      const previousBookings = queryClient.getQueryData<Booking[]>(['admin-bookings']);

      // Optimistically update to the new value
      if (previousBookings) {
        queryClient.setQueryData<Booking[]>(['admin-bookings'], (old) =>
          old?.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status }
              : booking
          )
        );
      }

      return { previousBookings };
    },
    onError: (err: any, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousBookings) {
        queryClient.setQueryData(['admin-bookings'], context.previousBookings);
      }
      console.error('Full error response:', err.response);
      const errorMessage = err.response?.data?.error || 
                         err.response?.data?.detail || 
                         err.response?.data?.message || 
                         'Failed to update booking status';
      
      // Add more descriptive messages for common errors
      if (errorMessage.includes('cannot be cancelled')) {
        toast.error('This booking cannot be cancelled because it has either already started or is in a non-cancellable state');
      } else {
        toast.error(errorMessage);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
    },
  })

  const deleteBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      // No need to get token from localStorage here, AuthContext sets axios defaults
      return axios.delete(
        `http://localhost:8000/api/bookings/${bookingId}/`,
      );
    },
    onMutate: async (bookingId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['admin-bookings'] });

      // Snapshot the previous value
      const previousBookings = queryClient.getQueryData<Booking[]>(['admin-bookings']);

      // Optimistically update to the new value
      if (previousBookings) {
        queryClient.setQueryData<Booking[]>(['admin-bookings'], (old) =>
          old?.filter((booking) => booking.id !== bookingId)
        );
      }

      return { previousBookings };
    },
    onError: (err: any, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousBookings) {
        queryClient.setQueryData(['admin-bookings'], context.previousBookings);
      }
      console.error('Full error response:', err.response);
      const errorMessage = err.response?.data?.error || 
                         err.response?.data?.detail || 
                         err.response?.data?.message || 
                         'Failed to delete booking';
      
      toast.error(errorMessage);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] }); // Invalidate user bookings as well
    },
  })

  if (authLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  if (!user?.is_staff) return <div className="text-center p-6"><h3 className="text-red-600 text-lg">Access Denied</h3><p className="text-gray-500">Admins only</p></div>
  if (error) return <div className="text-center p-6"><h3 className="text-red-600 text-lg">Error loading</h3><p className="text-gray-500">Try refresh</p></div>

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Manage Bookings</h1>
      <div className="grid gap-6">
        <AnimatePresence>
          {bookings.map(b => {
            // destruct nested details
            const { brand, model, image } = b.car_details
            const { username, email } = b.user_details
            
            const parseDateString = (dateString: string) => {
              const [year, month, day] = dateString.split('-').map(Number);
              return new Date(year, month - 1, day);
            };

            const start = parseDateString(b.start_date).toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })
            const end = parseDateString(b.end_date).toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })
            const created = new Date(b.created_at).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' })
            const statusStyles = {
              pending: 'bg-yellow-100 text-yellow-800',
              confirmed: 'bg-green-100 text-green-800',
              cancelled: 'bg-red-100 text-red-800',
              completed: 'bg-blue-100 text-blue-800'
            }
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <img
                  src={image}
                  alt={`${brand} ${model}`}
                  className="h-48 md:h-auto md:w-64 object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = '/placeholder-car.png' }}
                />
                <div className="flex flex-1 flex-col p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-primary">{brand} {model}</h2>
                      <p className="text-sm text-gray-600">Booked by: {username} ({email})</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full ${statusStyles[b.status]}`}> {b.status.charAt(0).toUpperCase() + b.status.slice(1)} </span>
                      <button
                        onClick={() => deleteBookingMutation.mutate(b.id)}
                        disabled={deleteBookingMutation.isPending}
                        className="p-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        title="Delete Booking History"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center"><CalendarIcon className="w-5 h-5 text-accent mr-1"/><span>{start} - {end}</span></div>
                    <div className="flex items-center"><CheckIcon className="w-5 h-5 text-accent mr-1"/><span>${b.total_price}</span></div>
                    <div className="col-span-2 text-gray-500">Booked on: {created}</div>
                  </div>
                  {b.status === 'pending' && (
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => updateStatus.mutate({ bookingId: b.id, status: 'confirmed' })}
                        disabled={updateStatus.isPending}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                      >Confirm</button>
                      <button
                        onClick={() => updateStatus.mutate({ bookingId: b.id, status: 'cancelled' })}
                        disabled={updateStatus.isPending}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                      >Cancel</button>
                    </div>
                  )}
                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus.mutate({ bookingId: b.id, status: 'completed' })}
                      disabled={updateStatus.isPending}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >Mark Completed</button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
      {bookings.length === 0 && (
        <div className="text-center p-6">
          <h3 className="text-lg font-medium text-gray-900">No Bookings Found</h3>
          <p className="text-gray-500">There are no bookings right now.</p>
        </div>
      )}
    </div>
  )
}
