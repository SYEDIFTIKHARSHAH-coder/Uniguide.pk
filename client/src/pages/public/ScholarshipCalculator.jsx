import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Coins, Search, ExternalLink, Calendar, ChevronRight, SlidersHorizontal, X, Award, Users } from "lucide-react";
import axios from "axios";

function safeDate(val) {
  if (!val) return null;
  try {
    const d = new Date(val?.toDate ? val.toDate() : val);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return null;
  }
}

function ScholarshipCard({ scholarship }) {
  const deadline = safeDate(scholarship.deadline);
  const typeColors = {
    merit: { bg: "#EFF6FF", text: "#1D4ED8" },
    need: { bg: "#F0FDF4", text: "#16A34A" },
    "need-based": { bg: "#F0FDF4", text: "#16A34A" },
    government: { bg: "#F5F3FF", text: "#7C3AED" },
    international: { bg: "#FFFBEB", text: "#D97706" },
  };
  const tc = typeColors[scholarship.type?.toLowerCase()] || { bg: "#F1F5F9", text: "#475569" };

  return (
    <div style={{
      background: "#FFFFFF", borderRadius: "14px",
      border: "1px solid #E2E8F0",
      overflow: "hidden", display: "flex", flexDirection: "column",
      transition: "all 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ padding: "24px 24px 20px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
          <div style={{ width: "42px", height: "42px", background: "#FFFBEB", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Coins size={20} color="#D97706" />
          </div>
          {scholarship.type && (
            <span style={{
              fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "6px",
              background: tc.bg, color: tc.text, textTransform: "capitalize",
            }}>
              {scholarship.type.replace(/-/g, " ")}
            </span>
          )}
        </div>

        <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0F172A", lineHeight: 1.3, marginBottom: "4px" }}>
          {scholarship.name}
        </h3>
        {scholarship.provider && (
          <p style={{ fontSize: "13px", color: "#64748B", fontWeight: "500", marginBottom: "12px" }}>{scholarship.provider}</p>
        )}
        {scholarship.description && (
          <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.5, marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {scholarship.description}
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {scholarship.amount && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#16A34A", fontWeight: "600" }}>
              <Award size={14} /> {scholarship.amount}
            </div>
          )}
          {scholarship.minMarks != null && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}>
              <Users size={14} color="#94A3B8" /> Min {scholarship.minMarks}% marks
            </div>
          )}
          {scholarship.incomeLimit != null && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}>
              <Users size={14} color="#94A3B8" /> Max income: PKR {Number(scholarship.incomeLimit).toLocaleString()}
            </div>
          )}
          {deadline && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#DC2626", fontWeight: "600" }}>
              <Calendar size={14} /> Deadline: {deadline}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "14px 24px", borderTop: "1px solid #F1F5F9", background: "#FAFBFC", display: "flex", gap: "8px" }}>
        <Link to={`/scholarship-calculator/${scholarship.id}`}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            padding: "10px", borderRadius: "8px",
            background: "#EFF6FF", color: "#1D4ED8",
            fontSize: "13px", fontWeight: "700", textDecoration: "none",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#DBEAFE"}
          onMouseLeave={e => e.currentTarget.style.background = "#EFF6FF"}
        >
          View Details <ChevronRight size={14} />
        </Link>
        {scholarship.applyLink && (
          <a href={scholarship.applyLink} target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "10px 16px", borderRadius: "8px",
              background: "#2563EB", color: "#FFFFFF",
              fontSize: "13px", fontWeight: "700", textDecoration: "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#1D4ED8"}
            onMouseLeave={e => e.currentTarget.style.background = "#2563EB"}
          >
            Apply <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}

export default function ScholarshipCalculator() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [marksFilter, setMarksFilter] = useState("");
  const [incomeFilter, setIncomeFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    axios.get((import.meta.env.VITE_API_BASE_URL || "") + "/api/scholarships")
      .then(r => setScholarships(r.data.data || []))
      .catch(() => setScholarships([]))
      .finally(() => setLoading(false));
  }, []);

  const hasActiveFilters = marksFilter || incomeFilter || typeFilter !== "all";

  const filtered = scholarships.filter(sch => {
    const matchesSearch = !searchTerm ||
      sch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const marks = marksFilter ? Number(marksFilter) : null;
    const matchesMarks = marks === null || (sch.minMarks == null || marks >= sch.minMarks);
    const income = incomeFilter ? Number(incomeFilter) : null;
    const matchesIncome = income === null || (sch.incomeLimit == null || income <= sch.incomeLimit);
    const matchesType = typeFilter === "all" || sch.type?.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesMarks && matchesIncome && matchesType;
  });

  const uniqueTypes = [...new Set(scholarships.map(s => s.type).filter(Boolean))];

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>

      {/* ═══════════ HERO ═══════════ */}
      <section style={{
        position: "relative", minHeight: "380px",
        display: "flex", alignItems: "center", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/scholarships-hero.png')",
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(115deg, rgba(15,23,42,0.92) 0%, rgba(30,64,175,0.78) 50%, rgba(15,23,42,0.45) 100%)",
        }} />

        <div style={{
          position: "relative", zIndex: 10,
          maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "56px 32px",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 16px", borderRadius: "20px",
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
            marginBottom: "20px",
          }}>
            <Award size={14} color="#93C5FD" />
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#93C5FD", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Financial Aid
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(30px, 5vw, 48px)", fontWeight: "800",
            color: "#FFFFFF", lineHeight: 1.15, marginBottom: "16px", maxWidth: "520px",
          }}>
            Find Scholarships That Support Your Education
          </h1>

          <p style={{ color: "#CBD5E1", fontSize: "16px", lineHeight: 1.7, maxWidth: "460px" }}>
            Explore scholarship opportunities and financial support available to eligible students across Pakistan.
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
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search scholarships by name or provider..."
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

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={() => setShowFilters(!showFilters)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "7px 16px", borderRadius: "8px",
                border: showFilters || hasActiveFilters ? "1.5px solid #2563EB" : "1.5px solid #E2E8F0",
                background: showFilters || hasActiveFilters ? "#EFF6FF" : "#FFFFFF",
                color: showFilters || hasActiveFilters ? "#1D4ED8" : "#475569",
                fontWeight: "600", fontSize: "13px", cursor: "pointer",
              }}
            >
              <SlidersHorizontal size={14} /> Filters {hasActiveFilters && "(active)"}
            </button>

            {uniqueTypes.map(type => (
              <button key={type} onClick={() => setTypeFilter(typeFilter === type ? "all" : type)}
                style={{
                  padding: "6px 14px", borderRadius: "6px",
                  border: typeFilter === type ? "1.5px solid #2563EB" : "1.5px solid #E2E8F0",
                  background: typeFilter === type ? "#2563EB" : "#FFFFFF",
                  color: typeFilter === type ? "#FFFFFF" : "#475569",
                  fontSize: "12px", fontWeight: "600", cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >{type.replace(/-/g, " ")}</button>
            ))}

            {!loading && (
              <span style={{ marginLeft: "auto", fontSize: "13px", color: "#64748B" }}>
                {filtered.length} scholarship{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {showFilters && (
          <div style={{
            background: "#FFFFFF", border: "1px solid #E2E8F0",
            borderRadius: "14px", padding: "24px", marginTop: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Eligibility Filters</h3>
              {hasActiveFilters && (
                <button onClick={() => { setMarksFilter(""); setIncomeFilter(""); setTypeFilter("all"); }}
                  style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#DC2626", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}>
                  <X size={12} /> Clear all
                </button>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                  Academic Score (%) <span style={{ color: "#94A3B8", fontWeight: "400" }}>— optional</span>
                </label>
                <input type="number" min="0" max="100" value={marksFilter} onChange={e => setMarksFilter(e.target.value)}
                  placeholder="e.g. 75"
                  style={{
                    width: "100%", boxSizing: "border-box", padding: "11px 14px",
                    border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "14px",
                    color: "#0F172A", outline: "none", background: "#F8FAFC",
                  }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                  Monthly Family Income (PKR) <span style={{ color: "#94A3B8", fontWeight: "400" }}>— optional</span>
                </label>
                <input type="number" min="0" value={incomeFilter} onChange={e => setIncomeFilter(e.target.value)}
                  placeholder="e.g. 40000"
                  style={{
                    width: "100%", boxSizing: "border-box", padding: "11px 14px",
                    border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "14px",
                    color: "#0F172A", outline: "none", background: "#F8FAFC",
                  }} />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ═══════════ RESULTS ═══════════ */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 32px 64px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ height: "260px", background: "#E2E8F0", borderRadius: "14px" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "64px 24px",
            background: "#FFFFFF", borderRadius: "14px", border: "1px solid #E2E8F0",
          }}>
            <Coins size={48} color="#CBD5E1" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>
              {scholarships.length === 0 ? "No Scholarships Added Yet" : "No Matches Found"}
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "14px", maxWidth: "360px", margin: "0 auto" }}>
              {scholarships.length === 0
                ? "Scholarships will appear here once they're added. Check back soon!"
                : "Try adjusting your search or filters."}
            </p>
            {(searchTerm || hasActiveFilters) && (
              <button onClick={() => { setSearchTerm(""); setMarksFilter(""); setIncomeFilter(""); setTypeFilter("all"); }}
                style={{ marginTop: "16px", color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {filtered.map(sch => (
              <ScholarshipCard key={sch.id} scholarship={sch} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
