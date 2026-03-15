import { X, MapPin, Star, Bed, Bath, Maximize, Heart, Wifi, Wind, Car, Dumbbell, TreePine, Building, ChefHat, WashingMachine, Waves, PlugZap, Cctv } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const amenityIcons = {
  WiFi: Wifi,
  AC: Wind,
  Parking: Car,
  Gym: Dumbbell,
  Kitchen: ChefHat,
  Laundry: WashingMachine,
  Water: Waves,
  Electricity: PlugZap,
  Furnished: Bed,
  CCTV: Cctv,
  Lift: Building,
};

export default function RoomDetail({ room, onClose }) {
  const { user, toggleFavorite } = useAuth();
  const isFav = user?.favorites?.includes(room.id);

  const [currentImage, setCurrentImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const images = room?.property_images || [];
  const nextImage = () => {
    if (!images.length) return;
    setCurrentImage((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    if (!images.length) return;
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative">
          <img
            src={images?.[currentImage]?.image || '/noimage.png'}
            onError={(e) => { e.currentTarget.src = '/noimage.png'; }}
            alt={room.title}
            className="w-full aspect-[16/10] object-cover rounded-t-2xl transition-all duration-300"
          />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
          >
            <X className="w-5 h-5 text-warm-700" />
          </button>

          {/* Featured */}
          {room.featured && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-sage-500/90 text-white text-xs font-medium rounded-full">
              Featured
            </span>
          )}

          {/* Prev Button */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/60"
            >
              ‹
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/60"
            >
              ›
            </button>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === currentImage ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-2xl font-serif font-semibold text-warm-900">{room.title}</h2>
              <div className="flex items-center gap-1 text-warm-500 mt-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{room.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <button
                  onClick={() => toggleFavorite(room.id)}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-warm-200 hover:border-warm-300 transition-all"
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-blush-500 text-blush-500' : 'text-warm-400'}`} />
                </button>
              )}
            </div>
          </div>

          {/* Rating & Type */}
          {/* <div className="flex items-center gap-4 mb-5">
            <span className="px-3 py-1 bg-warm-100 text-warm-700 text-xs font-medium rounded-full">{room.property_type}</span>
            {room.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium text-warm-700">{room.rating}</span>
                <span className="text-sm text-warm-400">({room.reviews} reviews)</span>
              </div>
            )}
          </div> */}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col items-center p-3 bg-warm-50 rounded-xl">
              <Bed className="w-5 h-5 text-warm-500 mb-1" />
              <span className="text-sm font-medium text-warm-800">{room.bedrooms} {room.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-warm-50 rounded-xl">
              <Bath className="w-5 h-5 text-warm-500 mb-1" />
              <span className="text-sm font-medium text-warm-800">{room.bathrooms} {room.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-warm-50 rounded-xl">
              <Maximize className="w-5 h-5 text-warm-500 mb-1" />
              <span className="text-sm font-medium text-warm-800">{room.area} sqft</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-warm-800 mb-2">About this space</h3>
            <p className="text-sm text-warm-500 leading-relaxed">{room.description}</p>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-warm-800 mb-3">Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                room.wifi && "WiFi",
                room.ac && "AC",
                room.parking && "Parking",
                room.gym && "Gym",
                room.kitchen && "Kitchen",
                room.laundry && "Laundry",
                room.water && "Water",
                room.electricity && "Electricity",
                room.furnished && "Furnished",
                room.cctv && "CCTV",
                room.lift && "Lift",
              ]
                .filter(Boolean)
                .map((amenity) => {
                  const Icon = amenityIcons[amenity] || Wifi;
                  return (
                    <div key={amenity} className="flex items-center gap-2 px-3 py-2 bg-warm-50 rounded-lg">
                      <Icon className="w-4 h-4 text-sage-500" />
                      <span className="text-sm text-warm-700">{amenity}</span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Owner */}
          <div className="flex items-center gap-3 p-4 bg-warm-50 rounded-xl mb-6">
            <img src={room.owner_image || '/user.png'} alt="" onError={(e)=>{e.currentTarget.src='/user.png';}} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="text-sm font-medium text-warm-800">
                {room.owner_name ||
                 `${room.owner?.first_name || ""} ${room.owner?.last_name || ""}`.trim() ||
                 room.owner?.username ||
                 room.owner}
              </p>
              <p className="text-xs text-warm-500">Property Owner</p>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-warm-100">
            <div>
              <span className="text-xl font-semibold text-warm-900">₹{room.rent}</span>
              <span className="text-warm-400"> /month</span>
            </div>
          {showPhone ? (
            <a
              href={`tel:${room.owner_phone}`}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-500 transition-colors"
            >
              Call +91-{room.owner_phone || ""}
            </a>
          ) : (
            <button
              onClick={() => {
                if (!user) {
                  setShowLoginPopup(true);
                  return;
                }
                setShowPhone(true);
              }}
              className="px-6 py-3 bg-[#c74c3c] text-warm-50 rounded-xl font-medium hover:bg-warm-700 transition-colors"
            >
              Contact Owner
            </button>
          )}
          </div>
        </div>
      </div>
      {showLoginPopup && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowLoginPopup(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-warm-900 mb-2">
              Login Required
            </h3>
            <p className="text-sm text-warm-500 mb-5">
              You need to login first to contact the owner.
            </p>

            <button
              onClick={() => setShowLoginPopup(false)}
              className="px-5 py-2 bg-[#c74c3c] text-white rounded-lg hover:bg-[#b84335] transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
