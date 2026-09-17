import { useLatestGuides } from "../../hooks/useGuidanceData";
import ArticleCard from "../../components/ui/ArticleCard";
import { Link } from "react-router-dom";
import {
  Building2, FileText, BookOpen, ClipboardList, Award,
  Calculator, Briefcase, ArrowRight, CheckCircle,
  Zap, ShieldCheck, Users, GraduationCap, TrendingUp, Star
} from "lucide-react";

// ─── Quick Access Cards ───────────────────────────────────────────
const QUICK_ACCESS = [
  {
    icon: Building2,
    title: "Universities",
    desc: "Explore top universities in Pakistan",
    to: "/admissions",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    icon: FileText,
    title: "Admissions",
    desc: "Check admission details, deadlines & eligibility",
    to: "/admissions",
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    icon: BookOpen,
    title: "Courses",
    desc: "Discover degree programs & subjects",
    to: "/courses",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: ClipboardList,
    title: "Entry Tests",
    desc: "Prepare for entry tests & test dates",
    to: "/entry-tests",
    color: "#EA580C",
    bg: "#FFF7ED",
  },
  {
    icon: Award,
    title: "Scholarships",
    desc: "Find scholarships & financial aid",
    to: "/scholarship-calculator",
    color: "#DC2626",
    bg: "#FEF2F2",
  },
  {
    icon: Calculator,
    title: "Merit Calculator",
    desc: "Calculate your merit & chances",
    to: "/merit-calculator",
    color: "#0891B2",
    bg: "#ECFEFF",
  },
  {
    icon: Briefcase,
    title: "Career Guidance",
    desc: "Get expert career advice & field recommendations",
    to: "/guidance",
    color: "#9333EA",
    bg: "#FAF5FF",
  },
];

// ─── Why UniGuide Features ────────────────────────────────────────
const WHY_FEATURES = [
  {
    icon: Zap,
    title: "Up-to-Date Information",
    desc: "Get the latest updates on admissions, deadlines and more.",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    icon: ShieldCheck,
    title: "Trusted & Reliable",
    desc: "Accurate information from official courses and trusted universities.",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    icon: Users,
    title: "Student Focused",
    desc: "Built for Pakistani students by people who understand your needs.",
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    icon: GraduationCap,
    title: "Expert Guidance",
    desc: "Get career and academic advice from experienced counselors.",
    color: "#DC2626",
    bg: "#FEF2F2",
  },
];

// ─── Statistics ───────────────────────────────────────────────────
const STATS = [
  { icon: Building2, label: "Universities", value: "200+", color: "#2563EB" },
  { icon: FileText, label: "Admission Programs", value: "5,000+", color: "#16A34A" },
  { icon: Award, label: "Scholarships", value: "100+", color: "#DC2626" },
  { icon: BookOpen, label: "Students Guided", value: "50,000+", color: "#7C3AED" },
  { icon: Star, label: "Satisfaction Rate", value: "98%", color: "#EA580C" },
];

