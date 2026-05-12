export {};
'use client'

import Link from 'next/link'

const serviceGroups = [
  {
    title: '📢 Marketing Services',
    sections: [
      {
        name: 'Execution',
        items: [
          'Email Campaign',
          'SMS Campaign',
          'Landing Page',
          'Workflow Setup',
          'CRM Setup',
        ],
      },
      {
        name: 'Strategy',
        items: [
          'Offer Optimization',
          'Funnel Copywriting',
          'Lead Magnet Creation',
          'A/B Testing',
          'Conversion Audit',
        ],
      },
      {
        name: 'Advanced',
        items: [
          'Customer Journey Mapping',
          'Segmentation Strategy',
          'Retargeting Setup',
        ],
      },
    ],
  },
  {
    title: '🤖 AI Services',
    sections: [
      {
        name: 'AI Optimization',
        items: [
          'AI Campaign Strategy',
          'AI Persona Modeling',
          'AI Funnel Optimization',
        ],
      },
    ],
  },
  {
    title: '🎨 Branding & SEO',
    sections: [
      {
        name: 'Brand Development',
        items: [
          'Logo Design',
          'Branding Kit',
          'SEO Optimization',
          'Local SEO',
        ],
      },
    ],
  },
  {
    title: '📱 Social & GMB',
    sections: [
      {
        name: 'Growth Presence',
        items: [
          'Social Media Management',
          'Content Calendar',
          'GMB Optimization',
          'GMB Monthly Management',
        ],
      },
    ],
  },
]

const pricing = [
  { name: 'Starter', range: '$29–$79 range' },
  { name: 'Growth', range: '$79–$129 range' },
  { name: 'Advanced', range: '$129–$179 range' },
  { name: 'Premium Strategy', range: '$149–$249 range' },
  { name: 'Branding', range: '$149–$499' },
  { name: 'Monthly Services', range: '$79–$199/mo' },
]

const bundles = [
  {
    name: 'Launch',
    price: '$149',
    items: ['Landing Page', 'Email Campaign', 'Workflow'],
  },
  {
    name: 'Growth',
    price: '$299',
    popular: true,
    items: ['Funnel', 'Email Sequence', 'CRM Setup', 'Segmentation'],
  },
  {
    name: 'Automation',
    price: '$499',
    items: ['Lead Nurturing', 'Advanced Automation', 'A/B Testing', 'Dashboard'],
  },
  {
    name: 'Authority',
    price: '$799',
    items: ['Branding', 'SEO', 'GMB', 'Offer Optimization'],
  },
  {
    name: 'Conversion Engine',
    price: '$999',
    items: ['Funnel', 'Copywriting', 'Lead Magnet', 'AI Strategy'],
  },
  {
    name: 'Full Business',
    price: '$1,499',
    items: ['Full system setup', 'Automation', 'Branding', 'Strategy'],
  },
]

const recurring = [
  { name: 'Growth Ops', price: '$299/mo' },
  { name: 'Scale Ops', price: '$599/mo' },
  { name: 'Elite Ops', price: '$999/mo' },
]

