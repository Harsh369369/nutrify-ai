import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChipSelect from '../components/ChipSelect';
import MetricCard from '../components/MetricCard';
import MacroBar from '../components/MacroBar';
import { 
  Flame, 
  Dumbbell, 
  Wheat, 
  Droplet, 
  Sparkles, 
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const { 
    user, 
    saveGuestProfile, 
    guestProfile, 
    guestMacros
  } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Form State for Interactive Slides
  const [step, setStep] = useState(1);
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

  const [formError, setFormError] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);

  // Prefill if guestProfile already exists in local storage
  useEffect(() => {
    if (guestProfile) {
      setFormData(guestProfile);
      setShowRequirements(true);
    }
  }, [guestProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError('');
  };

  const handleChipChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (formError) setFormError('');
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.age || !formData.weight || !formData.height || !formData.gender) {
        setFormError('Please enter age, weight, height, and gender.');
        return false;
      }
      if (Number(formData.age) <= 0 || Number(formData.weight) <= 0 || Number(formData.height) <= 0) {
        setFormError('Please enter valid positive values.');
        return false;
      }
    }
    setFormError('');
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
      setFormError('');
    }
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    saveGuestProfile(formData);
    setShowRequirements(true);
  };

  return (
    <div className="h-[100dvh] md:h-auto md:min-h-screen flex flex-col bg-bgApp overflow-hidden md:overflow-y-auto relative pb-4 md:pb-12">
      {/* Decorative top shape */}
      <div className="absolute top-0 left-0 right-0 h-[240px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none -z-10" />

      {/* Header Bar */}
      <header className="hidden md:flex px-6 py-4 items-center justify-between border-b border-gray-100 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm font-bold text-lg">
            🥗
          </div>
          <span className="font-extrabold text-gray-800 text-base tracking-tight">Nutrify AI</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="text-xs font-extrabold text-primary border-2 border-primary/20 hover:border-primary px-4 py-2 rounded-full transition-all focus:outline-none"
        >
          Sign In
        </button>
      </header>

      <div className="max-w-xl mx-auto w-full px-6 pt-4 md:pt-6 flex-1 flex flex-col justify-between md:justify-start overflow-hidden md:overflow-visible">
        {/* HERO SECTION */}
        <div className="text-center mb-4 md:mb-8 shrink-0">
          <span className="text-[10px] font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2 md:mb-3">
            AI-Driven Diet Engine
          </span>
          <h1 className="text-xl md:text-3xl font-black text-gray-800 leading-tight">
            Calculate your nutrition target instantly
          </h1>
          <p className="text-[11px] md:text-xs font-semibold text-gray-400 mt-1 md:mt-2 px-4 leading-relaxed">
            Science-backed Mifflin-St Jeor calculations coupled with highly custom daily meals.
          </p>
        </div>

        {/* INTERACTIVE SLIDES SECTION */}
        {!showRequirements && (
          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-card border border-gray-100 mb-4 md:mb-6 flex flex-col justify-between flex-1 md:flex-initial md:min-h-[360px] overflow-y-auto no-scrollbar">
            <div>
              {/* Stepper Progress bar */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                  Step {step} of 3
                </span>
                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${(step / 3) * 100}%` }}
                    className="bg-primary h-full transition-all duration-300"
                  />
                </div>
              </div>

              {formError && (
                <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl mb-4 border border-red-100">
                  {formError}
                </div>
              )}

              {/* Form Slides with AnimatePresence */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-base font-extrabold text-gray-800">Tell us about your body</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Age (Years)</label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="e.g. 25"
                          className="w-full px-4 h-12 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full px-4 h-12 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
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
                          className="w-full px-4 h-12 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none"
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
                          className="w-full px-4 h-12 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-base font-extrabold text-gray-800">What is your primary goal?</h3>
                    <div>
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
                    <h3 className="text-base font-extrabold text-gray-800 mt-4">Activity Level</h3>
                    <div>
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
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-base font-extrabold text-gray-800">Dietary Style & Cuisine</h3>
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
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Cuisine Preference</label>
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
                        className="w-full px-4 h-12 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stepper Buttons */}
            <div className="flex gap-4 mt-8 pt-4 border-t border-gray-50">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold h-12 rounded-xl flex items-center justify-center transition-colors focus:outline-none"
                >
                  <ArrowLeft size={16} className="mr-1" /> Back
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm focus:outline-none"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-extrabold h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm focus:outline-none"
                >
                  Calculate targets 🎯
                </button>
              )}
            </div>
          </div>
        )}

        {/* RESULTS & DIET PLAN REDIRECT SECTION */}
        {showRequirements && guestMacros && (
          <div className="space-y-4 md:space-y-6 flex-1 flex flex-col justify-between overflow-hidden md:overflow-visible pb-4">
            {/* calculated nutrition cards */}
            <div className="bg-white rounded-3xl p-5 md:p-6 shadow-card border border-gray-100 flex-1 md:flex-initial overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">
                  Your Nutrition Targets
                </h3>
                <button
                  onClick={() => {
                    setShowRequirements(false);
                    setStep(1);
                  }}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 focus:outline-none"
                >
                  Edit details
                </button>
              </div>

              {/* Metric grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
                <MetricCard
                  title="Daily Calories"
                  value={guestMacros.calories}
                  unit="kcal"
                  icon={Flame}
                  colorClass="text-orange-500"
                  borderClass="border-orange-500"
                />
                <MetricCard
                  title="Protein"
                  value={guestMacros.protein}
                  unit="g"
                  icon={Dumbbell}
                  colorClass="text-emerald-500"
                  borderClass="border-emerald-500"
                />
                <MetricCard
                  title="Carbohydrates"
                  value={guestMacros.carbs}
                  unit="g"
                  icon={Wheat}
                  colorClass="text-amber-500"
                  borderClass="border-amber-500"
                />
                <MetricCard
                  title="Fats"
                  value={guestMacros.fat}
                  unit="g"
                  icon={Droplet}
                  colorClass="text-pink-500"
                  borderClass="border-pink-500"
                />
              </div>

              {/* Macro Bar breakdown */}
              <MacroBar protein={guestMacros.protein} carbs={guestMacros.carbs} fat={guestMacros.fat} />
            </div>

            {/* Create Diet CTA - Navigates to /generate */}
            <button
              onClick={() => navigate('/generate')}
              className="w-full bg-primary hover:bg-primary-dark text-white font-black h-[52px] md:h-[54px] rounded-2xl flex items-center justify-center gap-2 transition-transform shadow-md hover:shadow-lg active:scale-95 focus:outline-none shrink-0"
            >
              Create Personalized Diet Plan <Sparkles className="w-5 h-5 fill-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
