import { Story, StoryOptions } from '../types/Story';

const storyTemplates = {
  adventure: {
    cat: {
      forest: "Once upon a time, Luna the curious cat discovered a magical path in the enchanted forest. The moonlight danced through the emerald leaves as she padded softly along the glittering trail. Suddenly, she heard a tiny voice calling for help from behind a giant mushroom. A small fairy was trapped under a fallen twig! Luna carefully lifted the twig with her paw, freeing the grateful fairy. 'Thank you, brave Luna!' said the fairy. 'As a reward, I'll grant you one wish.' Luna thought carefully and wished for all the forest animals to always have enough food. The fairy smiled and waved her tiny wand, making fruit trees bloom everywhere. From that day on, Luna became the guardian of the enchanted forest, ensuring every creature was happy and well-fed.",
      ocean: "Luna the adventurous cat found a magical seashell that allowed her to breathe underwater. She dove into the sparkling ocean and discovered an amazing underwater kingdom filled with colorful coral castles. Swimming alongside friendly dolphins, she met the Sea King who told her about a treasure that had been lost for centuries. Luna bravely swam through kelp forests and around underwater mountains, following clues made of glowing pearls. Finally, she found the treasure chest buried in the sand. Inside wasn't gold, but something much more valuable - a magical pearl that could clean all the ocean's water! Luna and the sea creatures worked together to use the pearl's power, making the ocean the cleanest and most beautiful it had ever been.",
      castle: "Princess Luna the cat lived in a magnificent royal castle with towers that touched the clouds. One morning, she discovered that all the kingdom's colors had mysteriously disappeared! Everything was gray and dull. The wise castle wizard told her that only an act of true courage could bring the colors back. Luna set off on a quest through the castle's secret passages, meeting talking paintings and friendly ghosts along the way. She climbed the highest tower where she found a sad dragon who had accidentally stolen all the colors because he felt lonely. Luna befriended the dragon, teaching him how to make friends with the other castle inhabitants. Grateful for her kindness, the dragon breathed out all the colors in a beautiful rainbow, restoring the kingdom's beauty and gaining a best friend in Princess Luna."
    },
    rabbit: {
      forest: "Benny Bunny was the fastest hopper in the enchanted forest, but he always used his speed to help others. One sunny morning, he heard that the annual Forest Festival's magic crystal had been lost in the deepest part of the woods. Without it, there would be no celebration! Benny volunteered for the rescue mission, hopping through thorny bushes and over babbling brooks. He met wise owls, helpful squirrels, and even a friendly bear who gave him directions. After hours of searching, Benny found the crystal guarded by a lonely old turtle who just wanted someone to talk to. Benny spent the afternoon listening to the turtle's stories, and in return, the turtle happily gave him the crystal. The Forest Festival was the most magical ever, and Benny learned that sometimes the greatest adventures come from making new friends.",
      mountain: "High up in the magical mountains, Benny Bunny discovered a hidden village of mountain folk who had lost their way home. A thick, mysterious fog had covered all the mountain paths for weeks! The village elder asked Benny to help find the legendary Wind Whistle, which could blow away any fog. Benny hopped from peak to peak, following ancient mountain songs that echoed in the thin air. He met a wise mountain goat who taught him how to read the stars, and a family of marmots who shared their warmest burrow when night fell. At the highest peak, Benny found the golden Wind Whistle guarded by the Mountain King, who was impressed by Benny's determination and kindness. When Benny played the whistle, the fog cleared instantly, revealing the most beautiful mountain sunrise anyone had ever seen.",
      space: "Captain Benny Bunny was the bravest astronaut in the galaxy, hopping from planet to planet in his carrot-shaped spaceship. One day, he received a distress signal from the Planet of Lost Toys, where all the galaxy's missing toys had somehow ended up. The toy planet was in danger of crashing into a star! Benny put on his special space suit and hopped through asteroid fields, past colorful nebulas, and around three different moons. On the toy planet, he met teddy bears, toy robots, and dolls from across the universe who had been waiting to return home to children who missed them. Together, they worked to fix the planet's engines using creativity and teamwork. Benny successfully piloted the toy planet to safety, and then helped deliver every single toy back to its rightful child across the galaxy."
    }
  },
  friendship: {
    dragon: {
      castle: "Spark the little dragon was different from other dragons - instead of breathing fire, he breathed beautiful, colorful bubbles! The other dragons laughed at him, making Spark feel very sad and lonely. One day, he flew to the royal castle where he met Princess Maya, who was also feeling lonely because she was new to the kingdom. At first, Princess Maya was scared of Spark, but when she saw his gentle bubble breath creating rainbow patterns in the sky, she realized he was special. They became the very best of friends, playing together every day in the castle gardens. When the kingdom faced a drought, Spark's magical bubbles turned into gentle rain that saved all the crops. The people celebrated Spark as a hero, and he learned that being different was actually his greatest gift.",
      village: "In a cozy village nestled between rolling hills, Spark the young dragon felt like he didn't fit in anywhere. He was too big for the rabbit holes, too gentle for the wolf pack, and the village children ran away whenever they saw him. Feeling very lonely, Spark sat by the village fountain and began to cry tears that sparkled like diamonds. A brave little girl named Emma approached him and asked why he was sad. When Spark explained that nobody wanted to be his friend because he was a dragon, Emma declared that she would be his best friend forever. Together, they explored the village, with Emma showing everyone how kind and helpful Spark really was. Soon, all the villagers realized that having a dragon friend was the most wonderful thing ever, and Spark became the village's beloved protector and friend."
    },
    princess: {
      forest: "Princess Maya loved exploring more than sitting in her royal tower, so she often snuck out to adventure in the enchanted forest. One day, she discovered a small, injured fox caught in a hunter's trap. Despite her beautiful dress getting dirty, she carefully freed the fox and used her silk ribbon to bandage its hurt paw. The grateful fox, whose name was Ruby, became her dearest friend and guide through the forest's secrets. Together, they discovered a hidden grove where all the forest's orphaned animals lived together as a family. Princess Maya used her royal influence to protect the grove forever, creating the kingdom's first animal sanctuary. Ruby and Maya's friendship showed everyone that true friendship knows no boundaries between different kinds of creatures, and the princess learned that the best adventures come from helping others.",
      ocean: "Princess Maya had always dreamed of exploring the ocean, but her royal duties kept her in the castle. One magical evening, a beautiful mermaid named Pearl appeared in the castle's fountain, having traveled through underground rivers to meet the kind princess she'd heard so much about. Maya and Pearl quickly became the closest of friends, sharing stories about their different worlds. Pearl taught Maya how to hold her breath underwater using ancient mer-magic, while Maya showed Pearl the wonders of the land world. Together, they worked to build a bridge between their two kingdoms - literally! They convinced Maya's father the king and Pearl's mother the Sea Queen to create a beautiful coral bridge that connected land and sea, allowing both kingdoms to share their cultures and become lifelong allies."
    }
  },
  magic: {
    astronaut: {
      space: "Captain Zoe was exploring a distant galaxy when her spaceship's engines suddenly stopped working near a mysterious, glowing planet. As she drifted closer, she discovered the planet was inhabited by friendly star beings who communicated through beautiful, musical light patterns. The star beings had been watching Earth for years and were excited to finally meet a human! They showed Zoe that her spaceship had stopped because it was powered by ordinary fuel, but their planet ran on pure starlight magic. The eldest star being taught Zoe how to harness the power of starlight, transforming her spaceship into a magical vessel that could travel faster than light itself. With her new magical abilities, Captain Zoe became the galaxy's first Star Ambassador, helping different planets communicate and share their unique forms of magic throughout the universe.",
      mountain: "Captain Zoe crash-landed her emergency pod high in the magical mountains during a fierce storm. Seeking shelter, she discovered an ancient cave filled with glowing crystals that hummed with mysterious energy. An old mountain wizard appeared, explaining that these were the legendary Power Crystals that had protected the mountains for thousands of years. The storm outside was actually a magical tempest caused by the crystals losing their balance. Zoe's scientific knowledge combined with the wizard's ancient magic created the perfect solution - she built a special device that could harmonize the crystals' frequencies. As the crystals began to sing in perfect harmony, the storm cleared and revealed the most beautiful aurora dancing across the mountain peaks. The grateful wizard granted Zoe a special crystal that would always guide her safely home, no matter how far she traveled in space."
    },
    mermaid: {
      ocean: "Pearl the young mermaid discovered she had a very special gift - she could talk to all the sea creatures, from the tiniest seahorse to the mightiest whale! At first, she thought everyone could do this, but she soon realized her ability was magical and rare. When a family of lost baby turtles couldn't find their way to their nesting beach, Pearl used her gift to call upon dolphins, whales, and even the wise old octopus to help guide them home. Her magical voice created a underwater song so beautiful that it reached every corner of the ocean, bringing all sea life together in harmony. The Ocean Goddess, impressed by Pearl's kindness and magical gift, blessed her with the ability to heal injured sea creatures with her voice. From that day forward, Pearl became known as the Sea's Guardian Angel, using her magical singing to protect and heal all ocean life."
    }
  }
};

