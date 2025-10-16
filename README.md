# GymBros - Gym Routine Tracker

A mobile-optimized PWA for tracking gym routines and exercises with a beautiful dark mode interface inspired by iOS design.

## Features

- 🏋️ **Routine Management**: Create and manage custom workout routines
- 📊 **Exercise Tracking**: Track sets, reps, and RIR (Reps in Reserve) for each exercise
- 🔄 **Session History**: View previous workout data as placeholders for new sessions
- 📱 **PWA Support**: Install as a mobile app with offline capabilities
- 🌙 **Dark Mode**: Beautiful dark theme optimized for mobile
- 📤 **Data Export**: Export your workout data to CSV
- 🔐 **Authentication**: Secure login with Google or email/password
- ☁️ **Cloud Sync**: All data synced with Firebase

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Custom CSS with iOS-inspired dark theme
- **Animations**: Framer Motion
- **Backend**: Firebase (Authentication + Firestore)
- **PWA**: Vite PWA Plugin
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gymbros-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Google + Email/Password)
   - Create a Firestore database
   - Copy your Firebase config

4. Update Firebase configuration:
   - Open `src/firebase/config.js`
   - Replace the placeholder config with your Firebase project config

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AuthGuard.jsx
│   ├── LoadingSpinner.jsx
│   └── ExportModal.jsx
├── contexts/           # React contexts
│   └── AuthContext.jsx
├── firebase/           # Firebase configuration and services
│   ├── config.js
│   ├── auth.js
│   └── database.js
├── pages/              # Page components
│   ├── LoginPage.jsx
│   ├── Dashboard.jsx
│   ├── RoutineDetail.jsx
│   └── ExerciseSession.jsx
├── App.jsx            # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles and Tailwind imports
```

## Usage

### Creating Routines

1. Sign in to your account
2. Click "New Routine" on the dashboard
3. Enter a routine name (e.g., "Upper A", "Push Day")
4. Add exercises to your routine

### Adding Exercises

1. Open a routine
2. Click "Add Exercise"
3. Enter exercise details:
   - Name (e.g., "Bench Press")
   - Sets (number of sets)
   - Reps (target repetitions)
   - RIR (Reps in Reserve)

### Starting a Workout Session

1. Click "Start Session" on any routine
2. The app will show placeholders from your last session
3. Update the values as needed
4. Mark exercises as completed
5. Save your session when done

### Data Export

1. Click the download icon in the header
2. Choose CSV export
3. Download your workout data

## Firebase Database Structure

```
users/{userId}/
├── routines/{routineId}/
│   ├── name: string
│   ├── description: string
│   ├── createdAt: timestamp
│   ├── updatedAt: timestamp
│   └── exercises/{exerciseId}/
│       ├── name: string
│       ├── sets: number
│       ├── reps: number
│       ├── rir: number
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│   └── sessions/{sessionId}/
│       ├── exercises: array
│       ├── completedAt: timestamp
│       └── createdAt: timestamp
```

## Customization

### Colors and Theme

The app uses a custom dark theme with iOS-inspired design. You can modify the color palette by updating the CSS custom properties in `src/index.css`.

### Styling

All styles use custom CSS with utility classes defined in `src/index.css`. The design follows iOS-inspired principles with:

- Rounded corners (rounded-2xl for cards, rounded-xl for inputs)
- Generous spacing and padding
- Smooth transitions and animations
- Glass morphism effects
- Dark mode optimized for mobile devices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on GitHub.