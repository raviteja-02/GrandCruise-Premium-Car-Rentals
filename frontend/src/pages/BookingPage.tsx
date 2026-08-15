import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../contexts/AuthContext';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  UserGroupIcon as Users,
  FireIcon as Fuel,
  Cog6ToothIcon as Settings,
  TagIcon as Tag,
  CalendarDaysIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface CarDetailsData {
  price_per_day: number;
  brand: string;
  model: string;
  seats: number;
  fuelType?: string;
  transmission?: string;
  mileage?: number;
  image?: string;
  description?: string;
  category?: string;
  rating?: number;
}

interface BookingDates {
  startDate: Date | null;
  endDate: Date | null;
}

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useAuth();
  const [dates, setDates] = useState<BookingDates>({ startDate: null, endDate: null });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch car details
  const { data: car } = useQuery<CarDetailsData>({
    queryKey: ['carDetails', id],
    queryFn: async () => {
      const response = await axios.get(`/api/cars/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (payload: { car: number; start_date: string; end_date: string }) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      const auth = token.startsWith('Token ') ? token : `Token ${token}`;
      await axios.post(
        '/api/bookings/',
        payload,
        { headers: { Authorization: auth, 'Content-Type': 'application/json' } }
      );
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => navigate('/bookings'), 2000);
    },
    onError: (err: any) => {
      if (err.message === 'Authentication required') {
        setError('Please log in to make a booking');
        return;
      }
      const data = err.response?.data;
      const msg = Array.isArray(data)
        ? data[0]
        : typeof data === 'object'
        ? Object.values(data)[0]
        : 'Booking failed';
      setError(msg as string);
    }
  });

  const handleDateChange = (range: [Date | null, Date | null]) => {
    setDates({ startDate: range[0], endDate: range[1] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!dates.startDate || !dates.endDate) {
      setError('Please select both pick-up and drop-off dates.');
      return;
    }
    const fmt = (d: Date) => {
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    bookingMutation.mutate({
      car: Number(id),
      start_date: fmt(dates.startDate),
      end_date: fmt(dates.endDate)
    });
  };

  // Fixed Booking Days Calculation to use standard non-inclusive range (minimum 1 day)
  const days = dates.startDate && dates.endDate
    ? Math.max(1, Math.round((dates.endDate.getTime() - dates.startDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const total = days && car ? days * car.price_per_day : 0;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Luxury Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/50 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <SparklesIcon className="h-3.5 w-3.5 text-amber-600" />
            Premium Fleet Reservation
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Secure Your Journey
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-xl mx-auto">
            Experience unparalleled luxury and dynamic driving performance. Review details and confirm your reservation below.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Premium Scheduler & Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CalendarDaysIcon className="h-6 w-6 text-amber-600" />
              Select Booking Window
            </h2>
            
            <div className="flex justify-center mb-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <DatePicker
                selected={dates.startDate}
                onChange={handleDateChange}
                startDate={dates.startDate}
                endDate={dates.endDate}
                selectsRange
                inline
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                showPopperArrow={false}
                calendarClassName="border-0 shadow-sm rounded-xl font-sans"
              />
            </div>

            {/* Custom Selected Dates Display */}
            <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                <span className="block text-xs uppercase font-semibold text-gray-400">Pick-up Date</span>
                <span className="text-sm font-bold text-gray-800">
                  {dates.startDate ? dates.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not Selected'}
                </span>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                <span className="block text-xs uppercase font-semibold text-gray-400">Drop-off Date</span>
                <span className="text-sm font-bold text-gray-800">
                  {dates.endDate ? dates.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not Selected'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 p-4 rounded-xl">
                  <XCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-red-800">{error}</span>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                  <CheckCircleIcon className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-emerald-800">Booking Confirmed! Redirecting to dashboard…</span>
                </div>
              )}

              {/* Luxury Pricing Breakdown */}
              {days > 0 && car && (
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Duration</span>
                    <span className="font-bold text-gray-900">{days} {days === 1 ? 'Day' : 'Days'}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Daily Rate</span>
                    <span className="font-bold text-gray-900">${car.price_per_day.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200 font-bold text-lg text-gray-900">
                    <span>Estimated Total</span>
                    <span className="text-amber-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={bookingMutation.isPending || success || days === 0 || !car}
                className="w-full bg-gray-900 hover:bg-black text-amber-500 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
              >
                {bookingMutation.isPending ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin text-amber-500" />
                ) : success ? (
                  <CheckCircleIcon className="h-5 w-5 text-amber-500" />
                ) : (
                  <ShieldCheckIcon className="h-5 w-5 text-amber-500" />
                )}
                {bookingMutation.isPending ? 'Processing reservation...' : success ? 'Confirmed!' : 'Confirm Reservation'}
              </button>
              
              <p className="text-xs text-center text-gray-400 mt-4">
                No credit card charged now. Fully flexible cancelation policy applies.
              </p>
            </form>
          </div>

          {/* Right Column: Premium Summary Card & Inclusions */}
          <div className="lg:col-span-5 space-y-8">
            {car && (
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                {/* Car Header Banner */}
                <div className="h-56 overflow-hidden relative">
                  <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black px-2.5 py-1 rounded-full mb-2">
                      {car.category || 'Premium'}
                    </span>
                    <h2 className="text-2xl font-extrabold">{car.brand} {car.model}</h2>
                  </div>
                </div>

                {/* Car Spec Attributes */}
                <div className="p-6 space-y-6">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {car.description || 'Experience comfort, class, and dynamic performance in our premium fleet selection.'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-sm">
                    <div className="flex items-center gap-2.5 text-gray-600 bg-gray-50 p-3 rounded-xl">
                      <Users className="h-5 w-5 text-amber-600" />
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase font-semibold">Capacity</span>
                        <span className="font-bold text-gray-800">{car.seats} Seats</span>
                      </div>
                    </div>
                    {car.fuelType && (
                      <div className="flex items-center gap-2.5 text-gray-600 bg-gray-50 p-3 rounded-xl">
                        <Fuel className="h-5 w-5 text-amber-600" />
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase font-semibold">Fuel System</span>
                          <span className="font-bold text-gray-800">{car.fuelType}</span>
                        </div>
                      </div>
                    )}
                    {car.transmission && (
                      <div className="flex items-center gap-2.5 text-gray-600 bg-gray-50 p-3 rounded-xl">
                        <Settings className="h-5 w-5 text-amber-600" />
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase font-semibold">Gearbox</span>
                          <span className="font-bold text-gray-800">{car.transmission}</span>
                        </div>
                      </div>
                    )}
                    {car.mileage != null && (
                      <div className="flex items-center gap-2.5 text-gray-600 bg-gray-50 p-3 rounded-xl">
                        <Tag className="h-5 w-5 text-amber-600" />
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase font-semibold">Range / Efficiency</span>
                          <span className="font-bold text-gray-800">{car.mileage} {car.fuelType === 'Electric' ? 'mi' : 'mpg'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Premium Inclusions Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-5">
              <h3 className="font-bold text-lg text-gray-900 border-b border-gray-150 pb-3">
                GrandCruise Complementary Perks
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-sm font-semibold text-gray-800">Flexible Cancelation</span>
                    <span className="block text-xs text-gray-400">Cancel for free up to 24 hours prior to trip.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-sm font-semibold text-gray-800">Comprehensive Shield Cover</span>
                    <span className="block text-xs text-gray-400">Premium comprehensive insurance covers damage & theft.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-sm font-semibold text-gray-800">Elite Concierge Support</span>
                    <span className="block text-xs text-gray-400">24/7 dedicated helpline and VIP roadside assistance.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}