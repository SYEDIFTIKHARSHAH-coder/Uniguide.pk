import { Link } from "react-router-dom";
import { Clock, BookOpen, User } from "lucide-react";

const DIFFICULTY_STYLES = {
  beginner: "bg-emerald-50 text-emerald-700",
  intermediate: "bg-amber-50 text-amber-700",
  advanced: "bg-red-50 text-red-700",
};

export default function CourseCard({ course, enrollment }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        {course.thumbnailUrl || course.courseThumbnail ? (
          <img
            src={course.thumbnailUrl || course.courseThumbnail}
            alt={course.title || course.courseTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
        )}
        <div className="absolute top-3 left-3 flex space-x-2">
          <span className="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm">
            FREE
          </span>
          {(course.difficulty) && (
            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full capitalize ${DIFFICULTY_STYLES[course.difficulty] || ""}`}>
              {course.difficulty}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
          {(course.category || course.courseCategory || "").replace(/_/g, " ")}
        </span>

        <Link to={`/courses/${course.id || course.courseId}`}>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2">
            {course.title || course.courseTitle}
          </h3>
        </Link>

        {/* Progress bar for enrolled courses */}
        {enrollment && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span>{enrollment.progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1.5 text-slate-400" />
            <span className="truncate max-w-[120px]">{course.instructor || course.courseInstructor}</span>
          </div>
          <div className="flex items-center space-x-3">
            {course.totalModules && (
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1 text-slate-400" />
                {course.totalModules}
              </div>
            )}
            {course.durationHours && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-slate-400" />
                {course.durationHours}h
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
