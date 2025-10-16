# Firebase Deployment Instructions

To fix the Firebase permissions issue, you need to deploy the Firestore rules to your Firebase project.

## Steps:

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project** (if not already done):
   ```bash
   firebase init firestore
   ```
   - Select your existing project: `gymbros-c21df`
   - Use the existing `firestore.rules` file
   - Use the existing `firestore.indexes.json` file (or create empty one)

4. **Deploy the Firestore rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Verify the deployment**:
   - Go to Firebase Console → Firestore Database → Rules
   - Make sure the rules are deployed and active

## Alternative: Manual Rule Setup

If you prefer to set the rules manually in the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `gymbros-c21df`
3. Go to Firestore Database → Rules
4. Replace the existing rules with the content from `firestore.rules` file
5. Click "Publish"

## Rules Explanation

The rules allow:
- Users to read/write only their own data
- Access to routines, exercises, and sessions under their user ID
- All operations require authentication

This ensures data security while allowing the app to function properly.
