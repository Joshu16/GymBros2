# GymBros - Gym Routine Tracker

A modern, mobile-optimized Progressive Web App (PWA) for tracking gym routines and workout sessions. Built with React, Firebase, and designed with a dark theme inspired by iOS design principles.

## ✨ Features

### 🏋️ Routine Management
- Create custom routines (e.g., "Upper A", "Upper B", "Lower A", "Lower B")
- Each routine maintains independent exercise data
- Exercises with same name in different routines are completely separate

### 📊 Exercise Tracking
- **Complete exercise data**: Sets, Reps, RIR (Reps in Reserve), Weight, Notes
- **Session memory**: Each routine remembers its last session data as placeholders
- **Independent tracking**: Upper A and Upper B exercises are tracked separately

### 📈 Session Management
- **Session history**: View all previous workout sessions
- **Progress tracking**: See completion rates and workout statistics
- **Repeat sessions**: "Repeat last session" button for quick setup
- **Real-time progress**: Live progress bar during workouts

### 📤 Data Export
- **CSV export**: Download all workout data in spreadsheet format
- **Complete data**: Includes routine, exercise, sets, reps, RIR, weight, notes, completion status, and dates
- **Google Drive integration**: Coming soon

### 🎨 Design & UX
- **Dark mode**: Modern dark theme (#121212 background)
- **iOS-inspired design**: Clean, minimal interface with smooth animations
- **Mobile-first**: Optimized for mobile devices with PWA support
- **Responsive**: Works on all screen sizes

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Firebase (Authentication + Firestore)
- **PWA**: Service Worker + Manifest

## 📱 PWA Features

- **Installable**: Add to home screen on mobile devices
- **Offline support**: Basic offline functionality
- **App-like experience**: Full-screen mode, no browser UI
- **Fast loading**: Optimized bundle size and caching

## 🗄️ Database Structure

```
users/{userId}/
  ├── routines/{routineId}/
  │   ├── exercises/{exerciseId}/
  │   └── sessions/{sessionId}/
```

Each session stores:
- Exercise details (sets, reps, RIR, weight, notes)
- Completion status
- Timestamps
- Routine information

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Joshu16/GymBros2.git
   cd GymBros2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a Firebase project
   - Enable Authentication (Google + Email/Password)
   - Enable Firestore Database
   - Update `src/firebase/config.js` with your Firebase config

4. **Deploy Firestore Rules**
   ```bash
   npm run deploy-firebase
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔥 Firebase Configuration

### Authentication
- Google Sign-In enabled
- Email/Password authentication
- User management and session handling

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📊 Usage

### Creating Routines
1. Click "New Routine" on the dashboard
2. Enter routine name (e.g., "Upper A")
3. Add exercises with sets, reps, RIR, weight, and notes

### Workout Sessions
1. Select a routine and click "Start Session"
2. Previous session data appears as placeholders
3. Modify values as needed
4. Mark exercises as completed
5. Save session when finished

### Viewing History
1. Go to routine detail page
2. Click the history icon
3. View all previous sessions with complete details

### Exporting Data
1. Click the export icon in the header
2. Choose CSV export
3. Download complete workout data

## 🎯 Key Features Explained

### Independent Routine Data
- Each routine maintains its own exercise database
- "Bench Press" in Upper A is completely separate from "Bench Press" in Upper B
- Last session data is remembered per routine, not globally

### Session Memory
- When starting a new session, the app shows your last performance as placeholders
- You can modify these values or keep them the same
- This helps track progression and maintain consistency

### Complete Exercise Tracking
- **Sets & Reps**: Traditional workout tracking
- **RIR (Reps in Reserve)**: How many more reps you could have done
- **Weight**: Track strength progression
- **Notes**: Add personal notes for each exercise

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy-firebase` - Deploy Firestore rules

### Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth)
├── firebase/           # Firebase configuration and functions
├── pages/              # Main application pages
│   ├── Dashboard.jsx
│   ├── RoutineDetail.jsx
│   ├── ExerciseSession.jsx
│   ├── SessionHistory.jsx
│   └── LoginPage.jsx
└── App.jsx             # Main app component
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables if needed
3. Deploy automatically on push

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects for SPA routing

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## 📱 Mobile Installation

1. Open the app in your mobile browser
2. Look for "Add to Home Screen" option
3. Install as a PWA
4. Enjoy app-like experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspired by Apple Fitness and Notion
- Icons by Lucide React
- Animations by Framer Motion
- Built with React and Firebase

---

**GymBros** - Track your gym routines with ease! 💪