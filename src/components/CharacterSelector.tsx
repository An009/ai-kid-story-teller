import React from 'react';
import { Cat, Rabbit, Hexagon as Dragon, Crown, Rocket, Fish } from 'lucide-react';

interface CharacterSelectorProps {
  selected: string;
  onSelect: (character: string) => void;
  highContrast: boolean;
  audioEnabled: boolean;
}

const characters = [
  { id: 'cat', name: 'Luna the Cat', icon: Cat, color: 'from-purple-400 to-pink-400' },
  { id: 'rabbit', name: 'Benny Bunny', icon: Rabbit, color: 'from-green-400 to-blue-400' },
  { id: 'dragon', name: 'Spark the Dragon', icon: Dragon, color: 'from-red-400 to-orange-400' },
  { id: 'princess', name: 'Princess Maya', icon: Crown, color: 'from-pink-400 to-purple-400' },
  { id: 'astronaut', name: 'Captain Zoe', icon: Rocket, color: 'from-blue-400 to-indigo-400' },
  { id: 'mermaid', name: 'Pearl the Mermaid', icon: Fish, color: 'from-teal-400 to-cyan-400' }
];

const CharacterSelector: React.FC<CharacterSelectorProps> = ({ 
  selected, 
  onSelect, 
  highContrast,
  audioEnabled 
}) => {
  const playSelectSound = () => {
    if (audioEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Character selected!');
      utterance.rate = 1.5;
      utterance.volume = 0.3;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`${
      highContrast ? 'bg-gray-800 border-white' : 'bg-white/80 border-white/30'
    } backdrop-blur-sm rounded-2xl p-6 border shadow-lg`}>
      <h3 className={`text-2xl font-bold text-center mb-6 ${
        highContrast ? 'text-white' : 'text-gray-800'
      }`}>
        Choose Your Hero
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {characters.map((character) => {
          const IconComponent = character.icon;
          const isSelected = selected === character.id;
          
          return (
            <button
              key={character.id}
              onClick={() => {
                onSelect(character.id);
                playSelectSound();
              }}
              className={`group relative p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? highContrast
                    ? 'bg-white text-black shadow-lg'
                    : `bg-gradient-to-br ${character.color} text-white shadow-lg scale-105`
                  : highContrast
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isSelected && !highContrast ? 'bg-white/20' : ''
                }`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium text-center leading-tight">
                  {character.name}
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

export default CharacterSelector;