import { lazy, Suspense, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import {
  Menu, X, GraduationCap, BookOpen, Calculator, Mail,
  Bell, Heart, Search, User, LogOut, LogIn, UserPlus, ChevronDown,
} from 'lucide-react';

// ─── Lazy-loaded Pages (Code Splitting) ─────────────────────────
// Public
const GuidanceHub = lazy(() => import('./pages/public/GuidanceHub'));
const CourseDashboard = lazy(() => import('./pages/public/CourseDashboard'));
const CourseDetail = lazy(() => import('./pages/public/CourseDetail'));
const EntryTestDashboard = lazy(() => import('./pages/public/EntryTestDashboard'));
const EntryTestDetail = lazy(() => import('./pages/public/EntryTestDetail'));
const MeritCalculator = lazy(() => import('./pages/public/MeritCalculator'));
const ScholarshipCalculator = lazy(() => import('./pages/public/ScholarshipCalculator'));
const ScholarshipDetail = lazy(() => import('./pages/public/ScholarshipDetail'));
const ContactUs = lazy(() => import('./pages/public/ContactUs'));
const AdmissionsPortal = lazy(() => import('./pages/public/AdmissionsPortal'));

// Auth
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const UnauthorizedPage = lazy(() => import('./pages/auth/UnauthorizedPage'));

// Widgets
const IftiAiWidget = lazy(() => import('./components/ui/IftiAiWidget'));

// Student (protected)
const MyCourses = lazy(() => import('./pages/student/MyCourses'));
const MyFavorites = lazy(() => import('./pages/student/MyFavorites'));
const NotificationCenter = lazy(() => import('./pages/student/NotificationCenter'));

// Admin (admin-protected)
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const DocumentVerification = lazy(() => import('./pages/admin/DocumentVerification'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const SystemSettings = lazy(() => import('./pages/admin/SystemSettings'));
const AiAdmissionsPage = lazy(() => import('./pages/admin/AiAdmissionDashboard?version=2'));
const ApplicationsManagement = lazy(() => import('./pages/admin/ApplicationsManagement'));
const UniversitiesManagement = lazy(() => import('./pages/admin/UniversitiesManagement'));
const CoursesManagement = lazy(() => import('./pages/admin/CoursesManagement'));
const ScholarshipsManagement = lazy(() => import('./pages/admin/ScholarshipsManagement'));
const EntryTestsManagement = lazy(() => import('./pages/admin/EntryTestsManagement'));
const ArticlesManagement = lazy(() => import('./pages/admin/ArticlesManagement'));

// ─── Loading Spinner ─────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}

// ─── Public Navbar (Students & Visitors ONLY — NO Admin) ─────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, logout, loading, isAdmin } = useAuth();

  // Hide navbar on admin pages — admin has its own sidebar
  if (location.pathname.startsWith('/admin')) return null;
  // Hide navbar on auth pages for cleaner UI
  if (['/login', '/register', '/forgot-password'].includes(location.pathname)) return null;

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/admissions', label: 'Admissions' },
    { to: '/courses', label: 'Courses' },
    { to: '/entry-tests', label: 'Entry Tests' },
    { to: '/merit-calculator', label: 'Merit Calc' },
    { to: '/scholarship-calculator', label: 'Scholarships' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-slate-900">
              Uni<span className="text-blue-600">Guide</span><span className="text-slate-400 text-sm font-normal">.pk</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {publicLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === to
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}>
                {label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                {/* Logged-in student actions */}
                <Link to="/student/favorites" className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Saved">
                  <Heart className="w-5 h-5" />
                </Link>
                <Link to="/student/notifications" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Notifications">
                  <Bell className="w-5 h-5" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative ml-1">
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      {(userProfile?.fullName || user.displayName || user.email)?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate hidden xl:block">
                      {userProfile?.fullName || user.displayName || 'Student'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <div className="text-sm font-bold text-slate-900 truncate">
                            {userProfile?.fullName || user.displayName}
                          </div>
                          <div className="text-xs text-slate-500 truncate">{user.email}</div>
                        </div>
                        {isAdmin && isAdmin() && (
                          <Link to="/admin" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
                            <GraduationCap className="w-4 h-4" /> Admin Dashboard
                          </Link>
                        )}
                        <Link to="/student/courses" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                          <BookOpen className="w-4 h-4" /> My Courses
                        </Link>
                        <Link to="/student/favorites" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                          <Heart className="w-4 h-4" /> Saved Items
                        </Link>
                        <Link to="/student/notifications" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                          <Bell className="w-4 h-4" /> Notifications
                        </Link>
                        <hr className="my-1 border-slate-100" />
                        <button onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 w-full text-left">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Guest actions */}
                <Link to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5">
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link to="/register"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4" /> Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-slate-600">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-1 shadow-lg">
          {publicLinks.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${location.pathname === to ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
                }`}>
              {label}
            </Link>
          ))}
          <hr className="border-slate-200 my-2" />
          {user ? (
            <>
              <Link to="/student/favorites" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">❤️ Saved Items</Link>
              <Link to="/student/notifications" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">🔔 Notifications</Link>
              <Link to="/student/courses" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">📚 My Courses</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="block w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-lg font-semibold">
                🚪 Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 rounded-lg font-semibold">🔐 Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-lg text-center mt-1">Create Account</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

// ─── App ─────────────────────────────────────────────────────────
function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isAuth = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Navbar />

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          {!isAdmin && <IftiAiWidget />}
          <Routes>
            {/* ─── Public Routes (Anyone Can View) ─── */}
            <Route path="/" element={<GuidanceHub />} />
            <Route path="/admissions" element={<AdmissionsPortal />} />
            <Route path="/courses" element={<CourseDashboard />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/entry-tests" element={<EntryTestDashboard />} />
            <Route path="/entry-tests/:id" element={<EntryTestDetail />} />
            <Route path="/merit-calculator" element={<MeritCalculator />} />
            <Route path="/scholarship-calculator" element={<ScholarshipCalculator />} />
            <Route path="/scholarship-calculator/:id" element={<ScholarshipDetail />} />
            <Route path="/contact" element={<ContactUs />} />

            {/* ─── Auth Routes ─── */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout /></AdminRoute>} />

            {/* ─── Student Routes (Require Login) ─── */}
            <Route path="/student/courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
            <Route path="/student/favorites" element={<ProtectedRoute><MyFavorites /></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute><NotificationCenter /></ProtectedRoute>} />

            {/* ─── Admin Routes (Require Admin/Super Admin Role) ─── */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="ai-admissions" element={<AiAdmissionsPage />} />
              <Route path="applications" element={<ApplicationsManagement />} />
              <Route path="universities" element={<UniversitiesManagement />} />
              <Route path="courses" element={<CoursesManagement />} />
              <Route path="scholarships" element={<ScholarshipsManagement />} />
              <Route path="entry-tests" element={<EntryTestsManagement />} />
              <Route path="articles" element={<ArticlesManagement />} />
              <Route path="documents" element={<DocumentVerification />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<SystemSettings />} />
            </Route>

            {/* ─── 404 ─── */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="text-8xl font-extrabold text-slate-200 mb-4">404</div>
                <h2 className="text-2xl font-bold text-slate-700 mb-2">Page Not Found</h2>
                <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
                <Link to="/" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">
                  Go Home
                </Link>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>

      {/* Footer — only show on public pages */}
      {!isAdmin && !isAuth && (
        <footer className="bg-slate-900 text-slate-400 py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-1">
                <div className="text-white font-extrabold text-xl mb-2">
                  Uni<span className="text-blue-400">Guide</span><span className="text-slate-500 text-sm font-normal">.pk</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Pakistan's #1 AI-Powered University Admission Guideance Platform
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Explore</h4>
                <div className="space-y-2">
                  <Link to="/admissions" className="block text-sm hover:text-white transition-colors">Admissions</Link>
                  <Link to="/courses" className="block text-sm hover:text-white transition-colors">Courses</Link>
                  <Link to="/scholarship-calculator" className="block text-sm hover:text-white transition-colors">Scholarships</Link>
                  <Link to="/entry-tests" className="block text-sm hover:text-white transition-colors">Entry Tests</Link>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Tools</h4>
                <div className="space-y-2">
                  <Link to="/merit-calculator" className="block text-sm hover:text-white transition-colors">Merit Calculator</Link>
                  <Link to="/" className="block text-sm hover:text-white transition-colors">Guideance Hub</Link>
                  <Link to="/contact" className="block text-sm hover:text-white transition-colors">Contact Us</Link>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Contact</h4>
                <div className="space-y-2 text-sm">
                  <a href="mailto:ifitkharbusiness100@gmail.com" className="block text-blue-400 hover:underline">
                    ifitkharbusiness100@gmail.com
                  </a>
                  <p>Pakistan — Nationwide</p>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
              © 2026 UniGuide.pk — All rights reserved. Built by Syed Iftikhar Shah
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
