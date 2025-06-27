# AI Kid Storyteller

## 🌟 Overview
"AI Kid Storyteller" is an interactive web application designed to spark imagination and creativity in children by generating personalized stories. Users can choose a character, setting, and theme, and the AI will craft a unique tale, complete with moral lessons. The application features a delightful 3D animated companion character, text-to-speech narration with various voices, and accessibility options to ensure an engaging experience for all children.

## ✨ Features

* **AI-Powered Story Generation**: Generate unique stories based on user-selected preferences.
    * **Customizable Prompts**: Users can specify a hero's name and type, setting, theme, age group, and story length.
    * **Cohere API Integration**: Leverages the Cohere API for rich story content generation.
* **Interactive 3D Companion**: A charming 3D character that responds to user interactions and guides them through the app.
    * **Dynamic Animations**: The character exhibits various states like idle, welcoming, encouraging, celebrating, guiding, reading, and thoughtful.
    * **Positioning System**: The character adapts its position based on the current view (homepage, sidebar, corner, etc.).
    * **Performance Optimized**: Utilizes CSS 3D transforms, `will-change`, and Intersection Observers for smooth animations.
* **Text-to-Speech Narration**: Listen to stories read aloud with a selection of engaging voices.
    * **Voice Personalities**: Choose from 10 unique voices, each with distinct characteristics (rate, pitch, volume, emphasis).
    * **Recommended Voices**: The app suggests suitable voices based on story content and character.
    * **Reading Progress Tracking**: Visual progress bar and highlighted words during narration.
* **User Authentication & Story Library**:
    * **Sign Up/Sign In**: Users can create accounts to save their generated stories.
    * **Personal Story Collection**: View, read, favorite, and delete saved stories in a personal library.
    * **Read Count & Favorites**: Track read stories and mark favorites.
* **Accessibility Features**: Designed with inclusivity in mind.
    * **High Contrast Mode**: Enhanced visibility for low vision users.
    * **Adjustable Text Size**: Choose between small, medium, and large text.
    * **Audio Feedback Toggle**: Enable or disable sound effects and narration.
    * **Reduced Motion Preference**: Automatically simplifies animations for users with motion sensitivities.
* **Responsive Design**: Provides a seamless experience across various devices and screen sizes.

## 🛠️ Technologies Used

* **Frontend**:
    * [React](https://react.dev/)
    * [TypeScript](https://www.typescriptlang.org/)
    * [Vite](https://vitejs.dev/) - Frontend Tooling
    * [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
    * [Lucide React](https://lucide.dev/icons/) - Icon library
* **Backend & Database (via Supabase)**:
    * [Supabase](https://supabase.com/) - Open-source Firebase alternative (Authentication, Database, Edge Functions)
    * Supabase Edge Functions (Deno) for API endpoints
* **AI Model**:
    * [Cohere API](https://cohere.com/) - For generating story content.

## 🚀 Getting Started

### Prerequisites

* Node.js (v14 or higher)
* npm or yarn
* A Supabase project
* A Cohere API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/ai-kid-story-teller.git](https://github.com/your-username/ai-kid-story-teller.git)
    cd ai-kid-story-teller
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project and add your Supabase and Cohere credentials:

    ```
    VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
    VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    COHERE_API_KEY="YOUR_COHERE_API_KEY"
    ```

    * You can find your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your Supabase project settings.
    * Obtain your `COHERE_API_KEY` from the Cohere dashboard.

4.  **Set up Supabase Database and Functions:**
    The project uses Supabase for authentication, database storage (for user stories), and Edge Functions for AI story generation.

    * **Database Schema**: Apply the SQL migrations located in `supabase/migrations/` to your Supabase project. These define the `stories` and `user_preferences` tables and Row Level Security (RLS) policies.
        * `20250622191702_royal_lab.sql`: Initial schema for stories and user preferences.
        * `20250623011029_white_spark.sql`: Updates to allow guest users and fix foreign key constraints.
    * **Supabase Edge Functions**: Deploy the functions located in `supabase/functions/` to your Supabase project. These handle story generation, saving, fetching, updating, and deleting.
        * `generate-story/index.ts`
        * `save-story/index.ts`
        * `get-user-stories/index.ts`
        * `update-story/index.ts`
        * `delete-story/index.ts`
        * Remember to set `COHERE_API_KEY` as a secret in your Supabase project's Edge Functions settings.

### Running the Project

```bash
npm run dev
# or
yarn dev
```

## 📂 Project Structure

ai-kid-story-teller/
├── public/
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── components/
│   │   ├── AccessibilityPanel.tsx
│   │   ├── AnimatedBackground/
│   │   │   ├── AnimatedBackground.tsx
│   │   │   └── AnimatedBackground.css
│   │   ├── auth/
│   │   │   ├── AuthButton.tsx
│   │   │   ├── LoginModal.tsx
│   │   │   └── SignUpModal.tsx
│   │   ├── Character3D/
│   │   │   ├── Character3D.tsx
│   │   │   ├── Character3D.css
│   │   │   ├── CharacterIntegration.tsx
│   │   │   ├── CharacterManager.tsx
│   │   │   ├── useCharacterAnimations.ts
│   │   │   ├── types.ts
│   │   │   └── README.md
│   │   ├── CharacterSelector.tsx
│   │   ├── SettingSelector.tsx
│   │   ├── StoryDisplay.tsx
│   │   ├── StoryGenerator.tsx
│   │   ├── StoryLibrary.tsx
│   │   ├── ThemeSelector.tsx
│   │   └── VoiceSelector.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   ├── authService.ts
│   │   ├── storyService.ts
│   │   └── voiceService.ts
│   ├── types/
│   │   └── Story.ts
│   └── utils/
│       ├── advancedStoryGenerator.ts
│       └── storyGenerator.ts
├── supabase/
│   ├── functions/
│   │   ├── _shared/cors.ts
│   │   ├── delete-story/index.ts
│   │   ├── generate-story/index.ts
│   │   ├── get-user-stories/index.ts
│   │   ├── save-story/index.ts
│   │   └── update-story/index.ts
│   └── migrations/
│       ├── 20250622191702_royal_lab.sql
│       └── 20250623011029_white_spark.sql
├── .bolt/config.json
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts

## 📚 Usage

1.  **Create Story**: Navigate to the "Create Story" tab.
    * Enter a name for your hero.
    * Select a character type (e.g., Cat, Rabbit, Dragon).
    * Choose a magical setting (e.g., Enchanted Forest, Underwater Kingdom).
    * Pick a theme (e.g., Epic Adventure, True Friendship).
    * Select an age range and desired story length.
    * Optionally, select a narrator voice from the "Choose Reading Voice" section.
    * Click "Generate AI Story" and watch the magic happen!

2.  **Read Story**: Once generated, the story will be displayed. You can:
    * Read the story content.
    * Click "Read Aloud" to have the story narrated.
    * Save the story to your library (requires signing in).
    * Go back to generate a new story.

3.  **My Stories**: If you are signed in, go to the "My Stories" tab to view your saved stories.
    * Click on any story to re-read it.
    * Mark stories as favorites or delete them.

4.  **Accessibility**: Adjust settings via the "Settings" icon in the header:
    * Toggle High Contrast Mode.
    * Change Text Size.
    * Enable/Disable Audio Feedback.

## 🤝 Contributing
Contributions are welcome! Please feel free to open issues or submit pull requests.

## 📄 License
This project is open-source under the [License](LICENSE).