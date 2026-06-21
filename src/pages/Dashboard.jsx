import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/MetricCard';
import MacroBar from '../components/MacroBar';
import BottomNav from '../components/BottomNav';
import api from '../api';
import { Flame, Dumbbell, Wheat, Droplet, Sparkles, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const { user, macros, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [latestPlan, setLatestPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const getTodayDateKey = () => {
    const today = new Date();
    return `water_intake_${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  const [waterIntake, setWaterIntake] = useState(() => {
    const saved = localStorage.getItem(getTodayDateKey());
    return saved ? Number(saved) : 0;
  });

  const addWater = (amount) => {
    const updated = waterIntake + amount;
    setWaterIntake(updated);
    localStorage.setItem(getTodayDateKey(), updated.toString());
  };

  const resetWater = () => {
    setWaterIntake(0);
    localStorage.setItem(getTodayDateKey(), '0');
  };

  const waterProgressPct = Math.min((waterIntake / 2500) * 100, 100);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/', { replace: true });
      return;
    }

    if (!profile) {
      navigate('/setup', { replace: true });
      return;
    }

    const fetchLatestPlan = async () => {
      try {
        const res = await api.get('/plan/history');
        if (res.data.plans && res.data.plans.length > 0) {
          setLatestPlan(res.data.plans[0]);
        }
      } catch (err) {
        console.error('Error fetching latest plan:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestPlan();
  }, [user, profile, authLoading, navigate]);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Safe parsing helper
  const parsePlan = (txt) => {
    try {
      return JSON.parse(txt);
    } catch (e) {
      return null;
    }
  };

  const parsedPlanText = latestPlan ? parsePlan(latestPlan.planText) : null;
  const firstMeals = parsedPlanText ? parsedPlanText.meals.slice(0, 3) : [];

  return (
    <div className="flex-1 flex flex-col p-6 pb-[80px] md:pt-[88px] md:pb-8 bg-bgApp min-h-screen">
      <div className="max-w-5xl mx-auto w-full">
        {/* Top Section */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-tight">
            {getGreeting()}, {user?.name || 'Friend'} 👋
          </h1>
          <p className="text-xs font-bold text-gray-400 mt-1">
            Here's your daily nutrition target
          </p>
        </div>

        {/* Responsive Layout wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left/Main Column: Metric Cards Grid & Macro Split Bar */}
          <div className="md:col-span-2 space-y-6">
            {/* Metric Cards (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="Daily Calories"
                value={macros?.calories || 0}
                unit="kcal"
                icon={Flame}
                colorClass="text-orange-500"
                borderClass="border-orange-500"
              />
              <MetricCard
                title="Protein"
                value={macros?.protein || 0}
                unit="g"
                icon={Dumbbell}
                colorClass="text-emerald-500"
                borderClass="border-emerald-500"
              />
              <MetricCard
                title="Carbohydrates"
                value={macros?.carbs || 0}
                unit="g"
                icon={Wheat}
                colorClass="text-amber-500"
                borderClass="border-amber-500"
              />
              <MetricCard
                title="Fats"
                value={macros?.fat || 0}
                unit="g"
                icon={Droplet}
                colorClass="text-pink-500"
                borderClass="border-pink-500"
              />
            </div>

            {/* Macro Split Bar */}
            {macros && (
              <MacroBar protein={macros.protein} carbs={macros.carbs} fat={macros.fat} />
            )}
          </div>

          {/* Right Column: CTA Actions & Last Plan Summary */}
          <div className="flex flex-col gap-6">
            {/* Big Action CTA */}
            <button
              onClick={() => navigate('/generate')}
              className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold h-[52px] rounded-full flex items-center justify-center gap-2 transition-transform shadow-md hover:shadow-lg focus:outline-none active:scale-95"
            >
              Generate Today's Diet Plan <Sparkles className="w-4 h-4 fill-white" />
            </button>

            {/* Last Generated Plan Preview */}
            {latestPlan && parsedPlanText && (
              <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100">
                <div className="flex items-center justify-between mb-3.5 border-b border-gray-50 pb-2.5">
                  <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                    Last Generated Diet
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                    {new Date(latestPlan.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="space-y-3">
                  {firstMeals.map((meal, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs font-semibold text-gray-600">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-primary uppercase font-bold">{meal.name}</span>
                        <span className="text-gray-800 font-medium truncate max-w-[180px]">{meal.items[0]}</span>
                      </div>
                      <span className="text-gray-400 font-bold bg-gray-50 px-1.5 py-0.5 rounded text-[10px]">
                        {meal.calories} kcal
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/history')}
                  className="w-full text-center text-xs font-bold text-primary mt-4 flex items-center justify-center gap-1 hover:underline border-t border-gray-50 pt-3"
                >
                  View full plan <ChevronRight size={14} />
                </button>
              </div>
            )}

            {/* Water Hydration Tracker */}
            <div 
              className="bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-white/40 flex flex-col transition-all duration-200 hover:scale-[1.01]"
              style={{ boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-50/50">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <Droplet className="w-4 h-4 text-blue-500 fill-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-800 tracking-wide uppercase">Water Tracker</h3>
                    <p className="text-[10px] font-bold text-gray-400">Daily goal: 2500 ml</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {waterProgressPct.toFixed(0)}%
                </span>
              </div>

              {/* Visual animated water container and stats */}
              <div className="flex items-center gap-6 my-2">
                {/* Visual Cup container with wave/fill */}
                <div className="relative w-16 h-24 border-4 border-blue-200 rounded-b-2xl rounded-t-sm overflow-hidden bg-blue-50/30 flex items-end justify-center shadow-inner">
                  {/* Liquid Fill */}
                  <div 
                    className="w-full bg-blue-500/80 transition-all duration-500 ease-out relative"
                    style={{ height: `${waterProgressPct}%` }}
                  >
                    {/* Wave Animation overlay if needed */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400/50 animate-pulse" />
                  </div>
                  
                  {/* Grid marks on the glass cup */}
                  <div className="absolute inset-0 flex flex-col justify-between p-1.5 pointer-events-none opacity-40">
                    <div className="border-b border-blue-300 w-1/3 self-end" />
                    <div className="border-b border-blue-300 w-1/2 self-end" />
                    <div className="border-b border-blue-300 w-1/3 self-end" />
                    <div className="border-b border-blue-300 w-1/2 self-end" />
                  </div>
                  
                  {/* Progress display in center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-black text-blue-900 drop-shadow-sm">
                      {waterIntake} ml
                    </span>
                  </div>
                </div>

                {/* Quick stats & custom status description */}
                <div className="flex-1 space-y-1">
                  <div className="text-sm font-black text-gray-800">
                    {waterIntake} <span className="text-xs text-gray-400 font-bold">/ 2500 ml</span>
                  </div>
                  <p className="text-[10px] font-semibold text-gray-500 leading-normal">
                    {waterIntake >= 2500 
                      ? "🎉 You met your hydration goal today! Amazing job." 
                      : waterIntake === 0 
                      ? "💧 Ready to start hydrating? Log your first cup!" 
                      : "Keep drinking water to maintain energy & digestion."}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-blue-50/50">
                <button 
                  onClick={() => addWater(250)}
                  className="bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-600 font-extrabold text-[11px] py-2 rounded-xl transition-all flex items-center justify-center gap-1 focus:outline-none"
                >
                  +250ml
                </button>
                <button 
                  onClick={() => addWater(500)}
                  className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-extrabold text-[11px] py-2 rounded-xl transition-all flex items-center justify-center gap-1 focus:outline-none shadow-sm hover:shadow"
                >
                  +500ml
                </button>
                <button 
                  onClick={resetWater}
                  className="bg-gray-50 hover:bg-gray-100 active:scale-95 text-gray-500 font-extrabold text-[11px] py-2 rounded-xl transition-all flex items-center justify-center gap-1 focus:outline-none"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Navigation */}
      <BottomNav />
    </div>
  );
};

export default Dashboard;
