import { Story, StoryOptions, StoryTemplate } from '../types/Story';

// Character type mappings
const characterTypes: { [key: string]: string } = {
  cat: 'curious cat',
  rabbit: 'brave bunny',
  dragon: 'friendly dragon',
  princess: 'kind princess',
  astronaut: 'space explorer',
  mermaid: 'magical mermaid'
};

// Setting descriptions
const settingDescriptions: { [key: string]: { name: string; description: string; atmosphere: string } } = {
  forest: {
    name: 'Enchanted Forest',
    description: 'a magical woodland filled with towering oak trees, sparkling streams, and glowing mushrooms',
    atmosphere: 'The air smelled of pine needles and wildflowers, and gentle sunbeams danced through the emerald canopy above.'
  },
  ocean: {
    name: 'Underwater Kingdom',
    description: 'a shimmering realm beneath the waves, with coral castles and schools of rainbow fish',
    atmosphere: 'The water was crystal clear and warm, with gentle currents that carried the sweet sound of whale songs.'
  },
  mountain: {
    name: 'Magical Mountains',
    description: 'towering peaks covered in snow and clouds, with hidden caves and crystal formations',
    atmosphere: 'The mountain air was crisp and fresh, filled with the echoes of ancient songs and the whisper of wind through stone.'
  },
  castle: {
    name: 'Royal Castle',
    description: 'a magnificent fortress with golden towers, marble halls, and gardens full of singing flowers',
    atmosphere: 'The castle walls hummed with magic, and every room sparkled with the warmth of a thousand candles.'
  },
  space: {
    name: 'Starlight Galaxy',
    description: 'the vast cosmos filled with twinkling stars, colorful nebulas, and floating crystal asteroids',
    atmosphere: 'The silence of space was broken only by the gentle hum of starlight and the distant music of the planets.'
  },
  village: {
    name: 'Cozy Village',
    description: 'a charming town with cobblestone streets, flower-filled gardens, and friendly neighbors',
    atmosphere: 'The village buzzed with laughter and the delicious smells of fresh bread and blooming roses.'
  }
};

// Theme morals and supporting characters
const themeData: { [key: string]: { moral: string; supportingCharacters: string[]; conflict: string; resolution: string } } = {
  adventure: {
    moral: 'True adventure comes from being brave enough to help others and explore the unknown.',
    supportingCharacters: ['wise old owl', 'helpful squirrel', 'magical guide'],
    conflict: 'must overcome challenges and solve puzzles',
    resolution: 'discovers that courage grows stronger when shared with friends'
  },
  friendship: {
    moral: 'The best friendships are built on kindness, understanding, and accepting differences.',
    supportingCharacters: ['lonely creature', 'group of forest friends', 'wise elder'],
    conflict: 'learns about loneliness and the importance of inclusion',
    resolution: 'creates lasting bonds through acts of kindness and empathy'
  },
  magic: {
    moral: 'Real magic comes from believing in yourself and using your gifts to help others.',
    supportingCharacters: ['ancient wizard', 'magical creatures', 'fellow magic learner'],
    conflict: 'discovers hidden magical abilities but struggles to control them',
    resolution: 'learns that magic is most powerful when used with a caring heart'
  },
  dreams: {
    moral: 'Dreams come true when you work hard, stay determined, and never give up hope.',
    supportingCharacters: ['encouraging mentor', 'fellow dreamers', 'wise storyteller'],
    conflict: 'faces obstacles that make their dream seem impossible',
    resolution: 'achieves their goal through perseverance and the support of others'
  },
  mystery: {
    moral: 'Curiosity and careful thinking can solve any puzzle, especially when friends work together.',
    supportingCharacters: ['detective partner', 'helpful witnesses', 'mysterious stranger'],
    conflict: 'encounters a puzzling mystery that needs solving',
    resolution: 'solves the mystery through teamwork and clever observation'
  },
  kindness: {
    moral: 'Small acts of kindness create ripples of joy that spread throughout the world.',
    supportingCharacters: ['grateful recipient', 'community members', 'kindness teacher'],
    conflict: 'meets someone in need and learns about compassion',
    resolution: 'discovers how one kind act can transform an entire community'
  }
};

// Age-appropriate vocabulary and sentence complexity
const ageSettings = {
  '4-6': {
    vocabularyLevel: 'simple',
    sentenceLength: 'short',
    concepts: 'basic',
    wordCount: { short: 250, medium: 350, long: 450 }
  },
  '7-9': {
    vocabularyLevel: 'intermediate',
    sentenceLength: 'medium',
    concepts: 'moderate',
    wordCount: { short: 300, medium: 500, long: 700 }
  },
  '10-12': {
    vocabularyLevel: 'advanced',
    sentenceLength: 'varied',
    concepts: 'complex',
    wordCount: { short: 350, medium: 600, long: 1000 }
  }
};

