import React from 'react';

const shadowColors = {
  'text-orange-500': 'rgba(249, 115, 22, 0.12)',
  'text-emerald-500': 'rgba(16, 185, 129, 0.12)',
  'text-amber-500': 'rgba(245, 158, 11, 0.12)',
  'text-pink-500': 'rgba(236, 72, 153, 0.12)'
};

const MetricCard = ({ title, value, unit, icon: Icon, colorClass, borderClass }) => {
  const glowColor = shadowColors[colorClass] || 'rgba(0, 0, 0, 0.04)';

  return (
    <div 
      className={`p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-white/40 border-l-4 ${borderClass} flex flex-col justify-between h-[100px] transition-all duration-200 hover:scale-[1.02]`}
      style={{ boxShadow: `0 10px 25px -5px ${glowColor}, 0 8px 10px -6px ${glowColor}` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold text-gray-400 tracking-wide uppercase">{title}</span>
        {Icon && <Icon className={`w-4 h-4 ${colorClass}`} />}
      </div>
      <div className="mt-2 flex items-baseline">
        <span className="text-2xl font-black text-gray-800">{value}</span>
        <span className="text-xs font-bold text-gray-400 ml-1">{unit}</span>
      </div>
    </div>
  );
};

export default MetricCard;
