import { Search, ArrowRight, Shield, Clock, Heart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProperties } from '../api/propertyApi';
import RoomCard from '../components/RoomCard';

export default function HomePage({ setCurrentPage, onSelectRoom }) {
  const [featured, setFeatured] = useState([]);
  const [roomsCount, setRoomsCount] = useState(0);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getProperties();

        const rooms = Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data)
          ? data
          : [];

        setRoomsCount(data?.count ?? rooms.length);
        setFeatured(rooms.slice(0, 3));
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);
  const token = localStorage.getItem("room_access");
  if (!token) {
    window.location.href = "/login";
  }
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-100 via-warm-50 to-sage-50" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-sage-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blush-100 rounded-full blur-3xl opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-[#c74c3c] text-warm-50 text-sm font-medium rounded-full mb-6">
              Find your perfect space
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-warm-900 leading-tight mb-6">
              Discover rooms that feel like
              <span className="text-[#c74c3c]"> home</span>
            </h1>
            <p className="text-lg text-warm-500 leading-relaxed mb-8 max-w-lg">
              Browse beautiful, verified rooms for rent. From cozy studios to spacious apartments, find a place that matches your lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setCurrentPage('explore')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#c74c3c] text-warm-50 rounded-xl font-medium hover:bg-warm-700 transition-colors"
              >
                <Search className="w-4 h-4" />
                Explore Rooms
              </button>
              <button
                onClick={() => setCurrentPage('list')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-warm-700 border border-warm-200 rounded-xl font-medium hover:border-warm-300 hover:bg-warm-50 transition-colors"
              >
                List Your Property
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-warm-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: roomsCount, label: "Rooms Listed" },
              { value: "1,800+", label: "Happy Tenants" },
              { value: "4.8", label: "Average Rating" },
              { value: "50+", label: "Neighborhoods" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-serif font-semibold text-warm-900">{stat.value}</div>
                <div className="text-sm text-warm-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-semibold text-warm-900 mb-3">Why choose <span className="text-[#c74c3c]">The Room</span></h2>
          <p className="text-warm-500 max-w-lg mx-auto">We make finding your perfect space simple, safe, and enjoyable.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Verified Listings",
              desc: "Every room is verified by our team to ensure accuracy and quality of listings.",
              color: "bg-sage-50 text-sage-600"
            },
            {
              icon: Clock,
              title: "Quick & Easy",
              desc: "Find and apply for rooms in minutes. No complicated forms or lengthy processes.",
              color: "bg-blush-50 text-blush-600"
            },
            {
              icon: Heart,
              title: "Perfect Match",
              desc: "Our smart filters help you find rooms that perfectly match your preferences and budget.",
              color: "bg-warm-100 text-warm-600"
            }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl border border-warm-100 hover:border-warm-200 transition-all hover:shadow-sm">
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-warm-900 mb-2">{item.title}</h3>
              <p className="text-sm text-warm-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="bg-white border-y border-warm-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-warm-900 mb-2">Featured <span className="text-[#c74c3c]">rooms</span></h2>
              <p className="text-warm-500">Hand-picked spaces we think you'll love</p>
            </div>
            <button
              onClick={() => setCurrentPage('explore')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-warm-600 hover:text-warm-800 border border-warm-200 rounded-lg hover:border-warm-300 transition-all"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(room => (
              <RoomCard key={room.id} room={room} onSelect={onSelectRoom} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <button
              onClick={() => setCurrentPage('explore')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-warm-600 border border-warm-200 rounded-lg"
            >
              View all rooms
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className="font-serif text-2xl text-warm-800 leading-relaxed mb-6">
            "The Room made my apartment search so much easier. I found my dream studio in just two days!"
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="text-sm font-medium text-warm-800">Sarah Mitchell</p>
              <p className="text-xs text-warm-400">Found a studio in Manhattan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-warm-900 text-warm-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="bg-white px-2 rounded-lg">
              <img src="The.png" alt="" className="w-15 h-18" />
            </div>
            <p className="text-sm">© 2026 The Room. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
