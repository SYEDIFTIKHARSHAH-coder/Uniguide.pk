import { useState } from "react";
import { useCourseList } from "../../hooks/useCourseData";
import CourseCard from "../../components/ui/CourseCard";
import { Search, GraduationCap, BookOpen } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Courses" },
  { id: "admission_preparation", label: "Admission Prep" },
  { id: "study_skills", label: "Study Skills" },
  { id: "soft_skills", label: "Soft Skills" },
  { id: "career_development", label: "Career Development" },
];

export default function CourseDashboard() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: courses, isLoading } = useCourseList(activeCategory);

  const filtered = courses?.filter(c =>
    (c.title || "").toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>

      {/* ═══════════ HERO ═══════════ */}
      <section style={{
        position: "relative",
        minHeight: "380px",
        display: "flex", alignItems: "center",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/courses-hero.png')",
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(115deg, rgba(15,23,42,0.92) 0%, rgba(30,64,175,0.78) 50%, rgba(15,23,42,0.45) 100%)",
        }} />

        <div style={{
          position: "relative", zIndex: 10,
          maxWidth: "1200px", width: "100%", margin: "0 auto",
          padding: "56px 32px",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 16px", borderRadius: "20px",
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
            marginBottom: "20px",
          }}>
            <GraduationCap size={14} color="#93C5FD" />
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#93C5FD", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Learning Hub
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(30px, 5vw, 48px)", fontWeight: "800",
            color: "#FFFFFF", lineHeight: 1.15, marginBottom: "16px", maxWidth: "520px",
          }}>
            Explore Programs That Match Your Future
          </h1>

          <p style={{ color: "#CBD5E1", fontSize: "16px", lineHeight: 1.7, maxWidth: "460px" }}>
            Discover degree programs, academic fields and study opportunities to prepare for admissions and launch your career.
          </p>
        </div>
      </section>

      {/* ═══════════ SEARCH + FILTERS ═══════════ */}
      <section style={{
        maxWidth: "1200px", margin: "0 auto", padding: "0 32px",
        marginTop: "-32px", position: "relative", zIndex: 20,
      }}>
        <div style={{
          background: "#FFFFFF", borderRadius: "16px", padding: "24px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #E2E8F0",
        }}>
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <Search size={18} color="#94A3B8" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search courses or degree programs..."
              style={{
                width: "100%", boxSizing: "border-box",
                paddingLeft: "48px", paddingRight: "16px", paddingTop: "14px", paddingBottom: "14px",
                border: "1.5px solid #E2E8F0", borderRadius: "10px",
                fontSize: "15px", color: "#0F172A", outline: "none", background: "#F8FAFC",
                transition: "border-color 0.15s",
              }}
              onFocus={e => e.target.style.borderColor = "#2563EB"}
              onBlur={e => e.target.style.borderColor = "#E2E8F0"}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: "7px 18px", borderRadius: "8px",
                  border: activeCategory === cat.id ? "1.5px solid #2563EB" : "1.5px solid #E2E8F0",
                  background: activeCategory === cat.id ? "#EFF6FF" : "#FFFFFF",
                  color: activeCategory === cat.id ? "#1D4ED8" : "#475569",
                  fontWeight: "600", fontSize: "13px", cursor: "pointer", transition: "all 0.15s",
                }}
              >{cat.label}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ COURSE GRID ═══════════ */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 32px 64px" }}>
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ height: "300px", background: "#E2E8F0", borderRadius: "14px" }} />
            ))}
          </div>
        ) : filtered?.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
            {filtered.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: "64px 24px",
            background: "#FFFFFF", borderRadius: "14px", border: "1px solid #E2E8F0",
          }}>
            <BookOpen size={48} color="#CBD5E1" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>No courses found</h3>
            <p style={{ color: "#94A3B8", fontSize: "14px" }}>Try a different category or search term.</p>
          </div>
        )}
      </section>
    </div>
  );
}
