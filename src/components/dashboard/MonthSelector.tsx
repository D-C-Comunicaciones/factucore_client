"use client";
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const monthOptions = [
  { value: 'current', label: 'Mes actual' },
  { value: 'last3', label: 'Últimos 3 meses' },
  { value: 'last6', label: 'Últimos 6 meses' },
];

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('Mes actual');

  const handleSelect = (option: typeof monthOptions[0]) => {
    setSelectedLabel(option.label);
    setShowMenu(false);
    onMonthChange(option.value);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="bg-white px-3 py-1.5 rounded-full text-xs font-medium border border-gray-300 hover:border-gray-400 transition-colors flex items-center gap-2 min-w-[120px] justify-between text-gray-900"
      >
        <span>{selectedLabel}</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
      </button>
      {showMenu && (
        <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden">
          <div className="py-1">
            {monthOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors text-gray-900"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
