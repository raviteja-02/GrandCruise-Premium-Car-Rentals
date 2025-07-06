import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FaCar,
  FaShieldAlt,
  FaClock,
  FaUsers,
  FaGasPump,
  FaCog,
} from "react-icons/fa";

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price_per_day: number;
  image: string;
  category: string;
  transmission: string;
  fuelType: string;
  seats: number;
  description: string;
  mileage: number;
}

export default function Home() {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDates, setSearchDates] = useState({ start: "", end: "" });
  const [searchError, setSearchError] = useState("");

  const { data: featuredCars } = useQuery<Car[]>({
    queryKey: ["featuredCars"],
    queryFn: async () => {
      const response = await axios.get("/api/cars/");
      const carsByCategory = response.data.reduce(
        (acc: { [key: string]: Car }, car: Car) => {
          if (!acc[car.category]) {
            acc[car.category] = car;
          }
          return acc;
        },
        {}
      );
      return Object.values(carsByCategory);
    },
  });

  const handleSearch = async () => {
    try {
      setSearchError("");
      if (!searchDates.start || !searchDates.end) {
        setSearchError("Please select both pick-up and return dates");
        return;
      }
      const startDate = new Date(searchDates.start);
      const endDate = new Date(searchDates.end);
      if (startDate > endDate) {
        setSearchError("Return date must be after pick-up date");
        return;
      }
      navigate(
        `/cars?location=${encodeURIComponent(searchLocation)}&start=${searchDates.start}&end=${searchDates.end}`
      );
    } catch (error) {
      setSearchError("An error occurred while searching. Please try again.");
      console.error("Search error:", error);
    }
  };

  return (
    <div className="space-y-16 w-full">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden rounded-2xl bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
          style={{ backgroundImage: "url('/images/car-3d.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/30 to-black z-10" />
        <div className="absolute inset-0 z-10 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className="absolute w-full h-px bg-white"
              style={{ top: `${i * 5}%` }}
            />
          ))}
        </div>
        <div className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-6xl md:text-7xl font-playfair tracking-tight mb-2">
              Premium Car <br />
              <span className="text-purple-400">Rental</span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-playfair font-medium text-white/90 mt-4">
              Your Journey Begins Here
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Discover the perfect car for your next adventure. Premium vehicles, competitive rates, and exceptional service.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-10 w-full max-w-4xl rounded-xl bg-white/10 p-6 backdrop-blur-sm"
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-white">Pick-up Location</label>
                <input
                  type="text"
                  placeholder="Enter city or airport"
                  className="w-full rounded-lg bg-white/20 p-3 text-white placeholder-white/70"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white">Pick-up Date</label>
                <input
                  type="date"
                  className="w-full rounded-lg bg-white/20 p-3 text-white"
                  value={searchDates.start}
                  onChange={(e) => setSearchDates({ ...searchDates, start: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  aria-label="Pick-up Date"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white">Return Date</label>
                <input
                  type="date"
                  className="w-full rounded-lg bg-white/20 p-3 text-white"
                  value={searchDates.end}
                  onChange={(e) => setSearchDates({ ...searchDates, end: e.target.value })}
                  min={searchDates.start || new Date().toISOString().split("T")[0]}
                  aria-label="Return Date"
                />
              </div>
            </div>
            {searchError && <p className="mt-2 text-sm text-red-300">{searchError}</p>}
            <button
              onClick={handleSearch}
              className="mt-6 w-full rounded-lg bg-accent px-6 py-3 text-lg font-semibold text-white hover:bg-accent/90"
            >
              Search Available Cars
            </button>
          </motion.div>
        </div>
      </section>

      <section className="px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <h2 className="font-playfair text-3xl font-bold text-primary">
            Featured Vehicles by Category
          </h2>
          <Link to="/cars" className="text-accent hover:text-accent/80">
            View All Cars →
          </Link>
        </motion.div>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {featuredCars?.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl"
            >
              <div className="relative h-[400px]">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-playfair text-3xl font-bold">
                      {car.brand} {car.model}
                    </h3>
                    <div className="rounded-full bg-accent px-4 py-1 text-sm">
                      {car.category}
                    </div>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-accent">
                    ${car.price_per_day}
                    <span className="text-sm font-normal text-white/80">/day</span>
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 flex translate-y-full flex-col bg-black/80 p-6 text-white transition-transform duration-300 group-hover:translate-y-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-playfair text-2xl font-bold">
                    {car.brand} {car.model}
                  </h4>
                  <div className="rounded-full bg-accent px-4 py-1 text-sm">
                    {car.category}
                  </div>
                </div>
                <div className="mt-auto">
                  <h4 className="mb-4 font-playfair text-xl font-bold text-accent">
                    Car Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaCar className="text-accent" />
                      <span>{car.transmission || "Automatic"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaGasPump className="text-accent" />
                      <span>{car.fuelType || "Petrol"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-accent" />
                      <span>{car.seats || 5} Seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCog className="text-accent" />
                      <span>{car.fuelType === 'Electric' ? 'Single Charge Mileage' : 'Mileage'}: {car.mileage}</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-300">
                    {car.description || `${car.brand} ${car.model} - A perfect blend of comfort and performance.`}
                  </p>
                  <Link
                    to={`/cars/${car.id}`}
                    className="mt-6 block w-full rounded-lg bg-accent px-6 py-3 text-center font-semibold text-white hover:bg-accent/90"
                  >
                    Book for ${car.price_per_day}/day
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.7 }}
        className="bg-gray-50 px-8 py-12"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-playfair text-3xl font-bold text-primary">
            Why Choose Us
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FaCar className="text-2xl text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-primary">Wide Selection</h3>
              <p className="text-sm text-gray-600">
                Choose from our extensive fleet of vehicles to match your needs.
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FaShieldAlt className="text-2xl text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-primary">Secure Booking</h3>
              <p className="text-sm text-gray-600">
                Safe and secure payment processing with 24/7 support.
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FaClock className="text-2xl text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-primary">Flexible Rental</h3>
              <p className="text-sm text-gray-600">
                Flexible rental periods with easy pickup and drop-off.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.7 }}
        className="rounded-2xl bg-primary p-8 text-center text-white"
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="font-playfair text-3xl font-bold">
            Ready to Start Your Journey?
          </h2>
          <p className="mt-4">
            Join thousands of satisfied customers who have experienced our premium car rental service.
          </p>
          <Link
            to="/cars"
            className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 text-white hover:bg-accent/90"
          >
            Browse Our Fleet
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
