// Mocking Firestore interactions for Utilities (Reviews, Favorites)

let MOCK_REVIEWS = [
  { id: "rev_1", targetId: "uni_1", targetType: "university", userId: "stu_1", userName: "Ahmed Ali", rating: 5, comment: "Excellent faculty and research facilities.", createdAt: "2026-07-01T10:00:00Z" },
  { id: "rev_2", targetId: "uni_1", targetType: "university", userId: "stu_2", userName: "Fatima Khan", rating: 4, comment: "Great campus but the hostel needs improvement.", createdAt: "2026-07-02T12:00:00Z" },
];

let MOCK_FAVORITES = [
  { id: "fav_1", userId: "stu_1", targetId: "uni_1", targetType: "university", addedAt: "2026-07-05T09:00:00Z", title: "National University of Sciences & Technology", subtitle: "Islamabad" },
  { id: "fav_2", userId: "stu_1", targetId: "sch_1", targetType: "scholarship", addedAt: "2026-07-06T11:00:00Z", title: "HEC Need-Based", subtitle: "Fully Funded" },
];

// REVIEWS
export const getReviews = async (targetId, targetType) => {
  return MOCK_REVIEWS.filter(r => r.targetId === targetId && r.targetType === targetType);
};

export const addReview = async (userId, userName, reviewData) => {
  // Check if user already reviewed this target
  const existing = MOCK_REVIEWS.find(r => r.userId === userId && r.targetId === reviewData.targetId);
  if (existing) {
    throw new Error("You have already reviewed this.");
  }

  const newReview = {
    id: `rev_${Date.now()}`,
    userId,
    userName,
    ...reviewData,
    createdAt: new Date().toISOString()
  };
  
  MOCK_REVIEWS.unshift(newReview);
  
  // In a real app, we would also update the average rating on the University/Scholarship document here.
  return newReview;
};

// FAVORITES
export const getUserFavorites = async (userId, type = "all") => {
  let favs = MOCK_FAVORITES.filter(f => f.userId === userId);
  if (type !== "all") {
    favs = favs.filter(f => f.targetType === type);
  }
  return favs;
};

export const toggleFavorite = async (userId, targetId, targetType, title = "", subtitle = "") => {
  const index = MOCK_FAVORITES.findIndex(f => f.userId === userId && f.targetId === targetId);
  
  if (index >= 0) {
    // Remove it
    MOCK_FAVORITES.splice(index, 1);
    return { isFavorite: false };
  } else {
    // Add it
    const newFav = {
      id: `fav_${Date.now()}`,
      userId,
      targetId,
      targetType,
      title,      // In real app, we'd fetch these from the DB
      subtitle,   // using the targetId before saving
      addedAt: new Date().toISOString()
    };
    MOCK_FAVORITES.push(newFav);
    return { isFavorite: true, favorite: newFav };
  }
};

export const checkIsFavorite = async (userId, targetId) => {
  return MOCK_FAVORITES.some(f => f.userId === userId && f.targetId === targetId);
};