const getTitleFromStory = (options: StoryOptions): string => {
  const characterNames: { [key: string]: string } = {
    cat: "Luna",
    rabbit: "Benny",
    dragon: "Spark",
    princess: "Maya",
    astronaut: "Zoe",
    mermaid: "Pearl"
  };

  const settingNames: { [key: string]: string } = {
    forest: "Enchanted Forest",
    ocean: "Ocean Kingdom",
    mountain: "Magical Mountains",
    castle: "Royal Castle",
    space: "Starlight Galaxy",
    village: "Cozy Village"
  };

  const themeNames: { [key: string]: string } = {
    adventure: "Adventure",
    friendship: "Friendship",
    magic: "Magic",
    dreams: "Dreams",
    mystery: "Mystery",
    kindness: "Kindness"
  };

  const character = characterNames[options.character] || options.character;
  const setting = settingNames[options.setting] || options.setting;
  const theme = themeNames[options.theme] || options.theme;

  return `${character} and the ${setting} ${theme}`;
};

export const generateStory = (options: StoryOptions): Story => {
  // Get the story content from templates or generate a default one
  let content = '';
  
  if (storyTemplates[options.theme as keyof typeof storyTemplates]?.[options.character as keyof typeof storyTemplates.adventure]?.[options.setting as keyof typeof storyTemplates.adventure.cat]) {
    content = storyTemplates[options.theme as keyof typeof storyTemplates][options.character as keyof typeof storyTemplates.adventure][options.setting as keyof typeof storyTemplates.adventure.cat];
  } else {
    // Generate a simple story if no template exists
    content = `Once upon a time, there was a wonderful ${options.character} who lived in the ${options.setting}. This is a magical story about ${options.theme} that teaches us important lessons about courage, kindness, and believing in ourselves. Through exciting adventures and meeting new friends, our hero discovers that the greatest magic of all comes from within our hearts.`;
  }

  return {
    title: getTitleFromStory(options),
    content,
    character: options.character,
    setting: options.setting,
    theme: options.theme,
    createdAt: new Date().toISOString()
  };
};