// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore"; // Add if you need Firestore
// import { getStorage } from "firebase/storage"; // Add if you need Storage

// --- IMPORTANT ---
// 1. ENSURE `NEXT_PUBLIC_FIREBASE_API_KEY` IS CORRECTLY SET in your .env file.
//    This value comes from your Firebase project settings:
//    Project Settings > General > Your apps > Web app > API Key.
// 2. Verify other `NEXT_PUBLIC_FIREBASE_*` variables are also correct.
// 3. In your Firebase Console (Authentication > Settings > Authorized domains), ensure your
//    application's domain (e.g., localhost, your-deployment-url.com, *.cloudworkstations.dev) is added.
//    THIS IS CRUCIAL FOR REDIRECT-BASED AUTH.
// 4. In your Firebase Console (Authentication > Sign-in method), ensure the "Google" provider is enabled.
// 5. In Google Cloud Console (APIs & Services > Credentials), check the restrictions on the API key
//    associated with your Firebase project. Ensure it allows requests from your application's domain
//    and that the "Identity Platform API" or relevant Firebase APIs are enabled.
// ---

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // <<< CHECK THIS ENV VARIABLE in .env
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

// Client-side logging to help diagnose configuration issues
if (typeof window !== 'undefined') {
    console.log("Firebase Config Check (src/lib/firebase.ts):");
    // Log the key directly ONLY for local debugging, be careful not to commit/expose this in production logs
    // console.log("Attempting to use API Key:", firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 5) + '...' : 'Not Loaded');
    console.log(" - Is NEXT_PUBLIC_FIREBASE_API_KEY Loaded?:", !!firebaseConfig.apiKey);
    console.log(" - Auth Domain:", firebaseConfig.authDomain);
    console.log(" - Project ID:", firebaseConfig.projectId);

    if (!firebaseConfig.apiKey) {
        console.error(
            "Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing or undefined! " +
            "Please ensure it is correctly set in your .env file and the Next.js development server was restarted after adding it."
        );
    }
     if (!firebaseConfig.authDomain || !firebaseConfig.projectId) {
        console.error(
            "Firebase configuration is incomplete (Auth Domain or Project ID missing). " +
            "Check your .env file and Firebase project settings."
        );
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
            // This often happens if the config values are syntactically wrong
             app = null; // Ensure app is null if init fails
            if (typeof window !== 'undefined') {
                 alert("Critical Firebase Initialization Error. Check console and .env configuration.");
            }
            // throw new Error("Firebase initialization failed. Check console for details.");
        }
    } else {
         console.error("Firebase initialization skipped due to missing critical configuration (API Key, Auth Domain, or Project ID). Check .env file.");
         // Handle the case where Firebase cannot be initialized (e.g., show an error state)
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
        // Optional: Set custom parameters for Google sign-in if needed
        // googleProvider.setCustomParameters({
        //   'login_hint': 'user@example.com'
        // });
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
