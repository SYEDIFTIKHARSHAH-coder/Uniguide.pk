import * as courseService from "../services/course.service.js";

export const getCourses = async (req, res) => {
  try {
    const category = req.query.category || "all";
    const courses = await courseService.getAllCourses(category);
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getCourseDetail = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await courseService.getCourseDetail(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const enrollInCourse = async (req, res) => {
  try {
    const studentId = req.user.uid;
    const courseId = req.params.id;
    const result = await courseService.enrollStudent(studentId, courseId);

    if (!result.success) {
      return res.status(409).json({ success: false, message: result.message });
    }

    res.status(201).json({ success: true, data: result.data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user.uid;
    const enrollments = await courseService.getStudentEnrollments(studentId);
    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
