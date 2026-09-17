import admin from "../firebase/admin.js";
import { FieldValue } from "firebase-admin/firestore";

const db = admin.firestore();

export const addBookmark = async (userId, itemId) => {
  const userRef = db.collection("users").doc(userId);
  await userRef.set({
    bookmarks: FieldValue.arrayUnion(itemId)
  }, { merge: true });
  const userDoc = await userRef.get();
  return userDoc.data().bookmarks || [];
};

export const removeBookmark = async (userId, itemId) => {
  const userRef = db.collection("users").doc(userId);
  await userRef.set({
    bookmarks: FieldValue.arrayRemove(itemId)
  }, { merge: true });
  const userDoc = await userRef.get();
  return userDoc.data().bookmarks || [];
};

export const getUserBookmarks = async (userId) => {
  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) return [];
  return userDoc.data().bookmarks || [];
};
