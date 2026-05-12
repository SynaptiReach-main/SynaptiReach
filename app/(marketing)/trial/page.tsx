export {};
'use client'

import { useState } from 'react'
import Link from 'next/link'

const managedPlans = [
  {
    name: 'Basic',
    ai: 500,
    emails: 1000,
    sms: 500,
    contacts: 500,
    available: true,
    popular: false,
  },
  {
    name: 'Growth',
    ai: 1000,
    emails: 3000,
    sms: 1000,
    contacts: 1000,
    available: true,
    popular: true,
  },
  {
    name: 'Premium',
    ai: 'Locked',
    emails: 'Locked',
    sms: 1500,
    contacts: 'Locked',
    available: false,
    popular: false,
  },
]

const discounts = [
  { duration: '3 Months', off: '10%' },
  { duration: '6 Months', off: '20%' },
  { duration: '9 Months', off: '25%' },
  { duration: '12 Months', off: '30%', best: true },
]

const faqs = [
  {
    q: 'How long is the free trial?',
    a: 'The SynaptiReach free trial lasts 30 days. At the end of the trial, your selected tier automatically renews unless canceled beforehand.',
  },
  {
    q: 'What happens if I run out of credits?',
    a: 'Credits do not refresh during the free trial. If you hit your limit, you must purchase additional credit packs or upgrade your plan.',
  },
  {
    q: 'Can I use my own API keys?',
    a: 'Yes. BYOK mode allows you to connect your own OpenAI, Twilio, and other API providers. You are responsible for all usage costs tied to your own keys.',
  },
  {
    q: 'Are overages allowed?',
    a: 'No. SynaptiReach does not allow overages during the trial period. Usage is hard capped based on your selected trial tier.',
  },
  {
    q: 'Can I access Done-For-You services during trial?',
    a: 'Yes, DFY setup and implementation services are available for an additional fee. Contact SynaptiReach for custom onboarding options.',
  },
]

