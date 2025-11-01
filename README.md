# HIIT Timer

A free, minimalist HIIT (High-Intensity Interval Training) timer web app. No paywalls, no subscriptions - just a simple, effective workout timer.

## Why This Exists

Most HIIT timer apps on mobile are behind paywalls or filled with ads. This is a free, open-source alternative that works on any device with a browser.

## Features

- ⏱️ Customizable work/rest intervals
- 🔄 Multiple rounds with round rest periods
- 🔥 Warm-up timer before workouts
- 💾 Save named workout routines
- 📊 Workout history tracking
- 📱 Mobile-first design
- 🔒 User authentication (Firebase)
- 🌐 Works offline as a PWA

## Tech Stack

- React
- Firebase (Authentication & Firestore)
- Tailwind CSS
- Vercel (deployment)

## Quick Start

1. Clone the repository
2. Install dependencies:
```bash
   npm install
```
3. Set up Firebase:
   - Create a Firebase project
   - Enable Authentication (Email/Password & Google)
   - Enable Firestore Database
   - Update `src/config/firebase.js` with your config
4. Run locally:
```bash
   npm start
```
5. Deploy to Vercel:
```bash
   vercel --prod
```

## Firebase Setup

Add these Firestore security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /workouts/{workout} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /workoutPresets/{preset} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

Create these indexes in Firestore:
- Collection: `workouts` | Fields: `userId` (Asc), `createdAt` (Desc)
- Collection: `workoutPresets` | Fields: `userId` (Asc), `createdAt` (Desc)

## License

MIT License - feel free to use, modify, and distribute.

## Contributing

Pull requests welcome! This is a simple project meant to stay simple.