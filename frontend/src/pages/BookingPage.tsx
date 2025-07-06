  import { useState } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import { useQuery, useMutation } from '@tanstack/react-query';
  import axios from 'axios';
  import DatePicker from 'react-datepicker';
  import 'react-datepicker/dist/react-datepicker.css';
  import { useAuth } from '../contexts/AuthContext';
  import {
    CheckCircle,
    XCircle,
    Loader2,
    Car as CarIcon,
    Users,
    Fuel,
    Settings,
    Tag
  } from 'lucide-react';

  interface CarDetailsData {
    price_per_day: number;
    brand: string;
    model: string;
    seats: number;
    fuelType?: string;
    transmission?: string;
    mileage?: number;
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

    // useQuery v5 object signature
    const { data: car } = useQuery<CarDetailsData>({
      queryKey: ['carDetails', id],
      queryFn: async () => {
        const response = await axios.get(`/api/cars/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

    // useMutation v5 object signature
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
        setError('Please select both start and end dates.');
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

    const days = dates.startDate && dates.endDate
      ? Math.max(1, Math.ceil((dates.endDate.getTime() - dates.startDate.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    const total = days && car ? days * car.price_per_day : 0;

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary mb-8">Book Car</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-primary mb-4">Select Dates</h2>
            <div className="flex justify-center mb-6">
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
                calendarClassName="border rounded-lg shadow-lg"
              />
            </div>
            {(dates.startDate || dates.endDate) && (
              <div className="text-center mb-6 text-gray-700">
                {dates.startDate && (
                  <p>Pick-up Date: <span className="font-medium">{dates.startDate.toDateString()}</span></p>
                )}
                {dates.endDate && (
                  <p>Drop-off Date: <span className="font-medium">{dates.endDate.toDateString()}</span></p>
                )}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center bg-red-50 p-3 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-600">{error}</span>
                </div>
              )}
              {success && (
                <div className="flex items-center bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700">Booked! Redirecting…</span>
                </div>
              )}
              {days > 0 && car && (
                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between"><span>Days</span><span>{days}</span></div>
                  <div className="flex justify-between"><span>Price/day</span><span>${car.price_per_day}</span></div>
                  <div className="flex justify-between pt-3 border-t font-bold"><span>Total</span><span className="text-accent">${total}</span></div>
                </div>
              )}
              <button
                type="submit"
                disabled={bookingMutation.isPending || success || days === 0 || !car}
                className="w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center disabled:opacity-50"
              >
                {bookingMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : success ? <CheckCircle className="h-5 w-5 mr-2" /> : <CarIcon className="h-5 w-5 mr-2" />}
                {bookingMutation.isPending ? 'Processing...' : success ? 'Booked!' : 'Book Now'}
              </button>
              <p className="text-xs text-center text-gray-500 mt-2">
                By booking, you agree to our terms and conditions
              </p>
            </form>
          </div>
          <div className="space-y-6">
            {car && (
              <div className="p-6 bg-gray-50 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-primary">{car.brand} {car.model}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center"><Users className="h-5 w-5 text-accent mr-1" /><span>{car.seats} Seats</span></div>
                  {car.fuelType && <div className="flex items-center"><Fuel className="h-5 w-5 text-accent mr-1" /><span>{car.fuelType}</span></div>}
                  {car.transmission && <div className="flex items-center"><Settings className="h-5 w-5 text-accent mr-1" /><span>{car.transmission}</span></div>}
                  {car.mileage != null && (
                    <div className="flex items-center"><Tag className="h-5 w-5 text-accent mr-1" /><span>{car.fuelType === 'Electric' ? 'Single Charge Mileage' : 'Mileage'}: {car.mileage} km</span></div>
                  )}
                </div>
              </div>
            )}
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-medium mb-4">What's included</h3>
              <ul className="space-y-2">
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Free cancellation</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Full insurance</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />24/7 assistance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }