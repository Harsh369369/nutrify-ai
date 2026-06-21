import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, User, Leaf } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/history', label: 'My Plan', icon: ClipboardList },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 md:top-0 md:bottom-auto left-0 w-full h-[60px] md:h-[64px] bg-white border-t md:border-t-0 md:border-b border-gray-100 flex items-center justify-around md:justify-between px-6 md:px-12 shadow-nav md:shadow-sm z-40">
      {/* Desktop Logo branding */}
      <div 
        onClick={() => navigate('/dashboard')} 
        className="hidden md:flex items-center gap-2 cursor-pointer select-none"
      >
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm">
          <Leaf className="w-5 h-5" />
        </div>
        <span className="font-extrabold text-gray-800 text-lg tracking-tight">Nutrify AI</span>
      </div>

      {/* Nav items list */}
      <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-around md:justify-end">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col md:flex-row items-center justify-center gap-1.5 px-4 h-full md:h-10 md:rounded-full transition-all focus:outline-none ${
                isActive 
                  ? 'text-primary md:bg-primary/5 font-extrabold scale-[1.02]' 
                  : 'text-gray-400 hover:text-gray-600 font-semibold'
              }`}
            >
              <Icon size={18} className={isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'} />
              <span className="text-[10px] md:text-xs mt-0.5 md:mt-0">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
