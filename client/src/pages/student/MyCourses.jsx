import { useEnrolledCourses } from "../../hooks/useCourseData";
import CourseCard from "../../components/ui/CourseCard";
import { BookOpen } from "lucide-react";

export default function MyCourses() {
  const { data: enrollments, isLoading } = useEnrolledCourses();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
        <p className="text-sm text-slate-500">Track your learning progress across all enrolled courses.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-72 bg-slate-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : enrollments?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <CourseCard
              key={enrollment.id}
              course={{
                id: enrollment.courseId,
                title: enrollment.courseTitle,
                category: enrollment.courseCategory,
                thumbnailUrl: enrollment.courseThumbnail,
                instructor: enrollment.courseInstructor,
              }}
              enrollment={enrollment}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No courses yet</h3>
          <p className="text-slate-500">Start learning by enrolling in a course from the Learning Hub.</p>
        </div>
      )}
    </div>
  );
}
