import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, X, MapPin, ChevronDown } from 'lucide-react';
import { sampleRooms, roomTypes, priceRanges } from '../data/rooms';
import { useAuth } from '../context/AuthContext';
import RoomCard from '../components/RoomCard';
import { getProperties } from "../api/propertyApi";

export default function ExplorePage({ onSelectRoom }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        // console.log("Properties API response:", data);
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
 
    fetchProperties();
  }, []);
  // Combine sample rooms with user listings
  const allRooms = useMemo(() => {
  const userListings = user?.listings || [];
  return [...properties, ...userListings];
}, [properties, user]);

  const filteredRooms = useMemo(() => {
    let rooms = [...allRooms];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      rooms = rooms.filter(r =>
        r.title?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q) ||
        r.property_type?.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (selectedType !== 'All') {
      rooms = rooms.filter(r => r.property_type === selectedType);
    }

    // Price filter
    const range = priceRanges[selectedPriceRange];
    rooms = rooms.filter(r => Number(r.rent) >= range.min && Number(r.rent) <= range.max);

    // Sort
    switch (sortBy) {
      case 'price-low':
        rooms.sort((a, b) => Number(a.rent) - Number(b.rent));
        break;
      case 'price-high':
        rooms.sort((a, b) => Number(b.rent) - Number(a.rent));
        break;
      case 'rating':
        rooms.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'featured':
      default:
        rooms.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return rooms;
  }, [allRooms, searchQuery, selectedType, selectedPriceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedPriceRange(0);
    setSortBy('featured');
  };

  const hasActiveFilters = searchQuery || selectedType !== 'All' || selectedPriceRange !== 0;

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
   <div className="bg-white border-b border-warm-100 lg:fixed lg:top-16 lg:left-0 lg:w-full lg:z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-serif text-3xl font-semibold text-warm-900 mb-2">Explore <span className="text-[#c74c3c]">rooms</span></h1>
          <p className="text-warm-500 mb-6">Find the perfect room that suits your lifestyle</p>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, type, or name..."
                className="w-full pl-11 pr-4 py-3 bg-warm-50 border border-warm-200 rounded-xl text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-warm-300 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 border rounded-xl text-sm font-medium transition-all ${showFilters || hasActiveFilters
                ? 'border-warm-400 bg-warm-100 text-warm-800'
                : 'border-warm-200 text-warm-600 hover:border-warm-300'
                }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-sage-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-5 bg-warm-50 rounded-xl border border-warm-100 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-warm-600 mb-2">Room Type</label>
                  <div className="flex flex-wrap gap-2">
                    {roomTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedType === type
                          ? 'bg-warm-800 text-warm-50'
                          : 'bg-white text-warm-600 border border-warm-200 hover:border-warm-300'
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sm:w-48">
                  <label className="block text-xs font-medium text-warm-600 mb-2">Price Range</label>
                  <div className="relative">
                    <select
                      value={selectedPriceRange}
                      onChange={(e) => setSelectedPriceRange(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-warm-200 rounded-lg text-sm text-warm-700 appearance-none focus:outline-none focus:ring-2 focus:ring-warm-300"
                    >
                      {priceRanges.map((range, i) => (
                        <option key={i} value={i}>{range.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400 pointer-events-none" />
                  </div>
                </div>
                <div className="sm:w-48">
                  <label className="block text-xs font-medium text-warm-600 mb-2">Sort By</label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-warm-200 rounded-lg text-sm text-warm-700 appearance-none focus:outline-none focus:ring-2 focus:ring-warm-300"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-warm-500 hover:text-warm-700 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${showFilters ? 'lg:mt-[350px]' : 'lg:mt-[190px]'}`}>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-warm-500">
            {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} found
          </p>
        </div>

        {filteredRooms.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredRooms.map(room => (
              <RoomCard key={room.id} room={room} onSelect={onSelectRoom} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-warm-400" />
            </div>
            <h3 className="font-serif text-xl text-warm-800 mb-2">No rooms found</h3>
            <p className="text-sm text-warm-500 mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 bg-warm-800 text-warm-50 rounded-xl text-sm font-medium hover:bg-warm-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
