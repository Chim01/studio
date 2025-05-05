// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

// --- SECURITY WARNING ---
// This file should ONLY be imported and used on the SERVER-SIDE
// (e.g., in API routes, Server Actions, getServerSideProps).
// NEVER import or use this in client-side components.

// Check if the Admin SDK has already been initialized
if (!admin.apps.length) {
  try {
    let serviceAccount: admin.ServiceAccount | undefined;

    // Option 1: Use JSON stored in environment variable (Recommended for Vercel, etc.)
    if (process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON);
        console.log('Initializing Firebase Admin SDK using FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON.');
      } catch (e) {
        console.error('Failed to parse FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON:', e);
        // Potentially fall back or throw, depending on requirements
      }
    }
    // Option 2: Use GOOGLE_APPLICATION_CREDENTIALS environment variable (path to file or default in GCP)
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // The SDK will automatically pick up the credentials from the path specified
      // or from the default service account in GCP environments (like Cloud Run/Functions).
      // No need to explicitly parse `GOOGLE_APPLICATION_CREDENTIALS` here.
      console.log('Initializing Firebase Admin SDK using GOOGLE_APPLICATION_CREDENTIALS.');
      // Use default credential detection if serviceAccount is still undefined
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        // You might need to specify databaseURL or storageBucket if using those services
        // databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
        // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
      console.log('Firebase Admin SDK initialized successfully (via Application Default Credentials).');

    } else {
       console.warn('Firebase Admin SDK not initialized: Neither FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON nor GOOGLE_APPLICATION_CREDENTIALS found.');
       // Throw an error or handle the uninitialized state as appropriate
       throw new Error('Firebase Admin SDK credentials not found.');
    }


    // Initialize only if using FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON and not already initialized via applicationDefault
    if (serviceAccount && !admin.apps.length) {
       admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // Optionally add databaseURL or storageBucket if needed
        // databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
        // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
      console.log('Firebase Admin SDK initialized successfully (via Service Account JSON).');
    } else if (!admin.apps.length) {
         // This case handles if GOOGLE_APPLICATION_CREDENTIALS was set but applicationDefault failed,
         // or if neither env var was set correctly.
         console.error('Firebase Admin SDK initialization failed. Check environment variables and service account configuration.');
          throw new Error('Firebase Admin SDK initialization failed.');
    }


  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
    // You might want to throw the error or handle it differently
    // depending on whether Admin SDK access is critical at startup.
  }
} else {
  console.log('Firebase Admin SDK already initialized.');
}

// Export initialized admin instance and specific services
const adminAuth = admin.auth();
// const adminDb = admin.firestore(); // Uncomment if using Firestore Admin
// const adminStorage = admin.storage(); // Uncomment if using Storage Admin

export { admin, adminAuth /*, adminDb, adminStorage */ };
