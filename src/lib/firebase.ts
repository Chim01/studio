// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore"; // Add if you need Firestore
// import { getStorage } from "firebase/storage"; // Add if you need Storage

// IMPORTANT: Verify these environment variables are set correctly in your .env.local file
// and match the configuration in your Firebase project settings.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

// Log to check if the API key is loaded (without logging the key itself)
if (typeof window !== 'undefined') { // Only run on client-side
    console.log("Firebase API Key Loaded:", !!firebaseConfig.apiKey);
    if (!firebaseConfig.apiKey) {
        console.error("Firebase API Key is missing! Check your NEXT_PUBLIC_FIREBASE_API_KEY environment variable.");
        alert("Firebase configuration error: API Key is missing. Please check environment variables."); // Alert user
    }
}


// IMPORTANT: In your Firebase Console:
// 1. Go to Project Settings -> General -> Your apps -> Web apps. Ensure the API key matches NEXT_PUBLIC_FIREBASE_API_KEY.
// 2. Go to Authentication -> Settings -> Authorized domains. Ensure your app's domain (e.g., localhost, your deployment URL, *.cloudworkstations.dev) is listed.
// 3. Go to Authentication -> Sign-in method. Ensure the Google provider is enabled.

// Initialize Firebase
let app;
if (!getApps().length) {
    try {
        app = initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully.");
    } catch (error) {
        console.error("Firebase initialization error:", error);
        // Prevent further execution if initialization fails
        if (typeof window !== 'undefined') {
            alert("Failed to initialize Firebase. Check console for details.");
        }
        // Handle the error appropriately, maybe throw or return null auth/provider
        throw new Error("Firebase initialization failed");
    }

} else {
  app = getApp();
  console.log("Firebase app already initialized.");
}

let auth: ReturnType<typeof getAuth>;
let googleProvider: GoogleAuthProvider;

try {
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    // const db = getFirestore(app); // Add if you need Firestore
    // const storage = getStorage(app); // Add if you need Storage
} catch (error) {
    console.error("Error getting Firebase services:", error);
     if (typeof window !== 'undefined') {
        alert("Failed to get Firebase services after initialization. Check console.");
    }
    // Handle the error appropriately
    throw new Error("Failed to get Firebase services");
}


export { app, auth, googleProvider /*, db, storage */ };