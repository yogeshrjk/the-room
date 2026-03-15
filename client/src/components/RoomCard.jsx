import { useState, useEffect } from "react";
import {
  Heart,
  MapPin,
  Star,
  Bed,
  Bath,
  Maximize,
  Pencil,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function RoomCard({
  room,
  onSelect,
  onDelete,
  onUpdate,
  profileId,
  propertyId,
  isFav,
  localFav,
  setLocalFav,
}) {
  const { user, toggleFavorite } = useAuth();
  const [fav, setFav] = useState(
    isFav ?? user?.favorites?.includes(room.id)
  );

  useEffect(() => {
    if (typeof isFav !== "undefined") {
      setFav(isFav);
    } else if (user?.favorites) {
      setFav(user.favorites.includes(room.id));
    }
  }, [isFav, user, room.id]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-warm-100 hover:border-warm-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onSelect?.(room)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={room?.property_images?.[0]?.image || "/noimage.png"}
          alt={room.title}
          onError={(e) => {
            e.currentTarget.src = "/noimage.png";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {room.featured && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-sage-500/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
            Featured
          </span>
        )}

        {user && (
          <button
            onClick={async (e) => {
              e.stopPropagation();
              try {
                const res = await toggleFavorite?.(room.id);
                if (res && typeof res.saved !== "undefined") {
                  setFav(res.saved);
                }
              } catch (err) {
                // optional rollback
              }
            }}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                fav ? "fill-red-500 text-red-500" : "text-warm-600"
              }`}
            />
          </button>
        )}

        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-warm-800 text-xs font-medium rounded-full">
            {room.property_type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-warm-900 group-hover:text-warm-700 transition-colors line-clamp-1">
            {room.title}
          </h3>
          {/* {room.rating > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-warm-700">{room.rating}</span>
            </div>
          )} */}
        </div>

        <div className="flex items-center gap-1 text-warm-500 mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-sm">{room.location}</span>
        </div>

        <div className="flex items-center gap-4 text-warm-400 text-xs mb-4">
          <span className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5" />
            {room.bedrooms} {room.bedrooms === 1 ? "Bed" : "Beds"}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5" />
            {room.bathrooms} {room.bathrooms === 1 ? "Bath" : "Baths"}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="w-3.5 h-3.5" />
            {room.area} sqft
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-warm-100">
          <div>
            <span className="text-md font-semibold text-warm-900">
              ₹{room.rent}
            </span>
            <span className="text-sm text-warm-400"> /month</span>
          </div>
          {user &&
          (Number(profileId) === Number(room.owner) ||
            Number(profileId) === Number(room.owner?.id)) ? (
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-600 text-white hover:bg-green-500 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate?.(room);
                }}
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <img
                src={room.owner_image || "/user.png"}
                alt=""
                onError={(e) => {
                  e.currentTarget.src = "/user.png";
                }}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-xs text-warm-500">
                {room.owner_name ||
                  `${room.owner?.first_name || ""} ${room.owner?.last_name || ""}`.trim() ||
                  room.owner?.username ||
                  room.owner}
              </span>
            </div>
          )}
        </div>
      </div>
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteModal(false);
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-warm-900 mb-2">
              Delete Property
            </h3>
            <p className="text-sm text-warm-500 mb-5">
              Are you sure you want to delete this property?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm border border-warm-200 rounded-lg text-warm-600 hover:border-warm-300"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  onDelete?.(room.id);
                }}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
