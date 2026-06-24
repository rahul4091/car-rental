import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Phone, Search, Car } from 'lucide-react'
import { getLocations } from '../api/locations'
import Spinner from '../components/ui/Spinner'

export default function Locations() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getLocations()
      .then(({ data }) => setLocations(data.data.locations || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = locations.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Our Locations</h1>
        <p className="text-gray-500 text-sm mt-1">Find a DriveEase branch near you</p>
      </div>

      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by city or location name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No locations found</h3>
          <p className="text-sm text-gray-500">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(loc => (
            <div key={loc._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              {loc.image && (
                <div className="h-36 bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{loc.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" /> {loc.city}, {loc.state}
                  </div>
                </div>
                {loc.airportLocation && (
                  <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full">Airport</span>
                )}
              </div>

              <p className="text-xs text-gray-500 mb-3">{loc.address}</p>

              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                {loc.operatingHours?.is24Hours ? (
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <Clock className="w-3.5 h-3.5" /> Open 24/7
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {loc.operatingHours?.open} – {loc.operatingHours?.close}
                  </span>
                )}
                {loc.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> {loc.phone}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/cars?location=${loc._id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium bg-blue-700 text-white px-3 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <Car className="w-3.5 h-3.5" /> View Cars
                </button>
                <div className="flex gap-1">
                  {loc.isPickupAvailable && (
                    <span className="text-xs bg-green-50 text-green-700 font-medium px-2 py-2 rounded-lg">Pickup</span>
                  )}
                  {loc.isDropAvailable && (
                    <span className="text-xs bg-purple-50 text-purple-700 font-medium px-2 py-2 rounded-lg">Drop</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
