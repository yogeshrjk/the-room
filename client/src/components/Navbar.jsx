import { Home, Search, CircleUserRound, User, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from "../api/apiClient"

export default function Navbar({ currentPage, setCurrentPage }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navProfile, setNavProfile] = useState({});

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Search },
  ];

  if (user) {
    navItems.push(
      { id: 'list', label: 'List Property', icon: CircleUserRound },
      { id: 'profile', label: 'Profile', icon: User }
    );
  }

useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile/');
        const data = response.data;

        const imageUrl = data.image
          ? (data.image.startsWith("http")
              ? data.image
              : `http://127.0.0.1:8000${data.image}`)
          : `https://ui-avatars.com/api/?name=${data.first_name || "U"}`;

        setNavProfile({
          id: data.id,
          name: `${data.first_name || ""} ${data.last_name || ""}`,
          email: data.email,
          avatar: imageUrl + `?t=${Date.now()}`,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-warm-200 sticky top-0 z-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="The.png" alt="" className="w-15 h-18" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === item.id
                  ? 'bg-warm-100 text-warm-900'
                  : 'text-warm-600 hover:text-warm-800 hover:bg-warm-50'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                <img src={navProfile?.avatar} alt="profile" className="w-8 h-8 border rounded-full object-cover" />
                <span className="text-sm font-medium text-warm-700">{navProfile?.name || 'User'}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setCurrentPage('login');
                  }}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 hover:text-warm-700 transition-colors"
                > <span>Logout</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage('login')}
                  className="px-4 py-2 text-sm font-medium text-warm-700 hover:text-warm-900 transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => setCurrentPage('signup')}
                  className="px-4 py-2 text-sm font-medium bg-warm-800 text-warm-50 rounded-lg hover:bg-warm-700 transition-colors"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-warm-600"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-warm-100 px-4 pb-4">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setCurrentPage(item.id); setMobileOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${currentPage === item.id
                ? 'bg-warm-100 text-warm-900'
                : 'text-warm-600 hover:bg-warm-50'
                }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
          <div className="border-t border-warm-100 mt-2 pt-2">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                  setCurrentPage('login');
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm text-warm-600 hover:bg-warm-50"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setCurrentPage('login'); setMobileOpen(false); }}
                  className="w-full px-4 py-3 text-sm font-medium text-warm-700 rounded-lg hover:bg-warm-50"
                >
                  Log in
                </button>
                <button
                  onClick={() => { setCurrentPage('signup'); setMobileOpen(false); }}
                  className="w-full px-4 py-3 text-sm font-medium bg-warm-800 text-warm-50 rounded-lg"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
