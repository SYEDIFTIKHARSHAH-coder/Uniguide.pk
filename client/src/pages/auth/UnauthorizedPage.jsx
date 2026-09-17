import { Link, useNavigate } from 'react-router-dom';
import { Shield, Home, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UnauthorizedPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleSwitchAccount = async () => {
    if (user) {
      await logout();
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-rose-100/30 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 relative z-10 text-center">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-rose-50 mb-6">
          <Shield className="h-10 w-10 text-rose-500" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Access Denied</h2>
        
        <p className="text-slate-500 mb-8 leading-relaxed">
          You do not have permission to view this page. This area is restricted to administrators and authorized personnel only.
        </p>

        <div className="space-y-3">
          <Link
            to="/"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all"
          >
            <Home className="w-4 h-4 mr-2" /> Go to Home
          </Link>
          
          <button
            onClick={handleSwitchAccount}
            className="w-full flex justify-center items-center py-3 px-4 border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all"
          >
            <LogIn className="w-4 h-4 mr-2" /> Login with Different Account
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center relative z-10">
        <Link to="/" className="text-xl font-extrabold text-slate-900 tracking-tight opacity-50 hover:opacity-100 transition-opacity">
          Uni<span className="text-blue-600">Guid</span>.pk
        </Link>
      </div>
    </div>
  );
}
