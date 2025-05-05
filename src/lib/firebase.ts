// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore"; // Add if you need Firestore
// import { getStorage } from "firebase/storage"; // Add if you need Storage

// --- IMPORTANT ---
// 1. Ensure all NEXT_PUBLIC_FIREBASE_* variables are correctly set in your .env file.
//    These values come from your Firebase project settings (Project Settings > General > Your apps > Web app).
// 2. In your Firebase Console (Authentication > Settings > Authorized domains), ensure your
//    application's domain (e.g., localhost, your-deployment-url.com, *.cloudworkstations.dev) is added.
// 3. In your Firebase Console (Authentication > Sign-in method), ensure the "Google" provider is enabled.
// ---

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

// Client-side logging to help diagnose configuration issues
if (typeof window !== 'undefined') {
    console.log("Firebase Config Check:");
    console.log(" - API Key Loaded:", !!firebaseConfig.apiKey);
    console.log(" - Auth Domain:", firebaseConfig.authDomain);
    console.log(" - Project ID:", firebaseConfig.projectId);

    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
        console.error(
            "Firebase configuration is incomplete or missing! " +
            "Please check your .env file and ensure all NEXT_PUBLIC_FIREBASE_* variables " +
            "match your Firebase project settings. Also, verify Authorized Domains in the Firebase console."
        );
        // Consider showing a user-friendly error message in the UI instead of just console logging
    }
}


// Initialize Firebase
let app;
// Check if Firebase has already been initialized
if (!getApps().length) {
    // Ensure config has essential values before initializing
    if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
         try {
            app = initializeApp(firebaseConfig);
            console.log("Firebase initialized successfully.");
        } catch (error) {
            console.error("Firebase initialization error:", error);
            // Prevent further execution if initialization fails critically
            throw new Error("Firebase initialization failed. Check console for details.");
        }
    } else {
         console.error("Firebase initialization skipped due to missing configuration.");
         // Handle the case where Firebase cannot be initialized (e.g., show an error state)
         // Setting app to null or a specific state might be necessary depending on how it's used elsewhere
         app = null;
    }

} else {
  app = getApp(); // Use the already initialized app
  console.log("Firebase app already initialized.");
}

let auth: ReturnType<typeof getAuth> | null = null;
let googleProvider: GoogleAuthProvider | null = null;
// const db = app ? getFirestore(app) : null; // Initialize other services only if app exists
// const storage = app ? getStorage(app) : null;

if (app) {
    try {
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();
    } catch (error) {
        console.error("Error getting Firebase Auth services:", error);
        // Handle error appropriately, maybe set auth/provider to null
        auth = null;
        googleProvider = null;
    }
} else {
    console.warn("Firebase App not initialized, Auth services will not be available.");
}


export { app, auth, googleProvider /*, db, storage */ };
