// src/services/auth.ts
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithRedirect, signOut, UserCredential, AuthError, getRedirectResult } from 'firebase/auth';

/**
 * Initiates the Google Sign-In process using Firebase Authentication via redirect.
 * This method avoids issues with browser popup blockers.
 * The result is handled after the redirect by calling getRedirectResult.
 * @returns A promise that resolves when the redirect initiation is complete.
 * @throws An AuthError if the redirect initiation fails or if auth/provider are not initialized.
 */
export const signInWithGoogle = async (): Promise<void> => {
  if (!auth || !googleProvider) {
    console.error("Firebase Auth or Google Provider not initialized. Cannot sign in.");
    throw new Error("Authentication service not ready.");
  }
  try {
    // signInWithRedirect doesn't return a UserCredential directly, it starts the redirect.
    await signInWithRedirect(auth, googleProvider);
    console.log("Google Sign-In redirect initiated.");
    // The result (UserCredential or error) is obtained via getRedirectResult() AFTER the redirect.
  } catch (error) {
    const authError = error as AuthError;
    // Handle Errors that might occur *during the initiation* of the redirect.
    // Common initiation errors: network issues, misconfiguration before redirect starts.
    console.error("Google Sign-In Redirect Initiation Error:", authError.code, authError.message);
    // You might want to map specific error codes to user-friendly messages here.
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
    console.error("Sign Out Error:", error);
    throw error; // Re-throw the error
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
        console.log("No Google Sign-In redirect result found.");
        return null;
    } catch (error) {
        const authError = error as AuthError;
        // Handle Errors that occurred *during the redirect sign-in process*.
        // Common redirect errors: auth/account-exists-with-different-credential, auth/auth-domain-config-required, auth/credential-already-in-use
        console.error("Google Sign-In Redirect Result Error:", authError.code, authError.message);
        // Optionally provide more specific user feedback based on authError.code
        // Example:
        // if (authError.code === 'auth/account-exists-with-different-credential') {
        //   // Inform user to sign in using the original method.
        // }
        throw authError; // Re-throw the error to be caught by components/UI
    }
};


// You can add functions for email/password sign-in/sign-up here later
// export const signInWithEmail = async (email, password) => { ... };
// export const signUpWithEmail = async (email, password) => { ... };
