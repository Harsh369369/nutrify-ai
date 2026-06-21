import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import { Mail, LogOut, Edit2, ShieldAlert, Award, Footprints } from 'lucide-react';

const Profile = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const formatLabel = (txt) => {
    if (!txt) return 'None';
    return txt.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="flex-1 flex flex-col p-6 pb-[80px] md:pt-[88px] md:pb-8 bg-bgApp min-h-screen">
      <div className="max-w-3xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">My Profile</h1>
          <p className="text-xs font-bold text-gray-400 mt-0.5">Account & physical statistics</p>
        </div>

        {/* User Header Details Card */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100 mb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xl mb-3 border border-primary/20">
            {getInitials(user?.name)}
          </div>
          <h2 className="text-base font-extrabold text-gray-800 leading-tight">{user?.name || 'User'}</h2>
          <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 mt-1 justify-center">
            <Mail size={12} /> {user?.email || 'user@example.com'}
          </span>
        </div>

        {profile ? (
          <div className="space-y-5">
            {/* Physical Stats Grid */}
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-2.5">
                Physical Details
              </span>
              <div className="grid grid-cols-2 gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-card">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Age</span>
                  <span className="text-sm font-extrabold text-gray-800 mt-0.5">{profile.age} years</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Gender</span>
                  <span className="text-sm font-extrabold text-gray-800 mt-0.5 capitalize">{profile.gender}</span>
                </div>
                <div className="border-t border-gray-50 pt-3 mt-2.5">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Weight</span>
                  <span className="text-sm font-extrabold text-gray-800 mt-0.5">{profile.weight} kg</span>
                </div>
                <div className="border-t border-gray-50 pt-3 mt-2.5">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Height</span>
                  <span className="text-sm font-extrabold text-gray-800 mt-0.5">{profile.height} cm</span>
                </div>
              </div>
            </div>

            {/* Goal & Preferences */}
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-2.5">
                Target & Diet Preferences
              </span>
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-card space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Award size={15} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 block uppercase">Target Goal</span>
                    <span className="text-xs font-bold text-gray-800 leading-tight block mt-0.5">{formatLabel(profile.goal)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-gray-50 pt-3.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Footprints size={15} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 block uppercase">Activity level</span>
                    <span className="text-xs font-bold text-gray-800 leading-tight block mt-0.5">{formatLabel(profile.activity)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-gray-50 pt-3.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-primary flex items-center justify-center flex-shrink-0 text-sm">
                    🥗
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 block uppercase">Diet & Cuisine</span>
                    <span className="text-xs font-bold text-gray-800 leading-tight block mt-0.5">
                      {formatLabel(profile.dietType)} • {formatLabel(profile.cuisine)}
                    </span>
                  </div>
                </div>

                {profile.conditions && (
                  <div className="flex items-start gap-3 border-t border-gray-50 pt-3.5">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ShieldAlert size={15} />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 block uppercase">Health Conditions</span>
                      <span className="text-xs font-semibold text-gray-700 leading-normal block mt-0.5">
                        {profile.conditions}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 text-center mb-6">
            <p className="text-xs font-semibold text-gray-400 mb-4">You have not completed your profile setup.</p>
            <button
              onClick={() => navigate('/setup')}
              className="px-6 py-2.5 bg-primary text-white font-bold rounded-full text-xs focus:outline-none"
            >
              Setup Now
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate('/setup')}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-100 font-bold h-[52px] rounded-full flex items-center justify-center gap-2 transition-colors focus:outline-none shadow-sm"
          >
            <Edit2 size={15} className="text-gray-400" /> Edit Profile Details
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold h-[52px] rounded-full flex items-center justify-center gap-2 transition-colors focus:outline-none"
          >
            <LogOut size={15} /> Log Out
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