export default function GuidanceHub() {
  const { data: latestGuides, isLoading } = useLatestGuides();

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section
        style={{
          position: "relative",
          height: "480px",
          backgroundImage: "url('/campus-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          overflow: "hidden",
        }}
      >
        {/* Gradient overlay — lighter on right so campus photo shows */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.55) 55%, rgba(15,23,42,0.15) 100%)",
        }} />

        {/* Hero Content */}
        <div style={{
          position: "relative", zIndex: 10,
          maxWidth: "1200px", margin: "0 auto",
          padding: "0 24px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
          {/* Small badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{ width: "28px", height: "2px", background: "#60A5FA" }} />
            <span style={{ color: "#93C5FD", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em" }}>
              Your Future Starts Here
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: "800",
            color: "#FFFFFF",
            lineHeight: "1.15",
            marginBottom: "20px",
            maxWidth: "560px",
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}>
            Your Gateway to<br />University Success
          </h1>

          <p style={{
            color: "#CBD5E1",
            fontSize: "clamp(14px, 2vw, 17px)",
            lineHeight: "1.7",
            maxWidth: "480px",
            marginBottom: "32px",
          }}>
            Discover universities, explore admission requirements,
            find the right courses, scholarships and get expert career
            guidance — all in one place.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/admissions" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#2563EB",
              color: "#FFFFFF",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "15px",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1D4ED8"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#2563EB"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <Building2 size={18} />
              Explore Universities
            </Link>
            <Link to="/register" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.12)",
              border: "2px solid rgba(255,255,255,0.5)",
              color: "#FFFFFF",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "15px",
              textDecoration: "none",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ QUICK ACCESS ═══════════ */}
      <section style={{ background: "#FFFFFF", padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>
              Quick Access
            </h2>
            <p style={{ color: "#64748B", fontSize: "15px" }}>
              Find everything you need for your academic journey in one place.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))",
            gap: "16px",
          }}>
            {QUICK_ACCESS.map(({ icon: Icon, title, desc, to, color, bg }) => (
              <Link key={to + title} to={to} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  padding: "20px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  height: "100%",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.1)`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#E2E8F0";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "10px",
                    background: bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={22} color={color} />
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "14px", color: "#0F172A", marginBottom: "4px" }}>
                      {title}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748B", lineHeight: "1.5" }}>{desc}</div>
                  </div>
                  <div style={{ marginTop: "auto" }}>
                    <ArrowRight size={14} color={color} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ LATEST ARTICLES ═══════════ */}
      <section style={{ background: "#F8FAFC", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", marginBottom: "32px",
            flexWrap: "wrap", gap: "12px",
          }}>
            <div>
              <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>
                Latest Articles
              </h2>
              <p style={{ color: "#64748B", fontSize: "15px" }}>
                Fresh insights to boost your career and academic success.
              </p>
            </div>
            <Link to="/guidance" style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              color: "#2563EB", fontWeight: "600", fontSize: "14px",
              textDecoration: "none",
              padding: "8px 0",
            }}
              onMouseEnter={e => e.currentTarget.style.gap = "10px"}
              onMouseLeave={e => e.currentTarget.style.gap = "6px"}
            >
              View All Articles <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{
                  height: "320px", background: "#E2E8F0",
                  borderRadius: "12px", animation: "pulse 1.5s infinite"
                }} />
              ))}
            </div>
          ) : latestGuides?.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {latestGuides.slice(0, 5).map(guide => (
                <ArticleCard key={guide.id} article={guide} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center", padding: "48px",
              color: "#94A3B8", background: "#FFFFFF",
              borderRadius: "12px", border: "1px solid #E2E8F0",
            }}>
              <BookOpen size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
              <p>Articles are being loaded...</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ STATISTICS ═══════════ */}
      <section style={{ background: "#FFFFFF", padding: "48px 24px", borderTop: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "24px",
          }}>
            {STATS.map(({ icon: Icon, label, value, color }) => (
              <div key={label} style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: "10px",
                padding: "24px 16px",
                borderRadius: "12px",
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                textAlign: "center",
              }}>
                <Icon size={28} color={color} />
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#0F172A" }}>{value}</div>
                <div style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHY UNIGUIDE.PK ═══════════ */}
      <section style={{ background: "#F8FAFC", padding: "56px 24px 64px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>
              Why UniGuide.pk?
            </h2>
            <p style={{ color: "#64748B", fontSize: "15px" }}>
              We make your academic journey easier, simpler and smarter.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}>
            {WHY_FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "14px",
                padding: "28px 24px",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}>
                <div style={{
                  width: "46px", height: "46px",
                  borderRadius: "12px", background: bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon size={24} color={color} />
                </div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "15px", color: "#0F172A", marginBottom: "6px" }}>
                    {title}
                  </div>
                  <div style={{ fontSize: "13px", color: "#64748B", lineHeight: "1.6" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
