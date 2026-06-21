import React from 'react';

const MacroBar = ({ protein = 0, carbs = 0, fat = 0 }) => {
  const total = protein + carbs + fat || 1;
  const pPct = Math.round((protein / total) * 100);
  const cPct = Math.round((carbs / total) * 100);
  const fPct = Math.max(0, 100 - pPct - cPct); // Guard against rounding issues

  return (
    <div className="bg-white p-4 rounded-2xl shadow-card">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-500 tracking-wide uppercase">Macro Ratio (g)</span>
        <span className="text-[11px] font-bold text-gray-500">
          {pPct}% P • {cPct}% C • {fPct}% F
        </span>
      </div>
      
      {/* Progress Bar Container */}
      <div className="w-full h-3 rounded-full flex overflow-hidden bg-gray-100">
        <div 
          style={{ width: `${pPct}%` }} 
          className="bg-emerald-500 h-full transition-all duration-500" 
          title={`Protein: ${protein}g (${pPct}%)`} 
        />
        <div 
          style={{ width: `${cPct}%` }} 
          className="bg-amber-500 h-full transition-all duration-500" 
          title={`Carbs: ${carbs}g (${cPct}%)`} 
        />
        <div 
          style={{ width: `${fPct}%` }} 
          className="bg-pink-500 h-full transition-all duration-500" 
          title={`Fat: ${fat}g (${fPct}%)`} 
        />
      </div>

      {/* Legend details */}
      <div className="flex justify-between mt-3 text-[11px] font-semibold">
        <div className="flex items-center text-emerald-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
          Prot: {protein}g
        </div>
        <div className="flex items-center text-amber-600">
          <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
          Carbs: {carbs}g
        </div>
        <div className="flex items-center text-pink-600">
          <span className="w-2 h-2 rounded-full bg-pink-500 mr-1.5" />
          Fat: {fat}g
        </div>
      </div>
    </div>
  );
};

export default MacroBar;
