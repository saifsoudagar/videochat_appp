import { Routes, Route } from 'react-router-dom'; // No need to import BrowserRouter here
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/ProtectdRoute';
import LandingPage from './pages/LandingPage'; // Import LandingPage

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Landing page as default */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<LandingPage />} /> {/* Redirect unknown routes to LandingPage */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
