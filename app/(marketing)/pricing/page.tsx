export {};
'use client'
import { useState } from 'react'
import Link from 'next/link'

const selfService = [
  { name: 'Basic', byok: 15, managed: 29, credits: 1000, agents: 0,
    tagline: 'Use your own APIs, pay less.', bestFor: 'Solo operators & side projects',
    features: ['CRM access','1,000 AI credits/mo','Email campaigns','Basic automation','Lead pipeline'],
    excluded: ['AI agents','SMS campaigns','Advanced automation'],
    cta: 'Start Free Trial', href: '/trial', popular: false },
  { name: 'Growth', byok: 39, managed: 59, credits: 5000, agents: 2,
    tagline: 'We power your growth.', bestFor: 'Growing service businesses',
    features: ['Everything in Basic','5,000 AI credits/mo','2 AI Agents','Advanced automation','Segmentation','SMS campaigns'],
    excluded: ['Automation Agent','Priority support'],
    cta: 'Start Free Trial', href: '/trial', popular: true },
  { name: 'Premium', byok: 79, managed: 119, credits: 15000, agents: 5,
    tagline: 'Run your business on autopilot.', bestFor: 'Agencies & advanced teams',
    features: ['Everything in Growth','15,000 AI credits/mo','5 AI Agents','Automation Agent','A/B testing','Priority support'],
    excluded: [], cta: 'Get Started', href: '/trial', popular: false },
]

const dfy = [
  { name: 'DFY Basic', price: 149, credits: 10000, agents: 5,
    tagline: 'We handle your setup.', bestFor: 'Non-technical business owners',
    features: ['Full CRM setup','Basic automation','Lead pipeline built','10,000 AI credits/mo','5 AI Agents','Dedicated setup call'],
    excluded: [], cta: 'Get Started', href: '/contact', popular: false },
  { name: 'DFY Growth', price: 299, credits: 25000, agents: 8,
    tagline: 'Your entire system, built for you.', bestFor: 'Serious operators ready to scale',
    features: ['Full funnel build','Email + SMS sequences','CRM + segmentation','25,000 AI credits/mo','8 AI Agents','Monthly strategy call'],
    excluded: [], cta: 'Get Started', href: '/contact', popular: true },
  { name: 'DFY Premium', price: 499, credits: 60000, agents: 10,
    tagline: 'Full-service growth engine.', bestFor: 'High-volume agencies & enterprises',
    features: ['Full business system','Branding + strategy','Advanced AI + automation','60,000 AI credits/mo','10+ AI Agents','Dedicated account manager'],
    excluded: [], cta: 'Get Started', href: '/contact', popular: false },
]

const bundles = [
  { name: 'Launch',        price: 149,  items: ['Landing Page','Email Campaign','Workflow Setup'],                          popular: false },
  { name: 'Growth',        price: 299,  items: ['Funnel Build','Email Sequence','CRM Setup','Segmentation'],               popular: true  },
  { name: 'Automation',    price: 499,  items: ['Lead Nurturing','Advanced Automation','A/B Testing','Dashboard'],         popular: false },
  { name: 'Authority',     price: 799,  items: ['Branding Kit','SEO Setup','GMB Optimization','Offer Optimization'],       popular: false },
  { name: 'Full Business', price: 1499, items: ['Full System Build','Automation','Branding','AI Strategy'],               popular: false },
]

const creditPacks = [
  { label: 'Small',  credits: '1,000',  price: 15,  note: '1.5¢ per credit' },
  { label: 'Medium', credits: '5,000',  price: 60,  note: '1.2¢ per credit' },
  { label: 'Large',  credits: '15,000', price: 150, note: '1¢ per credit'   },
]

const commitDiscounts = [
  { duration: '3 months',  off: '10%' },
  { duration: '6 months',  off: '20%' },
  { duration: '9 months',  off: '25%' },
  { duration: '12 months', off: '30%', best: true },
]

