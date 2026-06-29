import { useState, useEffect } from 'react'
import { Link, useSearchParams, useLocation } from 'react-router-dom'
import {
  Search, X, ChevronDown, ChevronUp, Star,
  MapPin, Users, Settings, Fuel, Phone, Clock,
  Check,
} from 'lucide-react'
import { getCars, getCarFilters } from '../api/cars'
import { getLocationById } from '../api/locations'
import Spinner from '../components/ui/Spinner'

const TRANSMISSIONS = ['automatic', 'manual']
const SORT_OPTIONS  = [
  { value: 'price-asc',   label: 'Price Low to High' },
  { value: 'price-desc',  label: 'Price High to Low' },
  { value: 'model-asc',   label: 'Sort By Model' },
  { value: 'rating-desc', label: 'Sort By Review Score' },
  { value: '-createdAt',  label: 'Newest First' },
]
const RENTAL_TIPS = [
  {
    title: 'Top 5 Tips for First-Time Car Renters',
    date: 'January 9, 2025',
    image: '/articles/first-time.jpg',
  },
  {
    title: 'How to Enjoy Sightseeing With Car Rentals',
    date: 'January 6, 2025',
    image: '/articles/road-trip.jpg',
  },
  {
    title: 'Ride Across the Blue Ridge Parkway',
    date: 'January 5, 2025',
    image: '/articles/insurance.jpg',
  },
]

