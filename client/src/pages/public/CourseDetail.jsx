import { useParams, Link } from "react-router-dom";
import { useCourseDetail, useEnrollMutation } from "../../hooks/useCourseData";
import { ChevronLeft, Clock, BookOpen, User, PlayCircle, CheckCircle } from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();
  const { data: course, isLoading, isError } = useCourseDetail(id);
  const enrollMutation = useEnrollMutation();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading course...</div>;
  if (isError || !course) return <div className="min-h-screen flex items-center justify-center text-red-500">Course not found.</div>;

  const totalLessons = course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0;

  const handleEnroll = () => {
    enrollMutation.mutate(course.id);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link to="/courses" className="inline-flex items-center text-blue-200 hover:text-white font-medium mb-6 transition-colors text-sm">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Courses
          </Link>
          <span className="block text-sm font-semibold text-blue-300 uppercase tracking-wider mb-2">
            {course.category.replace(/_/g, " ")}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{course.title}</h1>
          <p className="text-blue-100 text-lg max-w-3xl mb-6">{course.description}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-blue-200">
            <div className="flex items-center"><User className="w-5 h-5 mr-2" /> {course.instructor}</div>
            <div className="flex items-center"><Clock className="w-5 h-5 mr-2" /> {course.durationHours} hours</div>
            <div className="flex items-center"><BookOpen className="w-5 h-5 mr-2" /> {course.modules.length} modules · {totalLessons} lessons</div>
          </div>

          <button
            onClick={handleEnroll}
            disabled={enrollMutation.isPending}
            className="mt-8 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-bold rounded-lg transition-colors shadow-sm text-lg"
          >
            {enrollMutation.isPending ? "Enrolling..." : enrollMutation.isSuccess ? "✓ Enrolled!" : "Enroll Now – Free"}
          </button>
        </div>
      </div>

      {/* Course Syllabus */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Syllabus</h2>
        <div className="space-y-4">
          {course.modules.map((mod, modIdx) => (
            <div key={modIdx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                  {modIdx + 1}
                </span>
                <h3 className="font-bold text-slate-900">{mod.title}</h3>
                <span className="ml-auto text-sm text-slate-500">{mod.lessons.length} lessons</span>
              </div>
              <ul className="divide-y divide-slate-100">
                {mod.lessons.map((lesson, lesIdx) => (
                  <li key={lesIdx} className="p-4 flex items-center hover:bg-slate-50 transition-colors">
                    <PlayCircle className="w-5 h-5 text-slate-400 mr-4 flex-shrink-0" />
                    <span className="text-slate-700 flex-grow">{lesson.title}</span>
                    <span className="text-sm text-slate-400 ml-4">{lesson.durationMinutes} min</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
