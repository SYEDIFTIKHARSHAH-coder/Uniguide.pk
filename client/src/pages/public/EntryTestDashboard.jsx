import { useState } from "react";
import { useTestList } from "../../hooks/useEntryTestData";
import TestCard from "../../components/ui/TestCard";
import TestCalendar from "../../components/ui/TestCalendar";
import { Search, ClipboardList, X } from "lucide-react";

export default function EntryTestDashboard() {
  const { data: tests, isLoading } = useTestList();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = (tests || []).filter(t =>
    !searchTerm ||
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.organizingBody?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>

      {/* ═══════════ HERO ═══════════ */}
      <section style={{
        position: "relative", minHeight: "380px",
        display: "flex", alignItems: "center", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/entrytests-hero.png')",
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
            <ClipboardList size={14} color="#93C5FD" />
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#93C5FD", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Entry Tests
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(30px, 5vw, 48px)", fontWeight: "800",
            color: "#FFFFFF", lineHeight: 1.15, marginBottom: "16px", maxWidth: "520px",
          }}>
            Prepare for Your University Entry Test
          </h1>

          <p style={{ color: "#CBD5E1", fontSize: "16px", lineHeight: 1.7, maxWidth: "460px" }}>
            Find entry test dates, registration deadlines, universities and preparation information — all in one place.
          </p>
        </div>
      </section>

      {/* ═══════════ SEARCH ═══════════ */}
      <section style={{
        maxWidth: "1200px", margin: "0 auto", padding: "0 32px",
        marginTop: "-32px", position: "relative", zIndex: 20,
      }}>
        <div style={{
          background: "#FFFFFF", borderRadius: "16px", padding: "24px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #E2E8F0",
        }}>
          <div style={{ position: "relative" }}>
            <Search size={18} color="#94A3B8" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search entry tests or universities..."
              style={{
                width: "100%", boxSizing: "border-box",
                paddingLeft: "48px", paddingRight: searchTerm ? "90px" : "16px",
                paddingTop: "14px", paddingBottom: "14px",
                border: "1.5px solid #E2E8F0", borderRadius: "10px",
                fontSize: "15px", color: "#0F172A", outline: "none", background: "#F8FAFC",
                transition: "border-color 0.15s",
              }}
              onFocus={e => e.target.style.borderColor = "#2563EB"}
              onBlur={e => e.target.style.borderColor = "#E2E8F0"}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")}
                style={{
                  position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                  background: "#F1F5F9", border: "none", borderRadius: "6px",
                  padding: "6px 12px", cursor: "pointer",
                  fontSize: "12px", color: "#475569", fontWeight: "600",
                  display: "flex", alignItems: "center", gap: "4px",
                }}
              ><X size={12} /> Clear</button>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ CONTENT ═══════════ */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 32px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>

          {/* LEFT: Tests */}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>
                {searchTerm ? `Results for "${searchTerm}"` : "All Entry Tests"}
              </h2>
              {!isLoading && (
                <span style={{ fontSize: "13px", color: "#64748B" }}>
                  {filtered.length} test{filtered.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {isLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ height: "240px", background: "#E2E8F0", borderRadius: "14px" }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "64px 24px",
                background: "#FFFFFF", borderRadius: "14px", border: "1px solid #E2E8F0",
              }}>
                <ClipboardList size={48} color="#CBD5E1" style={{ margin: "0 auto 16px" }} />
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>
                  {searchTerm ? "No tests match your search" : "No Entry Tests Yet"}
                </h3>
                <p style={{ color: "#94A3B8", fontSize: "14px" }}>
                  {searchTerm ? "Try a different search term." : "Entry tests will appear here once they're added."}
                </p>
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")}
                    style={{ marginTop: "16px", color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
                {filtered.map(test => (
                  <TestCard key={test.id} test={test} />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Calendar */}
          <div style={{ minWidth: 0 }}>
            <TestCalendar />
          </div>
        </div>
      </section>
    </div>
  );
}