// ── Horizontal list-style car card ──────────────────────────────────────────
function CarListCard({ car, pickupLocation, dropLocation }) {
  const primaryImage = car.images?.find(i => i.isPrimary) || car.images?.[0]
  const features = car.features?.slice(0, 6) || []
  const half = Math.ceil(features.length / 2)
  const leftFeat  = features.slice(0, half)
  const rightFeat = features.slice(half)

  const hasLocation = !!(pickupLocation || dropLocation)
  return (
    <Link
      to={hasLocation ? `/booking/${car._id}` : `/cars/${car._id}`}
      state={hasLocation ? { pickupLocation: pickupLocation || null, dropLocation: dropLocation || null } : undefined}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden flex hover:shadow-lg transition-shadow duration-300 group"
    >
      {/* Image */}
      <div className="w-64 xl:w-80 h-[220px] shrink-0 relative bg-gray-50 overflow-hidden flex items-center justify-center">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-contain object-center p-3 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center text-6xl w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
            🚗
          </div>
        )}
        {car.isFeatured && (
          <span className="absolute top-2.5 left-2.5 bg-teal-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
            Featured
          </span>
        )}
        {!car.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 p-5 flex flex-col">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {car.brand} {car.model}
            </h3>
            {/* Stars */}
            <div className="flex items-center gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(car.rating || 0)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
              {car.reviewCount > 0 && (
                <span className="text-xs text-gray-400 ml-1">{car.reviewCount} reviews</span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <div className="text-2xl font-extrabold text-gray-900">
              ₹{car.pricePerDay?.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Per Day</div>
          </div>
        </div>

        {/* Specs row */}
        <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 mb-4">
          {car.seats && (
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gray-400" /> {car.seats} Seats
            </span>
          )}
          {car.transmission && (
            <span className="flex items-center gap-1.5 capitalize">
              <Settings className="w-4 h-4 text-gray-400" /> {car.transmission}
            </span>
          )}
          {car.fuelType && (
            <span className="flex items-center gap-1.5 capitalize">
              <Fuel className="w-4 h-4 text-gray-400" /> {car.fuelType}
            </span>
          )}
          {car.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" /> {car.location.city || car.location.name}
            </span>
          )}
        </div>

        {/* Features — 2-column checklist */}
        {features.length > 0 && (
          <div className="mt-auto grid grid-cols-2 gap-x-6 gap-y-1.5 pt-3 border-t border-gray-100">
            <div className="space-y-1.5">
              {leftFeat.map((f, i) => (
                <span key={i} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Check className="w-3.5 h-3.5 text-teal-500 shrink-0" /> {f}
                </span>
              ))}
            </div>
            <div className="space-y-1.5">
              {rightFeat.map((f, i) => (
                <span key={i} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Check className="w-3.5 h-3.5 text-teal-500 shrink-0" /> {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

// ── Collapsible sidebar filter section ──────────────────────────────────────
function FilterSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-sm font-bold text-gray-800 mb-2"
      >
        {title}
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400" />
          : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && children}
    </div>
  )
}

function CheckGroup({ options, value, onChange }) {
  return (
    <div className="space-y-2">
      {options.map(opt => {
        const val   = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        const checked = value === val
        return (
          <label key={val} className="flex items-center gap-2 cursor-pointer group">
            <div
              onClick={() => onChange(checked ? '' : val)}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                checked ? 'bg-teal-500 border-teal-500' : 'border-gray-300 group-hover:border-teal-400'
              }`}
            >
              {checked && <div className="w-2 h-2 rounded-sm bg-white" />}
            </div>
            <span className="text-sm text-gray-600 capitalize group-hover:text-teal-600 transition-colors">
              {label}
            </span>
          </label>
        )
      })}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function Cars() {
  const [searchParams, setSearchParams] = useSearchParams()
  const routerLocation = useLocation()
  const [pickupLocation, setPickupLocation] = useState(routerLocation.state?.pickupLocation || null)
  const [dropLocation, setDropLocation]     = useState(routerLocation.state?.dropLocation   || null)
  const [cars, setCars]               = useState([])
  const [pagination, setPagination]   = useState({})
  const [filterData, setFilterData]   = useState({ brands: [], types: [], fuelTypes: [], priceRange: { min: 0, max: 10000 } })
  const [loading, setLoading]         = useState(true)

  const [query, setQuery] = useState({
    search:       searchParams.get('search')       || '',
    type:         searchParams.get('type')         || '',
    brand:        searchParams.get('brand')        || '',
    transmission: searchParams.get('transmission') || '',
    fuelType:     searchParams.get('fuelType')     || '',
    minPrice:     searchParams.get('minPrice')     || '',
    maxPrice:     searchParams.get('maxPrice')     || '',
    sort:         searchParams.get('sort')         || 'price-asc',
    page:         parseInt(searchParams.get('page') || '1'),
    location:     searchParams.get('location')     || '',
  })

  useEffect(() => {
    getCarFilters().then(({ data }) => setFilterData(data.data)).catch(() => {})
  }, [])

  // Fix #10: rehydrate pickupLocation from API when navigating directly via URL (e.g. refresh)
  useEffect(() => {
    if (query.location && !pickupLocation && !dropLocation) {
      getLocationById(query.location)
        .then(res => setPickupLocation(res.data.data.location))
        .catch(() => {})
    }
  }, [query.location])

  useEffect(() => {
    setLoading(true)
    const params = {}
    Object.entries(query).forEach(([k, v]) => { if (v) params[k] = v })
    getCars(params)
      .then(({ data }) => { setCars(data.data.cars); setPagination(data.data.pagination) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [query])

  const update = (updates) => setQuery(prev => ({ ...prev, ...updates, page: 1 }))

  const clearFilters = () => {
    setQuery({ search: '', type: '', brand: '', transmission: '', fuelType: '', minPrice: '', maxPrice: '', sort: 'price-asc', page: 1, location: '' })
    setSearchParams({})
    setPickupLocation(null)
    setDropLocation(null)
  }

  const hasFilters = query.type || query.brand || query.transmission || query.fuelType || query.minPrice || query.maxPrice || query.search

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div className="relative min-h-[420px] md:min-h-[540px] overflow-hidden">
        <img
          src="/heroes/cars.jpg"
          alt="Car rental"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* gradient: lighter at top, dark at bottom so title pops */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/75" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg">
            Our Cars
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-xl">
            Find the perfect car for every journey — premium fleet, unbeatable rates
          </p>
        </div>
      </div>

      {/* ── Top Search Bar ────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-3 items-center">

            {/* Category / Type */}
            <div className="relative flex-1 min-w-[160px]">
              <select
                value={query.type}
                onChange={e => update({ type: e.target.value })}
                className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm text-gray-600 bg-white outline-none focus:border-teal-400 transition-colors"
              >
                <option value="">Category</option>
                {filterData.types.map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Brand */}
            <div className="relative flex-1 min-w-[160px]">
              <select
                value={query.brand}
                onChange={e => update({ brand: e.target.value })}
                className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm text-gray-600 bg-white outline-none focus:border-teal-400 transition-colors"
              >
                <option value="">All Brands</option>
                {filterData.brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative flex-1 min-w-[200px]">
              <select
                value={query.sort}
                onChange={e => update({ sort: e.target.value })}
                className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm text-gray-600 bg-white outline-none focus:border-teal-400 transition-colors"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Search button */}
            <button
              onClick={() => update({})}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-8 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" /> Search
            </button>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium shrink-0"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Page Content ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-7 items-start">

          {/* ── Car List ──────────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {/* Location banner */}
            {(pickupLocation || dropLocation) && (
              <div className="mb-4 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-teal-800 flex-wrap">
                  <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
                  {pickupLocation && (
                    <span><span className="font-semibold">Pickup:</span> {pickupLocation.name}, {pickupLocation.city}</span>
                  )}
                  {dropLocation && (
                    <span className={pickupLocation ? 'ml-2' : ''}><span className="font-semibold">Drop-off:</span> {dropLocation.name}, {dropLocation.city}</span>
                  )}
                  {!pickupLocation && dropLocation && (
                    <span className="text-teal-600 italic text-xs ml-1">(pickup: same branch)</span>
                  )}
                </div>
                <span className="text-xs text-teal-600 font-medium shrink-0">Click any car to book</span>
              </div>
            )}
            {/* Result count */}
            {!loading && (
              <p className="text-sm text-gray-500 mb-4">
                <span className="font-semibold text-gray-900">{pagination.total || 0}</span> cars found
                {hasFilters && (
                  <span className="ml-2 text-xs text-teal-600 font-medium">· filters active</span>
                )}
              </p>
            )}

            {loading ? (
              <div className="flex justify-center py-28">
                <Spinner size="lg" />
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
                <div className="text-5xl mb-4">🚗</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-500 text-sm mb-4">Try adjusting your filters</p>
                <button onClick={clearFilters} className="text-sm text-teal-600 font-semibold hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-5">
                  {cars.map(car => <CarListCard key={car._id} car={car} pickupLocation={pickupLocation} dropLocation={dropLocation} />)}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center gap-1.5 mt-8">
                    <button
                      disabled={query.page === 1}
                      onClick={() => setQuery(p => ({ ...p, page: p.page - 1 }))}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white disabled:opacity-40 hover:border-teal-400 hover:text-teal-600 transition-colors"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === pagination.pages || Math.abs(p - query.page) <= 1)
                      .reduce((acc, p, i, arr) => {
                        if (i > 0 && p - arr[i - 1] > 1) acc.push('...')
                        acc.push(p)
                        return acc
                      }, [])
                      .map((p, i) =>
                        p === '...' ? (
                          <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setQuery(prev => ({ ...prev, page: p }))}
                            className={`w-9 h-9 text-sm rounded-lg border transition-colors ${
                              query.page === p
                                ? 'bg-teal-500 text-white border-teal-500'
                                : 'bg-white border-gray-200 hover:border-teal-400 hover:text-teal-600'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                    <button
                      disabled={query.page === pagination.pages}
                      onClick={() => setQuery(p => ({ ...p, page: p.page + 1 }))}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white disabled:opacity-40 hover:border-teal-400 hover:text-teal-600 transition-colors"
                    >
                      Next →
                    </button>
                    <span className="text-xs text-gray-400 ml-2">
                      Page {query.page} of {pagination.pages}
                    </span>
                  </div>
                )}
              </>
            )}
          </main>

          {/* ── Right Sidebar ─────────────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-5 w-64 xl:w-72 shrink-0 sticky top-24">

            {/* For More Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                For More Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-teal-500 shrink-0" />
                  1-567.124.4227
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-teal-500 shrink-0" />
                  Mon – Sat 8:00 – 18:00 Sunday CLOSED
                </div>
              </div>
            </div>

            {/* Rental Tips */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                Rental Tips
              </h3>
              <div className="space-y-4">
                {RENTAL_TIPS.map((tip, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <img
                      src={tip.image}
                      alt=""
                      className="w-16 h-12 object-cover rounded-lg shrink-0 bg-gray-100"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">
                        {tip.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{tip.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connect with Us */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                Connect with Us
              </h3>
              <div className="flex gap-2">
                {[
                  { letter: 'f', bg: 'bg-blue-600' },
                  { letter: 't', bg: 'bg-sky-500' },
                  { letter: 'y', bg: 'bg-red-600' },
                  { letter: 'p', bg: 'bg-pink-600' },
                  { letter: 'in', bg: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' },
                ].map(({ letter, bg }) => (
                  <a key={letter} href="#" onClick={e => e.preventDefault()}
                    className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity uppercase`}>
                    {letter}
                  </a>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                Filters
              </h3>

              {/* Search */}
              <div className="mb-3 pb-3 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search brand or model..."
                    value={query.search}
                    onChange={e => update({ search: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 transition-colors"
                  />
                </div>
              </div>

              <FilterSection title="Transmission" defaultOpen>
                <CheckGroup
                  options={TRANSMISSIONS}
                  value={query.transmission}
                  onChange={val => update({ transmission: val })}
                />
              </FilterSection>

              <FilterSection title="Fuel Type">
                <CheckGroup
                  options={filterData.fuelTypes}
                  value={query.fuelType}
                  onChange={val => update({ fuelType: val })}
                />
              </FilterSection>

              <FilterSection title="Price Range (₹/day)">
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min price"
                    value={query.minPrice}
                    onChange={e => update({ minPrice: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={query.maxPrice}
                    onChange={e => update({ maxPrice: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400"
                  />
                </div>
              </FilterSection>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full mt-2 flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium border border-red-200 hover:border-red-300 rounded-lg py-2 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Clear All Filters
                </button>
              )}
            </div>

          </aside>
        </div>
      </div>
    </div>
  )
}