export default function ServicesPage() {
  const C = {
    bg: 'transparent',
    card: 'rgba(17,24,39,0.72)',
    cyan: '#00E5FF',
    green: '#00E676',
    muted: '#B2EBF2',
    dim: '#7FB3C8',
    border: 'rgba(0,229,255,0.12)',
    borderHot: 'rgba(0,229,255,0.35)',
  }

  const gradText = {
    background: 'linear-gradient(90deg,#00FFFF,#00E676)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'transparent',
        color: '#fff',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=JetBrains+Mono&display=swap');

        *{
          box-sizing:border-box;
          margin:0;
          padding:0;
        }

        a{
          text-decoration:none;
          color:inherit;
        }

        .card-hover{
          transition:all .25s ease;
          backdrop-filter: blur(10px);
        }

        .card-hover:hover{
          border-color:rgba(0,229,255,0.35)!important;
          transform:translateY(-3px);
        }

        .cta-btn:hover{
          transform:scale(1.03);
        }
      `}</style>

      <div
        style={{
          maxWidth: '1180px',
          margin: '0 auto',
          padding: '70px 20px 100px',
          position: 'relative',
          zIndex: 1,
          background: 'transparent',
        }}
      >
        {/* HERO */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '6px 18px',
              borderRadius: '999px',
              border: '1px solid rgba(0,229,255,0.25)',
              color: C.cyan,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              marginBottom: '18px',
              background: 'rgba(0,0,0,0.15)',
              backdropFilter: 'blur(8px)',
            }}
          >
            SERVICES & EXECUTION
          </div>

          <h1
            style={{
              fontFamily: 'Montserrat,sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(34px,6vw,64px)',
              lineHeight: 1.1,
              marginBottom: '18px',
            }}
          >
            Marketing & AI{' '}
            <span style={gradText}>Services</span>
          </h1>

          <p
            style={{
              color: C.muted,
              fontSize: '16px',
              lineHeight: 1.7,
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            Funnels, automations, AI systems, branding, CRM optimization,
            campaigns, SEO, and growth operations — built to scale your business.
          </p>
        </div>

        {/* SERVICES */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '36px',
            marginBottom: '80px',
          }}
        >
          {serviceGroups.map((group) => (
            <div
              key={group.title}
              className="card-hover"
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: '22px',
                padding: '34px',
              }}
            >
              <h2
                style={{
                  fontFamily: 'Montserrat,sans-serif',
                  fontWeight: 800,
                  fontSize: '28px',
                  marginBottom: '28px',
                }}
              >
                {group.title}
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
                  gap: '24px',
                }}
              >
                {group.sections.map((section) => (
                  <div
                    key={section.name}
                    style={{
                      background: 'rgba(0,229,255,0.04)',
                      border: `1px solid ${C.border}`,
                      borderRadius: '16px',
                      padding: '22px',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <div
                      style={{
                        color: C.cyan,
                        fontWeight: 700,
                        marginBottom: '16px',
                        fontSize: '15px',
                      }}
                    >
                      {section.name}
                    </div>

                    <ul
                      style={{
                        listStyle: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {section.items.map((item) => (
                        <li
                          key={item}
                          style={{
                            display: 'flex',
                            gap: '10px',
                            color: C.muted,
                            fontSize: '14px',
                            lineHeight: 1.5,
                          }}
                        >
                          <span style={{ color: C.green }}>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* PRICING */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2
              style={{
                fontFamily: 'Montserrat,sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(28px,5vw,42px)',
                marginBottom: '12px',
              }}
            >
              Service <span style={gradText}>Pricing</span>
            </h2>

            <p style={{ color: C.muted }}>
              Flexible pricing based on complexity and execution depth.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
              gap: '18px',
            }}
          >
            {pricing.map((p) => (
              <div
                key={p.name}
                className="card-hover"
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: '18px',
                  padding: '28px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Montserrat,sans-serif',
                    fontWeight: 700,
                    fontSize: '18px',
                    marginBottom: '12px',
                  }}
                >
                  {p.name}
                </div>

                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '26px',
                    fontWeight: 700,
                    ...gradText,
                  }}
                >
                  {p.range}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BUNDLES */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2
              style={{
                fontFamily: 'Montserrat,sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(28px,5vw,42px)',
                marginBottom: '12px',
              }}
            >
              Service <span style={gradText}>Bundles</span>
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
              gap: '20px',
            }}
          >
            {bundles.map((bundle) => (
              <div
                key={bundle.name}
                className="card-hover"
                style={{
                  position: 'relative',
                  background: bundle.popular
                    ? 'linear-gradient(160deg,rgba(9,26,19,0.78),rgba(17,24,39,0.78))'
                    : C.card,
                  border: `1px solid ${
                    bundle.popular ? C.borderHot : C.border
                  }`,
                  borderRadius: '20px',
                  padding: '28px',
                }}
              >
                {bundle.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-11px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background:
                        'linear-gradient(90deg,#00FFFF,#00E676)',
                      color: '#0A0F1F',
                      padding: '4px 16px',
                      borderRadius: '999px',
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                    }}
                  >
                    ⭐ MOST POPULAR
                  </div>
                )}

                <div
                  style={{
                    fontFamily: 'Montserrat,sans-serif',
                    fontWeight: 800,
                    fontSize: '22px',
                    marginBottom: '8px',
                  }}
                >
                  {bundle.name}
                </div>

                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: '34px',
                    marginBottom: '20px',
                    ...gradText,
                  }}
                >
                  {bundle.price}
                </div>

                <ul
                  style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    marginBottom: '24px',
                  }}
                >
                  {bundle.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        display: 'flex',
                        gap: '10px',
                        color: C.muted,
                        fontSize: '14px',
                      }}
                    >
                      <span style={{ color: C.green }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className="cta-btn"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    background: bundle.popular
                      ? C.green
                      : 'transparent',
                    color: bundle.popular ? '#0A0F1F' : C.cyan,
                    border: bundle.popular
                      ? 'none'
                      : '1px solid rgba(0,229,255,0.35)',
                    padding: '12px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* RECURRING */}
        <div
          className="card-hover"
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: '24px',
            padding: '42px 32px',
            marginBottom: '70px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2
              style={{
                fontFamily: 'Montserrat,sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(28px,5vw,40px)',
                marginBottom: '12px',
              }}
            >
              Recurring <span style={gradText}>Growth Ops</span>
            </h2>

            <p style={{ color: C.muted }}>
              Ongoing execution, optimization, automation, and scaling support.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
              gap: '20px',
            }}
          >
            {recurring.map((plan) => (
              <div
                key={plan.name}
                className="card-hover"
                style={{
                  background: 'rgba(0,229,255,0.04)',
                  border: `1px solid ${C.border}`,
                  borderRadius: '18px',
                  padding: '28px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Montserrat,sans-serif',
                    fontWeight: 700,
                    fontSize: '22px',
                    marginBottom: '12px',
                  }}
                >
                  {plan.name}
                </div>

                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '34px',
                    fontWeight: 700,
                    marginBottom: '18px',
                    ...gradText,
                  }}
                >
                  {plan.price}
                </div>

                <Link
                  href="/contact"
                  className="cta-btn"
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(90deg,#00FFFF,#00E676)',
                    color: '#0A0F1F',
                    padding: '12px 28px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  Book Strategy Call
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: 'Montserrat,sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(28px,5vw,46px)',
              marginBottom: '16px',
            }}
          >
            Ready to <span style={gradText}>Scale?</span>
          </h2>

          <p
            style={{
              color: C.muted,
              maxWidth: '620px',
              margin: '0 auto 28px',
              lineHeight: 1.7,
            }}
          >
            Get a custom growth system built around your business goals,
            workflows, automation, and customer acquisition strategy.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/trial"
              className="cta-btn"
              style={{
                background: C.green,
                color: '#0A0F1F',
                padding: '14px 34px',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '15px',
              }}
            >
              Start Free Trial
            </Link>

            <Link
              href="/contact"
              className="cta-btn"
              style={{
                background: 'transparent',
                color: '#fff',
                padding: '14px 34px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 700,
                fontSize: '15px',
              }}
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
