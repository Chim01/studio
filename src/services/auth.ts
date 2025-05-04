// src/services/auth.ts
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, UserCredential, AuthError } from 'firebase/auth';

/**
 * Initiates the Google Sign-In process using Firebase Authentication.
 * @returns A promise that resolves with the UserCredential on successful sign-in.
 * @throws An AuthError if the sign-in process fails.
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // The signed-in user info.
    // const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    console.log("Google Sign-In successful:", result.user.displayName);
    return result;
  } catch (error) {
    const authError = error as AuthError;
    // Handle Errors here.
    console.error("Google Sign-In Error:", authError.code, authError.message);
    // The email of the user's account used.
    // const email = authError.customData?.email;
    // The AuthCredential type that was used.
    // const credential = GoogleAuthProvider.credentialFromError(authError);
    // ...
    throw authError; // Re-throw the error to be caught by the caller
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

// You can add functions for email/password sign-in/sign-up here later
// export const signInWithEmail = async (email, password) => { ... };
// export const signUpWithEmail = async (email, password) => { ... };
