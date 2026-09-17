import { useState } from "react";
import { Mail, MapPin, Send, Clock, CheckCircle, MessageSquare } from "lucide-react";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production: send to backend POST /api/contact
    setSubmitted(true);
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    padding: "12px 16px",
    border: "1.5px solid #E2E8F0", borderRadius: "10px",
    fontSize: "14px", color: "#0F172A", outline: "none",
    background: "#F8FAFC", transition: "border-color 0.15s",
  };

  const labelStyle = {
    display: "block", fontSize: "13px", fontWeight: "600",
    color: "#475569", marginBottom: "6px",
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "48px 32px", textAlign: "center", maxWidth: "480px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #E2E8F0" }}>
          <div style={{ width: "64px", height: "64px", background: "#DCFCE7", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <CheckCircle size={32} color="#16A34A" />
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0F172A", marginBottom: "12px" }}>Message Sent!</h2>
          <p style={{ color: "#64748B", lineHeight: 1.6, marginBottom: "24px" }}>
            Thank you for reaching out. Our team will review your message and get back to you within 24 hours.
          </p>
          <div style={{ background: "#F1F5F9", borderRadius: "12px", padding: "16px", marginBottom: "24px", fontSize: "14px", color: "#475569" }}>
            <span style={{ fontWeight: "600" }}>Direct Email:</span>{" "}
            <a href="mailto:ifitkharbusiness100@gmail.com" style={{ color: "#2563EB", textDecoration: "none" }}>ifitkharbusiness100@gmail.com</a>
          </div>
          <button onClick={() => setSubmitted(false)} style={{
            background: "#2563EB", color: "#FFFFFF", padding: "12px 24px", borderRadius: "10px",
            border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer", width: "100%"
          }}>
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>

      {/* ═══════════ HERO ═══════════ */}
      <section style={{
        position: "relative", minHeight: "380px",
        display: "flex", alignItems: "center", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/contact-hero.png')",
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
            <MessageSquare size={14} color="#93C5FD" />
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#93C5FD", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Support Center
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(30px, 5vw, 48px)", fontWeight: "800",
            color: "#FFFFFF", lineHeight: 1.15, marginBottom: "16px", maxWidth: "520px",
          }}>
            How Can We Help?
          </h1>

          <p style={{ color: "#CBD5E1", fontSize: "16px", lineHeight: 1.7, maxWidth: "460px" }}>
            Have a question about universities, admissions or UniGuide.pk? Our team is here to help you navigate your academic journey.
          </p>
        </div>
      </section>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px 64px", marginTop: "-32px", position: "relative", zIndex: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>

          {/* LEFT: Contact Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{
              background: "#FFFFFF", borderRadius: "16px", padding: "32px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #E2E8F0",
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>Get in Touch</h2>
              <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6, marginBottom: "28px" }}>
                UniGuide.pk is dedicated to helping Pakistani students. Whether you're a student, parent, or institution, we'd love to hear from you.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { icon: Mail, label: "Email Support", value: "ifitkharbusiness100@gmail.com", href: "mailto:ifitkharbusiness100@gmail.com", color: "#2563EB", bg: "#EFF6FF" },
                  { icon: MapPin, label: "Location", value: "Pakistan — Serving students nationwide", color: "#16A34A", bg: "#F0FDF4" },
                  { icon: Clock, label: "Working Hours", value: "Mon–Sat: 9:00 AM – 6:00 PM PKT", color: "#7C3AED", bg: "#F5F3FF" },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <item.icon size={18} color={item.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>{item.label}</div>
                      {item.href ? (
                        <a href={item.href} style={{ fontSize: "14px", color: "#0F172A", fontWeight: "600", textDecoration: "none" }}>{item.value}</a>
                      ) : (
                        <div style={{ fontSize: "14px", color: "#0F172A", fontWeight: "500" }}>{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Profile Card */}
            <div style={{
              background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)",
              borderRadius: "16px", padding: "32px", color: "#FFFFFF",
              boxShadow: "0 10px 25px rgba(37,99,235,0.2)",
            }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#93C5FD", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Platform Administrator</div>
              <div style={{ fontSize: "24px", fontWeight: "800", marginBottom: "4px" }}>Syed Iftikhar Shah</div>
              <div style={{ fontSize: "14px", color: "#BFDBFE", marginBottom: "20px" }}>Founder & Lead Developer, UniGuide.pk</div>
              <a href="mailto:ifitkharbusiness100@gmail.com" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "10px 16px", background: "rgba(255,255,255,0.15)", borderRadius: "8px",
                color: "#FFFFFF", fontSize: "13px", fontWeight: "600", textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)", transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              >
                <Mail size={14} /> Contact Admin directly
              </a>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div style={{
            background: "#FFFFFF", borderRadius: "16px", padding: "32px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #E2E8F0",
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0F172A", marginBottom: "24px" }}>Send us a Message</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Ahmed Ali" style={inputStyle} onFocus={e => e.target.style.borderColor = "#2563EB"} onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="ahmed@example.com" style={inputStyle} onFocus={e => e.target.style.borderColor = "#2563EB"} onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Subject *</label>
                <select required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                  style={{ ...inputStyle, appearance: "none" }} onFocus={e => e.target.style.borderColor = "#2563EB"} onBlur={e => e.target.style.borderColor = "#E2E8F0"}>
                  <option value="" disabled>Select a topic...</option>
                  <option>Admission Inquiry</option>
                  <option>Scholarship Information</option>
                  <option>University Partnership</option>
                  <option>Technical Support</option>
                  <option>Feedback & Suggestions</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Message *</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you today?" style={{ ...inputStyle, resize: "none" }}
                  onFocus={e => e.target.style.borderColor = "#2563EB"} onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
              </div>
              <button type="submit" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                background: "#2563EB", color: "#FFFFFF", padding: "14px", borderRadius: "10px",
                border: "none", fontSize: "15px", fontWeight: "700", cursor: "pointer",
                marginTop: "8px", transition: "background 0.15s", boxShadow: "0 4px 12px rgba(37,99,235,0.25)"
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#1D4ED8"}
                onMouseLeave={e => e.currentTarget.style.background = "#2563EB"}
              >
                <Send size={16} /> Send Message
              </button>
            </form>
          </div>

        </div>

        {/* FAQ Quick Answers */}
        <div style={{ marginTop: "64px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0F172A", marginBottom: "24px", textAlign: "center" }}>Quick Answers</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {[
              { q: "How do I apply to a university?", a: "Browse universities, select your desired program, and click 'Apply Now'." },
              { q: "Are the scholarships real?", a: "Yes! All scholarships are verified from official HEC and university sources." },
              { q: "How is merit calculated?", a: "Use our Merit Calculator tool with your Matric, FSc, and entry test scores." },
              { q: "Is UniGuide.pk free?", a: "Yes, all basic features including guidance, calculators, and course resources are 100% free." },
            ].map(({ q, a }, idx) => (
              <div key={idx} style={{ background: "#FFFFFF", padding: "20px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", marginBottom: "8px" }}>{q}</div>
                <div style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.6 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