// Story templates with dialogue and sensory details
const generateStoryContent = (options: StoryOptions): StoryTemplate => {
  const characterType = characterTypes[options.character];
  const setting = settingDescriptions[options.setting];
  const theme = themeData[options.theme];
  const ageLevel = ageSettings[options.ageRange];
  
  // Create title
  const title = `${options.characterName} and the ${setting.name} ${theme.moral.split(' ')[0]}`;
  
  // Generate story based on age and length
  let story = '';
  
  // Beginning
  story += `Once upon a time, in ${setting.description}, there lived a ${characterType} named ${options.characterName}. `;
  story += `${setting.atmosphere} `;
  
  if (options.ageRange === '4-6') {
    story += `${options.characterName} loved to explore and make new friends. `;
  } else if (options.ageRange === '7-9') {
    story += `${options.characterName} was known throughout the land for being curious and kind-hearted. `;
  } else {
    story += `${options.characterName} possessed a remarkable spirit of adventure and an unwavering desire to help others. `;
  }

  // Introduce conflict and supporting characters
  story += `\n\nOne bright morning, ${options.characterName} ${theme.conflict}. `;
  
  // Add sensory details and dialogue
  if (options.setting === 'forest') {
    story += `The leaves rustled softly overhead as ${options.characterName} heard a small voice calling, "Help! Help!" `;
  } else if (options.setting === 'ocean') {
    story += `Bubbles danced around ${options.characterName} as a gentle voice echoed through the water, "Please, can you help us?" `;
  } else if (options.setting === 'space') {
    story += `Stars twinkled like diamonds as ${options.characterName} received a cosmic message: "We need your help!" `;
  }

  // Introduce first supporting character
  const firstSupporter = theme.supportingCharacters[0];
  story += `\n\nFollowing the voice, ${options.characterName} discovered a ${firstSupporter} who explained the situation. `;
  story += `"${options.characterName}," said the ${firstSupporter}, "you're exactly who we've been waiting for!" `;

  // Middle - adventure and challenges
  story += `\n\nTogether, they embarked on an incredible journey. `;
  
  if (options.storyLength !== 'short') {
    // Add more supporting characters and details for medium/long stories
    const secondSupporter = theme.supportingCharacters[1];
    story += `Along the way, they met a ${secondSupporter} who joined their quest. `;
    
    // Add sensory descriptions
    if (options.setting === 'forest') {
      story += `They walked through groves where flowers chimed like bells and streams giggled as they flowed. `;
    } else if (options.setting === 'ocean') {
      story += `They swam past coral gardens that glowed like rainbows and listened to dolphins singing ancient songs. `;
    }
    
    // Add dialogue and interaction
    story += `"Look!" exclaimed the ${secondSupporter}, pointing ahead. "Do you see that?" `;
    story += `${options.characterName} squinted and gasped with wonder. `;
  }

  if (options.storyLength === 'long') {
    // Add third supporting character and more complex plot
    const thirdSupporter = theme.supportingCharacters[2];
    story += `\n\nJust when things seemed most challenging, they encountered a ${thirdSupporter}. `;
    story += `"Fear not," the ${thirdSupporter} said with a warm smile. "Every great adventure has moments of doubt." `;
    
    // Add more sensory details and onomatopoeia
    story += `Suddenly, they heard a loud "WHOOSH!" followed by a gentle "tinkle-tinkle" of magic in the air. `;
  }

  // Climax and resolution
  story += `\n\n${theme.resolution}. `;
  story += `"We did it!" cheered ${options.characterName}, feeling proud and happy. `;
  
  // Ending with moral
  story += `\n\nAs the sun set over the ${setting.name.toLowerCase()}, ${options.characterName} realized something important: `;
  story += `${theme.moral} `;
  
  // Final dialogue
  story += `"Thank you, ${options.characterName}," said all their new friends together. "You've shown us what true ${options.theme} means!" `;
  story += `\n\nAnd from that day forward, ${options.characterName} continued to spread joy and ${options.theme} wherever they went, `;
  story += `knowing that the greatest adventures are the ones that bring friends together.`;

  // Add "The End" for younger children
  if (options.ageRange === '4-6') {
    story += `\n\nThe End! 🌟`;
  }

  return {
    title,
    content: story,
    moral: theme.moral,
    supportingCharacters: theme.supportingCharacters
  };
};

export const generateAdvancedStory = (options: StoryOptions): Story => {
  const storyTemplate = generateStoryContent(options);
  
  return {
    title: storyTemplate.title,
    content: storyTemplate.content,
    character: options.character,
    characterName: options.characterName,
    setting: options.setting,
    theme: options.theme,
    ageRange: options.ageRange,
    storyLength: options.storyLength,
    createdAt: new Date().toISOString(),
    moral: storyTemplate.moral
  };
};