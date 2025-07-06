import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useMaintenance } from '../contexts/MaintenanceContext'
import {
  Users, Fuel, Settings, Tag, CheckCircle, Star, Loader2
} from 'lucide-react'
import { API_BASE_URL } from '../components/hooks/config'
import { useState, useEffect } from 'react'

interface Car {
  id: number
  brand: string
  model: string
  year: number
  description: string
  seats: number
  fuelType: string
  transmission: string
  price_per_day: number
  image: string
  features: string[]
  specifications: { label: string; value: string }[]
  mileage?: number
  engine?: string
  color?: string
  category?: string
  rating?: number
  reviews?: number
  is_available: boolean
}
interface GalleryItem {
  car: number; gallery_url: string; images: string[];
}
type GalleryResponse = GalleryItem[];

export default function CarDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isMaintenanceMode } = useMaintenance()

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const { data: car, isLoading, error: carError } = useQuery<Car>({
    queryKey: ['car', id],
    queryFn: async () => { const res = await axios.get(`${API_BASE_URL}/cars/${id}/`); return res.data; },
    enabled: !!id,
    retry: 1
  })
  const { data: galleryResponse, isLoading: galleryLoading } = useQuery<GalleryResponse>({
    queryKey: ['car-gallery', id],
    queryFn: async () => { const res = await axios.get(`${API_BASE_URL}/car-gallery/?car=${id}`); return res.data; },
    enabled: !!id,
  })

  // Image extraction logic
  const carGalleryData = galleryResponse?.[0];
  const exteriorImages: string[] = (carGalleryData?.images || []).filter(
    (url: string) => url && !url.includes('spacer3x2.png')
  );

  // Carousel Logic
  useEffect(() => { setCurrentSlide(0) }, [id])

  useEffect(() => {
    if (exteriorImages.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === exteriorImages.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [exteriorImages.length, isHovered]);

  const handlePrev = () => setCurrentSlide((prev) => (prev === 0 ? exteriorImages.length - 1 : prev - 1))
  const handleNext = () => setCurrentSlide((prev) => (prev === exteriorImages.length - 1 ? 0 : prev + 1))

  // Loading and Error states
  if (isLoading) return (
    <div className="flex flex-col h-64 items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-accent h-8 w-8" />
      <p className="text-muted-foreground">Loading car details...</p>
    </div>
  )
  if (carError || !car) return (
    <div className="text-center py-10">
      <h3 className="text-lg font-semibold text-red-600">Error loading car details</h3>
      <p className="text-sm text-gray-500 mt-2">Please try again later</p>
      <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90">
        Retry
      </button>
    </div>
  )

  const specs = [
    { icon: Users, label: 'Seats', value: car.seats },
    { icon: Fuel, label: 'Fuel', value: car.fuelType },
    { icon: Settings, label: 'Transmission', value: car.transmission },
    { icon: Tag, label: car.fuelType === 'Electric' ? 'Range' : 'Mileage', value: `${car.mileage} km` },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* 🚗 Car Image Gallery */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {galleryLoading ? (
          <div className="flex h-[400px] items-center justify-center bg-gray-100">
            <Loader2 className="animate-spin text-accent h-8 w-8" />
          </div>
        ) : exteriorImages.length > 0 ? (
          <div className="relative w-full h-[400px]">
            <img
              src={exteriorImages[currentSlide]}
              alt={car.model}
              className="w-full h-[400px] object-cover transition-all duration-500"
            />
            {/* Clickable Area Overlays with Custom Arrow Cursors from CSS file */}
            {exteriorImages.length > 1 && (
              <>
                {/* Left Clickable Area with Left Arrow Cursor */}
                <div
                  onClick={handlePrev}
                  aria-label="Previous image"
                  role="button"
                  className="absolute left-0 top-0 h-full w-1/2 cursor-arrow-left"
                />
                {/* Right Clickable Area with Right Arrow Cursor */}
                <div
                  onClick={handleNext}
                  aria-label="Next image"
                  role="button"
                  className="absolute right-0 top-0 h-full w-1/2 cursor-arrow-right"
                />
              </>
            )}
          </div>
        ) : (
          <img src={car.image} alt={car.model} className="w-full h-[400px] object-cover"/>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-6 left-6 text-white space-y-2">
          <h1 className="text-4xl font-bold">{car.brand} {car.model}</h1>
          <p className="text-md text-white/80">{car.year} • {car.category || 'Standard'}</p>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm">{car.rating || 0} ({car.reviews || 0} reviews)</span>
          </div>
        </div>
        <div className="absolute top-6 right-6 bg-white/90 px-4 py-1 rounded-full text-primary font-semibold">
          ${car.price_per_day || 0}/day
        </div>
      </div>

      {/* 📝 Description */}
      <div className="mt-10 space-y-6">
        <p className="text-lg text-gray-700 leading-relaxed">{car.description}</p>

        {/* 📊 Key Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {specs.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-secondary/30 p-4 rounded-xl text-center">
              <Icon className="mx-auto mb-2 h-6 w-6 text-accent" />
              <div className="text-sm text-muted-foreground">{label}</div>
              <div className="text-xl font-bold text-foreground">{value}</div>
            </div>
          ))}
        </div>

        {/* 🎯 Features */}
        {car.features?.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {car.features.map((f) => (
                <div key={f} className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span className="text-sm text-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 📐 Technical Specs */}
        {car.specifications?.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {car.specifications.map((s) => (
                <div key={s.label} className="flex justify-between items-center bg-secondary/20 p-4 rounded-lg">
                  <span className="text-muted-foreground font-medium">{s.label}</span>
                  <span className="text-foreground font-semibold">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 📅 Booking CTA */}
      <div className="mt-10">
        {isMaintenanceMode ? (
          <button
            disabled
            className="w-full bg-yellow-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 cursor-not-allowed"
          >
            Booking Unavailable (Maintenance Mode)
          </button>
        ) : !car.is_available ? (
          <button
            disabled
            className="w-full bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 cursor-not-allowed"
          >
            Car Not Available
          </button>
        ) : (
          <button
            onClick={() => navigate(`/cars/${car.id}/book`)}
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-all duration-200"
          >
            Book Now for ${car.price_per_day || 0}/day
          </button>
        )}
      </div>
    </div>
  )
}