export default function TrialPage() {
  const [mode, setMode] = useState<'managed' | 'byok'>('managed')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const C = {
    bg: '#0A0F1F',
    card: '#111827',
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
        background: C.bg,
        color: '#fff',
        fontFamily: "'Inter',sans-serif",
        position: 'relative',
        overflow: 'hidden',
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

        button{
          cursor:pointer;
          transition:all .2s ease;
          font-family:inherit;
        }

        @keyframes pulseGlow {
          0%{opacity:.35;transform:scale(1)}
          50%{opacity:.7;transform:scale(1.08)}
          100%{opacity:.35;transform:scale(1)}
        }

        @keyframes synapseMove {
          0%{transform:translateY(0px)}
          50%{transform:translateY(-12px)}
          100%{transform:translateY(0px)}
        }

        @keyframes fadeIn {
          from{
            opacity:0;
            transform:translateY(10px);
          }
          to{
            opacity:1;
            transform:translateY(0);
          }
        }

        .trial-card:hover{
          border-color:rgba(0,229,255,0.35)!important;
          transform:translateY(-4px);
        }

        .cta-btn:hover{
          transform:scale(1.03);
        }

        .faq-btn:hover{
          background:rgba(0,229,255,0.05)!important;
        }
      `}</style>

      {/* GRID */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* GLOW ORBS */}
      <div
        style={{
          position: 'fixed',
          top: '-180px',
          left: '-180px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'rgba(0,229,255,0.18)',
          filter: 'blur(120px)',
          animation: 'pulseGlow 8s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'fixed',
          bottom: '-220px',
          right: '-180px',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'rgba(0,230,118,0.16)',
          filter: 'blur(120px)',
          animation: 'pulseGlow 10s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* SYNAPSES */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.65,
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{
            animation: 'synapseMove 14s ease-in-out infinite',
          }}
        >
          {Array.from({ length: 42 }, (_, i) => {
            const x1 = (i * 137 + 17) % 100
            const y1 = (i * 71 + 11) % 100
            const x2 = ((i + 5) * 137) % 100
            const y2 = ((i + 3) * 71 + 15) % 100

            return (
              <g key={i}>
                <circle
                  cx={x1 + '%'}
                  cy={y1 + '%'}
                  r="2.2"
                  fill="#00E5FF"
                  opacity="0.7"
                />
                <line
                  x1={x1 + '%'}
                  y1={y1 + '%'}
                  x2={x2 + '%'}
                  y2={y2 + '%'}
                  stroke="#00E5FF"
                  strokeWidth="0.7"
                  opacity="0.22"
                />
              </g>
            )
          })}
        </svg>
      </div>

      {/* MAIN */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1180px',
          margin: '0 auto',
          padding: '56px 20px 90px',
          animation: 'fadeIn .5s ease',
        }}
      >
        {/* HERO */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '54px',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '.12em',
              color: C.cyan,
              border: '1px solid rgba(0,229,255,0.35)',
              borderRadius: '50px',
              padding: '5px 18px',
              marginBottom: '18px',
            }}
          >
            30 DAY FREE TRIAL
          </div>

          <h1
            style={{
              fontFamily: 'Montserrat,sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(32px,6vw,60px)',
              lineHeight: 1.1,
              marginBottom: '16px',
            }}
          >
            Launch Your Business With{' '}
            <span style={gradText}>SynaptiReach</span>
          </h1>

          <p
            style={{
              color: C.muted,
              fontSize: '16px',
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Start free for 30 days with AI automation, CRM access, email systems,
            SMS tools, and workflow automation. Choose between SynaptiReach Managed
            Keys or Bring Your Own Keys (BYOK).
          </p>
        </div>

        {/* MODE TOGGLE */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '44px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setMode('managed')}
            style={{
              padding: '12px 28px',
              borderRadius: '50px',
              border: mode === 'managed'
                ? 'none'
                : '1px solid rgba(0,229,255,0.16)',
              background: mode === 'managed'
                ? 'linear-gradient(90deg,#00FFFF,#00E676)'
                : 'rgba(0,229,255,0.06)',
              color: mode === 'managed'
                ? '#0A0F1F'
                : C.muted,
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            ⚡ SynaptiReach Keys
          </button>

          <button
            onClick={() => setMode('byok')}
            style={{
              padding: '12px 28px',
              borderRadius: '50px',
              border: mode === 'byok'
                ? 'none'
                : '1px solid rgba(0,229,255,0.16)',
              background: mode === 'byok'
                ? 'linear-gradient(90deg,#00FFFF,#00E676)'
                : 'rgba(0,229,255,0.06)',
              color: mode === 'byok'
                ? '#0A0F1F'
                : C.muted,
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            🔑 Bring Your Own Keys
          </button>
        </div>

        {/* MANAGED */}
        {mode === 'managed' && (
          <>
            <div
              style={{
                textAlign: 'center',
                marginBottom: '34px',
              }}
            >
              <h2
                style={{
                  fontFamily: 'Montserrat,sans-serif',
                  fontSize: 'clamp(24px,4vw,38px)',
                  fontWeight: 800,
                  marginBottom: '10px',
                }}
              >
                Managed Trial Access
              </h2>

              <p
                style={{
                  color: C.muted,
                  fontSize: '15px',
                  maxWidth: '700px',
                  margin: '0 auto',
                  lineHeight: 1.7,
                }}
              >
                SynaptiReach provides the infrastructure and API usage during the
                trial period. Usage is capped by tier and no overages are allowed.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
                gap: '22px',
                marginBottom: '70px',
              }}
            >
              {managedPlans.map((plan) => (
                <div
                  key={plan.name}
                  className="trial-card"
                  style={{
                    background: plan.popular
                      ? 'linear-gradient(160deg,#091A13,#111827)'
                      : C.card,
                    border: '1px solid ' + (
                      plan.popular ? C.borderHot : C.border
                    ),
                    borderRadius: '18px',
                    padding: '30px',
                    position: 'relative',
                    transition: 'all .25s ease',
                  }}
                >
                  {plan.popular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background:
                          'linear-gradient(90deg,#00FFFF,#00E676)',
                        color: '#0A0F1F',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '4px 16px',
                        borderRadius: '50px',
                        letterSpacing: '.08em',
                      }}
                    >
                      MOST POPULAR
                    </div>
                  )}

                  <div
                    style={{
                      fontFamily: 'Montserrat,sans-serif',
                      fontWeight: 800,
                      fontSize: '24px',
                      marginBottom: '18px',
                    }}
                  >
                    {plan.name}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      marginBottom: '28px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(0,229,255,0.05)',
                        border: '1px solid rgba(0,229,255,0.1)',
                        borderRadius: '12px',
                        padding: '14px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '11px',
                          color: C.dim,
                          marginBottom: '5px',
                        }}
                      >
                        AI CREDITS
                      </div>

                      <div
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: '24px',
                          color: C.cyan,
                          fontWeight: 700,
                        }}
                      >
                        {plan.ai}
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(0,229,255,0.05)',
                        border: '1px solid rgba(0,229,255,0.1)',
                        borderRadius: '12px',
                        padding: '14px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '11px',
                          color: C.dim,
                          marginBottom: '5px',
                        }}
                      >
                        EMAIL LIMIT
                      </div>

                      <div
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: '24px',
                          color: C.green,
                          fontWeight: 700,
                        }}
                      >
                        {plan.emails}
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(0,229,255,0.05)',
                        border: '1px solid rgba(0,229,255,0.1)',
                        borderRadius: '12px',
                        padding: '14px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '11px',
                          color: C.dim,
                          marginBottom: '5px',
                        }}
                      >
                        SMS LIMIT
                      </div>

                      <div
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: '24px',
                          color: '#fff',
                          fontWeight: 700,
                        }}
                      >
                        {plan.sms}
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(0,229,255,0.05)',
                        border: '1px solid rgba(0,229,255,0.1)',
                        borderRadius: '12px',
                        padding: '14px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '11px',
                          color: C.dim,
                          marginBottom: '5px',
                        }}
                      >
                        CONTACT LIMIT
                      </div>

                      <div
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: '24px',
                          color: '#fff',
                          fontWeight: 700,
                        }}
                      >
                        {plan.contacts}
                      </div>
                    </div>
                  </div>

                  <ul
                    style={{
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      marginBottom: '28px',
                    }}
                  >
                    <li
                      style={{
                        color: C.muted,
                        fontSize: '14px',
                        display: 'flex',
                        gap: '8px',
                      }}
                    >
                      <span style={{ color: C.green }}>✓</span>
                      30 Day Access
                    </li>

                    <li
                      style={{
                        color: C.muted,
                        fontSize: '14px',
                        display: 'flex',
                        gap: '8px',
                      }}
                    >
                      <span style={{ color: C.green }}>✓</span>
                      No Overages Allowed
                    </li>

                    <li
                      style={{
                        color: C.muted,
                        fontSize: '14px',
                        display: 'flex',
                        gap: '8px',
                      }}
                    >
                      <span style={{ color: C.green }}>✓</span>
                      Buy Extra Credit Packs If Needed
                    </li>

                    <li
                      style={{
                        color: C.muted,
                        fontSize: '14px',
                        display: 'flex',
                        gap: '8px',
                      }}
                    >
                      <span style={{ color: C.green }}>✓</span>
                      Auto Renew After Trial
                    </li>
                  </ul>

                  <Link
                    href="/pricing"
                    className="cta-btn"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: plan.available
                        ? 'linear-gradient(90deg,#00FFFF,#00E676)'
                        : 'rgba(255,255,255,0.08)',
                      color: plan.available
                        ? '#0A0F1F'
                        : '#7A8C9F',
                      padding: '13px',
                      borderRadius: '50px',
                      fontSize: '14px',
                      fontWeight: 700,
                      pointerEvents: plan.available
                        ? 'auto'
                        : 'none',
                    }}
                  >
                    {plan.available
                      ? 'Select Trial Tier'
                      : 'Premium Locked'}
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {/* BYOK */}
        {mode === 'byok' && (
          <div
            style={{
              background: C.card,
              border: '1px solid ' + C.borderHot,
              borderRadius: '20px',
              padding: '42px',
              marginBottom: '70px',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                marginBottom: '32px',
              }}
            >
              <h2
                style={{
                  fontFamily: 'Montserrat,sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(24px,4vw,38px)',
                  marginBottom: '12px',
                }}
              >
                Bring Your Own Keys (BYOK)
              </h2>

              <p
                style={{
                  color: C.muted,
                  fontSize: '15px',
                  maxWidth: '760px',
                  margin: '0 auto',
                  lineHeight: 1.7,
                }}
              >
                Connect your own APIs and unlock uncapped AI, email, and SMS
                usage. SynaptiReach will guide users through setup instructions
                directly inside the dashboard.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
                gap: '18px',
                marginBottom: '30px',
              }}
            >
              {[
                'OpenAI API Setup',
                'Twilio SMS Setup',
                'Email Provider Setup',
                'Dashboard Integration Guide',
                'Step-by-Step API Tutorials',
                'Unlimited Usage Based On Your Own Billing',
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    background: 'rgba(0,229,255,0.05)',
                    border: '1px solid rgba(0,229,255,0.12)',
                    borderRadius: '14px',
                    padding: '18px',
                    color: C.muted,
                    fontSize: '14px',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'flex-start',
                  }}
                >
                  <span style={{ color: C.green }}>✓</span>
                  {item}
                </div>
              ))}
            </div>

            <div
              style={{
                background: 'rgba(0,229,255,0.05)',
                border: '1px solid rgba(0,229,255,0.12)',
                borderRadius: '14px',
                padding: '22px',
                color: C.muted,
                lineHeight: 1.8,
                fontSize: '14px',
              }}
            >
              Customer is responsible for all costs associated with their own API
              keys and providers. No usage caps are enforced in BYOK mode because
              billing is handled directly through the customer’s connected services.
            </div>
          </div>
        )}

        {/* RULES */}
        <div
          style={{
            marginBottom: '70px',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            <h2
              style={{
                fontFamily: 'Montserrat,sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(24px,4vw,36px)',
                marginBottom: '10px',
              }}
            >
              Trial Rules & Limits
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
              gap: '18px',
            }}
          >
            {[
              'Credits do not refresh during trial',
              'Must purchase credit packs after hitting cap',
              'Upgrade required after limit reached',
              'SMS setup may require Twilio fees',
              'No overages allowed',
              'Auto renews into selected tier after 30 days',
            ].map((rule) => (
              <div
                key={rule}
                style={{
                  background: C.card,
                  border: '1px solid ' + C.border,
                  borderRadius: '14px',
                  padding: '22px',
                  color: C.muted,
                  fontSize: '14px',
                  lineHeight: 1.7,
                }}
              >
                {rule}
              </div>
            ))}
          </div>
        </div>

        {/* DISCOUNTS */}
        <div
          style={{
            background: C.card,
            border: '1px solid ' + C.border,
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '70px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'Montserrat,sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(24px,4vw,36px)',
              marginBottom: '10px',
            }}
          >
            Commitment Discounts
          </h2>

          <p
            style={{
              color: C.muted,
              fontSize: '15px',
              marginBottom: '30px',
            }}
          >
            Lock in longer terms and save more after your trial.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
              gap: '14px',
            }}
          >
            {discounts.map((d) => (
              <div
                key={d.duration}
                style={{
                  background: 'rgba(0,229,255,0.05)',
                  border: '1px solid ' + (
                    d.best
                      ? 'rgba(0,229,255,0.35)'
                      : C.border
                  ),
                  borderRadius: '14px',
                  padding: '22px',
                }}
              >
                <div
                  style={{
                    color: C.dim,
                    fontSize: '12px',
                    marginBottom: '8px',
                  }}
                >
                  {d.duration}
                </div>

                <div
                  style={{
                    fontFamily: 'Montserrat,sans-serif',
                    fontWeight: 800,
                    fontSize: '34px',
                    ...gradText,
                  }}
                >
                  {d.off}
                </div>

                {d.best && (
                  <div
                    style={{
                      color: C.green,
                      fontSize: '11px',
                      marginTop: '8px',
                      fontWeight: 700,
                    }}
                  >
                    BEST VALUE
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div
          style={{
            marginBottom: '70px',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            <h2
              style={{
                fontFamily: 'Montserrat,sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(24px,4vw,36px)',
              }}
            >
              Common Questions
            </h2>
          </div>

          <div
            style={{
              maxWidth: '760px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: C.card,
                  border: '1px solid ' + (
                    openFaq === i
                      ? C.borderHot
                      : C.border
                  ),
                  borderRadius: '14px',
                  overflow: 'hidden',
                }}
              >
                <button
                  className="faq-btn"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '20px 22px',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '15px',
                    fontWeight: 600,
                  }}
                >
                  <span>{faq.q}</span>

                  <span
                    style={{
                      color: C.cyan,
                      fontSize: '22px',
                      transform: openFaq === i
                        ? 'rotate(45deg)'
                        : 'none',
                      transition: 'transform .2s ease',
                    }}
                  >
                    +
                  </span>
                </button>

                {openFaq === i && (
                  <div
                    style={{
                      padding: '0 22px 22px',
                      color: C.muted,
                      fontSize: '14px',
                      lineHeight: 1.8,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT */}
        <div
          style={{
            background: 'linear-gradient(135deg,#091A14,#0D1B2A)',
            border: '1px solid ' + C.borderHot,
            borderRadius: '20px',
            padding: '46px 30px',
            textAlign: 'center',
            boxShadow: '0 0 60px rgba(0,229,255,0.05)',
          }}
        >
          <h2
            style={{
              fontFamily: 'Montserrat,sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(24px,4vw,40px)',
              marginBottom: '14px',
            }}
          >
            Questions About Your Trial?
          </h2>

          <p
            style={{
              color: C.muted,
              fontSize: '15px',
              maxWidth: '700px',
              margin: '0 auto 24px',
              lineHeight: 1.7,
            }}
          >
            Contact SynaptiReach for custom pricing, DFY onboarding, or help
            choosing the right setup for your business.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '14px',
              marginBottom: '26px',
            }}
          >
            <div
              style={{
                background: 'rgba(0,229,255,0.07)',
                border: '1px solid rgba(0,229,255,0.14)',
                borderRadius: '50px',
                padding: '12px 20px',
                color: C.cyan,
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              📞 555-555-5555
            </div>

            <div
              style={{
                background: 'rgba(0,229,255,0.07)',
                border: '1px solid rgba(0,229,255,0.14)',
                borderRadius: '50px',
                padding: '12px 20px',
                color: C.cyan,
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              ✉️ SynaptiReach@gmail.com
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '14px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/contact"
              className="cta-btn"
              style={{
                background: 'linear-gradient(90deg,#00FFFF,#00E676)',
                color: '#0A0F1F',
                padding: '14px 34px',
                borderRadius: '50px',
                fontSize: '15px',
                fontWeight: 700,
              }}
            >
              Contact SynaptiReach
            </Link>

            <Link
              href="/pricing"
              style={{
                background: 'transparent',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '14px 34px',
                borderRadius: '50px',
                fontSize: '15px',
                fontWeight: 600,
              }}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
