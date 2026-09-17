// guidance.service.js
// ──────────────────────────────────────────────────────────────────────────────
// PURPOSE: Fetch guidance articles for the public-facing GuidanceHub page.
// SOURCE:  Reads from the SAME Firestore 'articles' collection that the admin
//          writes to. Previous implementation used hardcoded mock data, meaning
//          admin-created articles were NEVER visible to students.
// FIX:     Removed all mock data. Now queries Firestore 'articles' directly,
//          filtering by published: true so drafts stay hidden.
// ──────────────────────────────────────────────────────────────────────────────

import admin from "../firebase/admin.js";

const db = admin.firestore();

// Map a Firestore article document to the shape expected by the frontend
function mapArticle(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || "",
    category: (data.category || "General").toLowerCase().replace(/\s+/g, "_"),
    excerpt: data.excerpt || "",
    thumbnailUrl: data.thumbnailUrl || "",
    readTimeMinutes: data.readTimeMinutes || 3,
    tags: data.tags || [],
    author: data.author || "Admin",
    content: data.content || "",
    featured: data.featured || false,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() || null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || null,
  };
}

// ─── Get the latest N published articles (for GuidanceHub landing) ─────────────
export const getLatestGuides = async (limit = 9) => {
  try {
    const snapshot = await db
      .collection("articles")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const articles = snapshot.docs.map(mapArticle);
    console.log(`[Guidance] getLatestGuides: returned ${articles.length} articles`);
    return articles;
  } catch (err) {
    console.error("[Guidance] getLatestGuides error:", err.message);
    // Firestore may throw if index isn't yet built; return empty instead of crashing
    return [];
  }
};

// ─── Get articles filtered by category ─────────────────────────────────────────
// Category values sent by the frontend: "career", "degree", "university",
// "admission", "faq". These map to the 'category' field stored in Firestore.
// Admin panel stores categories as "Career Guide", "Admission Tips", etc.
// We do a case-insensitive client-side filter after fetching to handle both.
export const getGuidesByCategory = async (category) => {
  try {
    const snapshot = await db
      .collection("articles")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    let articles = snapshot.docs.map(mapArticle);

    // Flexible category matching: "admission" matches "Admission Tips", etc.
    if (category && category !== "all") {
      const cat = category.toLowerCase();
      articles = articles.filter((a) => {
        const storedCat = (a.category || "").toLowerCase().replace(/[\s_-]/g, "");
        const searchCat = cat.replace(/[\s_-]/g, "");
        return storedCat.includes(searchCat) || searchCat.includes(storedCat);
      });
    }

    // Strip full content for list views — only return summary
    return articles.map(({ content, ...summary }) => summary);
  } catch (err) {
    console.error("[Guidance] getGuidesByCategory error:", err.message);
    return [];
  }
};

// ─── Get a single article's full detail by ID ───────────────────────────────────
export const getGuideDetail = async (id) => {
  try {
    const doc = await db.collection("articles").doc(id).get();
    if (!doc.exists) {
      console.warn(`[Guidance] getGuideDetail: article ${id} not found`);
      return null;
    }
    const article = mapArticle(doc);
    // Only return published articles to public
    if (!doc.data().published) {
      console.warn(`[Guidance] getGuideDetail: article ${id} exists but is not published`);
      return null;
    }
    return article;
  } catch (err) {
    console.error("[Guidance] getGuideDetail error:", err.message);
    return null;
  }
};
