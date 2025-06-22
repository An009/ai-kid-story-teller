import React from 'react';
import { Trees, Waves, Mountain, Castle, Rocket, Home } from 'lucide-react';

interface SettingSelectorProps {
  selected: string;
  onSelect: (setting: string) => void;
  highContrast: boolean;
  audioEnabled: boolean;
  disabled?: boolean;
}

const settings = [
  { id: 'forest', name: 'Enchanted Forest', icon: Trees, color: 'from-green-400 to-emerald-400' },
  { id: 'ocean', name: 'Underwater Kingdom', icon: Waves, color: 'from-blue-400 to-teal-400' },
  { id: 'mountain', name: 'Magical Mountains', icon: Mountain, color: 'from-purple-400 to-indigo-400' },
  { id: 'castle', name: 'Royal Castle', icon: Castle, color: 'from-pink-400 to-rose-400' },
  { id: 'space', name: 'Outer Space', icon: Rocket, color: 'from-indigo-400 to-purple-400' },
  { id: 'village', name: 'Cozy Village', icon: Home, color: 'from-orange-400 to-red-400' }
];

const SettingSelector: React.FC<SettingSelectorProps> = ({ 
  selected, 
  onSelect, 
  highContrast,
  audioEnabled,
  disabled = false
}) => {
  const playSelectSound = () => {
    if (audioEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Setting selected!');
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
        Pick Your World
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {settings.map((setting) => {
          const IconComponent = setting.icon;
          const isSelected = selected === setting.id;
          
          return (
            <button
              key={setting.id}
              onClick={() => {
                if (!disabled) {
                  onSelect(setting.id);
                  playSelectSound();
                }
              }}
              disabled={disabled}
              className={`group relative p-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed ${
                isSelected
                  ? highContrast
                    ? 'bg-white text-black shadow-lg'
                    : `bg-gradient-to-br ${setting.color} text-white shadow-lg scale-105`
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
                  {setting.name}
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

export default SettingSelector;