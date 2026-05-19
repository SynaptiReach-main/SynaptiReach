export {};
'use client'
import { useState, useRef } from 'react'
import Footer from '@/components/sections/Footer'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [charCount, setCharCount] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)

  const C = {
    cyan:      '#00E5FF',
    green:     '#00E676',
    muted:     '#B2EBF2',
    dim:       '#7FB3C8',
    border:    'rgba(0,229,255,0.12)',
    borderHot: 'rgba(0,229,255,0.4)',
  }
  const gradText = {
    background: 'linear-gradient(90deg,#00FFFF,#00E676)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      formRef.current?.reset()
      setCharCount(0)
      setTimeout(() => setSubmitted(false), 7000)
    }, 1600)
  }

  const contactCards = [
    {
      icon: '📧',
      label: 'Email Us',
      value: 'SynaptiReach@gmail.com',
      sub: 'Best for detailed questions',
      href: 'mailto:SynaptiReach@gmail.com',
      color: C.cyan,
    },
    {
      icon: '📞',
      label: 'Call or Text',
      value: '(346) 866-5569',
      sub: 'Mon–Fri · 9am–6pm CST',
      href: 'tel:+13468665569',
      color: C.green,
    },
    {
      icon: '🎥',
      label: 'Zoom Call',
      value: 'Request via form',
      sub: '30-min onboarding or support',
      href: '#contact-form',
      color: C.cyan,
    },
  ]

  const expectations = [
    { icon: '⚡', label: 'Average response',   value: 'Under 24 hours'      },
    { icon: '🔒', label: 'Form data',          value: 'SSL encrypted'        },
    { icon: '🛠', label: 'DFY setup calls',    value: 'Scheduled in 48 hrs' },
    { icon: '🤝', label: 'No pressure',        value: 'Honest consultation'  },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=JetBrains+Mono&display=swap');

        *, *::before, *::after { box-sizing:border-box; }
        a    { text-decoration:none; color:inherit; }
        button { cursor:pointer; font-family:inherit; }

        /* ── INPUTS ── */
        .sr-input {
          width:100%;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(0,229,255,0.14);
          border-radius:10px;
          padding:13px 16px;
          color:#fff;
          font-size:14px;
          outline:none;
          transition:border-color 0.2s ease, box-shadow 0.2s ease;
          font-family:inherit;
          -webkit-appearance:none;
          appearance:none;
        }
        .sr-input:focus {
          border-color:rgba(0,229,255,0.5);
          box-shadow:0 0 0 3px rgba(0,229,255,0.08);
        }
        .sr-input::placeholder { color:rgba(178,235,242,0.3); }
        textarea.sr-input { min-height:130px; resize:vertical; }
        select.sr-input    { cursor:pointer; }
        select.sr-input option { background:#111827; color:#fff; }

        /* ── FIELD WRAP ── */
        .f-label {
          display:block;
          font-size:11px;
          font-weight:700;
          letter-spacing:0.08em;
          text-transform:uppercase;
          color:#7FB3C8;
          margin-bottom:7px;
        }
        .f-req { color:#FF6B8A; margin-left:2px; }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideL   { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideR   { from{opacity:0;transform:translateX(16px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes popCheck { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }

        /* ── CARDS ── */
        .c-card {
          background:rgba(17,24,39,0.82);
          backdrop-filter:blur(10px);
          border:1px solid rgba(0,229,255,0.12);
          border-radius:16px;
          transition:all 0.25s ease;
          display:block;
        }
        .c-card:hover {
          border-color:rgba(0,229,255,0.38);
          transform:translateY(-3px);
          box-shadow:0 10px 36px rgba(0,229,255,0.07);
        }

        /* ── SUBMIT ── */
        .sub-btn {
          width:100%;
          background:linear-gradient(90deg,#00FFFF,#00E676);
          color:#0A0F1F;
          border:none;
          padding:16px;
          border-radius:12px;
          font-size:15px;
          font-weight:800;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          transition:all 0.2s ease;
        }
        .sub-btn:hover:not(:disabled) {
          transform:scale(1.02);
          box-shadow:0 0 36px rgba(0,230,118,0.28);
        }
        .sub-btn:disabled { opacity:0.7; cursor:not-allowed; }

        /* ── PAGE LAYOUT ── */
        .pg { max-width:1120px; margin:0 auto; padding:56px 20px 80px; animation:fadeUp 0.4s ease; }

        .main-grid {
          display:grid;
          grid-template-columns:1fr 360px;
          gap:28px;
          align-items:start;
        }
        .form-panel {
          background:rgba(17,24,39,0.82);
          backdrop-filter:blur(12px);
          border:1px solid rgba(0,229,255,0.13);
          border-radius:20px;
          padding:32px;
          animation:slideL 0.45s ease 0.1s both;
        }
        .side-col {
          display:flex;
          flex-direction:column;
          gap:14px;
          animation:slideR 0.45s ease 0.15s both;
        }

        .fg2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

        /* tablet */
        @media (max-width:900px) {
          .main-grid { grid-template-columns:1fr; }
          .side-col {
            flex-direction:row;
            overflow-x:auto;
            padding-bottom:6px;
            scrollbar-width:none;
            -ms-overflow-style:none;
            order:-1;
          }
          .side-col::-webkit-scrollbar { display:none; }
          .c-card-wrap { min-width:230px; flex:0 0 auto; }
          .expect-panel { display:none; }
        }

        /* mobile */
        @media (max-width:580px) {
          .pg { padding:32px 14px 60px; }
          .side-col { flex-direction:column; overflow-x:visible; }
          .c-card-wrap { min-width:unset; flex:unset; }
          .fg2 { grid-template-columns:1fr; }
          .form-panel { padding:22px 18px; }
        }
      `}</style>

      {/* ── transparent wrapper — layout bg shows through ── */}
      <div style={{ position:'relative', zIndex:1, minHeight:'100vh', color:'#fff', fontFamily:"'Inter',-apple-system,sans-serif" }}>

        {/* SUCCESS MODAL */}
        {submitted && (
          <div style={{
            position:'fixed', inset:0,
            background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)',
            display:'flex', alignItems:'center', justifyContent:'center',
            zIndex:999, padding:'20px',
          }}>
            <div style={{
              background:'rgba(15,22,38,0.97)', backdropFilter:'blur(20px)',
              border:'1px solid rgba(0,229,255,0.28)',
              borderRadius:'22px', padding:'44px 36px',
              maxWidth:'400px', width:'100%',
              textAlign:'center', animation:'scaleIn 0.3s ease',
            }}>
              <div style={{
                width:'72px', height:'72px', margin:'0 auto 22px',
                background:'rgba(0,230,118,0.1)',
                border:'2px solid #00E676',
                borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                animation:'popCheck 0.4s ease',
                fontSize:'28px', color:'#00E676',
              }}>✓</div>
              <h2 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:800, fontSize:'26px', marginBottom:'12px' }}>
                Message Sent!
              </h2>
              <p style={{ color:C.muted, lineHeight:1.75, fontSize:'15px', marginBottom:'26px' }}>
                Successfully submitted. SynaptiReach will respond within{' '}
                <span style={{ color:C.cyan, fontWeight:700 }}>24–48 hours</span>.
              </p>
              <button onClick={() => setSubmitted(false)} style={{
                background:'linear-gradient(90deg,#00FFFF,#00E676)',
                color:'#0A0F1F', border:'none',
                padding:'11px 30px', borderRadius:'50px',
                fontSize:'14px', fontWeight:800, cursor:'pointer',
              }}>Got it</button>
            </div>
          </div>
        )}

        <div className="pg">

          {/* ── HERO ── */}
          <div style={{ textAlign:'center', marginBottom:'44px' }}>
            <div style={{
              display:'inline-block', fontSize:'11px', fontWeight:700,
              letterSpacing:'0.12em', color:C.cyan,
              border:'1px solid rgba(0,229,255,0.35)',
              borderRadius:'50px', padding:'5px 18px', marginBottom:'16px',
            }}>CONTACT SYNAPTIREACH</div>

            <h1 style={{
              fontFamily:'Montserrat,sans-serif', fontWeight:800,
              fontSize:'clamp(28px,5vw,52px)', lineHeight:1.1, marginBottom:'14px',
            }}>
              {"Let's "}
              <span style={gradText}>Build Together</span>
            </h1>
            <p style={{ color:C.muted, maxWidth:'520px', margin:'0 auto', lineHeight:1.8, fontSize:'16px' }}>
              Trial questions, DFY setup, onboarding, or custom pricing —
              we respond within 24–48 hours.
            </p>
          </div>

          {/* ── MAIN GRID ── */}
          <div className="main-grid">

            {/* LEFT — FORM */}
            <div className="form-panel" id="contact-form">
              <h2 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:800, fontSize:'22px', marginBottom:'5px' }}>
                Send a Message
              </h2>
              <p style={{ color:C.dim, fontSize:'13px', marginBottom:'26px', lineHeight:1.6 }}>
                Fields marked <span style={{ color:'#FF6B8A' }}>*</span> are required.
              </p>

              <form ref={formRef} onSubmit={handleSubmit}>

                {/* Row 1 */}
                <div className="fg2" style={{ marginBottom:'16px' }}>
                  <div>
                    <label className="f-label">Full Name <span className="f-req">*</span></label>
                    <input className="sr-input" type="text" placeholder="Jane Smith" required />
                  </div>
                  <div>
                    <label className="f-label">Business Name <span className="f-req">*</span></label>
                    <input className="sr-input" type="text" placeholder="Acme Co." required />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="fg2" style={{ marginBottom:'16px' }}>
                  <div>
                    <label className="f-label">Industry <span className="f-req">*</span></label>
                    <input className="sr-input" type="text" placeholder="Roofing, HVAC, Coaching..." required />
                  </div>
                  <div>
                    <label className="f-label">Business Type <span className="f-req">*</span></label>
                    <select className="sr-input" required defaultValue="">
                      <option value="" disabled>Select type</option>
                      <option>Sole Proprietor</option>
                      <option>Small Business (2–10)</option>
                      <option>Mid-size (11–50)</option>
                      <option>Agency</option>
                      <option>Enterprise (50+)</option>
                    </select>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="fg2" style={{ marginBottom:'16px' }}>
                  <div>
                    <label className="f-label">Email <span className="f-req">*</span></label>
                    <input className="sr-input" type="email" placeholder="you@company.com" required />
                  </div>
                  <div>
                    <label className="f-label">Phone <span className="f-req">*</span></label>
                    <input className="sr-input" type="tel" placeholder="(555) 000-0000" required />
                  </div>
                </div>

                {/* Row 4 */}
                <div className="fg2" style={{ marginBottom:'16px' }}>
                  <div>
                    <label className="f-label">Preferred Contact <span className="f-req">*</span></label>
                    <select className="sr-input" required defaultValue="">
                      <option value="" disabled>Select method</option>
                      <option>Email</option>
                      <option>Phone Call</option>
                      <option>Text Message</option>
                      <option>Zoom Call</option>
                    </select>
                  </div>
                  <div>
                    <label className="f-label">Zoom Availability</label>
                    <input className="sr-input" type="text" placeholder="e.g. Mon 2–4pm CST" />
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom:'6px' }}>
                  <label className="f-label">Message <span className="f-req">*</span></label>
                  <textarea
                    className="sr-input"
                    placeholder="Tell us how we can help — trial questions, DFY setup, pricing, automation..."
                    required
                    maxLength={600}
                    onChange={(e) => setCharCount(e.target.value.length)}
                  />
                </div>
                <div style={{
                  textAlign:'right', fontSize:'12px', marginBottom:'24px',
                  color: charCount > 540 ? '#FF6B8A' : C.dim,
                }}>
                  {charCount} / 600
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading} className="sub-btn">
                  {loading ? (
                    <>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5"
                        style={{ animation:'spin 0.75s linear infinite', flexShrink:0 }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      Sending...
                    </>
                  ) : 'Send Message →'}
                </button>

              </form>
            </div>

            {/* RIGHT — SIDEBAR */}
            <div className="side-col">

              {/* Contact method cards */}
              {contactCards.map((m, i) => (
                <a key={i} href={m.href} className="c-card c-card-wrap" style={{ padding:'20px' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:'14px' }}>
                    <div style={{
                      width:'46px', height:'46px', flexShrink:0,
                      background:'rgba(0,229,255,0.07)',
                      borderRadius:'12px',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'22px',
                    }}>{m.icon}</div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:'13px', fontWeight:700, color:'#fff', marginBottom:'3px' }}>{m.label}</div>
                      <div style={{ fontSize:'13px', fontWeight:700, color:m.color, marginBottom:'3px', wordBreak:'break-all' }}>{m.value}</div>
                      <div style={{ fontSize:'12px', color:C.dim }}>{m.sub}</div>
                    </div>
                  </div>
                </a>
              ))}

              {/* What to expect */}
              <div className="c-card expect-panel" style={{ padding:'22px' }}>
                <div style={{
                  fontSize:'11px', fontWeight:700, letterSpacing:'0.1em',
                  color:C.dim, marginBottom:'16px',
                }}>WHAT TO EXPECT</div>
                {expectations.map((s, i) => (
                  <div key={i} style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'10px 0',
                    borderBottom: i < expectations.length - 1 ? '1px solid rgba(0,229,255,0.07)' : 'none',
                    gap:'12px',
                  }}>
                    <div style={{ fontSize:'13px', color:C.dim }}>
                      {s.icon}&nbsp;&nbsp;{s.label}
                    </div>
                    <div style={{ fontSize:'13px', fontWeight:600, color:'#fff', textAlign:'right', flexShrink:0 }}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <p style={{ textAlign:'center', marginTop:'44px', color:'#4A6070', fontSize:'13px', lineHeight:1.8 }}>
            All inquiries welcome — trials, onboarding, pricing, DFY services, and client support.
          </p>

        </div>
      </div>
      <Footer />
    </>
  )
}
