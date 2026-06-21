import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MealCard from '../components/MealCard';
import GoogleSignInBtn from '../components/GoogleSignInBtn';
import api from '../api';
import { 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  Info 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingTexts = [
  "Building your personalized plan...",
  "Analyzing your profile stats...",
  "Calculating daily energy expenditure (TDEE)...",
  "Consulting the AI Nutritionist...",
  "Selecting custom ingredients and quantities...",
  "Formatting targets & practical tips..."
];

const GeneratePlan = () => {
  const { 
    user, 
    profile,
    loading: authLoading,
    googleLogin, 
    guestProfile, 
    guestPlan, 
    saveGuestPlan 
  } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const textIntervalRef = useRef(null);

  const generatePlan = async () => {
    setLoading(true);
    setError('');
    setPlan(null);

    // Text rotation
    setLoadingTextIdx(0);
    if (textIntervalRef.current) clearInterval(textIntervalRef.current);
    textIntervalRef.current = setInterval(() => {
      setLoadingTextIdx((prev) => (prev + 1) % loadingTexts.length);
    }, 2800);

    try {
      if (user) {
        // Authenticated user path
        const res = await api.post('/plan/generate');
        setPlan(res.data.plan);
      } else {
        // Guest path
        if (!guestProfile) {
          navigate('/', { replace: true });
          return;
        }
        const res = await api.post('/plan/generate-guest', guestProfile);
        setPlan(res.data.plan);
        saveGuestPlan(res.data.plan);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate plan. Please try again.');
    } finally {
      if (textIntervalRef.current) clearInterval(textIntervalRef.current);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (user && !profile) {
      navigate('/setup', { replace: true });
      return;
    }

    if (!user && !guestProfile) {
      navigate('/', { replace: true });
      return;
    }

    generatePlan();

    return () => {
      if (textIntervalRef.current) clearInterval(textIntervalRef.current);
    };
  }, [user, profile, authLoading, guestProfile, navigate]);

  const parsePlan = (txt) => {
    try {
      return JSON.parse(txt);
    } catch (e) {
      return null;
    }
  };

  const handleSelectMockGoogleAccount = async (email, name) => {
    setGoogleLoading(true);
    setAuthError('');
    try {
      // Simulate Google oauth window loader
      await new Promise(resolve => setTimeout(resolve, 1500));
      await googleLogin(email, name);
      setShowGoogleModal(false);
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err || 'Failed to authenticate with Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const parsedData = plan ? parsePlan(plan.planText) : null;

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-bgApp min-h-screen text-center">
        {/* Modern loader style */}
        <div className="relative w-20 h-20 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full absolute"
          />
          <div className="w-full h-full flex items-center justify-center text-3xl absolute">
            🥑
          </div>
        </div>

        <div className="h-14 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={loadingTextIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-base font-extrabold text-gray-700 max-w-[280px] leading-tight"
            >
              {loadingTexts[loadingTextIdx]}
            </motion.h2>
          </AnimatePresence>
        </div>

        <p className="text-xs font-semibold text-gray-400 mt-2">
          This takes just a few seconds while we structure your meals.
        </p>
      </div>
    );
  }

  const isGuestMode = !user && plan?.isGuest;

  return (
    <div className={`flex-1 flex flex-col p-6 bg-bgApp relative ${isGuestMode ? 'h-[100dvh] overflow-hidden pb-6' : 'pb-[80px] md:pt-[88px] md:pb-8 min-h-screen'}`}>
      <div className={`max-w-3xl mx-auto w-full flex-1 flex flex-col ${isGuestMode ? 'h-full overflow-hidden' : ''}`}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 shrink-0">
          <button
            onClick={() => navigate(user ? '/dashboard' : '/')}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Today's Diet Plan</h1>
            <p className="text-xs font-bold text-gray-400 mt-0.5">Personalized recommendations</p>
          </div>
        </div>

        {error ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 text-center my-auto shadow-card">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h3 className="text-base font-bold text-gray-800 mb-2">Generation Failed</h3>
            <p className="text-xs text-red-500 font-semibold mb-6 leading-relaxed">{error}</p>
            <button
              onClick={generatePlan}
              className="w-full bg-primary text-white font-bold h-12 rounded-full hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 focus:outline-none text-sm"
            >
              Try Again <RefreshCw size={16} />
            </button>
          </div>
        ) : (
          parsedData && (
            <div className={`flex-1 flex flex-col justify-between relative ${isGuestMode ? 'overflow-hidden h-full' : ''}`}>
              {/* MEALS CONTAINER & INFRASTRUCTURE */}
              <div className={isGuestMode ? "filter blur-[5px] opacity-40 pointer-events-none select-none h-full overflow-hidden" : ""}>
                {/* Target Header Summary */}
                <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase block">Daily Calorie Target</span>
                    <span className="text-lg font-black text-gray-800">{plan.calories} kcal</span>
                  </div>
                  <div className="flex gap-2.5 text-right">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 block">P</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{plan.protein}g</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 block">C</span>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">{plan.carbs}g</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 block">F</span>
                      <span className="text-xs font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded">{plan.fat}g</span>
                    </div>
                  </div>
                </div>

                {/* Meal Accordions */}
                <div className="space-y-1 mb-6">
                  {parsedData.meals.slice(0, isGuestMode ? 2 : undefined).map((meal, idx) => (
                    <MealCard key={idx} meal={meal} />
                  ))}
                </div>

                {/* Practical Tips */}
                {!isGuestMode && parsedData.tips && parsedData.tips.length > 0 && (
                  <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100 mb-6">
                    <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3.5 flex items-center gap-1.5 border-b border-gray-50 pb-2">
                      <CheckCircle2 size={15} className="text-primary" /> Practical Tips for Goal
                    </h3>
                    <ul className="space-y-2.5">
                      {parsedData.tips.map((tip, idx) => (
                        <li key={idx} className="text-xs text-gray-600 font-semibold leading-relaxed flex items-start">
                          <span className="text-primary mr-2 font-black">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Member Regeneration Action */}
                {!isGuestMode && (
                  <div className="mt-auto">
                    <button
                      onClick={generatePlan}
                      className="w-full bg-white hover:bg-gray-50 text-primary border-2 border-primary font-bold h-[52px] rounded-full flex items-center justify-center gap-2 transition-colors focus:outline-none shadow-sm"
                    >
                      Regenerate Plan <RefreshCw size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* LOCK OVERLAY CONTAINER (Only shown in guest mode) */}
              {isGuestMode && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] flex flex-col items-center justify-center p-6 text-center z-20 overflow-hidden select-none">
                  <div className="w-16 h-16 bg-gradient-to-tr from-primary to-emerald-400 rounded-full flex items-center justify-center text-white shadow-md mb-5 animate-bounce">
                    <Lock className="w-7 h-7 stroke-[2.5px]" />
                  </div>
                  
                  <h3 className="text-lg font-black text-gray-800 tracking-tight leading-tight mb-2">
                    Unlock your daily diet plan 🔓
                  </h3>
                  
                   <p className="text-xs font-semibold text-gray-500 max-w-[280px] mb-6 leading-relaxed">
                    We've designed a custom 1-day meal plan based on your profile targets. Sign in with Google to view the ingredients and save your plan.
                  </p>

                  {authError && (
                    <div className="text-red-500 text-[11px] font-bold mb-4">
                      {authError}
                    </div>
                  )}

                  {googleLoading ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                      <p className="text-[10px] font-bold text-gray-400">Authenticating account...</p>
                    </div>
                  ) : (
                    <GoogleSignInBtn onError={setAuthError} onSuccess={() => setGoogleLoading(true)} />
                  )}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GeneratePlan;
