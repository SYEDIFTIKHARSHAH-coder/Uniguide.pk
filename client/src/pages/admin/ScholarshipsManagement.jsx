import { useState, useEffect } from 'react';
import { Plus, Coins, Search, Loader2, Trash2, Pencil, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  fetchScholarshipsForAdmin,
  createScholarshipAdmin,
  updateScholarshipAdmin,
  deleteScholarshipAdmin
} from '../../api/adminApi';

const EMPTY_FORM = {
  name: '',
  type: 'merit',
  minMarks: 60,
  incomeLimit: '',
};

export default function ScholarshipsManagement() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchScholarshipsForAdmin();
      setScholarships(data || []);
    } catch (err) {
      toast.error('Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (s) => {
    setEditingId(s.id);
    setFormData({
      name: s.name || '',
      type: s.type || 'merit',
      minMarks: s.minMarks ?? 60,
      incomeLimit: s.incomeLimit === Infinity || s.incomeLimit == null ? '' : s.incomeLimit,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        type: formData.type,
        minMarks: Number(formData.minMarks),
        incomeLimit: formData.incomeLimit === '' ? null : Number(formData.incomeLimit),
      };
      if (editingId) {
        await updateScholarshipAdmin(editingId, payload);
        toast.success('Scholarship updated!');
      } else {
        await createScholarshipAdmin(payload);
        toast.success('Scholarship added!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save scholarship');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteScholarshipAdmin(id);
      toast.success('Scholarship deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = scholarships.filter(s =>
    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Scholarships Management</h2>
          <p className="text-sm text-slate-500">Add and manage scholarships shown on the public Scholarships page.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Scholarship
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search scholarships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div className="text-sm font-medium text-slate-500">{filtered.length} / {scholarships.length} total</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold">Scholarship Name</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Min. Marks (%)</th>
                <th className="p-4 font-semibold">Max Income (PKR)</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No scholarships found. Add one above!</td></tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <Coins className="w-4 h-4 text-amber-500" />{s.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${s.type === 'merit' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {s.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700">{s.minMarks}%</td>
                    <td className="p-4 text-slate-700">{s.incomeLimit == null ? 'No Limit' : `PKR ${Number(s.incomeLimit).toLocaleString()}`}</td>
                    <td className="p-4 flex items-center gap-2">
                      <button onClick={() => openEdit(s)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(s.id, s.name)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Scholarship' : 'Add New Scholarship'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form id="scholarship-form" onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Scholarship Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="e.g. HEC Need-Based Scholarship" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <option value="merit">Merit-Based</option>
                    <option value="need">Need-Based</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Minimum Marks (%)</label>
                  <input type="number" min="0" max="100" required value={formData.minMarks}
                    onChange={e => setFormData(p => ({ ...p, minMarks: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Max Household Income (PKR) <span className="text-slate-400 font-normal">— leave blank for no limit</span></label>
                <input type="number" min="0" value={formData.incomeLimit}
                  onChange={e => setFormData(p => ({ ...p, incomeLimit: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="e.g. 50000" />
              </div>
            </form>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
              <button type="submit" form="scholarship-form" disabled={saving} className="px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Scholarship'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
