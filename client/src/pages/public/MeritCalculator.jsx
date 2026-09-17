import { useState } from "react";
import { Calculator, ChevronRight, CheckCircle, TrendingUp } from "lucide-react";

export default function MeritCalculator() {
  const [scores, setScores] = useState({
    matricObtained: "", matricTotal: 1100, matricWeight: 10,
    interObtained: "", interTotal: 1100, interWeight: 40,
    testObtained: "", testTotal: 200, testWeight: 50,
  });

  const [aggregate, setAggregate] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    const { matricObtained, matricTotal, matricWeight, interObtained, interTotal, interWeight, testObtained, testTotal, testWeight } = scores;
    if (Number(matricWeight) + Number(interWeight) + Number(testWeight) !== 100) {
      alert("Weights must sum up to exactly 100%");
      return;
    }
    const matricPerc = (Number(matricObtained) / Number(matricTotal)) * Number(matricWeight);
    const interPerc = (Number(interObtained) / Number(interTotal)) * Number(interWeight);
    const testPerc = (Number(testObtained) / Number(testTotal)) * Number(testWeight);
    const total = matricPerc + interPerc + testPerc;
    setAggregate(total.toFixed(4));
  };

  const handleInputChange = (field, value) => {
    setScores(prev => ({ ...prev, [field]: value }));
  };

  const totalWeight = Number(scores.matricWeight) + Number(scores.interWeight) + Number(scores.testWeight);
  const weightValid = totalWeight === 100;

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    padding: "11px 14px",
    border: "1.5px solid #E2E8F0", borderRadius: "10px",
    fontSize: "14px", color: "#0F172A", outline: "none",
    background: "#F8FAFC", transition: "border-color 0.15s",
  };

  const labelStyle = {
    display: "block", fontSize: "13px", fontWeight: "600",
    color: "#475569", marginBottom: "6px",
  };

  const sections = [
    { num: "1", title: "Matriculation / O-Levels", prefix: "matric" },
    { num: "2", title: "Intermediate / A-Levels", prefix: "inter" },
    { num: "3", title: "Entry Test (MDCAT / ECAT / NET)", prefix: "test" },
  ];

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>

      {/* ═══════════ HERO ═══════════ */}
      <section style={{
        background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #3B82F6 100%)",
        color: "#FFFFFF", padding: "56px 32px", textAlign: "center",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 16px", borderRadius: "20px",
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
            marginBottom: "20px",
          }}>
            <Calculator size={14} color="#93C5FD" />
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#93C5FD", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Academic Tool
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: "800", marginBottom: "14px", lineHeight: 1.2 }}>
            Calculate Your Admission Merit
          </h1>
          <p style={{ fontSize: "16px", color: "#BFDBFE", lineHeight: 1.7 }}>
            Estimate your merit using your academic scores and entry-test information with custom university weightages.
          </p>
        </div>
      </section>

      {/* ═══════════ CALCULATOR ═══════════ */}
      <section style={{ maxWidth: "780px", margin: "0 auto", padding: "0 24px", marginTop: "-28px", position: "relative", zIndex: 10 }}>
        <div style={{
          background: "#FFFFFF", borderRadius: "18px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #E2E8F0",
          overflow: "hidden",
        }}>
          <form onSubmit={handleCalculate}>

            {/* Header */}
            <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TrendingUp size={18} color="#2563EB" />
                </div>
                <div>
                  <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#0F172A", margin: 0 }}>Academic Information</h2>
                  <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0 }}>Enter your marks and university-specific weightages</p>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div style={{ padding: "24px 28px" }}>
              {sections.map(({ num, title, prefix }) => (
                <div key={prefix} style={{
                  marginBottom: "24px", paddingBottom: "24px",
                  borderBottom: prefix !== "test" ? "1px solid #F1F5F9" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <div style={{
                      width: "24px", height: "24px", borderRadius: "6px",
                      background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: "800", color: "#2563EB",
                    }}>{num}</div>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", margin: 0 }}>{title}</h3>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                    <div>
                      <label style={labelStyle}>Obtained Marks</label>
                      <input type="number" required min="0" max={scores[`${prefix}Total`]}
                        value={scores[`${prefix}Obtained`]}
                        onChange={e => handleInputChange(`${prefix}Obtained`, e.target.value)}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = "#2563EB"}
                        onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                    </div>
                    <div>
                      <label style={labelStyle}>Total Marks</label>
                      <input type="number" required min="1"
                        value={scores[`${prefix}Total`]}
                        onChange={e => handleInputChange(`${prefix}Total`, e.target.value)}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = "#2563EB"}
                        onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                    </div>
                    <div>
                      <label style={labelStyle}>Weightage (%)</label>
                      <input type="number" required min="0" max="100"
                        value={scores[`${prefix}Weight`]}
                        onChange={e => handleInputChange(`${prefix}Weight`, e.target.value)}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = "#2563EB"}
                        onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              padding: "20px 28px",
              borderTop: "1px solid #F1F5F9",
              background: "#FAFBFC",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              flexWrap: "wrap", gap: "16px",
            }}>
              <div>
                <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "2px" }}>Total Weight</div>
                <div style={{
                  fontSize: "20px", fontWeight: "800",
                  color: weightValid ? "#16A34A" : totalWeight > 100 ? "#DC2626" : "#EA580C",
                }}>
                  {totalWeight}%
                  <span style={{ fontSize: "12px", fontWeight: "500", marginLeft: "6px" }}>
                    {weightValid ? "✓ Valid" : "Must equal 100%"}
                  </span>
                </div>
              </div>
              <button type="submit" style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "#2563EB", color: "#FFFFFF",
                padding: "13px 28px", borderRadius: "10px",
                border: "none", cursor: "pointer",
                fontSize: "14px", fontWeight: "700",
                boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                transition: "all 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#1D4ED8"}
                onMouseLeave={e => e.currentTarget.style.background = "#2563EB"}
              >
                Calculate Merit <ChevronRight size={16} />
              </button>
            </div>
          </form>

          {/* ── RESULT ── */}
          {aggregate !== null && (
            <div style={{
              background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
              borderTop: "2px solid #86EFAC",
              padding: "40px 28px", textAlign: "center",
            }}>
              <CheckCircle size={36} color="#16A34A" style={{ margin: "0 auto 12px" }} />
              <div style={{ fontSize: "13px", color: "#15803D", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Your Calculated Aggregate
              </div>
              <div style={{ fontSize: "52px", fontWeight: "900", color: "#16A34A", lineHeight: 1 }}>
                {aggregate}%
              </div>
              <p style={{ fontSize: "13px", color: "#166534", marginTop: "16px", maxWidth: "440px", margin: "16px auto 0", lineHeight: 1.6 }}>
                Compare this aggregate with previous year's closing merit lists of your desired universities to estimate your chances.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom spacing */}
      <div style={{ height: "64px" }} />
    </div>
  );
}