const faqs = [
  { q: 'What happens after my free trial?',  a: 'After 30 days, choose a plan or your account pauses. No surprise charges ever.' },
  { q: 'What are AI credits?',               a: 'Credits power every AI action: email generation, CRM updates, workflow steps, SMS sends. Each plan includes a monthly cap. Buy more anytime.' },
  { q: 'What is BYOK?',                      a: 'Bring Your Own API Keys. Connect your own OpenAI, Twilio, or similar keys and pay the lower Self-Service BYOK rate — zero usage fees from us on top.' },
  { q: 'Can I switch plans anytime?',        a: 'Yes. Upgrade or downgrade anytime. Changes take effect at your next billing cycle with no penalty.' },
  { q: 'What is Done-For-You (DFY)?',        a: 'Our team builds your entire system — CRM, automations, AI agents, funnels, and integrations. You show up to a ready-to-use platform.' },
  { q: 'Do credits roll over?',              a: 'Credits reset monthly and do not roll over. Unused credits expire at cycle end. Buy credit packs anytime for extra capacity.' },
]

export default function PricingPage() {
  const [tab,     setTab]     = useState('self')
  const [keyMode, setKeyMode] = useState('byok')
  const [billing, setBilling] = useState('monthly')
  const [openFaq, setOpenFaq] = useState(null as number | null)

  const activePlans = tab === 'self' ? selfService : dfy

  const getPrice = (plan: any) => {
    const base = tab === 'self'
      ? (keyMode === 'byok' ? plan.byok : plan.managed)
      : plan.price
    return billing === 'annual' ? Math.round(base * 0.7) : base
  }
  const getOriginal = (plan: any) =>
    tab === 'self' ? (keyMode === 'byok' ? plan.byok : plan.managed) : plan.price

  const C = {
    card:      '#111827',
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=JetBrains+Mono&display=swap');
        a{text-decoration:none;color:inherit}
        button{cursor:pointer;transition:all 0.2s ease;font-family:inherit}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .plan-card:hover { border-color:rgba(0,229,255,0.38) !important }
        .pack-card:hover  { border-color:rgba(0,229,255,0.32) !important }
        .faq-btn:hover    { background:rgba(0,229,255,0.04)  !important }
        .cta-btn:hover    { transform:scale(1.03) }
      `}</style>

      {/*
        ── NO background set here — the layout's canvas/grid/glow shows through ──
        ── position:relative + zIndex:1 keeps content above the layout layers    ──
      */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        color: '#fff',
        fontFamily: "'Inter',-apple-system,sans-serif",
        animation: 'fadeIn 0.45s ease',
      }}>

        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '56px 20px 80px' }}>

          {/* ── HERO ── */}
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <div style={{
              display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
              color: C.cyan, border: '1px solid rgba(0,229,255,0.35)',
              borderRadius: '50px', padding: '5px 18px', marginBottom: '18px',
            }}>TRANSPARENT PRICING · NO SURPRISES</div>

            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 'clamp(28px,5vw,52px)', lineHeight: 1.15, marginBottom: '14px' }}>
              Simple Pricing That{' '}
              <span style={gradText}>Scales With You</span>
            </h1>
            <p style={{ color: C.muted, fontSize: '16px', maxWidth: '460px', margin: '0 auto 28px', lineHeight: 1.65 }}>
              Start free. Only pay for what you use — or let us build everything for you.
            </p>

            {/* Billing toggle */}
            <div style={{ display: 'inline-flex', background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.12)', borderRadius: '50px', padding: '4px', gap: '4px' }}>
              {[['monthly','Monthly'],['annual','🏷 Annual — Save 30%']].map(([val,label]) => (
                <button key={val} onClick={() => setBilling(val)} style={{
                  padding: '8px 22px', borderRadius: '50px', fontSize: '13px', fontWeight: 600,
                  background: billing === val ? C.green : 'transparent',
                  color:      billing === val ? '#0A0F1F' : C.muted,
                  border: 'none',
                }}>{label}</button>
              ))}
            </div>
            {billing === 'annual' && (
              <div style={{ fontSize: '12px', color: C.green, marginTop: '8px' }}>✓ 30% off applied to all plans</div>
            )}
          </div>

          {/* ── TABS ── */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
            {[['self','⚙️ Self-Service'],['dfy','🛠 Done For You']].map(([val,label]) => (
              <button key={val} onClick={() => setTab(val)} style={{
                padding: '11px 30px', borderRadius: '50px', fontSize: '14px', fontWeight: 700,
                background: tab === val ? 'linear-gradient(90deg,#00FFFF,#00E676)' : 'rgba(0,229,255,0.06)',
                color:  tab === val ? '#0A0F1F' : C.muted,
                border: tab === val ? 'none'   : '1px solid rgba(0,229,255,0.15)',
              }}>{label}</button>
            ))}
          </div>

          {/* ── KEY MODE ── */}
          {tab === 'self' && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '36px', flexWrap: 'wrap' }}>
              {[['byok','🔑 Bring Your Own Keys'],['managed','⚡ Use SynaptiReach Keys']].map(([val,label]) => (
                <button key={val} onClick={() => setKeyMode(val)} style={{
                  padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                  background: keyMode === val ? 'rgba(0,229,255,0.1)' : 'transparent',
                  color:  keyMode === val ? C.cyan : C.dim,
                  border: keyMode === val ? '1px solid rgba(0,229,255,0.45)' : '1px solid rgba(0,229,255,0.12)',
                }}>{label}</button>
              ))}
              {keyMode === 'byok' && <span style={{ alignSelf: 'center', fontSize: '12px', color: C.green }}>← Lowest price</span>}
            </div>
          )}

          {/* ── PLAN CARDS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: '20px', marginBottom: '76px' }}>
            {activePlans.map((plan: any) => (
              <div key={plan.name} className="plan-card" style={{
                background: plan.popular ? 'linear-gradient(160deg,rgba(9,26,19,0.92),rgba(17,24,39,0.92))' : 'rgba(17,24,39,0.85)',
                border:      '1px solid ' + (plan.popular ? C.borderHot : C.border),
                borderRadius: '18px', padding: '30px', position: 'relative',
                backdropFilter: 'blur(10px)',
                boxShadow: plan.popular ? '0 0 48px rgba(0,229,255,0.07)' : 'none',
                transition: 'border-color 0.25s',
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(90deg,#00FFFF,#00E676)', color: '#0A0F1F',
                    fontSize: '10px', fontWeight: 800, padding: '4px 18px',
                    borderRadius: '50px', letterSpacing: '0.1em', whiteSpace: 'nowrap',
                  }}>⭐ MOST POPULAR</div>
                )}
                <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: '20px', marginBottom: '4px' }}>{plan.name}</div>
                <div style={{ fontSize: '12px', color: C.dim, marginBottom: '18px' }}>{plan.bestFor}</div>

                <div style={{ marginBottom: '4px' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '44px', fontWeight: 700, ...gradText }}>
                    ${getPrice(plan)}
                  </span>
                  <span style={{ color: C.dim, fontSize: '14px' }}>/mo</span>
                </div>
                {billing === 'annual' && (
                  <div style={{ fontSize: '12px', color: C.green, marginBottom: '4px' }}>Was ${getOriginal(plan)}/mo</div>
                )}
                <div style={{ fontSize: '13px', color: C.muted, fontStyle: 'italic', marginBottom: '20px' }}>{plan.tagline}</div>

                <div style={{
                  background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.1)',
                  borderRadius: '10px', padding: '12px 16px', marginBottom: '22px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: C.dim, marginBottom: '3px' }}>AI Credits / month</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '20px', color: C.cyan, fontWeight: 600 }}>
                      {plan.credits.toLocaleString()}
                    </div>
                  </div>
                  {plan.agents > 0 && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: C.dim, marginBottom: '3px' }}>AI Agents</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '20px', color: C.green, fontWeight: 600 }}>{plan.agents}</div>
                    </div>
                  )}
                </div>

                <ul style={{ listStyle: 'none', marginBottom: '26px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  {plan.features.map((f: string) => (
                    <li key={f} style={{ display: 'flex', gap: '8px', fontSize: '14px', color: C.muted, alignItems: 'flex-start' }}>
                      <span style={{ color: C.green, flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                  {plan.excluded?.map((f: string) => (
                    <li key={f} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#3A5060', alignItems: 'flex-start' }}>
                      <span style={{ flexShrink: 0 }}>—</span>{f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className="cta-btn" style={{
                  display: 'block', textAlign: 'center',
                  background: plan.popular ? C.green : 'transparent',
                  color:  plan.popular ? '#0A0F1F' : C.cyan,
                  border: plan.popular ? 'none'   : '1px solid rgba(0,229,255,0.4)',
                  padding: '13px', borderRadius: '50px',
                  fontSize: '14px', fontWeight: 700,
                  transition: 'transform 0.15s ease',
                }}>{plan.cta}</Link>
              </div>
            ))}
          </div>

          {/* ── CREDIT PACKS ── */}
          <div style={{ marginBottom: '76px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 'clamp(22px,4vw,32px)', marginBottom: '8px' }}>Need More Credits?</h2>
              <p style={{ color: C.muted, fontSize: '15px' }}>Top up any time. No plan change needed.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px' }}>
              {creditPacks.map(p => (
                <div key={p.label} className="pack-card" style={{
                  background: 'rgba(17,24,39,0.85)', backdropFilter: 'blur(10px)',
                  border: '1px solid ' + C.border,
                  borderRadius: '14px', padding: '26px', textAlign: 'center',
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{ fontSize: '11px', color: C.dim, letterSpacing: '0.1em', marginBottom: '10px' }}>{p.label.toUpperCase()} PACK</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '22px', color: C.cyan, fontWeight: 600, marginBottom: '4px' }}>{p.credits}</div>
                  <div style={{ fontSize: '11px', color: C.dim, marginBottom: '14px' }}>{p.note}</div>
                  <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '30px', fontWeight: 800, ...gradText, marginBottom: '18px' }}>${p.price}</div>
                  <button style={{
                    width: '100%', background: 'rgba(0,229,255,0.07)',
                    border: '1px solid rgba(0,229,255,0.2)', color: C.cyan,
                    padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  }}>Buy Pack</button>
                </div>
              ))}
            </div>
          </div>

          {/* ── BUNDLES ── */}
          <div style={{ marginBottom: '76px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 'clamp(22px,4vw,32px)', marginBottom: '8px' }}>One-Time Setup Bundles</h2>
              <p style={{ color: C.muted, fontSize: '15px' }}>Pay once. Get your entire system built.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '14px' }}>
              {bundles.map((b: any) => (
                <div key={b.name} style={{
                  background: 'rgba(17,24,39,0.85)', backdropFilter: 'blur(10px)',
                  border: '1px solid ' + (b.popular ? C.borderHot : C.border),
                  borderRadius: '14px', padding: '22px', position: 'relative',
                }}>
                  {b.popular && (
                    <div style={{
                      position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                      background: 'linear-gradient(90deg,#00FFFF,#00E676)', color: '#0A0F1F',
                      fontSize: '10px', fontWeight: 800, padding: '3px 14px',
                      borderRadius: '50px', whiteSpace: 'nowrap',
                    }}>⭐ BEST VALUE</div>
                  )}
                  <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>{b.name}</div>
                  <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '26px', fontWeight: 800, ...gradText, marginBottom: '14px' }}>
                    ${b.price.toLocaleString()}
                  </div>
                  <ul style={{ listStyle: 'none', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {b.items.map((item: string) => (
                      <li key={item} style={{ fontSize: '13px', color: C.muted, display: 'flex', gap: '6px' }}>
                        <span style={{ color: C.green }}>✓</span>{item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" style={{
                    display: 'block', textAlign: 'center',
                    background: b.popular ? C.green : 'transparent',
                    color:  b.popular ? '#0A0F1F' : C.cyan,
                    border: b.popular ? 'none'   : '1px solid rgba(0,229,255,0.35)',
                    padding: '9px', borderRadius: '50px', fontSize: '13px', fontWeight: 600,
                  }}>Get Started</Link>
                </div>
              ))}
            </div>
          </div>

          {/* ── COMMIT DISCOUNTS ── */}
          <div style={{
            background: 'rgba(17,24,39,0.8)', backdropFilter: 'blur(10px)',
            border: '1px solid ' + C.border,
            borderRadius: '18px', padding: '36px', marginBottom: '76px', textAlign: 'center',
          }}>
            <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '26px', marginBottom: '8px' }}>Commit & Save More</h2>
            <p style={{ color: C.muted, fontSize: '14px', marginBottom: '28px' }}>Pay upfront for a longer term and unlock an extra discount on any plan.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '12px' }}>
              {commitDiscounts.map((d: any) => (
                <div key={d.duration} style={{
                  background: 'rgba(0,229,255,0.05)',
                  border: '1px solid ' + (d.best ? 'rgba(0,229,255,0.35)' : C.border),
                  borderRadius: '12px', padding: '18px',
                }}>
                  <div style={{ fontSize: '12px', color: C.dim, marginBottom: '8px' }}>{d.duration}</div>
                  <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: '28px', ...gradText }}>{d.off}</div>
                  <div style={{ fontSize: '11px', color: C.dim, marginTop: '4px' }}>off</div>
                  {d.best && <div style={{ fontSize: '11px', color: C.green, marginTop: '6px', fontWeight: 600 }}>🏆 Best Value</div>}
                </div>
              ))}
            </div>
          </div>

          {/* ── DFY CTA BANNER ── */}
          <div style={{
            background: 'linear-gradient(135deg,rgba(9,26,20,0.9),rgba(13,27,42,0.9))',
            backdropFilter: 'blur(12px)',
            border: '1px solid ' + C.borderHot,
            borderRadius: '18px', padding: '42px 32px',
            textAlign: 'center', marginBottom: '76px',
            boxShadow: '0 0 60px rgba(0,229,255,0.06)',
          }}>
            <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 'clamp(20px,3.5vw,30px)', marginBottom: '12px' }}>
              {"Don't Want to Set This Up Yourself?"}
            </h2>
            <p style={{ color: C.muted, fontSize: '15px', maxWidth: '460px', margin: '0 auto 24px', lineHeight: 1.65 }}>
              {"We build your entire system — CRM, automations, AI agents, funnels, and integrations. You just show up."}
            </p>
            <Link href="/contact" className="cta-btn" style={{
              display: 'inline-block',
              background: 'linear-gradient(90deg,#00FFFF,#00E676)',
              color: '#0A0F1F', padding: '14px 38px',
              borderRadius: '50px', fontSize: '15px', fontWeight: 700,
              transition: 'transform 0.15s ease',
            }}>Get It Done For You →</Link>
          </div>

          {/* ── FAQ ── */}
          <div style={{ marginBottom: '76px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 'clamp(22px,4vw,32px)', marginBottom: '8px' }}>Common Questions</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '720px', margin: '0 auto' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{
                  background: 'rgba(17,24,39,0.8)', backdropFilter: 'blur(8px)',
                  border: '1px solid ' + (openFaq === i ? C.borderHot : C.border),
                  borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s',
                }}>
                  <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                    width: '100%', textAlign: 'left', padding: '18px 22px',
                    background: 'transparent', border: 'none', color: '#fff',
                    fontSize: '15px', fontWeight: 600,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
                  }}>
                    <span>{faq.q}</span>
                    <span style={{
                      color: C.cyan, fontSize: '22px', flexShrink: 0,
                      transform: openFaq === i ? 'rotate(45deg)' : 'none',
                      transition: 'transform 0.2s', display: 'inline-block',
                    }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 22px 20px', color: C.muted, fontSize: '14px', lineHeight: 1.75 }}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── FINAL CTA ── */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 'clamp(22px,4vw,36px)', marginBottom: '14px' }}>
              Ready to{' '}<span style={gradText}>Get Started?</span>
            </h2>
            <p style={{ color: C.muted, marginBottom: '24px', fontSize: '15px' }}>30 days free. No credit card required.</p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/trial" className="cta-btn" style={{
                background: C.green, color: '#0A0F1F',
                padding: '14px 36px', borderRadius: '50px',
                fontSize: '15px', fontWeight: 700, transition: 'transform 0.15s ease',
              }}>Start Free Trial</Link>
              <Link href="/contact" style={{
                background: 'transparent', color: '#fff',
                padding: '14px 36px', borderRadius: '50px',
                fontSize: '15px', fontWeight: 600,
                border: '2px solid rgba(255,255,255,0.25)',
              }}>Talk to Sales</Link>
            </div>
          </div>

          <p style={{ textAlign: 'center', color: '#3D5570', fontSize: '12px', lineHeight: 1.7 }}>
            Free trial applies to software access only. Setup, API usage, and services may be billed separately.
            Subscription renews automatically every 30 days unless canceled before renewal.
          </p>

        </div>
      </div>
    </>
  )
}
