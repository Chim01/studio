// src/services/auth.ts
import { auth, googleProvider } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  UserCredential,
  AuthError,
  getRedirectResult,
  updateProfile,
  sendPasswordResetEmail, // Import sendPasswordResetEmail
  GoogleAuthProvider, // Import GoogleAuthProvider type if needed
} from 'firebase/auth';

/**
 * Initiates the Google Sign-In process using Firebase Authentication via redirect.
 * This method avoids issues with browser popup blockers.
 * The result is handled after the redirect by calling handleRedirectResult.
 * @returns A promise that resolves when the redirect initiation is complete.
 * @throws An AuthError if the redirect initiation fails or if auth/provider are not initialized.
 */
export const signInWithGoogle = async (): Promise<void> => {
  if (!auth || !googleProvider) {
    console.error("Firebase Auth or Google Provider not initialized. Cannot sign in.");
    throw new Error("Authentication service not ready.");
  }
  try {
    // ***AUTH/UNAUTHORIZED-DOMAIN ERROR?***
    // If you get this error, make sure the domain you are running the app on
    // (e.g., localhost, *.cloudworkstations.dev, your deployed domain)
    // is added to your Firebase project's Authentication > Settings > Authorized domains list.
    await signInWithRedirect(auth, googleProvider);
    console.log("Google Sign-In redirect initiated.");
    // The result (UserCredential or error) is obtained via getRedirectResult() AFTER the redirect.
  } catch (error) {
    const authError = error as AuthError;
    // Handle Errors that might occur *during the initiation* of the redirect only.
    // Common initiation errors: network issues, misconfiguration before redirect starts.
    console.error("Google Sign-In Redirect Initiation Error:", authError.code, authError.message);

    // Specific check for invalid API key
    if (authError.code === 'auth/api-key-not-valid' || authError.message.includes('api-key-not-valid')) {
      console.error(
        "FIREBASE AUTH ERROR (Initiation): Invalid API Key. \n" +
        "Potential Causes & Solutions: \n" +
        "1. Check NEXT_PUBLIC_FIREBASE_API_KEY in your .env file. Is it correct? Is it the *web* API key? \n" +
        "2. Did you restart the Next.js server (npm run dev) after changing .env? \n" +
        "3. Check API Key restrictions in Google Cloud Console (Credentials > Your API Key): \n" +
        "   - Application restrictions > HTTP referrers: Ensure your app's URLs are listed (e.g., `localhost:9002/*`, `*.cloudworkstations.dev/*`, your deployment domain `/*`). \n" +
        "   - API restrictions: Ensure 'Identity Platform API' (or similar Firebase auth APIs) is enabled/unrestricted for this key. \n" +
        "4. Is the API key associated with the correct Firebase project (check Project ID in Firebase console vs. .env)? \n" +
        "5. Ensure Firebase Authentication > Settings > Authorized domains list includes your app's domains (e.g., `localhost`, `*.cloudworkstations.dev`, deployment domain). \n" +
        "6. Ensure the `firebaseConfig` in `src/lib/firebase.ts` is correctly loading the environment variable."
      );
    }
    // Check for unauthorized domain error
     if (authError.code === 'auth/unauthorized-domain') {
       console.error(
         "FIREBASE AUTH ERROR (Initiation): Unauthorized Domain. \n" +
         "FIX: Add the current domain (`" + window.location.hostname + "`) to your Firebase project's Authentication > Settings > Authorized domains list. See comments in `src/lib/firebase.ts` for more details."
       );
     }


    // You might want to map other specific error codes to user-friendly messages here.
    throw authError; // Re-throw the error to be caught by the caller (e.g., UI)
  }
};


/**
 * Signs out the currently authenticated user.
 * @returns A promise that resolves when sign-out is complete.
 */
export const signOutUser = async (): Promise<void> => {
  if (!auth) {
    console.error("Firebase Auth not initialized. Cannot sign out.");
    throw new Error("Authentication service not ready.");
  }
  try {
    await signOut(auth);
    console.log("User signed out successfully.");
  } catch (error) {
     const authError = error as AuthError;
    console.error("Sign Out Error:", authError.code, authError.message);
    throw authError; // Re-throw the specific AuthError
  }
};


/**
 * Checks for and processes the result of a sign-in operation initiated by signInWithRedirect.
 * Should be called when the app loads or the user is redirected back to the app.
 * @returns A promise that resolves with the UserCredential if sign-in was successful via redirect, or null otherwise.
 * @throws An AuthError if the redirect process itself resulted in an error (e.g., account exists with different credential).
 */
export const handleRedirectResult = async (): Promise<UserCredential | null> => {
  if (!auth) {
    console.error("Firebase Auth not initialized. Cannot handle redirect result.");
    // Return null or throw, depending on how you want to handle this state upstream.
    // Returning null might be safer if called early during app load.
    return null;
  }
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      // Successfully signed in via redirect.
      const user = result.user;
      console.log("Google Sign-In successful via redirect:", user.displayName);
      // You might get an access token here if needed:
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential?.accessToken;
      return result;
    }
    // No redirect result found (e.g., user navigated directly to the page, or was already signed in).
    // console.log("No Google Sign-In redirect result found."); // Reduce noise, only log if successful
    return null;
  } catch (error) {
    const authError = error as AuthError;
    // Handle Errors that occurred *during the redirect sign-in process*.
    // Common redirect errors: auth/account-exists-with-different-credential, auth/auth-domain-config-required, auth/credential-already-in-use
    console.error("Google Sign-In Redirect Result Error:", authError.code, authError.message);

    // Specific check for invalid API key during redirect result processing
    if (authError.code === 'auth/api-key-not-valid' || authError.message.includes('api-key-not-valid')) {
      console.error(
        "FIREBASE AUTH ERROR (Redirect Result): Invalid API Key. See logs in firebase.ts or auth.ts for debugging steps."
      );
    }
     // Check for unauthorized domain error during redirect result processing
     if (authError.code === 'auth/unauthorized-domain') {
       console.error(
         "FIREBASE AUTH ERROR (Redirect Result): Unauthorized Domain. \n" +
         "FIX: Ensure the domain (`" + (typeof window !== 'undefined' ? window.location.hostname : 'UNKNOWN_HOST') + "`) is added to your Firebase project's Authentication > Settings > Authorized domains list."
       );
     }

    // Optionally provide more specific user feedback based on authError.code
    // Example:
    // if (authError.code === 'auth/account-exists-with-different-credential') {
    //   // Inform user to sign in using the original method.
    // }
    throw authError; // Re-throw the error to be caught by components/UI
  }
};


