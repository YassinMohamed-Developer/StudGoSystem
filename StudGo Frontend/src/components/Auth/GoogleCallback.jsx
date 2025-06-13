import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Loader2 } from 'lucide-react';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { handleGoogleLogin } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the access token from the URL hash
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        
        if (accessToken) {
          // Call the Google login handler with the token
          await handleGoogleLogin(accessToken);
        } else {
          // If no token, redirect to login with error
          navigate('/login?error=google_auth_failed');
        }
      } catch (error) {
        console.error('Google auth error:', error);
        navigate('/login?error=google_auth_failed');
      }
    };

    handleCallback();
  }, [navigate, handleGoogleLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Completing Google Sign-In</h2>
        <p className="text-gray-400">Please wait while we process your authentication...</p>
      </div>
    </div>
  );
};

export default GoogleCallback; 