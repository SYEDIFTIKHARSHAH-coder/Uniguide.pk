import * as userService from "../services/user.service.js";

export const addBookmark = async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ success: false, message: "itemId is required" });
    
    const bookmarks = await userService.addBookmark(req.user.uid, itemId);
    res.status(200).json({ success: true, bookmarks, message: "Added to bookmarks" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const bookmarks = await userService.removeBookmark(req.user.uid, id);
    res.status(200).json({ success: true, bookmarks, message: "Removed from bookmarks" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await userService.getUserBookmarks(req.user.uid);
    res.status(200).json({ success: true, bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
