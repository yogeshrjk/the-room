import api from "../api/apiClient"
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const signup = (name, email, password) => {
    const existing = users.find(u => u.email === email);
    if (existing) return { success: false, message: "Email already exists" };

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      phone: "",
      bio: "Hey there! I'm looking for the perfect room.",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d4c8b6&color=3d342d&size=200`,
      listings: [],
      favorites: [],
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return { success: true };
  };

  const login = (userDetails) => {
    setUser(userDetails);
    localStorage.setItem("user", JSON.stringify(userDetails));
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const addListing = (listing) => {
    const newListing = {
      ...listing,
      id: Date.now(),
      owner: user.name,
      ownerAvatar: user.avatar,
      rating: 0,
      reviews: 0,
      available: true,
      featured: false
    };
    const updated = { ...user, listings: [...user.listings, newListing] };
    setUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    return newListing;
  };

  const toggleFavorite = async (roomId) => {
    if (!user) return;

    try {
      const res = await api.post(`/properties/${roomId}/toggle-save/`);

      const saved = res.data?.saved;

      const favs = saved
        ? [...(user.favorites || []), roomId]
        : (user.favorites || []).filter(id => id !== roomId);

      const updated = { ...user, favorites: favs };

      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));

      return res.data;
    } catch (err) {
      console.error("Toggle favorite failed", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, updateProfile, addListing, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
