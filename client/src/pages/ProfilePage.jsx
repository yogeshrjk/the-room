import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  FileText,
  Camera,
  Edit3,
  Save,
  X,
  Home,
  Heart,
  MapPin,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { sampleRooms } from "../data/rooms";
import RoomCard from "../components/RoomCard";
import api from "../api/apiClient";
import { getProperties } from "@/api/propertyApi";

export default function ProfilePage({ setCurrentPage, onSelectRoom }) {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("listings");
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    bio: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileData, setProfileData] = useState({});
  const [myListing, setMyListing] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const isFav = (roomId) => profileData?.favorites?.includes(roomId);
  const [favMap, setFavMap] = useState({});

  const getProfile = async () => {
    try {
      const response = await api.get("/profile/");
      // console.log('Profile data:', response.data);
      const data = response.data;

      const imageUrl = data.image
        ? data.image.startsWith("http")
          ? data.image
          : `http://127.0.0.1:8000${data.image}`
        : `https://ui-avatars.com/api/?name=${data.first_name || "U"}`;

      setProfileData({
        id: data.id,
        name: `${data.first_name || ""} ${data.last_name || ""}`,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        avatar: imageUrl + `?t=${Date.now()}`, // cache bust
        favorites: data.favorites || [],
        listings: [],
        joinedDate: "Recently",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  const fetchProperties = async () => {
    try {
      const data = await getProperties();
      // console.log("Properties API response:", data);

      // filter only current user's properties
      const myProperties = data.filter(
        (room) => Number(room?.owner) === Number(profileData?.id),
      );

      // console.log("myProperty: ", myProperties);

      setProfileData((prev) => ({
        ...prev,
        listings: myProperties || [],
      }));
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };
  const fetchSavedProperties = async () => {
    try {
      const res = await api.get("/properties/saved/");
      setFavoriteRooms(res.data || []);
    } catch (error) {
      console.error("Error fetching saved properties:", error);
    }
  };
  const handleDeleteProperty = async (propertyId) => {
    try {
      await api.delete(`/properties/${propertyId}/`);

      // remove property instantly from UI
      setProfileData((prev) => ({
        ...prev,
        listings: prev.listings.filter(
          (p) => Number(p.id) !== Number(propertyId),
        ),
      }));
    } catch (error) {
      console.error("Delete failed:", error?.response?.data || error.message);
    }
  };
  const handleUpdateProperty = (property) => {
    // store property in sessionStorage for edit mode
    sessionStorage.setItem("editProperty", JSON.stringify(property));

    // redirect using normal page string navigation
    setCurrentPage("list");
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (!profileData?.id) return;
    fetchProperties();
    fetchSavedProperties();
  }, [profileData?.id]);
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7 text-warm-400" />
          </div>
          <h2 className="font-serif text-2xl text-warm-900 mb-2">
            Sign in to view profile
          </h2>
          <p className="text-warm-500 mb-6">
            Create an account or sign in to manage your profile
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setCurrentPage("login")}
              className="px-6 py-2.5 bg-warm-800 text-warm-50 rounded-xl text-sm font-medium hover:bg-warm-700 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => setCurrentPage("signup")}
              className="px-6 py-2.5 border border-warm-200 text-warm-700 rounded-xl text-sm font-medium hover:border-warm-300 transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    );
  }

  const startEditing = () => {
    setEditForm({
      name: profileData.name || "",
      phone: profileData.phone || "",
      bio: profileData.bio || "",
    });
    setEditing(true);
  };

  const saveProfile = async () => {
    try {

      const formData = new FormData();

      formData.append("first_name", editForm.name?.split(" ")[0] || "");

      formData.append(
        "last_name",
        editForm.name?.split(" ").slice(1).join(" ") || "",
      );

      if (editForm.phone && editForm.phone.trim() !== "") {
        formData.append("phone", editForm.phone);
      }

      if (editForm.bio && editForm.bio.trim() !== "") {
        formData.append("bio", editForm.bio);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      // password change logic
      if (passwordForm.oldPassword && passwordForm.newPassword) {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          alert("New password and confirm password must match");
          return;
        }

        formData.append("old_password", passwordForm.oldPassword);
        formData.append("new_password", passwordForm.newPassword);
      }

      await api.patch("/profile/update/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImageFile(null);

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setEditing(false);
      window.location.reload();
      getProfile();
    } catch (error) {
      console.error(
        "Profile update failed:",
        error?.response?.data || error.message,
      );
    }
  };


  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const tabs = [
    {
      id: "listings",
      label: "My Listings",
      count: profileData?.listings?.length || 0,
    },
    {
      id: "favorites",
      label: "Favorites",
      count: favoriteRooms?.length || 0,
    },
  ];

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Profile Header */}
      <div className="bg-white border-b border-warm-100 lg:fixed lg:top-16 lg:left-0 lg:w-full lg:z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={profileData.avatar}
                alt=""
                className="w-24 h-24 rounded-2xl object-cover border-2 border-warm-100"
              />
              {editing && (
                <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-sage-100 rounded-lg flex items-center justify-center border-2 border-white cursor-pointer">
                  <Camera className="w-3.5 h-3.5 text-sage-600" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setImageFile(file);

                      const preview = URL.createObjectURL(file);
                      setProfileData((prev) => ({ ...prev, avatar: preview }));
                    }}
                  />
                </label>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-xs font-medium text-warm-600 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-warm-50 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warm-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-warm-600 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="(555) 123-4567"
                      className="w-full px-3 py-2 bg-warm-50 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warm-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-warm-600 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      rows={2}
                      className="w-full px-3 py-2 bg-warm-50 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warm-300 resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={saveProfile}
                      className="flex items-center gap-1.5 px-4 py-2 bg-warm-800 text-warm-50 rounded-lg text-sm font-medium hover:bg-warm-700 transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-1.5 px-4 py-2 border border-warm-200 text-warm-600 rounded-lg text-sm font-medium hover:border-warm-300 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                  <div className="pt-4 border-t border-warm-200">
                    <label className="block text-xs font-medium text-warm-600 mb-1">
                      Old Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.oldPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          oldPassword: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-warm-50 border border-warm-200 rounded-lg text-sm mb-2"
                    />

                    <label className="block text-xs font-medium text-warm-600 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-warm-50 border border-warm-200 rounded-lg text-sm mb-2"
                    />

                    <label className="block text-xs font-medium text-warm-600 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-warm-50 border border-warm-200 rounded-lg text-sm mb-3"
                    />

                    <button
                      onClick={saveProfile}
                      className="px-4 py-2 bg-sage-600 text-white rounded-lg text-sm hover:bg-sage-700"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="font-serif text-2xl font-semibold text-warm-900">
                        {profileData.name}
                      </h1>
                      <p className="text-sm text-warm-500 mt-1">
                        {profileData.bio}
                      </p>
                    </div>
                    <button
                      onClick={startEditing}
                      className="flex items-center gap-1.5 px-3 py-2 border border-warm-200 text-warm-600 rounded-lg text-sm font-medium hover:border-warm-300 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-warm-500 text-sm">
                      <Mail className="w-3.5 h-3.5" />
                      {profileData.email}
                    </div>
                    {profileData.phone && (
                      <div className="flex items-center gap-1.5 text-warm-500 text-sm">
                        <Phone className="w-3.5 h-3.5" />
                        {profileData.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-warm-500 text-sm">
                      <Calendar className="w-3.5 h-3.5" />
                      Joined {profileData.joinedDate}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 bg-warm-50 rounded-xl text-center">
              <div className="text-xl font-semibold text-warm-900">
                {profileData.listings?.length || 0}
              </div>
              <div className="text-xs text-warm-500 mt-0.5">Listings</div>
            </div>
            <div className="p-4 bg-warm-50 rounded-xl text-center">
              <div className="text-xl font-semibold text-warm-900">
                {favoriteRooms?.length || 0}
              </div>
              <div className="text-xs text-warm-500 mt-0.5">Favorites</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:mt-[260px]">
        <div className="flex gap-1 p-1 bg-warm-100 rounded-xl mb-8 max-w-xs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-warm-900 shadow-sm"
                  : "text-warm-500 hover:text-warm-700"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? "bg-warm-100 text-warm-700"
                    : "bg-warm-200/50 text-warm-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Listings Tab */}
        {activeTab === "listings" && (
          <>
            {profileData.listings?.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {profileData.listings.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onSelect={onSelectRoom}
                    onDelete={handleDeleteProperty}
                    onUpdate={() => handleUpdateProperty(room)}
                    profileId={profileData?.id}
                    propertyId={room?.id}
                    isFav={true}
                    localFav={true}
                    setLocalFav={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-6 h-6 text-warm-400" />
                </div>
                <h3 className="font-serif text-lg text-warm-800 mb-2">
                  No listings yet
                </h3>
                <p className="text-sm text-warm-500 mb-5">
                  Start by listing your first property
                </p>
                <button
                  onClick={() => setCurrentPage("list")}
                  className="px-5 py-2.5 bg-[#c74c3c] text-warm-50 rounded-xl text-sm font-medium hover:bg-warm-700 transition-colors"
                >
                  List a property
                </button>
              </div>
            )}
          </>
        )}

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <>
            {favoriteRooms?.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favoriteRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onSelect={onSelectRoom}
                    profileId={profileData?.id}
                    propertyId={room?.id}
                    isFav={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-warm-400" />
                </div>
                <h3 className="font-serif text-lg text-warm-800 mb-2">
                  No favorites yet
                </h3>
                <p className="text-sm text-warm-500 mb-5">
                  Explore rooms and save your favorites
                </p>
                <button
                  onClick={() => setCurrentPage("explore")}
                  className="px-5 py-2.5 bg-warm-800 text-warm-50 rounded-xl text-sm font-medium hover:bg-warm-700 transition-colors"
                >
                  Explore rooms
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
