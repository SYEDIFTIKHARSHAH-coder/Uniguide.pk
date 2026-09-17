import { useState, useEffect } from 'react';
import { Plus, FileText, Search, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchArticlesForAdmin, createArticle } from '../../api/adminApi';

export default function ArticlesManagement() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Career Guide',
    excerpt: '',
    content: '',
    author: 'Admin',
    thumbnailUrl: ''
  });
  const [saving, setSaving] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await fetchArticlesForAdmin();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Title and Content are required.');
      return;
    }

    setSaving(true);
    try {
      await createArticle(formData);
      
      toast.success('Article added successfully!');
      setIsModalOpen(false);
      setFormData({ title: '', category: 'Career Guide', excerpt: '', content: '', author: 'Admin', thumbnailUrl: '' });
      fetchArticles();
    } catch (error) {
      console.error('Error adding article:', error);
      toast.error(error.response?.data?.message || 'Failed to add article');
    } finally {
      setSaving(false);
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Articles & Guides Management</h2>
          <p className="text-sm text-slate-500">Manually publish articles, career guides, and admission tips.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Publish Article
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div className="text-sm font-medium text-slate-500">
            {filteredArticles.length} / {articles.length} total
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold">Article Title</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Author</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading articles...
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-slate-500 font-medium">No articles found.</td>
                </tr>
              ) : (
                filteredArticles.map(article => (
                  <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        {article.title}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-sm mt-1">{article.excerpt}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold mr-2">
                        {article.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-600">{article.author || 'Admin'}</span>
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
              <h3 className="text-xl font-bold text-slate-900">Publish New Article</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="article-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Article Title *</label>
                    <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="e.g. How to pass NUST Entry Test" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Category *</label>
                    <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <option value="Career Guide">Career Guide</option>
                      <option value="Degree Guide">Degree Guide</option>
                      <option value="University Guide">University Guide</option>
                      <option value="Admission Tips">Admission Tips</option>
                      <option value="News & Updates">News & Updates</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Author Name</label>
                    <input type="text" name="author" value={formData.author} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="e.g. Admin" />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Photo URL (Thumbnail)</label>
                    <input type="url" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="e.g. https://example.com/image.jpg" />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Short Excerpt</label>
                    <textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} rows="2" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="Brief summary of the article..."></textarea>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Main Content *</label>
                    <textarea required name="content" value={formData.content} onChange={handleInputChange} rows="8" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm" placeholder="Write article content here (Markdown supported if implemented)..."></textarea>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button type="submit" form="article-form" disabled={saving} className="px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                {saving ? 'Publishing...' : 'Publish Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
