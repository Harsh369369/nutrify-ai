import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChipSelect from '../components/ChipSelect';
import { ArrowLeft } from 'lucide-react';

const ProfileSetup = () => {
  const { user, profile, saveProfile, saveGuestProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    goal: 'lose_weight',
    activity: 'sedentary',
    dietType: 'vegetarian',
    cuisine: 'indian',
    conditions: ''
  });

  // Prefill details if profile already exists (Editing mode)
  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile.age || '',
        weight: profile.weight || '',
        height: profile.height || '',
        gender: profile.gender || 'male',
        goal: profile.goal || 'lose_weight',
        activity: profile.activity || 'sedentary',
        dietType: profile.dietType || 'vegetarian',
        cuisine: profile.cuisine || 'indian',
        conditions: profile.conditions || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleChipChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (error) setError('');
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.age || !formData.weight || !formData.height || !formData.gender) {
        setError('Please fill in age, weight, height, and gender.');
        return false;
      }
      if (Number(formData.age) <= 0 || Number(formData.weight) <= 0 || Number(formData.height) <= 0) {
        setError('Please enter valid positive numbers.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    } else {
      // If profile exists, we came from Profile editing, so go back to /profile
      if (profile) {
        navigate('/profile');
      } else {
        navigate('/login');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      if (user) {
        await saveProfile(formData, !!profile);
      } else {
        saveGuestProfile(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Stepper progress indicator percentage
  const progressPct = ((step - 1) / 2) * 100;

  return (
    <div className="h-[100dvh] md:h-auto md:min-h-screen flex flex-col p-6 pb-6 md:pt-[88px] md:pb-8 bg-bgApp overflow-hidden md:overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col overflow-hidden md:overflow-visible">
        {/* Header Progress Stepper */}
        <div className="flex items-center gap-4 mb-4 md:mb-6 shrink-0">
          <button 
            onClick={handleBack} 
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
              {profile ? 'Edit Profile' : 'Setup Profile'} • Step {step} of 3
            </span>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${step === 1 ? '33%' : step === 2 ? '66%' : '100%'}` }}
                className="bg-primary h-full transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between overflow-hidden md:overflow-visible">
          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-card border border-gray-100 mb-4 md:mb-6 flex-1 md:flex-initial overflow-y-auto no-scrollbar">
            {error && (
              <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl mb-4 border border-red-100">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-gray-800 mb-2">Tell us about yourself</h3>
                
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 28"
                    className="w-full px-4 h-[48px] bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="e.g. 70"
                      className="w-full px-4 h-[48px] bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="e.g. 175"
                      className="w-full px-4 h-[48px] bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Gender</label>
                  <ChipSelect
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' }
                    ]}
                    selectedValue={formData.gender}
                    onChange={(val) => handleChipChange('gender', val)}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h3 className="text-lg font-extrabold text-gray-800 mb-2">Goal & Activity</h3>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Health Target</label>
                  <ChipSelect
                    options={[
                      { value: 'lose_weight', label: 'Lose weight 📉' },
                      { value: 'maintain_weight', label: 'Maintain weight ⚖️' },
                      { value: 'gain_muscle', label: 'Gain muscle 💪' },
                      { value: 'improve_health', label: 'Improve health 🍎' }
                    ]}
                    selectedValue={formData.goal}
                    onChange={(val) => handleChipChange('goal', val)}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Activity Level</label>
                  <ChipSelect
                    options={[
                      { value: 'sedentary', label: 'Sedentary (desk job)' },
                      { value: 'light', label: 'Lightly Active' },
                      { value: 'moderate', label: 'Moderately Active' },
                      { value: 'very_active', label: 'Very Active' }
                    ]}
                    selectedValue={formData.activity}
                    onChange={(val) => handleChipChange('activity', val)}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-gray-800 mb-2">Dietary Choices</h3>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Diet Style</label>
                  <ChipSelect
                    options={[
                      { value: 'vegetarian', label: 'Vegetarian' },
                      { value: 'vegan', label: 'Vegan' },
                      { value: 'non-vegetarian', label: 'Non-Veg' },
                      { value: 'eggetarian', label: 'Eggetarian' }
                    ]}
                    selectedValue={formData.dietType}
                    onChange={(val) => handleChipChange('dietType', val)}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Cuisine</label>
                  <ChipSelect
                    options={[
                      { value: 'indian', label: 'Indian' },
                      { value: 'continental', label: 'Continental' },
                      { value: 'mixed', label: 'Mixed' }
                    ]}
                    selectedValue={formData.cuisine}
                    onChange={(val) => handleChipChange('cuisine', val)}
                    gridClass="grid grid-cols-3 gap-2"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Health Conditions / Allergies</label>
                  <input
                    type="text"
                    name="conditions"
                    value={formData.conditions}
                    onChange={handleChange}
                    placeholder="e.g. Diabetes, Peanut allergy, None"
                    className="w-full px-4 h-[48px] bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action button row */}
          <div className="flex gap-4 mt-auto shrink-0 pb-2">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold h-[50px] md:h-[52px] rounded-full flex items-center justify-center transition-colors focus:outline-none"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold h-[50px] md:h-[52px] rounded-full flex items-center justify-center transition-colors shadow-sm focus:outline-none"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold h-[50px] md:h-[52px] rounded-full flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 focus:outline-none"
              >
                {loading ? 'Saving details...' : 'Save & Continue'}
              </button>
            )}
          </div>
      </div>
    </div>
  </div>
  );
};

export default ProfileSetup;
