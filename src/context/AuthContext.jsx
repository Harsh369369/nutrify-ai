import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext(null);

const calculateClientMacros = ({ age, weight, height, gender, goal, activity }) => {
  const BMR = gender === 'male'
    ? 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) + 5
    : 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) - 161;

  const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, very_active: 1.725 };
  const TDEE = BMR * (multipliers[activity] || 1.2);

  let calories = TDEE;
  if (goal === 'lose_weight') {
    calories = TDEE * 0.8;
  } else if (goal === 'gain_muscle') {
    calories = TDEE * 1.1;
  }

  let proteinMultiplier = 1.4;
  if (goal === 'gain_muscle') {
    proteinMultiplier = 2.0;
  } else if (goal === 'lose_weight') {
    proteinMultiplier = 1.8;
  }
  
  const protein = Number(weight) * proteinMultiplier;
  const fat = (calories * 0.27) / 9;
  const carbs = (calories - (protein * 4) - (fat * 9)) / 4;

  return {
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat)
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [macros, setMacros] = useState(null);
  const [loading, setLoading] = useState(true);

  // Guest States
  const [guestProfile, setGuestProfile] = useState(() => {
    const saved = localStorage.getItem('guestProfile');
    return saved ? JSON.parse(saved) : null;
  });

  const [guestMacros, setGuestMacros] = useState(() => {
    const saved = localStorage.getItem('guestMacros');
    return saved ? JSON.parse(saved) : null;
  });

  const [guestPlan, setGuestPlan] = useState(() => {
    const saved = localStorage.getItem('guestPlan');
    return saved ? JSON.parse(saved) : null;
  });

  const saveGuestProfile = (profileData) => {
    const calculated = calculateClientMacros(profileData);
    setGuestProfile(profileData);
    setGuestMacros(calculated);
    localStorage.setItem('guestProfile', JSON.stringify(profileData));
    localStorage.setItem('guestMacros', JSON.stringify(calculated));
  };

  const saveGuestPlan = (planData) => {
    setGuestPlan(planData);
    localStorage.setItem('guestPlan', JSON.stringify(planData));
  };

  const fetchUser = async () => {
    try {
      const res = await api.get('/user/me');
      setUser(res.data.user);
      setProfile(res.data.profile);
      setMacros(res.data.macros);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const syncGuestData = async () => {
    const gProfile = localStorage.getItem('guestProfile');
    const gPlan = localStorage.getItem('guestPlan');

    if (gProfile) {
      try {
        const profileData = JSON.parse(gProfile);
        await api.post('/user/profile', profileData);
        
        if (gPlan) {
          const planData = JSON.parse(gPlan);
          await api.post('/plan/save', {
            planText: planData.planText,
            calories: planData.calories,
            protein: planData.protein,
            carbs: planData.carbs,
            fat: planData.fat
          });
        }
      } catch (err) {
        console.error('Failed to sync guest data on auth transition:', err);
      } finally {
        setGuestProfile(null);
        setGuestMacros(null);
        setGuestPlan(null);
        localStorage.removeItem('guestProfile');
        localStorage.removeItem('guestMacros');
        localStorage.removeItem('guestPlan');
      }
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      
      // Sync local guest stats to cloud if present
      await syncGuestData();

      // Fetch fresh profile state immediately after logging in
      const meRes = await api.get('/user/me');
      setProfile(meRes.data.profile);
      setMacros(meRes.data.macros);
      
      return { success: true, hasProfile: !!meRes.data.profile };
    } catch (err) {
      console.error(err);
      throw err.response?.data?.message || 'Login failed';
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { name, email, password, confirmPassword });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);

      // Sync guest details
      await syncGuestData();

      // Fetch profile
      const meRes = await api.get('/user/me');
      setProfile(meRes.data.profile);
      setMacros(meRes.data.macros);

      return { success: true };
    } catch (err) {
      console.error(err);
      throw err.response?.data?.message || 'Signup failed';
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (idToken, email, name) => {
    setLoading(true);
    try {
      const payload = idToken ? { idToken } : { email, name };
      const res = await api.post('/auth/google', payload);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);

      // Sync guest details
      await syncGuestData();

      // Fetch fresh profile
      const meRes = await api.get('/user/me');
      setProfile(meRes.data.profile);
      setMacros(meRes.data.macros);

      return { success: true, hasProfile: !!meRes.data.profile };
    } catch (err) {
      console.error(err);
      throw err.response?.data?.message || 'Google login failed';
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
    setMacros(null);
    setGuestProfile(null);
    setGuestMacros(null);
    setGuestPlan(null);
    localStorage.removeItem('guestProfile');
    localStorage.removeItem('guestMacros');
    localStorage.removeItem('guestPlan');
    setLoading(false);
  };

  const saveProfile = async (profileData, isUpdate = false) => {
    try {
      let res;
      if (isUpdate) {
        res = await api.put('/user/profile', profileData);
      } else {
        res = await api.post('/user/profile', profileData);
      }
      setProfile(res.data.profile);
      setMacros(res.data.macros);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err.response?.data?.message || 'Failed to save profile';
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      macros,
      guestProfile,
      guestMacros,
      guestPlan,
      loading,
      login,
      signup,
      googleLogin,
      logout,
      saveProfile,
      saveGuestProfile,
      saveGuestPlan,
      refreshUser: fetchUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
