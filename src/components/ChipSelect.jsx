import React from 'react';

const ChipSelect = ({ options, selectedValue, onChange, gridClass = "grid grid-cols-2 gap-2" }) => {
  return (
    <div className={gridClass}>
      {options.map((opt) => {
        const value = typeof opt === 'object' ? opt.value : opt;
        const label = typeof opt === 'object' ? opt.label : opt;
        const isSelected = selectedValue === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`py-3 px-4 rounded-xl text-xs font-bold border-2 transition-all text-center focus:outline-none flex items-center justify-center h-12 ${
              isSelected
                ? 'bg-primary border-primary text-white shadow-sm scale-[1.02]'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default ChipSelect;
