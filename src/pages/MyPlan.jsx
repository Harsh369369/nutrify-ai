import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import api from '../api';
import { Trash2, Calendar, Flame, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

const MyPlan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlanId, setExpandedPlanId] = useState(null);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await api.get('/plan/history');
      setPlans(res.data.plans || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch plan history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const toggleExpand = (id) => {
    setExpandedPlanId(expandedPlanId === id ? null : id);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Avoid expanding when deleting
    if (!window.confirm('Are you sure you want to delete this meal plan?')) return;

    try {
      await api.delete(`/plan/${id}`);
      setPlans(plans.filter((p) => p._id !== id));
      if (expandedPlanId === id) setExpandedPlanId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete meal plan.');
    }
  };

  const parsePlan = (txt) => {
    try {
      return JSON.parse(txt);
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 pb-[80px] md:pt-[88px] md:pb-8 bg-bgApp min-h-screen">
      <div className="max-w-3xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Plan History</h1>
          <p className="text-xs font-bold text-gray-400 mt-0.5">Your past generated meal plans</p>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-semibold text-gray-400">Loading history...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border border-gray-100 shadow-card my-auto">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <p className="text-xs text-red-500 font-semibold">{error}</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center my-auto p-6 bg-white rounded-3xl border border-gray-100 shadow-card">
            <span className="text-4xl mb-4 select-none">🍽️</span>
            <h3 className="text-sm font-bold text-gray-800 mb-1">No plans generated yet</h3>
            <p className="text-xs text-gray-400 font-semibold leading-relaxed mb-6">
              Generate your first meal plan to start tracking your daily diet goals.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => {
              const isExpanded = expandedPlanId === plan._id;
              const parsedData = parsePlan(plan.planText);
              const dateStr = new Date(plan.createdAt).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={plan._id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden transition-all duration-300"
                >
                  {/* Header click triggers expand */}
                  <div
                    onClick={() => toggleExpand(plan._id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-gray-800 block">
                          {dateStr}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-0.5">
                          <Flame size={12} className="text-orange-500" /> {plan.calories} kcal
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDelete(plan._id, e)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors focus:outline-none"
                      >
                        <Trash2 size={16} />
                      </button>
                      {isExpanded ? (
                        <ChevronUp size={18} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded meal breakdowns */}
                  {isExpanded && parsedData && (
                    <div className="px-4 pb-4 border-t border-gray-50 bg-gray-50/20 pt-3 space-y-3">
                      {/* Calories & Macros summary header */}
                      <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-2xl border border-gray-100 text-center">
                        <div>
                          <span className="text-[9px] font-bold text-gray-400 block">Protein</span>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50/50 px-1 py-0.5 rounded inline-block mt-0.5">{plan.protein}g</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-gray-400 block">Carbs</span>
                          <span className="text-xs font-bold text-amber-600 bg-amber-50/50 px-1 py-0.5 rounded inline-block mt-0.5">{plan.carbs}g</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-gray-400 block">Fat</span>
                          <span className="text-xs font-bold text-pink-600 bg-pink-50/50 px-1 py-0.5 rounded inline-block mt-0.5">{plan.fat}g</span>
                        </div>
                      </div>

                      {/* Individual Meals */}
                      <div className="space-y-3">
                        {parsedData.meals.map((meal, idx) => (
                          <div key={idx} className="bg-white p-3.5 rounded-2xl border border-gray-50 shadow-sm">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[9px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {meal.name}
                              </span>
                              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                {meal.calories} kcal
                              </span>
                            </div>
                            <ul className="text-xs text-gray-600 font-semibold space-y-1 my-2">
                              {meal.items.map((it, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-primary mr-1.5 font-bold">•</span>
                                  {it}
                                </li>
                              ))}
                            </ul>
                            <p className="text-[10px] text-gray-400 leading-normal font-semibold bg-gray-50 p-2 rounded-lg">
                              {meal.reason}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Meal Tips */}
                      {parsedData.tips && parsedData.tips.length > 0 && (
                        <div className="bg-white p-3.5 rounded-2xl border border-gray-50 shadow-sm">
                          <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-2 border-b border-gray-50 pb-1">
                            Health Advice
                          </span>
                          <ul className="space-y-1.5">
                            {parsedData.tips.map((t, idx) => (
                              <li key={idx} className="text-xs text-gray-600 font-semibold leading-relaxed flex items-start">
                                <span className="text-primary mr-1.5">•</span>
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <BottomNav />
    </div>
  );
};

export default MyPlan;
