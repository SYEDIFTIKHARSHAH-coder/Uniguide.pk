import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublishedAdmissions } from "../../api/adminApi";
import { ExternalLink, Calendar, BookOpen, MapPin, Award, Star, Search, Building2, ShieldCheck, ChevronRight } from "lucide-react";

const getDomain = (url) => {
  if (!url) return null;
  try {
    let hostname = new URL(url).hostname;
    return hostname.startsWith('www.') ? hostname.substring(4) : hostname;
  } catch (e) {
    return null;
  }
};

export default function AdmissionsPortal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");

  const { data: admissions, isLoading } = useQuery({
    queryKey: ["admissions", "published"],
    queryFn: fetchPublishedAdmissions,
  });

  const filtered = (admissions || []).filter(uni => {
    const name = (uni.universityName || uni.name || "").toLowerCase();
    const city = (uni.data?.city || uni.city || "").toLowerCase();
    const programs = (uni.data?.programs || []).join(" ").toLowerCase();
    const sector = uni.data?.sector || uni.sector || "";

    const matchesSearch = !searchTerm ||
      name.includes(searchTerm.toLowerCase()) ||
      city.includes(searchTerm.toLowerCase()) ||
      programs.includes(searchTerm.toLowerCase());

    const matchesSector = sectorFilter === "all" || sector === sectorFilter;

    return matchesSearch && matchesSector;
  });

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>

      {/* ═══════════ HERO ═══════════ */}
      <section style={{
        position: "relative",
        minHeight: "420px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}>
        {/* Background Image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/admissions-hero.png')",
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
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 16px", borderRadius: "20px",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            marginBottom: "20px",
          }}>
            <Building2 size={14} color="#93C5FD" />
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#93C5FD", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              University Admissions
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(30px, 5vw, 48px)", fontWeight: "800",
            color: "#FFFFFF", lineHeight: 1.15, marginBottom: "16px",
            maxWidth: "560px",
          }}>
            Find Your University.<br />Start Your Future.
          </h1>

          <p style={{
            color: "#CBD5E1", fontSize: "16px", lineHeight: 1.7,
            maxWidth: "460px", marginBottom: "24px",
          }}>
            Explore verified admission information from universities across Pakistan, including programs, deadlines, eligibility and application details.
          </p>

          {/* Trust Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "8px 16px", borderRadius: "8px",
            background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
          }}>
            <ShieldCheck size={16} color="#4ADE80" />
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#86EFAC" }}>
              HEC Verified Sources Only
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════ SEARCH + FILTERS ═══════════ */}
      <section style={{
        maxWidth: "1200px", margin: "0 auto",
        padding: "0 32px",
        marginTop: "-32px",
        position: "relative", zIndex: 20,
      }}>
        <div style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          border: "1px solid #E2E8F0",
        }}>
          {/* Search */}
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <Search size={18} color="#94A3B8" style={{
              position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
              pointerEvents: "none",
            }} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search universities, programs or cities..."
              style={{
                width: "100%", boxSizing: "border-box",
                paddingLeft: "48px", paddingRight: "16px",
                paddingTop: "14px", paddingBottom: "14px",
                border: "1.5px solid #E2E8F0", borderRadius: "10px",
                fontSize: "15px", color: "#0F172A", outline: "none",
                background: "#F8FAFC",
                transition: "border-color 0.15s",
              }}
              onFocus={e => e.target.style.borderColor = "#2563EB"}
              onBlur={e => e.target.style.borderColor = "#E2E8F0"}
            />
          </div>

          {/* Sector Filters */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", marginRight: "4px" }}>Filter:</span>
            {["all", "Public", "Private"].map(s => (
              <button
                key={s}
                onClick={() => setSectorFilter(s)}
                style={{
                  padding: "7px 18px", borderRadius: "8px",
                  border: sectorFilter === s ? "1.5px solid #2563EB" : "1.5px solid #E2E8F0",
                  background: sectorFilter === s ? "#EFF6FF" : "#FFFFFF",
                  color: sectorFilter === s ? "#1D4ED8" : "#475569",
                  fontWeight: "600", fontSize: "13px",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {s === "all" ? "All Universities" : s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ RESULTS ═══════════ */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 32px 64px" }}>
        {/* Count */}
        {!isLoading && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>
              Explore Universities
            </h2>
            <span style={{ fontSize: "13px", color: "#64748B" }}>
              {filtered.length} universit{filtered.length !== 1 ? "ies" : "y"}
              {searchTerm ? ` for "${searchTerm}"` : ""}
            </span>
          </div>
        )}

        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: "280px", background: "#E2E8F0", borderRadius: "14px" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "64px 24px",
            background: "#FFFFFF", borderRadius: "14px",
            border: "1px solid #E2E8F0",
          }}>
            <Building2 size={48} color="#CBD5E1" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>
              {searchTerm || sectorFilter !== "all" ? "No matches found" : "No approved admissions yet"}
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "14px", marginBottom: "16px" }}>
              {searchTerm || sectorFilter !== "all"
                ? "Try a different search or filter."
                : "Check back soon — admission data is updated regularly."}
            </p>
            {(searchTerm || sectorFilter !== "all") && (
              <button onClick={() => { setSearchTerm(""); setSectorFilter("all"); }}
                style={{ color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
            {filtered.map(uni => {
              const domain = getDomain(uni.officialWebsite || uni.websiteUrl);
              const logoUrl = uni.imageUrl || (domain ? `https://logo.clearbit.com/${domain}` : null);
              
              return (
              <div key={uni.id} style={{
                background: "#FFFFFF",
                borderRadius: "14px",
                border: "1px solid #E2E8F0",
                overflow: "hidden",
                display: "flex", flexDirection: "column",
                transition: "all 0.2s",
                cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* University Logo / Image Banner */}
                <div style={{
                  height: "70px",
                  background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                  position: "relative",
                  borderBottom: "1px solid #E2E8F0"
                }}>
                  <div style={{
                    position: "absolute",
                    bottom: "-24px",
                    left: "24px",
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "#FFFFFF",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
                  }}>
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt={uni.name || uni.universityName} 
                        style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }} 
                      />
                    ) : null}
                    <div style={{ display: logoUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                      <Building2 size={28} color="#94A3B8" />
                    </div>
                  </div>
                </div>

                <div style={{ padding: "36px 24px 20px", flex: 1 }}>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
                    <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0F172A", lineHeight: 1.3 }}>
                      {uni.universityName || uni.name}
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
                      <span style={{
                        fontSize: "11px", fontWeight: "700",
                        padding: "3px 10px", borderRadius: "6px",
                        background: (uni.data?.sector || uni.sector) === "Public" ? "#EFF6FF" : "#F5F3FF",
                        color: (uni.data?.sector || uni.sector) === "Public" ? "#1D4ED8" : "#7C3AED",
                      }}>
                        {uni.data?.sector || uni.sector || "N/A"}
                      </span>
                      {uni.admissionStatus && (
                        <span style={{
                          fontSize: "10px", fontWeight: "700",
                          padding: "2px 8px", borderRadius: "6px",
                          textTransform: "uppercase", letterSpacing: "0.05em",
                          background: uni.admissionStatus === "open" ? "#F0FDF4" : "#FEF2F2",
                          color: uni.admissionStatus === "open" ? "#16A34A" : "#DC2626",
                          border: `1px solid ${uni.admissionStatus === "open" ? "#BBF7D0" : "#FECACA"}`,
                        }}>
                          {uni.admissionStatus}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                    {(uni.data?.city || uni.city) && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}>
                        <MapPin size={14} color="#94A3B8" />
                        {uni.data?.city || uni.city}
                      </div>
                    )}
                    {(uni.data?.lastDateToApply || uni.deadline) && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#DC2626", fontWeight: "600" }}>
                        <Calendar size={14} />
                        Apply by: {uni.data?.lastDateToApply || uni.deadline}
                      </div>
                    )}
                    {uni.data?.entryTests?.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}>
                        <BookOpen size={14} color="#94A3B8" />
                        {uni.data.entryTests.join(", ")}
                      </div>
                    )}
                    {uni.data?.meritCriteria && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}>
                        <Award size={14} color="#94A3B8" />
                        {uni.data.meritCriteria}
                      </div>
                    )}
                  </div>

                  {/* Programs */}
                  {uni.data?.programs?.length > 0 && (
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#94A3B8", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Programs</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {uni.data.programs.slice(0, 4).map(prog => (
                          <span key={prog} style={{
                            fontSize: "12px", padding: "4px 10px",
                            background: "#F1F5F9", color: "#475569",
                            borderRadius: "6px", fontWeight: "500",
                          }}>{prog}</span>
                        ))}
                        {uni.data.programs.length > 4 && (
                          <span style={{
                            fontSize: "12px", padding: "4px 10px",
                            background: "#EFF6FF", color: "#2563EB",
                            borderRadius: "6px", fontWeight: "600",
                          }}>+{uni.data.programs.length - 4} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div style={{
                  padding: "14px 24px",
                  borderTop: "1px solid #F1F5F9",
                  background: "#FAFBFC",
                  display: "flex", gap: "10px",
                }}>
                  {(uni.admissionPortal || uni.admissionUrl) && (
                    <a href={uni.admissionPortal || uni.admissionUrl} target="_blank" rel="noreferrer"
                      style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                        padding: "10px", borderRadius: "8px",
                        background: "#2563EB", color: "#FFFFFF",
                        fontSize: "13px", fontWeight: "700",
                        textDecoration: "none", transition: "background 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#1D4ED8"}
                      onMouseLeave={e => e.currentTarget.style.background = "#2563EB"}
                    >
                      Apply Now <ExternalLink size={13} />
                    </a>
                  )}
                  {(uni.officialWebsite || uni.websiteUrl) && (
                    <a href={uni.officialWebsite || uni.websiteUrl} target="_blank" rel="noreferrer"
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        padding: "10px 16px", borderRadius: "8px",
                        background: "#FFFFFF", color: "#475569",
                        border: "1.5px solid #E2E8F0",
                        fontSize: "13px", fontWeight: "600",
                        textDecoration: "none", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#2563EB"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                    >
                      Website <ExternalLink size={12} />
                    </a>
                  )}
                  {!uni.admissionPortal && !uni.admissionUrl && !uni.officialWebsite && !uni.websiteUrl && (
                    <span style={{ flex: 1, textAlign: "center", padding: "10px", color: "#94A3B8", fontSize: "13px" }}>Links coming soon</span>
                  )}
                </div>
              </div>
            )})}
          </div>
        )}
      </section>
    </div>
  );
}
