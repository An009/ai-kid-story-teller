import React from 'react';
import { Compass, Heart, Zap, Star, Puzzle, Smile } from 'lucide-react';

interface ThemeSelectorProps {
  selected: string;
  onSelect: (theme: string) => void;
  highContrast: boolean;
  audioEnabled: boolean;
  disabled?: boolean;
}

const themes = [
  { id: 'adventure', name: 'Epic Adventure', icon: Compass, color: 'from-orange-400 to-red-400' },
  { id: 'friendship', name: 'True Friendship', icon: Heart, color: 'from-pink-400 to-rose-400' },
  { id: 'magic', name: 'Magical Powers', icon: Zap, color: 'from-purple-400 to-indigo-400' },
  { id: 'dreams', name: 'Following Dreams', icon: Star, color: 'from-yellow-400 to-orange-400' },
  { id: 'mystery', name: 'Fun Mystery', icon: Puzzle, color: 'from-teal-400 to-cyan-400' },
  { id: 'kindness', name: 'Acts of Kindness', icon: Smile, color: 'from-green-400 to-emerald-400' }
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  selected, 
  onSelect, 
  highContrast,
  audioEnabled,
  disabled = false
}) => {
  const playSelectSound = () => {
    if (audioEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Theme selected!');
      utterance.rate = 1.5;
      utterance.volume = 0.3;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`${
      highContrast ? 'bg-gray-800 border-white' : 'bg-white/80 border-white/30'
    } backdrop-blur-sm rounded-2xl p-6 border shadow-lg ${disabled ? 'opacity-50' : ''}`}>
      <h3 className={`text-2xl font-bold text-center mb-6 ${
        highContrast ? 'text-white' : 'text-gray-800'
      }`}>
        Choose Your Theme
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {themes.map((theme) => {
          const IconComponent = theme.icon;
          const isSelected = selected === theme.id;
          
          return (
            <button
              key={theme.id}
              onClick={() => {
                if (!disabled) {
                  onSelect(theme.id);
                  playSelectSound();
                }
              }}
              disabled={disabled}
              className={`group relative p-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed ${
                isSelected
                  ? highContrast
                    ? 'bg-white text-black shadow-lg'
                    : `bg-gradient-to-br ${theme.color} text-white shadow-lg scale-105`
                  : highContrast
                    ? 'bg-gray-700 text-white hover:bg-gray-600 disabled:hover:bg-gray-700'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:hover:from-gray-100 disabled:hover:to-gray-200'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isSelected && !highContrast ? 'bg-white/20' : ''
                }`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium text-center leading-tight">
                  {theme.name}
                </span>
              </div>
              
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow rounded-full flex items-center justify-center">
                  <span className="text-xs">✨</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;