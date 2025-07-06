import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

interface Car {
  id: number
  brand: string
  model: string
  year: number
  seats: number
  price_per_day: number
  image: string
  description: string
  fuelType?: string
  transmission?: string
  category?: string
}

interface Filters {
  brand: string
  minPrice: string
  maxPrice: string
  seats: string
  category: string
  fuelType: string
  transmission: string
}

export default function Cars() {
  const [tempFilters, setTempFilters] = useState<Filters>({
    brand: '',
    minPrice: '',
    maxPrice: '',
    seats: '',
    category: '',
    fuelType: '',
    transmission: '',
  })
  const [activeFilters, setActiveFilters] = useState<Filters>({
    brand: '',
    minPrice: '',
    maxPrice: '',
    seats: '',
    category: '',
    fuelType: '',
    transmission: '',
  })
  const [priceSort, setPriceSort] = useState<'asc' | 'desc'>('asc')
  const [hoveredCar, setHoveredCar] = useState<number | null>(null)

  const { data: cars, isLoading } = useQuery<Car[]>({
    queryKey: ['cars', activeFilters, priceSort],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (activeFilters.brand) params.append('brand', activeFilters.brand)
      if (activeFilters.minPrice) params.append('min_price', activeFilters.minPrice)
      if (activeFilters.maxPrice) params.append('max_price', activeFilters.maxPrice)
      if (activeFilters.seats) params.append('min_seats', activeFilters.seats)
      if (activeFilters.category) params.append('category', activeFilters.category)
      if (activeFilters.fuelType) params.append('fuel_type', activeFilters.fuelType)
      if (activeFilters.transmission) params.append('transmission', activeFilters.transmission)
      
      if (priceSort) {
        const orderParam = priceSort === 'asc' ? 'price_per_day' : '-price_per_day'
        params.append('ordering', orderParam)
      }

      const response = await axios.get(`/api/cars/?${params.toString()}`)
      return response.data
    },
  })

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTempFilters((prev) => ({ ...prev, [name]: value }))
    if (name === 'minPrice' || name === 'maxPrice') {
      setPriceSort('asc')
    }
  }

  const handleApplyFilters = () => {
    setActiveFilters(tempFilters)
  }

  const handleResetFilters = () => {
    const emptyFilters = {
      brand: '',
      minPrice: '',
      maxPrice: '',
      seats: '',
      category: '',
      fuelType: '',
      transmission: '',
    }
    setTempFilters(emptyFilters)
    setActiveFilters(emptyFilters)
    setPriceSort('asc')
  }

  const togglePriceSort = () => {
    setPriceSort(current => current === 'asc' ? 'desc' : 'asc')
  }

  useEffect(() => {
    if (!activeFilters.minPrice && !activeFilters.maxPrice) {
      setPriceSort('asc')
    }
  }, [activeFilters.minPrice, activeFilters.maxPrice])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="font-playfair text-2xl font-bold text-primary">Filters</h2>
          <button
            onClick={handleResetFilters}
            className="text-sm text-gray-600 hover:text-primary"
          >
            Reset Filters
          </button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <div className="relative">
              <input
                type="text"
                name="brand"
                value={tempFilters.brand}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 bg-white"
                placeholder="Search brand..."
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  name="minPrice"
                  value={tempFilters.minPrice}
                  onChange={handleFilterChange}
                  className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 bg-white"
                  placeholder="Min"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              </div>
              <span className="text-gray-400">-</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  name="maxPrice"
                  value={tempFilters.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 bg-white"
                  placeholder="Max"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              </div>
              {(tempFilters.minPrice || tempFilters.maxPrice) && (
                <button
                  onClick={togglePriceSort}
                  className="p-2 rounded-lg border border-gray-200 hover:border-accent hover:bg-accent/5 transition-all duration-200"
                  title={priceSort === 'asc' ? 'Sort by price (ascending)' : 'Sort by price (descending)'}
                >
                  {priceSort === 'asc' ? (
                    <ArrowUpIcon className="w-5 h-5 text-accent" />
                  ) : (
                    <ArrowDownIcon className="w-5 h-5 text-accent" />
                  )}
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Seats</label>
            <select
              name="seats"
              value={tempFilters.seats}
              onChange={handleFilterChange}
              aria-label="Select number of seats"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent"
            >
              <option value="">Any</option>
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="7">7+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              name="category"
              value={tempFilters.category}
              onChange={handleFilterChange}
              aria-label="Select car category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent"
            >
              <option value="">Any</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Electric">Electric</option>
              <option value="Luxury">Luxury</option>
              <option value="Sports Car">Sports Car</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
            <select
              id="fuelType"
              name="fuelType"
              value={tempFilters.fuelType}
              onChange={handleFilterChange}
              aria-label="Select fuel type"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent"
            >
              <option value="">Any</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Transmission</label>
            <select
              id="transmission"
              name="transmission"
              value={tempFilters.transmission}
              onChange={handleFilterChange}
              aria-label="Select transmission type"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent"
            >
              <option value="">Any</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Single-Speed">Single-Speed</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleApplyFilters}
              className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Car Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {cars?.map((car) => (
          <motion.div
            key={car.id}
            onHoverStart={() => setHoveredCar(car.id)}
            onHoverEnd={() => setHoveredCar(null)}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-car.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-sm font-medium">Click to view details</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-playfair text-2xl font-bold text-primary">
                    {car.brand} {car.model}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{car.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-accent">${car.price_per_day}</p>
                  <p className="text-sm text-gray-500">per day</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">{car.seats} Seats</span>
                </div>
                {car.fuelType && (
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm text-gray-600">{car.fuelType}</span>
                  </div>
                )}
                {car.transmission && (
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="text-sm text-gray-600">{car.transmission}</span>
                  </div>
                )}
                {car.category && (
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-sm text-gray-600">{car.category}</span>
                  </div>
                )}
              </div>

              <p className="mt-4 line-clamp-2 text-sm text-gray-600">
                {car.description}
              </p>
              
              <Link
                to={`/cars/${car.id}`}
                className="mt-6 block w-full rounded-xl bg-primary px-6 py-3 text-center font-medium text-white transition-colors duration-200 hover:bg-primary/90"
              >
                View Details
              </Link>
            </div>

            {/* Hover Preview */}
            <AnimatePresence>
              {hoveredCar === car.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm p-6"
                >
                  <div className="h-full flex flex-col">
                    <h4 className="font-playfair text-2xl font-bold text-primary mb-2">
                      {car.brand} {car.model}
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>Year: {car.year}</p>
                      <p>Seats: {car.seats}</p>
                      {car.fuelType && <p>Fuel: {car.fuelType}</p>}
                      {car.transmission && <p>Transmission: {car.transmission}</p>}
                      {car.category && <p>Category: {car.category}</p>}
                      <p className="text-lg font-semibold text-accent">
                        ${car.price_per_day}/day
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                      {car.description}
                    </p>
                    <div className="mt-auto pt-4">
                      <Link
                        to={`/cars/${car.id}`}
                        className="block w-full rounded-xl bg-primary px-6 py-3 text-center font-medium text-white transition-colors duration-200 hover:bg-primary/90"
                      >
                        View Full Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {cars?.length === 0 && (
        <div className="text-center">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No cars found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
} 