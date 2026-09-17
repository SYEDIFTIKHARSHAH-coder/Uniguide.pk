import * as appService from "../services/application.service.js";
import { withdrawApplicationSchema } from "../validators/application.validator.js";

export const getMyApplications = async (req, res) => {
  try {
    const studentId = req.user.uid;
    const apps = await appService.getStudentApplications(studentId);
    res.status(200).json({ success: true, data: apps });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getApplicationDetail = async (req, res) => {
  try {
    const studentId = req.user.uid;
    const appId = req.params.id;
    const detail = await appService.getApplicationDetail(studentId, appId);
    
    if (!detail) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    
    res.status(200).json({ success: true, data: detail });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    const studentId = req.user.uid;
    const appId = req.params.id;
    
    const validatedData = withdrawApplicationSchema.parse(req.body);
    const result = await appService.withdrawApplication(studentId, appId, validatedData.reason);
    
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, message: "Validation error", error: error.errors });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
