import React, { useState, useEffect } from 'react';
import { BookOpen, Trash2, Calendar, Heart, Eye, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { storyService } from '../services/storyService';
import { Story } from '../types/Story';

interface StoryLibraryProps {
  stories: Story[];
  onStorySelect: (story: Story) => void;
  onDeleteStory: (storyId: string) => void;
  highContrast: boolean;
  // Add refresh trigger prop to force component updates
  refreshTrigger?: number;
}

interface SavedStory {
  id: string;
  title: string;
  content: string;
  theme: string;
  hero_name: string;
  hero_type: string;
  setting: string;
  age_group: string;
  story_length: string;
  mood: string;
  magic_level: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  read_count: number;
}

const StoryLibrary: React.FC<StoryLibraryProps> = ({
  stories: localStories,
  onStorySelect,
  onDeleteStory,
  highContrast,
  refreshTrigger = 0
}) => {
  const { user } = useAuth();
  const [databaseStories, setDatabaseStories] = useState<SavedStory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredStory, setHoveredStory] = useState<string | null>(null);

  // Load stories from database when component mounts, user changes, or refresh is triggered
  useEffect(() => {
    if (user) {
      console.log('🔄 StoryLibrary: Loading stories due to dependency change', {
        userEmail: user.email,
        refreshTrigger
      });
      loadStoriesFromDatabase();
    } else {
      setDatabaseStories([]);
    }
  }, [user, refreshTrigger]); // Add refreshTrigger as dependency

  const loadStoriesFromDatabase = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('📚 Loading stories from database...');
      
      // Get user session token for authenticated requests
      const session = await user.getSession?.();
      const userToken = session?.access_token;
      
      const stories = await storyService.getUserStories(userToken);
      setDatabaseStories(stories);
      console.log('✅ Loaded', stories.length, 'stories from database');
    } catch (error) {
      console.error('❌ Failed to load stories:', error);
      setError(error instanceof Error ? error.message : 'Failed to load stories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!user) {
      // For local stories, use the existing delete function
      onDeleteStory(storyId);
      return;
    }

    try {
      console.log('🗑️ Deleting story from database:', storyId);
      
      // Get user session token for authenticated requests
      const session = await user.getSession?.();
      const userToken = session?.access_token;
      
      await storyService.deleteStory(storyId, userToken);
      
      // Remove from local state immediately for instant UI update
      setDatabaseStories(prev => prev.filter(story => story.id !== storyId));
      
      console.log('✅ Story deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete story:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete story');
    }
  };

  const handleToggleFavorite = async (storyId: string, currentFavorite: boolean) => {
    if (!user) return;

    try {
      console.log('❤️ Toggling favorite status for story:', storyId);
      
      // Get user session token for authenticated requests
      const session = await user.getSession?.();
      const userToken = session?.access_token;
      
      await storyService.updateStory(storyId, { isFavorite: !currentFavorite }, userToken);
      
      // Update local state immediately for instant UI update
      setDatabaseStories(prev => 
        prev.map(story => 
          story.id === storyId 
            ? { ...story, is_favorite: !currentFavorite }
            : story
        )
      );
      
      console.log('✅ Favorite status updated');
    } catch (error) {
      console.error('❌ Failed to update favorite status:', error);
    }
  };

  const handleStorySelect = async (story: SavedStory | Story) => {
    // Convert database story to Story interface if needed
    let storyToSelect: Story;
    
    if ('hero_name' in story) {
      // This is a database story, convert it
      storyToSelect = {
        id: story.id,
        title: story.title,
        content: story.content,
        character: story.hero_type,
        characterName: story.hero_name,
        setting: story.setting,
        theme: story.theme,
        ageRange: story.age_group,
        storyLength: story.story_length,
        createdAt: story.created_at,
        moral: '' // Database stories don't have moral field yet
      };

      // Increment read count for database stories
      if (user) {
        try {
          // Get user session token for authenticated requests
          const session = await user.getSession?.();
          const userToken = session?.access_token;
          
          await storyService.updateStory(story.id, { incrementReadCount: true }, userToken);
          
          // Update local state immediately for instant UI update
          setDatabaseStories(prev => 
            prev.map(s => 
              s.id === story.id 
                ? { ...s, read_count: s.read_count + 1 }
                : s
            )
          );
        } catch (error) {
          console.error('❌ Failed to update read count:', error);
        }
      }
    } else {
      // This is already a Story interface
      storyToSelect = story;
    }

    onStorySelect(storyToSelect);
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Combine local and database stories
  const allStories = user ? databaseStories : localStories;
  const totalStories = allStories.length;

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
          highContrast ? 'bg-gray-700' : 'bg-gradient-to-br from-purple-100 to-blue-100'
        }`}>
          <Loader2 className={`w-12 h-12 animate-spin ${
            highContrast ? 'text-white' : 'text-purple-600'
          }`} />
        </div>
        <h2 className={`text-3xl font-bold mb-4 ${
          highContrast ? 'text-white' : 'text-gray-800'
        }`}>
          Loading Your Stories
        </h2>
        <p className={`text-xl ${
          highContrast ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Fetching your magical collection...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
          highContrast ? 'bg-red-900' : 'bg-red-100'
        }`}>
          <AlertCircle className={`w-12 h-12 ${
            highContrast ? 'text-red-400' : 'text-red-600'
          }`} />
        </div>
        <h2 className={`text-3xl font-bold mb-4 ${
          highContrast ? 'text-white' : 'text-gray-800'
        }`}>
          Error Loading Stories
        </h2>
        <p className={`text-xl mb-6 ${
          highContrast ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {error}
        </p>
        <button
          onClick={loadStoriesFromDatabase}
          className={`flex items-center space-x-2 mx-auto px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            highContrast
              ? 'bg-white text-black hover:bg-gray-200'
              : 'bg-coral text-white hover:bg-coral/80'
          }`}
        >
          <RefreshCw className="w-5 h-5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (totalStories === 0) {
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
          {user 
            ? 'Create your first magical story to see it here!'
            : 'Sign in to save and view your story collection!'
          }
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
          {totalStories} magical {totalStories === 1 ? 'story' : 'stories'} waiting for you
        </p>
        {user && (
          <button
            onClick={loadStoriesFromDatabase}
            className={`mt-4 flex items-center space-x-2 mx-auto px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
              highContrast
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Stories</span>
          </button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allStories.map((story, index) => {
          const storyId = story.id;
          const isHovered = hoveredStory === storyId;
          const isFavorite = 'is_favorite' in story ? story.is_favorite : false;
          const readCount = 'read_count' in story ? story.read_count : 0;
          
          return (
            <div
              key={storyId}
              className={`group relative ${
                highContrast ? 'bg-gray-800 border-white' : 'bg-white/80 border-white/30'
              } backdrop-blur-sm rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden`}
              onMouseEnter={() => setHoveredStory(storyId)}
              onMouseLeave={() => setHoveredStory(null)}
            >
              {/* Book Cover */}
              <div className={`w-full h-40 rounded-t-xl bg-gradient-to-br ${getGradientColor(index)} flex items-center justify-center text-white relative`}>
                <BookOpen className="w-16 h-16 opacity-80" />
                {isFavorite && (
                  <div className="absolute top-3 right-3">
                    <Heart className="w-6 h-6 fill-current text-red-500" />
                  </div>
                )}
              </div>

              {/* Story Content */}
              <div className="p-6">
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
                      {'hero_type' in story ? story.hero_type : story.character}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      highContrast ? 'bg-gray-700 text-white' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {story.setting}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className={`w-4 h-4 ${
                        highContrast ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={highContrast ? 'text-gray-400' : 'text-gray-500'}>
                        {formatDate('created_at' in story ? story.created_at : story.createdAt)}
                      </span>
                    </div>
                    
                    {readCount > 0 && (
                      <div className="flex items-center space-x-1">
                        <Eye className={`w-4 h-4 ${
                          highContrast ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`text-xs ${
                          highContrast ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {readCount} read{readCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview Content - Only show when hovered */}
                {isHovered && (
                  <div className={`mb-4 p-3 rounded-lg transition-all duration-300 ${
                    highContrast ? 'bg-gray-900' : 'bg-gray-50'
                  }`}>
                    <h4 className={`font-bold mb-2 text-sm ${
                      highContrast ? 'text-white' : 'text-gray-800'
                    }`}>
                      Story Preview
                    </h4>
                    <p className={`text-sm leading-relaxed line-clamp-3 ${
                      highContrast ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {story.content.substring(0, 150)}...
                    </p>
                  </div>
                )}

                {/* Action Buttons - Always visible and positioned at bottom */}
                <div className="flex space-x-2 mt-auto">
                  <button
                    onClick={() => handleStorySelect(story)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                      highContrast
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-gradient-to-r from-coral to-yellow text-white hover:shadow-md'
                    }`}
                  >
                    Read Story
                  </button>
                  
                  {user && (
                    <button
                      onClick={() => handleToggleFavorite(storyId, isFavorite)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isFavorite
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : highContrast
                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteStory(storyId)}
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoryLibrary;