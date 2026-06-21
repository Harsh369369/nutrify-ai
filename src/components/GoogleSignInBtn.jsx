import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GoogleSignInBtn = ({ onSuccess, onError, width = 260 }) => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const btnRef = useRef(null);

  useEffect(() => {
    const initGoogleBtn = () => {
      if (window.google && btnRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "816497380500-96g18tmrr8e5sjdoljaceikhnhav69dg.apps.googleusercontent.com",
            ux_mode: "popup",
            callback: async (response) => {
              if (onSuccess) onSuccess();
              try {
                const result = await googleLogin(response.credential);
                if (result.hasProfile) {
                  navigate('/dashboard');
                } else {
                  navigate('/setup');
                }
              } catch (err) {
                if (onError) onError(err || 'Failed to authenticate with Google.');
              }
            }
          });

          window.google.accounts.id.renderButton(
            btnRef.current,
            { theme: "outline", size: "large", width }
          );

          // Trigger the Google One Tap account selector prompt (overlay box)
          window.google.accounts.id.prompt();
        } catch (e) {
          console.error('Google Sign In rendering error:', e);
        }
      }
    };

    // Use a small timeout to ensure DOM is ready
    const timer = setTimeout(initGoogleBtn, 150);
    return () => clearTimeout(timer);
  }, [googleLogin, navigate, onSuccess, onError, width]);

  return <div ref={btnRef} className="min-h-[50px] flex justify-center items-center shrink-0" />;
};

export default GoogleSignInBtn;
