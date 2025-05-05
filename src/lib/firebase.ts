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
// 3. In your Firebase Console (Authentication > Settings > Authorized domains), ensure your
//    application's domain (e.g., localhost, your-deployment-url.com, *.cloudworkstations.dev) is added.
//    THIS IS CRUCIAL FOR REDIRECT-BASED AUTH. Check for typos.
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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAcb4GdbSuAnB7CHxqw-kkH2wl8Uo4RZHk_invalid", // <<< CHECK THIS ENV VARIABLE in .env
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

// Client-side logging to help diagnose configuration issues
if (typeof window !== 'undefined') {
    console.log("--- Firebase Config Check (src/lib/firebase.ts) ---");
    // Log the key partially masked for security, but confirm it's loaded.
    const apiKeyLoaded = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "AIzaSyAcb4GdbSuAnB7CHxqw-kkH2wl8Uo4RZHk_invalid";
    const maskedApiKey = apiKeyLoaded ? `${firebaseConfig.apiKey!.substring(0, 4)}...${firebaseConfig.apiKey!.substring(firebaseConfig.apiKey!.length - 4)}` : 'Not Loaded/Invalid/Placeholder';
    console.log(`API Key Loaded: ${apiKeyLoaded}`);
    console.log(`API Key (Masked): ${maskedApiKey}`); // Log masked key
    console.log(`Auth Domain: ${firebaseConfig.authDomain || 'Not Loaded/Undefined'}`);
    console.log(`Project ID: ${firebaseConfig.projectId || 'Not Loaded/Undefined'}`);
    console.log("--------------------------------------------------");

    if (!apiKeyLoaded) {
        console.error(
            "Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing, invalid, or a placeholder! \n" +
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
}


// Initialize Firebase
let app: ReturnType<typeof initializeApp> | null = null; // Explicitly type 'app'
// Check if Firebase has already been initialized
if (!getApps().length) {
    // Ensure config has essential values before initializing
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "AIzaSyAcb4GdbSuAnB7CHxqw-kkH2wl8Uo4RZHk_invalid" && firebaseConfig.authDomain && firebaseConfig.projectId) {
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
         console.error("Firebase initialization skipped due to missing/invalid critical configuration (API Key, Auth Domain, or Project ID). Check .env file.");
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