import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import RoomDetail from './components/RoomDetail';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ExplorePage from './pages/ExplorePage';
import ListPropertyPage from './pages/ListPropertyPage';
import ProfilePage from './pages/ProfilePage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("room_access");
    if (!token) {
      setCurrentPage("login");
    }
    setAuthChecked(true);
  }, []);

  const handleSelectRoom = (room: any) => {
    setSelectedRoom(room);
  };

  const showNavbar = !['login', 'signup'].includes(currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'signup':
        return <SignupPage setCurrentPage={setCurrentPage} />;
      case 'explore':
        return <ExplorePage onSelectRoom={handleSelectRoom} />;
      case 'list':
        return <ListPropertyPage setCurrentPage={setCurrentPage} />;
      case 'profile':
        return <ProfilePage setCurrentPage={setCurrentPage} onSelectRoom={handleSelectRoom} />;
      case 'home':
      default:
        return <HomePage setCurrentPage={setCurrentPage} onSelectRoom={handleSelectRoom} />;
    }
  };

  if (!authChecked) {
    return null;
  }
  return (
    <div className="min-h-screen bg-warm-50">
      {showNavbar && <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      {renderPage()}
      {selectedRoom && (
        <RoomDetail room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
