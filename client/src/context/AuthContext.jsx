import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { USER_ROLES, SINGLE_ADMIN_EMAIL } from "@/config/constants";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
        setUserRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user profile from Firestore
  async function fetchUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile(data);
        setUserRole(data.role);
      } else {
        // Profile doesn't exist yet (e.g. Google sign-in first time)
        setUserProfile(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  // Sync Firebase ID token with backend to issue session cookie
  async function verifyTokenWithBackend(firebaseUser) {
    try {
      const idToken = await firebaseUser.getIdToken(true);
      const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/auth/verify-firebase-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (!data.success) {
        console.error("Backend token verification failed:", data.message);
      }
    } catch (error) {
      console.error("Error syncing token with backend:", error);
    }
  }

  // Create student profile in Firestore (auto-called on registration or first Google sign-in)
  async function createStudentProfile(uid, data) {
    const profileData = {
      userId: uid,
      fullName: data.fullName || "",
      email: data.email || "",
      phone: data.phone || "",
      city: data.city || "",
      province: data.province || "",
      profilePicture: data.profilePicture || "",
      education: "",
      fscMarks: "",
      matricMarks: "",
      preferences: [],
      savedUniversities: [],
      savedScholarships: [],
      applications: [],
      bookmarks: [],
      recentActivity: [],
      role: USER_ROLES.STUDENT,
      profileCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", uid), profileData);
    setUserProfile(profileData);
    setUserRole(USER_ROLES.STUDENT);
    return profileData;
  }

  // ─── Register with Email & Password ───────────────────────────
  async function register(fullName, email, password, phone = "", city = "") {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser, { displayName: fullName });

    // Send email verification
    try {
      await sendEmailVerification(newUser);
    } catch (e) {
      console.warn("Email verification send failed:", e.message);
    }

    // Create student profile in Firestore
    await createStudentProfile(newUser.uid, {
      fullName,
      email,
      phone,
      city,
    });
    
    await verifyTokenWithBackend(newUser);

    return newUser;
  }

  // ─── Login with Email & Password ──────────────────────────────
  async function login(email, password) {
    const { user: loggedInUser } = await signInWithEmailAndPassword(auth, email, password);
    await verifyTokenWithBackend(loggedInUser);
    await fetchUserProfile(loggedInUser.uid);
    return loggedInUser;
  }

  // ─── Google Sign-In ───────────────────────────────────────────
  async function signInWithGoogle() {
    // ── LOCAL DEVELOPMENT MOCK ──
    // If we are using placeholder keys, bypass Firebase entirely to prevent crash
    if (import.meta.env.VITE_FIREBASE_API_KEY === "AIzaSyPlaceholderKeyForLocalTesting12345") {
      console.log("Using Mock Google Sign-In (Placeholder Keys Detected)");
      const mockProfile = {
        userId: "mock_google_uid_123",
        fullName: "Syed Local Tester (Google)",
        email: "test.google@uniguid.pk",
        role: USER_ROLES.STUDENT,
        profilePicture: "https://ui-avatars.com/api/?name=Syed+Tester&background=0D8ABC&color=fff"
      };
      
      setUser({ uid: mockProfile.userId, email: mockProfile.email });
      setUserProfile(mockProfile);
      setUserRole(mockProfile.role);
      return mockProfile;
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const result = await signInWithPopup(auth, provider);
    const googleUser = result.user;

    // Check if profile exists in Firestore
    const userDoc = await getDoc(doc(db, "users", googleUser.uid));
    if (!userDoc.exists()) {
      // First-time Google user → create student profile automatically
      await createStudentProfile(googleUser.uid, {
        fullName: googleUser.displayName || "",
        email: googleUser.email || "",
        profilePicture: googleUser.photoURL || "",
      });
    } else {
      // Existing user → just fetch profile
      const data = userDoc.data();
      setUserProfile(data);
      setUserRole(data.role);
    }
    
    await verifyTokenWithBackend(googleUser);

    return googleUser;
  }

  // ─── Logout ───────────────────────────────────────────────────
  async function logout() {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    setUserRole(null);
  }

  // ─── Forgot Password ─────────────────────────────────────────
  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  // ─── Helper: Check if user has specific role ──────────────────
  function hasRole(...roles) {
    return roles.includes(userRole);
  }

  function isAdmin() {
    return userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN;
  }

  function isStudent() {
    return userRole === USER_ROLES.STUDENT;
  }

  // ─── Check if user is THE single admin ────────────────────────
  function isSingleAdmin() {
    return isAdmin() && user?.email === SINGLE_ADMIN_EMAIL;
  }

  // ─── Bookmarks (API Integration) ──────────────────────────────
  async function toggleBookmark(itemId, isCurrentlyBookmarked) {
    try {
      const url = `/api/user/bookmarks${isCurrentlyBookmarked ? `/${itemId}` : ''}`;
      const method = isCurrentlyBookmarked ? 'DELETE' : 'POST';
      const body = isCurrentlyBookmarked ? null : JSON.stringify({ itemId });

      const res = await fetch(import.meta.env.VITE_API_URL + url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body
      });
      const data = await res.json();
      
      if (data.success) {
        setUserProfile(prev => ({ ...prev, bookmarks: data.bookmarks }));
        return data.bookmarks;
      }
      throw new Error(data.message);
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      throw err;
    }
  }

  const value = {
    user,
    userProfile,
    userRole,
    loading,
    register,
    login,
    signInWithGoogle,
    logout,
    resetPassword,
    hasRole,
    isAdmin,
    isStudent,
    isSingleAdmin,
    fetchUserProfile,
    toggleBookmark,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
