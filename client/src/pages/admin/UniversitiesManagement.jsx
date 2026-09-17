import { useState, useEffect } from 'react';
import { Plus, Building, Search, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateUniversityStatus, updateAdmissionStatus, fetchUniversitiesForAdmin, createUniversity } from '../../api/adminApi';

export default function UniversitiesManagement() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    province: '',
    city: '',
    hecRanking: '',
    sector: 'Public',
    websiteUrl: '',
    admissionUrl: '',
    description: ''
  });
  const [saving, setSaving] = useState(false);

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const data = await fetchUniversitiesForAdmin("all");
      setUniversities(data);
    } catch (error) {
      console.error('Error fetching universities:', error);
      toast.error('Failed to load universities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.province) {
      toast.error('Name and Province are required.');
      return;
    }

    setSaving(true);
    try {
      await createUniversity({
        ...formData,
        status: 'approved',
        admissionStatus: 'open',
        manualEntry: true
      });
      
      toast.success('University added successfully!');
      setIsModalOpen(false);
      setFormData({ name: '', province: '', city: '', hecRanking: '', sector: 'Public', websiteUrl: '', admissionUrl: '', description: '' });
      fetchUniversities();
    } catch (error) {
      console.error('Error adding university:', error);
      toast.error(error.response?.data?.message || 'Failed to add university');
    } finally {
      setSaving(false);
    }
  };

  const filteredUnis = universities.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.province?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateUniversityStatus(id, newStatus);
      toast.success(`University marked as ${newStatus}`);
      fetchUniversities();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAdmissionStatusUpdate = async (id, newStatus) => {
    try {
      await updateAdmissionStatus(id, newStatus);
      toast.success(`Admission marked as ${newStatus}`);
      fetchUniversities();
    } catch (error) {
      toast.error('Failed to update admission status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Universities Management</h2>
          <p className="text-sm text-slate-500">Manually add or manage universities outside of AI automation.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add University
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search universities..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div className="text-sm font-medium text-slate-500">
            {filteredUnis.length} / {universities.length} total
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold">University Name</th>
                <th className="p-4 font-semibold">Province/City</th>
                <th className="p-4 font-semibold">Admissions</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading universities...
                  </td>
                </tr>
              ) : filteredUnis.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500 font-medium">No universities found.</td>
                </tr>
              ) : (
                filteredUnis.map(uni => (
                  <tr key={uni.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <Building className="w-4 h-4 text-blue-600" />
                        {uni.name}
                      </div>
                      {uni.websiteUrl && <a href={uni.websiteUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">{uni.websiteUrl}</a>}
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{uni.province}</span>
                      {uni.city && <span className="text-slate-500"> • {uni.city}</span>}
                    </td>
                    <td className="p-4">
                      {uni.admissionStatus === 'open' ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1 w-max">
                          <CheckCircle className="w-3 h-3" /> Open
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-md text-xs font-bold flex items-center gap-1 w-max">
                          <XCircle className="w-3 h-3" /> Closed
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {uni.status === 'pending' && <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Pending</span>}
                      {uni.status === 'approved' && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3" /> Approved</span>}
                      {uni.status === 'rejected' && <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><XCircle className="w-3 h-3" /> Rejected</span>}
                      {!uni.status && <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-md text-xs font-bold flex items-center gap-1 w-max">Unset</span>}
                    </td>
                    <td className="p-4 flex flex-col gap-2">
                      <div className="flex gap-2">
                        {uni.admissionStatus !== 'open' && (
                          <button onClick={() => handleAdmissionStatusUpdate(uni.id, 'open')} className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-2 py-1 rounded">Set Open</button>
                        )}
                        {uni.admissionStatus !== 'closed' && (
                          <button onClick={() => handleAdmissionStatusUpdate(uni.id, 'closed')} className="text-xs bg-rose-50 text-rose-600 hover:bg-rose-100 px-2 py-1 rounded">Set Closed</button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {uni.status !== 'approved' && (
                          <button onClick={() => handleStatusUpdate(uni.id, 'approved')} className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded">Approve</button>
                        )}
                        {uni.status !== 'rejected' && (
                          <button onClick={() => handleStatusUpdate(uni.id, 'rejected')} className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 px-2 py-1 rounded">Reject</button>
                        )}
                      </div>
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
              <h3 className="text-xl font-bold text-slate-900">Add New University</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="uni-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">University Name *</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="e.g. National University of Sciences & Technology" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Province *</label>
                    <select required name="province" value={formData.province} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <option value="">Select Province</option>
                      <option value="Federal">Federal (Islamabad)</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="KPK">Khyber Pakhtunkhwa</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                      <option value="AJK">AJK</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="e.g. Islamabad" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Sector</label>
                    <select name="sector" value={formData.sector} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">HEC Ranking (Optional)</label>
                    <input type="text" name="hecRanking" value={formData.hecRanking} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="e.g. #1 in Engineering" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Official Website URL</label>
                    <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="https://..." />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Admissions Portal URL</label>
                    <input type="url" name="admissionUrl" value={formData.admissionUrl} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="https://..." />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Short Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="Brief introduction about the university..."></textarea>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button type="submit" form="uni-form" disabled={saving} className="px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Building className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save University'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