/**
 * Signs in a user with email and password.
 * @param email The user's email address.
 * @param password The user's password.
 * @returns A promise that resolves with the UserCredential if sign-in is successful.
 * @throws An AuthError if sign-in fails.
 */
export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  if (!auth) {
    console.error("Firebase Auth not initialized. Cannot sign in.");
    throw new Error("Authentication service not ready.");
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in successfully with email:", email);
    return userCredential;
  } catch (error) {
    const authError = error as AuthError;
    console.error("Email Sign-In Error:", authError.code, authError.message);

    // Specific check for invalid API key
     if (authError.code === 'auth/api-key-not-valid' || authError.message.includes('api-key-not-valid')) {
         console.error(
             "FIREBASE AUTH ERROR (Email Login): Invalid API Key. See console logs in site-header or auth.ts for debugging steps."
         );
     }
       // Check for unauthorized domain error during email login
     if (authError.code === 'auth/unauthorized-domain') {
       console.error(
         "FIREBASE AUTH ERROR (Email Login): Unauthorized Domain. \n" +
         "FIX: Ensure the domain (`" + (typeof window !== 'undefined' ? window.location.hostname : 'UNKNOWN_HOST') + "`) is added to your Firebase project's Authentication > Settings > Authorized domains list."
       );
     }


    throw authError;
  }
};

/**
 * Creates a new user with email and password.
 * @param email The user's email address.
 * @param password The user's password.
 * @param displayName The user's display name.
 * @returns A promise that resolves with the UserCredential if sign-up is successful.
 * @throws An AuthError if sign-up fails.
 */
export const signUpWithEmail = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
  if (!auth) {
    console.error("Firebase Auth not initialized. Cannot sign up.");
    throw new Error("Authentication service not ready.");
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update the user's display name
    if (userCredential.user) { // Check if user object exists
       await updateProfile(userCredential.user, { displayName: displayName });
    } else {
        console.warn("User object not available after creation to update profile immediately.");
    }


    console.log("User signed up successfully with email:", email);
    return userCredential;
  } catch (error) {
    const authError = error as AuthError;
     // Specific check for invalid API key during signup
    if (authError.code === 'auth/api-key-not-valid' || authError.message.includes('api-key-not-valid')) {
      console.error(
        "FIREBASE AUTH ERROR (Signup): Invalid API Key. \n" +
        "Potential Causes & Solutions: \n" +
        "1. Check NEXT_PUBLIC_FIREBASE_API_KEY in your .env file. Is it correct? \n" +
        "2. Did you restart the Next.js server (npm run dev) after changing .env? \n" +
        "3. Check API Key restrictions in Google Cloud Console (Credentials): \n" +
        "   - HTTP Referrers: Ensure your app's URL (e.g., localhost:xxxx/*, *.cloudworkstations.dev/*) is listed. \n" +
        "   - API Restrictions: Ensure 'Identity Platform API' (or similar Firebase auth APIs) is enabled for the key. \n" +
        "4. Is the API key associated with the correct Firebase project (check Project ID)? \n" +
        " 5. Ensure the `firebaseConfig` in `src/lib/firebase.ts` is correctly using the environment variable."
      );
    }
      // Check for unauthorized domain error during signup
     if (authError.code === 'auth/unauthorized-domain') {
       console.error(
         "FIREBASE AUTH ERROR (Signup): Unauthorized Domain. \n" +
         "FIX: Ensure the domain (`" + (typeof window !== 'undefined' ? window.location.hostname : 'UNKNOWN_HOST') + "`) is added to your Firebase project's Authentication > Settings > Authorized domains list."
       );
     }
    console.error("Email Sign-Up Error:", authError.code, authError.message);
    throw authError;
  }
};


/**
 * Sends a password reset email to the given email address.
 * @param email The user's email address.
 * @returns A promise that resolves when the email is sent.
 * @throws An AuthError if sending the email fails (e.g., invalid email, network error).
 */
export const sendPasswordReset = async (email: string): Promise<void> => {
  if (!auth) {
    console.error("Firebase Auth not initialized. Cannot send password reset.");
    throw new Error("Authentication service not ready.");
  }
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully to:", email);
  } catch (error) {
    const authError = error as AuthError;
    console.error("Password Reset Error:", authError.code, authError.message);
     // Check for unauthorized domain error during password reset
     if (authError.code === 'auth/unauthorized-domain') {
       console.error(
         "FIREBASE AUTH ERROR (Password Reset): Unauthorized Domain. \n" +
         "FIX: Ensure the domain (`" + (typeof window !== 'undefined' ? window.location.hostname : 'UNKNOWN_HOST') + "`) is added to your Firebase project's Authentication > Settings > Authorized domains list."
       );
     }
    // Note: Firebase often throws auth/user-not-found if the email doesn't exist,
    // but for security, we usually don't reveal this to the user.
    // The calling function should handle this by showing a generic success message.
    throw authError;
  }
};
