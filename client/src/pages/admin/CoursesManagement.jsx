import { useState, useEffect } from 'react';
import { Plus, BookOpen, Search, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchCoursesForAdmin, createCourseAdmin, deleteCourseAdmin } from '../../api/adminApi';

export default function CoursesManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    universityName: '',
    category: 'Computer Science',
    degreeLevel: 'BS',
    duration: '4 Years',
    feeStructure: '',
    eligibilityCriteria: '',
    courseUrl: ''
  });
  const [saving, setSaving] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await fetchCoursesForAdmin();
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.universityName) {
      toast.error('Title and University are required.');
      return;
    }

    setSaving(true);
    try {
      await createCourseAdmin(formData);
      toast.success('Course added successfully!');
      setIsModalOpen(false);
      setFormData({ title: '', universityName: '', category: 'Computer Science', degreeLevel: 'BS', duration: '4 Years', feeStructure: '', eligibilityCriteria: '', courseUrl: '' });
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error(error.response?.data?.message || 'Failed to add course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (courseId, courseTitle) => {
    if (!window.confirm(`Delete "${courseTitle}"? This cannot be undone.`)) return;
    try {
      await deleteCourseAdmin(courseId);
      toast.success('Course deleted');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.universityName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Courses Management</h2>
          <p className="text-sm text-slate-500">Manually add or manage degree programs and courses.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search courses or universities..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div className="text-sm font-medium text-slate-500">
            {filteredCourses.length} / {courses.length} total
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold">Course Title</th>
                <th className="p-4 font-semibold">University</th>
                <th className="p-4 font-semibold">Category/Level</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading courses...
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No courses found.</td>
                </tr>
              ) : (
                filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        {course.title}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-slate-700">{course.universityName}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold mr-2">
                        {course.degreeLevel}
                      </span>
                      <span className="text-slate-500">{course.category}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-600">{course.duration}</span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(course.id, course.title)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Add New Course</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="course-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Course Title *</label>
                    <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="e.g. BS Computer Science" />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">University Name *</label>
                    <input required type="text" name="universityName" value={formData.universityName} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="e.g. NUST" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <option value="Computer Science">Computer Science & IT</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Business">Business & Management</option>
                      <option value="Medical">Medical & Health Sciences</option>
                      <option value="Arts">Arts & Humanities</option>
                      <option value="Sciences">Natural Sciences</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Degree Level</label>
                    <select name="degreeLevel" value={formData.degreeLevel} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <option value="BS">Bachelor's (BS)</option>
                      <option value="MS">Master's (MS/MPhil)</option>
                      <option value="PhD">Doctorate (PhD)</option>
                      <option value="Diploma">Diploma</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Duration</label>
                    <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="e.g. 4 Years" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Official Course URL</label>
                    <input type="url" name="courseUrl" value={formData.courseUrl} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="https://..." />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Fee Structure (Optional)</label>
                    <input type="text" name="feeStructure" value={formData.feeStructure} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="e.g. PKR 150,000 per semester" />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Eligibility Criteria</label>
                    <textarea name="eligibilityCriteria" value={formData.eligibilityCriteria} onChange={handleInputChange} rows="3" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="e.g. Minimum 60% in FSc Pre-Engineering..."></textarea>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button type="submit" form="course-form" disabled={saving} className="px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
