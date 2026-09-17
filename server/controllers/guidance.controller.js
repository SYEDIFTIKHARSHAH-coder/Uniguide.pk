import * as guidanceService from "../services/guidance.service.js";

export const getGuidesByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const guides = await guidanceService.getGuidesByCategory(category);
    res.status(200).json({ success: true, data: guides });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getGuideDetail = async (req, res) => {
  try {
    const guideId = req.params.id;
    const guide = await guidanceService.getGuideDetail(guideId);
    
    if (!guide) {
      return res.status(404).json({ success: false, message: "Guide not found" });
    }
    
    res.status(200).json({ success: true, data: guide });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getLatestGuides = async (req, res) => {
  try {
    const guides = await guidanceService.getLatestGuides(6);
    res.status(200).json({ success: true, data: guides });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
