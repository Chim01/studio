// src/services/auth.ts
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithRedirect, signOut, UserCredential, AuthError, getRedirectResult } from 'firebase/auth';

/**
 * Initiates the Google Sign-In process using Firebase Authentication via redirect.
 * This method avoids issues with browser popup blockers.
 * The result is handled after the redirect by calling getRedirectResult.
 * @returns A promise that resolves when the redirect initiation is complete.
 * @throws An AuthError if the redirect initiation fails.
 */
export const signInWithGoogle = async (): Promise<void> => {
  try {
    // No need to await here, it just starts the redirect process
     await signInWithRedirect(auth, googleProvider);
     console.log("Google Sign-In redirect initiated.");
     // The result will be handled by getRedirectResult in the component mount effect
  } catch (error) {
    const authError = error as AuthError;
    // Handle Errors that might occur *during the initiation* of the redirect.
    console.error("Google Sign-In Redirect Initiation Error:", authError.code, authError.message);
    throw authError; // Re-throw the error to be caught by the caller if needed
  }
};


/**
 * Signs out the currently authenticated user.
 * @returns A promise that resolves when sign-out is complete.
 */
export const signOutUser = async (): Promise<void> => {
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
 * Should be called when the app loads or the user is redirected back.
 * @returns A promise that resolves with the UserCredential if sign-in was successful, or null otherwise.
 * @throws An AuthError if the redirect process resulted in an error.
 */
export const handleRedirectResult = async (): Promise<UserCredential | null> => {
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            // This gives you a Google Access Token. You can use it to access Google APIs.
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential?.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log("Google Sign-In successful via redirect:", user.displayName);
            return result;
        }
        return null; // No redirect result found
    } catch (error) {
        const authError = error as AuthError;
        // Handle Errors here.
        console.error("Google Sign-In Redirect Result Error:", authError.code, authError.message);
         // The email of the user's account used.
        // const email = authError.customData?.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(authError);
        throw authError; // Re-throw the error to be caught by components
    }
};


// You can add functions for email/password sign-in/sign-up here later
// export const signInWithEmail = async (email, password) => { ... };
// export const signUpWithEmail = async (email, password) => { ... };
