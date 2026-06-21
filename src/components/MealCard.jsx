import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const MealCard = ({ meal }) => {
  const { profile, guestProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [itemsList, setItemsList] = useState(meal.items);
  const [swappingIdx, setSwappingIdx] = useState(null);

  const handleSwap = async (idx, itemName) => {
    setSwappingIdx(idx);
    try {
      const cuisine = profile?.cuisine || guestProfile?.cuisine || 'indian';
      const dietType = profile?.dietType || guestProfile?.dietType || 'vegetarian';
      const goal = profile?.goal || guestProfile?.goal || 'lose_weight';

      const res = await api.post('/plan/swap-item', {
        mealName: meal.name,
        itemName,
        cuisine,
        dietType,
        goal,
        calories: Math.round(meal.calories / meal.items.length)
      });

      const updated = [...itemsList];
      updated[idx] = res.data.replacement;
      setItemsList(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSwappingIdx(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden mb-3">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left focus:outline-none"
      >
        <div>
          <span className="text-[10px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {meal.name}
          </span>
          <h3 className="text-[15px] font-bold text-gray-800 mt-1.5 truncate max-w-[200px]">
            {itemsList[0] || 'Meal Details'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
            {meal.calories} kcal
          </span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-50 pt-3">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Ingredients & Quantity</h4>
              
              <ul className="space-y-2 mb-4">
                {itemsList.map((item, idx) => (
                  <li 
                    key={idx} 
                    className="text-xs font-semibold text-gray-600 flex items-center justify-between bg-gray-50/50 p-2 rounded-xl border border-gray-100/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{item}</span>
                    </div>
                    
                    {swappingIdx === idx ? (
                      <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0 mr-1" />
                    ) : (
                      <button
                        onClick={() => handleSwap(idx, item)}
                        className="text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded-lg transition-colors focus:outline-none flex items-center gap-1 shrink-0"
                        title="Swap for a healthy alternative"
                      >
                        <RefreshCw size={10} /> Swap
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              <div className="bg-primary/5 border-l-2 border-primary p-3 rounded-r-xl">
                <span className="text-[9px] font-extrabold text-primary uppercase tracking-wider block mb-0.5">
                  Nutritional Reason
                </span>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {meal.reason}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MealCard;
