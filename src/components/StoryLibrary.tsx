import React from 'react';
import { BookOpen, Trash2, Calendar } from 'lucide-react';
import { Story } from '../types/Story';

interface StoryLibraryProps {
  stories: Story[];
  onStorySelect: (story: Story) => void;
  onDeleteStory: (storyId: string) => void;
  highContrast: boolean;
}

const StoryLibrary: React.FC<StoryLibraryProps> = ({
  stories,
  onStorySelect,
  onDeleteStory,
  highContrast
}) => {
  const getGradientColor = (index: number) => {
    const gradients = [
      'from-pink-400 to-rose-400',
      'from-purple-400 to-indigo-400',
      'from-blue-400 to-teal-400',
      'from-green-400 to-emerald-400',
      'from-yellow-400 to-orange-400',
      'from-red-400 to-pink-400'
    ];
    return gradients[index % gradients.length];
  };

  if (stories.length === 0) {
    return (
      <div className="text-center py-16">
        <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
          highContrast ? 'bg-gray-700' : 'bg-gradient-to-br from-purple-100 to-blue-100'
        }`}>
          <BookOpen className={`w-12 h-12 ${
            highContrast ? 'text-white' : 'text-purple-600'
          }`} />
        </div>
        <h2 className={`text-3xl font-bold mb-4 ${
          highContrast ? 'text-white' : 'text-gray-800'
        }`}>
          No Stories Yet
        </h2>
        <p className={`text-xl ${
          highContrast ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Create your first magical story to see it here!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className={`text-center mb-8 ${
        highContrast ? 'text-white' : 'text-gray-800'
      }`}>
        <h2 className="text-4xl font-bold mb-4">My Story Collection</h2>
        <p className="text-xl opacity-80">
          {stories.length} magical {stories.length === 1 ? 'story' : 'stories'} waiting for you
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story, index) => (
          <div
            key={story.id}
            className={`group relative ${
              highContrast ? 'bg-gray-800 border-white' : 'bg-white/80 border-white/30'
            } backdrop-blur-sm rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
          >
            {/* Book Cover */}
            <div className={`w-full h-40 rounded-xl mb-4 bg-gradient-to-br ${getGradientColor(index)} flex items-center justify-center text-white`}>
              <BookOpen className="w-16 h-16 opacity-80" />
            </div>

            {/* Story Info */}
            <h3 className={`text-xl font-bold mb-2 line-clamp-2 ${
              highContrast ? 'text-white' : 'text-gray-800'
            }`}>
              {story.title}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  highContrast ? 'bg-gray-700 text-white' : 'bg-purple-100 text-purple-800'
                }`}>
                  {story.character}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  highContrast ? 'bg-gray-700 text-white' : 'bg-blue-100 text-blue-800'
                }`}>
                  {story.setting}
                </span>
              </div>
              
              <div className="flex items-center space-x-1 text-sm">
                <Calendar className={`w-4 h-4 ${
                  highContrast ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <span className={highContrast ? 'text-gray-400' : 'text-gray-500'}>
                  {new Date(story.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => onStorySelect(story)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  highContrast
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-gradient-to-r from-coral to-yellow text-white hover:shadow-md'
                }`}
              >
                Read Story
              </button>
              
              <button
                onClick={() => story.id && onDeleteStory(story.id)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  highContrast
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
                aria-label="Delete story"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Preview on hover */}
            <div className={`absolute inset-0 ${
              highContrast ? 'bg-gray-900' : 'bg-white'
            } rounded-2xl p-6 opacity-0 group-hover:opacity-95 transition-opacity duration-300 overflow-hidden`}>
              <h4 className={`font-bold mb-3 ${
                highContrast ? 'text-white' : 'text-gray-800'
              }`}>
                Story Preview
              </h4>
              <p className={`text-sm leading-relaxed ${
                highContrast ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {story.content.substring(0, 150)}...
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryLibrary;