import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'

interface Car {
  id: number
  brand: string
  model: string
  year: number
  seats: number
  price_per_day: string
  image: string
  description: string
  fuelType: string
  transmission: string
  features: string[]
  specifications: Array<{
    label: string
    value: string
  }>
  mileage: number
  engine: string
  color: string
  category: string
  rating: number
  reviews: number
  is_available: boolean
  created_at: string
  updated_at: string
}

const initialCarState: Omit<Car, 'id' | 'created_at' | 'updated_at'> = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  seats: 5,
  price_per_day: '0.00',
  image: '',
  description: '',
  fuelType: 'Petrol',
  transmission: 'Automatic',
  features: [],
  specifications: [],
  mileage: 0,
  engine: '',
  color: '',
  category: '',
  rating: 0,
  reviews: 0,
  is_available: true
}

export default function CarManagement() {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Omit<Car, 'id' | 'created_at' | 'updated_at'>>(initialCarState)
  const queryClient = useQueryClient()

  const { data: cars, isLoading } = useQuery<Car[]>({
    queryKey: ['cars'],
    queryFn: async () => {
      const response = await axios.get('/api/cars')
      return response.data
    },
  })

  const addCarMutation = useMutation({
    mutationFn: (newCar: Omit<Car, 'id' | 'created_at' | 'updated_at'>) => 
      axios.post<Car>('/api/cars/', newCar),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
      resetForm()
    },
  })

  const updateCarMutation = useMutation({
    mutationFn: (car: Omit<Car, 'created_at' | 'updated_at'>) => 
      axios.put<Car>(`/api/cars/${car.id}/`, car),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
      resetForm()
    },
  })

  const deleteCarMutation = useMutation({
    mutationFn: (carId: number) => axios.delete(`/api/cars/${carId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'seats' || name === 'mileage' || name === 'rating' || name === 'reviews'
        ? Number(value)
        : name === 'price_per_day'
        ? value.toString()
        : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && selectedCar) {
      const updatedCar = {
        ...formData,
        id: selectedCar.id,
        price_per_day: formData.price_per_day.toString(),
        year: Number(formData.year),
        seats: Number(formData.seats),
        mileage: Number(formData.mileage),
        rating: Number(formData.rating),
        reviews: Number(formData.reviews)
      }
      updateCarMutation.mutate(updatedCar)
    } else {
      const newCar = {
        ...formData,
        price_per_day: formData.price_per_day.toString(),
        year: Number(formData.year),
        seats: Number(formData.seats),
        mileage: Number(formData.mileage),
        rating: Number(formData.rating),
        reviews: Number(formData.reviews)
      }
      addCarMutation.mutate(newCar)
    }
  }

  const handleEdit = (car: Car) => {
    setSelectedCar(car)
    setFormData(car)
    setIsEditing(true)
  }

  const handleDelete = (carId: number) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      deleteCarMutation.mutate(carId)
    }
  }

  const resetForm = () => {
    setFormData(initialCarState)
    setSelectedCar(null)
    setIsEditing(false)
  }

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">
          {isEditing ? 'Edit Car' : 'Add New Car'}
        </h1>
        {isEditing && (
          <button
            onClick={resetForm}
            className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border p-2"
                  required
                  placeholder="Enter car brand"
                  title="Car brand"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border p-2"
                  required
                  placeholder="Enter car model"
                  title="Car model"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border p-2"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                  placeholder="Enter car year"
                  title="Car year"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Price per Day ($)</label>
                <input
                  type="number"
                  name="price_per_day"
                  value={formData.price_per_day}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border p-2"
                  min="0"
                  required
                  placeholder="Enter price per day"
                  title="Price per day"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border p-2"
                  required
                  title="Car category"
                >
                  <option value="">Select Category</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Electric">Electric</option>
                  <option value="Electric Sedan">Electric Sedan</option>
                  <option value="Electric Luxury">Electric Luxury</option>
                  <option value="Electric Sports">Electric Sports</option>
                  <option value="Electric SUV">Electric SUV</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Luxury Sedan">Luxury Sedan</option>
                  <option value="Luxury SUV">Luxury SUV</option>
                  <option value="Hybrid SUV">Hybrid SUV</option>
                  <option value="Hybrid Sedan">Hybrid Sedan</option>
                  <option value="Sports Car">Sports Car</option>
                  <option value="Economy">Economy</option>
                  <option value="Compact">Compact</option>
                  <option value="Mid-size">Mid-size</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Transmission</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border p-2"
                  required
                  title="Transmission type"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Single-Speed">Single-Speed</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Fuel Type</label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border p-2"
                  required
                  title="Fuel type"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Seats</label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border p-2"
                  min="2"
                  max="9"
                  required
                  placeholder="Enter number of seats"
                  title="Number of seats"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Mileage (km)</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                className="w-full rounded-lg border p-2"
                min="0"
                required
                placeholder="Enter car mileage"
                title="Car mileage"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Engine</label>
                <input
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border p-2"
                  required
                  placeholder="Enter engine type"
                  title="Engine type"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border p-2"
                  required
                  placeholder="Enter car color"
                  title="Car color"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Features (comma-separated)</label>
              <input
                type="text"
                name="features"
                value={formData.features.join(', ')}
                onChange={(e) => {
                  const features = e.target.value.split(',').map(f => f.trim()).filter(f => f)
                  setFormData(prev => ({ ...prev, features }))
                }}
                className="w-full rounded-lg border p-2"
                required
                placeholder="Enter features separated by commas"
                title="Car features"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Specifications</label>
              <div className="space-y-2">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="grid gap-2 md:grid-cols-2">
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) => {
                        const newSpecs = [...formData.specifications]
                        newSpecs[index].label = e.target.value
                        setFormData(prev => ({ ...prev, specifications: newSpecs }))
                      }}
                      className="w-full rounded-lg border p-2"
                      placeholder="Specification label"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => {
                          const newSpecs = [...formData.specifications]
                          newSpecs[index].value = e.target.value
                          setFormData(prev => ({ ...prev, specifications: newSpecs }))
                        }}
                        className="w-full rounded-lg border p-2"
                        placeholder="Specification value"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newSpecs = formData.specifications.filter((_, i) => i !== index)
                          setFormData(prev => ({ ...prev, specifications: newSpecs }))
                        }}
                        className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                        title="Remove specification"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      specifications: [...prev.specifications, { label: '', value: '' }]
                    }))
                  }}
                  className="mt-2 flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  <FaPlus /> Add Specification
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_available"
                name="is_available"
                checked={formData.is_available}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, is_available: e.target.checked }))
                }}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="is_available" className="text-sm font-medium">
                Car is available for booking
              </label>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full rounded-lg border p-2"
                required
                placeholder="Enter image URL"
                title="Car image URL"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-lg border p-2"
                rows={3}
                required
                placeholder="Enter car description"
                title="Car description"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Rating (0-5)</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border p-2"
                  min="0"
                  max="5"
                  step="0.1"
                  required
                  placeholder="Enter rating"
                  title="Car rating"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Number of Reviews</label>
                <input
                  type="number"
                  name="reviews"
                  value={formData.reviews}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border p-2"
                  min="0"
                  required
                  placeholder="Enter number of reviews"
                  title="Number of reviews"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              {isEditing ? 'Update Car' : 'Add Car'}
            </button>
          </form>
        </div>

        {/* Cars List Section */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-primary">Cars List</h2>
          <div className="space-y-4">
            {cars?.map((car) => (
              <div
                key={car.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <h3 className="font-semibold">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {car.category} • ${car.price_per_day}/day
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(car)}
                    className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                    title="Edit car details"
                    aria-label="Edit car details"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                    title="Delete car"
                    aria-label="Delete car"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 