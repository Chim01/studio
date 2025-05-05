// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Add if you need Firestore
// import { getStorage } from "firebase/storage"; // Add if you need Storage

// --- IMPORTANT ---
// 1. ENSURE `NEXT_PUBLIC_FIREBASE_API_KEY` IS CORRECTLY SET in your .env file.
//    This value comes from your Firebase project settings:
//    Project Settings > General > Your apps > Web app > SDK setup and configuration > Config > apiKey.
// 2. Verify other `NEXT_PUBLIC_FIREBASE_*` variables are also correct in .env.
// 3. ***AUTH/UNAUTHORIZED-DOMAIN ERROR***: In your Firebase Console (Authentication > Settings > Authorized domains),
//    ensure your application's domain is added. This includes:
//      - `localhost` (if testing locally)
//      - The specific domain provided by your development environment (e.g., `*.cloudworkstations.dev`, `*.gitpod.io`)
//      - Your production deployment domain (e.g., `your-app.vercel.app`, `your-custom-domain.com`)
//    THIS IS CRUCIAL FOR REDIRECT-BASED AUTH like Google Sign-In. Check for typos.
// 4. In your Firebase Console (Authentication > Sign-in method), ensure the "Google" provider is enabled.
// 5. In Google Cloud Console (APIs & Services > Credentials > Select your API Key):
//    - Check 'Application restrictions'. If 'HTTP referrers' is selected, ensure your app's domains
//      (including localhost variants if testing locally) are listed. Add patterns like:
//      - localhost:9002/* (or your specific port)
//      - *.cloudworkstations.dev/*
//      - your-deployed-app-domain.com/*
//    - Check 'API restrictions'. Ensure necessary Firebase APIs (like Identity Platform API) are enabled.
// ---

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDOGyE4fXg9H3p1cu_4nutedOJkxhvl4ZY", // <<< CHECK THIS ENV VARIABLE in .env
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "campus-cruiser-nkb4g.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "campus-cruiser-nkb4g",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "campus-cruiser-nkb4g.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "726367933776",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:726367933776:web:5d1dbe86c8dba4f629c855",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-EPF5MBFZVH" // Optional
};

// Client-side logging to help diagnose configuration issues
if (typeof window !== 'undefined') {
    console.log("--- Firebase Config Check (src/lib/firebase.ts) ---");
    // Log the key partially masked for security, but confirm it's loaded.
    const apiKeyLoaded = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "AIzaSyAcb4GdbSuAnB7CHxqw-kkH2wl8Uo4RZHk"; // Check against actual key, not placeholder
    const maskedApiKey = apiKeyLoaded ? `${firebaseConfig.apiKey!.substring(0, 4)}...${firebaseConfig.apiKey!.substring(firebaseConfig.apiKey!.length - 4)}` : 'Not Loaded/Invalid/Placeholder';
    console.log(`API Key Loaded: ${apiKeyLoaded}`);
    console.log(`API Key (Value): ${firebaseConfig.apiKey || 'Not Loaded'}`); // Log the actual key for debugging in dev
    console.log(`Auth Domain: ${firebaseConfig.authDomain || 'Not Loaded/Undefined'}`);
    console.log(`Project ID: ${firebaseConfig.projectId || 'Not Loaded/Undefined'}`);
    console.log("Current Location Origin:", window.location.origin); // Log the origin for easy comparison
    console.log("--------------------------------------------------");

    if (!apiKeyLoaded) {
        console.error(
            "Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing, invalid, or still the hardcoded default! \n" +
            "1. Check your .env file. \n" +
            "2. Ensure the variable name starts with NEXT_PUBLIC_. \n" +
            "3. Make sure it's the correct *Web* API Key from your Firebase project settings. \n" +
            "4. Restart your Next.js development server (npm run dev) after changes to .env."
        );
    }
     if (!firebaseConfig.authDomain || !firebaseConfig.projectId) {
        console.error(
            "Firebase configuration is incomplete (Auth Domain or Project ID missing). " +
            "Check your .env file and Firebase project settings."
        );
    }
    // Add a specific warning for unauthorized domain based on console error
    if (console && console.error && typeof console.error === 'function') {
        const originalError = console.error;
        console.error = (...args) => {
            if (args.some(arg => typeof arg === 'string' && arg.includes('auth/unauthorized-domain'))) {
                 originalError(
                    ...args,
                    "\n\n🚨 **FIX:** Add the current domain (`" + window.location.hostname + "`) to your Firebase project's Authentication > Settings > Authorized domains list. See comments in `src/lib/firebase.ts` for details. Ensure `localhost` is also added if testing locally.\n"
                 );
            } else {
                originalError(...args);
            }
        };
    }
}


// Initialize Firebase
let app: ReturnType<typeof initializeApp> | null = null; // Explicitly type 'app'
// Check if Firebase has already been initialized
if (!getApps().length) {
    // Ensure config has essential values before initializing
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "AIzaSyAcb4GdbSuAnB7CHxqw-kkH2wl8Uo4RZHk" && firebaseConfig.authDomain && firebaseConfig.projectId) { // Add check against default key
         try {
            app = initializeApp(firebaseConfig);
            console.log("Firebase initialized successfully.");
        } catch (error) {
            console.error("Firebase initialization error:", error);
            // Prevent further execution if initialization fails critically
            // This often happens if the config values are syntactically wrong
             app = null; // Ensure app is null if init fails
            if (typeof window !== 'undefined') {
                 // Avoid alert in production code, use better UI feedback
                 // alert("Critical Firebase Initialization Error. Check console and .env configuration.");
                 console.error("CRITICAL FIREBASE INIT ERROR - Check console and .env configuration.");
            }
        }
    } else {
         console.error("Firebase initialization skipped due to missing critical configuration (API Key, Auth Domain, or Project ID) or using default API key. Check .env file.");
         app = null;
    }

} else {
  app = getApp(); // Use the already initialized app
  console.log("Firebase app already initialized.");
}

let auth: ReturnType<typeof getAuth> | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let db: ReturnType<typeof getFirestore> | null = null; // Initialize db variable
// const storage = app ? getStorage(app) : null;

if (app) {
    try {
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();
        db = getFirestore(app); // Initialize Firestore
        // Optional: Set custom parameters for Google sign-in if needed
        // googleProvider.setCustomParameters({
        //   'login_hint': 'user@example.com'
        // });
    } catch (error) {
        console.error("Error getting Firebase services (Auth/Firestore):", error);
        // Handle error appropriately, maybe set auth/provider to null
        auth = null;
        googleProvider = null;
        db = null;
    }
} else {
    console.warn("Firebase App not initialized, Auth & Firestore services will not be available.");
}


export { app, auth, db, googleProvider /*, storage */ }; // Export db
