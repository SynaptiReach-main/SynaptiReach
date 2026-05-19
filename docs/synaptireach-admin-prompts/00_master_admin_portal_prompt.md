# SynaptiReach Admin + Admin Staff Portal Master Prompt

## Purpose

You are building the **SynaptiReach Admin Portal** and **SynaptiReach Admin Staff Portal**.

This is a production-grade internal operating system for managing the full SynaptiReach business, including:

- SaaS user administration
- User CRM control
- Admin impersonation
- Marketing service fulfillment
- AI service fulfillment
- Staff management
- Service orders
- Approval and denial workflows
- Client health monitoring
- Client/prospect discovery
- Revenue tracking
- Internal automation
- Admin AI tools
- Staff AI tools
- Mini-brain intelligence
- Knowledge base
- Templates
- Reports
- Audit logs
- Integrations

The Admin Portal must give the owner full command over SynaptiReach while keeping staff access restricted, secure, role-based, and auditable.

---

## Non-Negotiable Build Rules

1. Use **real application data only**.
2. Do **not** hardcode users, clients, campaigns, CRM records, service orders, tasks, approvals, revenue, prospects, analytics, staff, or reports.
3. Do **not** use mock data, fake data, demo data, placeholder records, simulated data, static sample records, or hardcoded metrics.
4. If real data does not exist, show a clean empty state with a useful next action.
5. Do not break the existing SynaptiReach User CRM.
6. Do not remove existing working features unless absolutely necessary.
7. Preserve the existing project architecture when possible.
8. Build modularly so every system can expand later.
9. Every admin/staff action that changes important data must be auditable.
10. Every sensitive action must respect role-based access control.
11. Every AI-generated output that can affect a client, campaign, workflow, or user account must support approval/review before execution.
12. Every destructive action must require confirmation.
13. Every page must be responsive.
14. Every page must follow the SynaptiReach visual design system.

---

## SynaptiReach Visual Design System

Use the existing SynaptiReach dark premium UI style:

- Dark background
- Premium SaaS dashboard feel
- Cyan-to-green gradients
- No flat solid green as a primary color
- Glow accents
- Synapse/network-inspired visual energy
- Card-based layouts
- High-contrast panels
- Clean spacing
- Modern typography
- Prominent SynaptiReach branding
- Large, confident command-center feel
- AI-native and high-tech atmosphere
- Smooth interactions when appropriate
- No cluttered admin UI

The interface should feel like an advanced operating system for running a SaaS, CRM, marketing agency, AI automation agency, and growth command center.

---

## Portal Types

Build two related but separated portal experiences:

### 1. Owner/Admin Portal

The Owner/Admin Portal is the complete command center.

Owner/admin must be able to:

- View all users
- Manage all users
- Enter any user's CRM
- Manage any user's CRM records
- Manage campaigns
- Manage workflows
- Manage service orders
- Manage AI outputs
- Approve/deny/revise everything
- Assign staff
- Manage staff roles and permissions
- View all revenue
- View all analytics
- View all audit logs
- Manage templates
- Manage knowledge base
- Manage integrations
- Discover prospects
- Create proposals
- Build packages
- Launch or schedule approved outreach/campaigns
- Access owner-only AI command tools
- Access the Admin Mini-Brain
- View and control the health of the entire business

### 2. Admin Staff Portal

The Admin Staff Portal is a restricted execution workspace.

Staff should be able to:

- See assigned clients
- See assigned tasks
- See assigned service orders
- Use permitted service tools
- Use a staff-scoped AI copilot
- Submit work for approval
- Request missing information
- Leave internal notes
- View relevant client context
- Follow service checklists
- Track their assigned work
- Communicate internally

Staff must not automatically access:

- All users
- Global revenue
- Billing settings
- System settings
- Owner-only AI tools
- Sensitive audit logs
- Other staff private performance
- Unassigned client accounts
- CRM impersonation unless explicitly permitted

---

## Required Admin Navigation

Create these Admin Portal sections:

- Command Center
- Users / Clients
- Enter User CRM
- Service Orders
- Approvals
- Tasks
- Staff
- Campaigns
- Workflows
- AI Assistant
- Mini-Brain
- Client Finder
- Prospects
- Proposals
- Packages
- Revenue
- Analytics
- Reports
- Templates
- Knowledge Base
- Integrations
- Audit Logs
- Settings

---

## Required Admin Staff Navigation

Create these Admin Staff Portal sections:

- My Dashboard
- My Clients
- My Tasks
- My Service Orders
- My Approvals
- Campaign Tools
- Workflow Tools
- Content Tools
- AI Copilot
- Knowledge Base
- Reports

Only show staff the sections they have permission to access.

---

## Admin Command Center

The Command Center is the owner's main dashboard.

It should include real-data-based sections for:

### Business Overview

- Total users
- Active users
- New signups
- Paying users
- Trial users
- Canceled users
- At-risk clients
- Recently active clients
- Low-activity clients

### Revenue Overview

- MRR if available
- ARR if available
- One-time service revenue
- Monthly service revenue
- Open invoices
- Failed payments
- Revenue by service
- Revenue by client
- Top services by revenue

### Operations Overview

- New service orders
- Active service orders
- Overdue service orders
- Staff workload
- Tasks due today
- Blocked tasks
- Work waiting on clients
- Work waiting on admin

### Approval Overview

- Pending approvals
- Denied items
- Revision requests
- Items waiting on client approval
- Items waiting on admin approval
- AI-generated items pending review

### CRM/System Health

- Failed workflows
- Failed automations
- Integration issues
- Data sync issues
- User accounts needing attention
- Campaigns with issues
- Clients with no recent follow-up

### Growth Opportunities

- Upsell opportunities
- Client Finder leads
- Prospects ready for outreach
- Clients needing service recommendations
- At-risk clients that need retention actions

### AI Recommendations

- Next best actions
- Client risk alerts
- Service opportunities
- Workflow suggestions
- Staff bottleneck warnings
- Revenue opportunity alerts

Every card must be actionable and route to the relevant page.

---

## User/Client Management

Create a complete user/client directory using real data.

Each user/client record should support available fields such as:

- Name
- Business name
- Email
- Phone
- Account status
- Subscription/plan
- Signup date
- Last login
- Assigned staff
- Services purchased
- CRM usage
- Client health score
- Tags
- Internal notes
- Revenue generated
- Open service orders
- Approval items
- Support history if available

Admin actions should include:

- View user
- Edit user
- Assign staff
- Change status
- Add internal note
- Add/remove tags
- View CRM records
- View service orders
- View billing/revenue history if available
- Enter user CRM
- Export user data if supported
- Suspend/archive user if supported
- Delete user only with strong confirmation and permission checks

---

## Admin CRM Impersonation

Admin must be able to enter any user's CRM and manage it as if they were the user.

Requirements:

- Admin can enter a selected user's CRM.
- Admin sees the actual user dashboard and CRM state.
- Admin can manage contacts, leads, opportunities, campaigns, automations, tasks, messages, analytics, settings, and workflows according to permissions.
- The UI must show a persistent Admin Impersonation banner.
- The banner should clearly identify:
  - The real logged-in admin
  - The target user/client account being managed
  - A clear Exit Impersonation button
- The system must distinguish between:
  - The authenticated admin actor
  - The target user/account context
- Every action inside impersonation mode must be logged.
- Destructive actions inside impersonation mode must require confirmation.
- Staff may only impersonate users if explicitly permitted.
- Consider requiring a reason/note before entering CRM impersonation mode.

Audit log for impersonation must capture:

- Admin/staff actor ID
- Target user ID
- Target organization/account ID if available
- Timestamp
- Action performed
- Entity changed
- Old value if available
- New value if available
- Reason if required
- IP/device/session metadata if available

---

## Roles and Permissions

Support role-based access control.

Recommended roles:

- Owner
- Super Admin
- Admin Manager
- Staff Manager
- Marketing Specialist
- AI Specialist
- CRM Specialist
- SEO Specialist
- GMB Specialist
- Designer
- Copywriter
- Sales / Client Finder
- Support Agent
- Read-Only Auditor
- Contractor

Permission categories:

- View users
- Edit users
- Enter user CRM
- View assigned clients
- Manage campaigns
- Manage workflows
- Manage service orders
- Manage tasks
- Manage approvals
- Use AI tools
- Use client finder
- View revenue
- Manage billing
- Manage staff
- Manage templates
- Manage knowledge base
- Manage integrations
- Export data
- Delete data
- View audit logs
- Manage settings

Owner and Super Admin can access everything.

Staff should only see records assigned to them unless they have broader permissions.

---

## Staff Assignment System

Admin must be able to assign:

- Clients to staff
- Service orders to staff
- Tasks to staff
- Campaigns to staff
- Workflow work to staff
- Approval items to reviewers
- Prospect outreach to sales staff
- Internal projects to staff

Assignments should support:

- Assigned staff member
- Client
- Related service
- Priority
- Status
- Due date
- Description
- Internal notes
- Required deliverables
- Files/assets if supported
- AI-generated brief if supported
- Approval requirements

---

## Global Approval and Denial System

Create a central approval system for work that needs admin, staff, or client review.

Approval item types:

- Email campaign
- SMS campaign
- Landing page
- Workflow automation
- CRM setup
- Offer optimization
- Funnel copy
- Lead magnet
- A/B test
- Conversion audit
- Customer journey map
- Segmentation strategy
- Retargeting setup
- AI campaign strategy
- AI persona model
- AI funnel optimization
- Logo design
- Branding kit
- SEO optimization
- Local SEO
- Social media content
- Content calendar
- GMB optimization
- GMB monthly work
- AI-generated recommendation
- Staff-created deliverable
- Prospect outreach message
- Proposal

Approval actions:

- Approve
- Deny
- Edit and approve
- Request revision
- Assign reviewer
- Send to client for approval
- Publish immediately
- Schedule for later
- Save as template
- Archive
- Escalate

Each approval item should include:

- Client
- Service type
- Created by
- Assigned reviewer
- Status
- Priority
- Due date
- Preview
- Internal notes
- Client-facing notes
- AI confidence score if available
- Risk/compliance warnings if available
- Revision history
- Approval history

Every approval, denial, edit, publish, revision request, and escalation must be logged.

---

## Service Fulfillment Engine

Build a real service fulfillment operating system for every SynaptiReach service.

### Marketing Services - Execution

- Email Campaign - $149
- SMS Campaign - $179
- Landing Page - $399
- Workflow Setup - $249
- CRM Setup - $399

### Marketing Services - Strategy

- Offer Optimization - $249
- Funnel Copywriting - $399
- Lead Magnet Creation - $299
- A/B Testing - $249
- Conversion Audit - $299

### Advanced

- Customer Journey Mapping - $499
- Segmentation Strategy - $399
- Retargeting Setup - $499

### AI Services

- AI Campaign Strategy - $399
- AI Persona Modeling - $349
- AI Funnel Optimization - $499

### Branding & SEO

- Logo Design - $249
- Branding Kit - $599
- SEO Optimization - $499
- Local SEO - $399

### Social & GMB

- Social Media Management - $599/mo
- Content Calendar - $249
- GMB Optimization - $299
- GMB Monthly Management - $299/mo

Each service should support:

- Service order page
- Intake section
- Internal brief
- Client context
- Assigned staff
- Status
- Priority
- Due date
- Checklist
- AI assistant panel
- Deliverables
- Approval flow
- Revision history
- Internal notes
- Client-facing notes
- Files/assets if supported
- Completion button
- Upsell recommendation
- Report/export if applicable

Service statuses:

- New
- Intake Needed
- Assigned
- In Progress
- Waiting on Client
- Waiting on Admin
- Needs Revision
- Ready for Approval
- Approved
- Scheduled
- Delivered
- Complete
- Blocked
- Archived

When a service order is created, generate or attach the correct workflow/checklist for that service type.

---

## Service-Specific Admin Tools

Each service should have AI-assisted fulfillment tools.

### Email Campaign

Tools:

- Campaign objective builder
- Audience selector
- Segment builder
- Subject line generator
- Email body generator
- Personalization token manager
- Spam risk checker
- CTA optimizer
- Preview mode
- A/B subject test suggestion
- Send/schedule controls
- Approval queue
- Performance tracker

### SMS Campaign

Tools:

- SMS copy generator
- Compliance warning checker
- Character counter
- Short link manager
- Audience segment selector
- Opt-out compliance checker
- Send/schedule controls
- Response tracker
- Approval queue

### Landing Page

Tools:

- Page brief generator
- Offer builder
- Hero section generator
- CTA builder
- Section layout planner
- Copy generator
- Form builder
- Lead capture configuration
- Mobile preview
- SEO metadata generator
- Conversion checklist
- Approval workflow
- Publish/schedule controls

### Workflow Setup

Tools:

- Workflow builder
- Trigger selector
- Action selector
- Condition builder
- Delay manager
- Message templates
- Testing mode
- Error detection
- Approval flow
- Activation controls
- Workflow logs

### CRM Setup

Tools:

- CRM onboarding wizard
- Pipeline builder
- Contact field mapper
- Opportunity stage builder
- Task template builder
- Automation starter kit
- Import contacts
- Data cleanup assistant
- User training checklist
- CRM health score

### Offer Optimization

Tools:

- Current offer analyzer
- Offer clarity score
- Value proposition builder
- Pain point mapper
- Competitor positioning notes
- Guarantee/risk reversal builder
- Pricing structure assistant
- CTA recommendation tool

### Funnel Copywriting

Tools:

- Funnel stage mapper
- Landing page copy builder
- Email copy builder
- SMS copy builder
- Ad copy builder
- Objection handling library
- CTA library
- Tone and brand voice settings
- Copy approval queue

### Lead Magnet Creation

Tools:

- Lead magnet idea generator
- Audience pain point analyzer
- Format selector
- Outline builder
- Copy generator
- Design brief builder
- Landing page connection
- Delivery email builder
- Follow-up sequence builder

### A/B Testing

Tools:

- Test idea generator
- Hypothesis builder
- Variant builder
- Metric selector
- Test duration estimator
- Traffic requirement estimator
- Results analyzer
- Winner recommendation
- Learnings archive

### Conversion Audit

Tools:

- Website audit
- Landing page audit
- Funnel audit
- CTA audit
- Form audit
- Mobile audit
- Speed audit
- Trust factor audit
- Messaging audit
- Friction score
- Priority recommendation list

### Customer Journey Mapping

Tools:

- Journey stage builder
- Touchpoint mapper
- Lead source mapper
- Emotion/friction mapper
- Automation opportunity finder
- Follow-up gap detector
- Lifecycle stage builder
- Journey visualization
- Recommended workflow builder

### Segmentation Strategy

Tools:

- Contact database analyzer
- Segment builder
- Behavior-based grouping
- Tag recommendation
- Lifecycle segmentation
- Campaign segment suggestions
- Revenue segment analysis
- Engagement segment analysis

### Retargeting Setup

Tools:

- Retargeting checklist
- Pixel/status checker
- Audience builder
- Offer selector
- Ad copy generator
- Landing page connection
- Campaign tracking setup
- Approval queue

### AI Campaign Strategy

Tools:

- Campaign goal builder
- Audience intelligence panel
- AI message strategy
- Channel recommendation
- Automation recommendation
- Campaign timeline
- Content generator
- Approval workflow

### AI Persona Modeling

Tools:

- Customer persona builder
- Demographic profile
- Pain point profile
- Objection profile
- Buying motivation profile
- Message preference profile
- Offer-fit profile
- Persona export

### AI Funnel Optimization

Tools:

- Funnel performance analyzer
- Drop-off detector
- Message gap detector
- CTA optimizer
- Automation gap finder
- AI recommendation engine
- Funnel improvement plan
- Before/after strategy

### Logo Design

Tools:

- Brand intake form
- Style preference selector
- Competitor reference board
- Logo brief generator
- Designer task assignment
- Concept approval queue
- Revision tracker
- Final asset delivery checklist

### Branding Kit

Tools:

- Brand identity builder
- Color palette manager
- Typography manager
- Voice/tone guide
- Logo usage rules
- Social profile kit
- Brand asset library
- Final brand guide generator

### SEO Optimization

Tools:

- Website crawl/import
- Keyword tracker
- Metadata editor
- On-page SEO checklist
- Content gap finder
- Internal link suggestions
- Technical SEO issue tracker
- SEO recommendation queue

### Local SEO

Tools:

- Local listing audit
- NAP consistency checker
- Local keyword tracker
- Location page checklist
- Review strategy builder
- Citation opportunity tracker
- Local ranking monitor

### Social Media Management

Tools:

- Content calendar
- Post generator
- Platform selector
- Asset manager
- Approval queue
- Scheduling integration
- Monthly report generator
- Engagement tracker
- Staff assignment

### Content Calendar

Tools:

- Monthly calendar builder
- Industry theme generator
- Campaign alignment tool
- Post topic generator
- Holiday/event integration
- Approval workflow
- Export/share tool

### GMB Optimization

Tools:

- GMB profile audit
- Category checker
- Description optimizer
- Services/products optimizer
- Photo checklist
- Review response builder
- Local post generator
- Optimization checklist

### GMB Monthly Management

Tools:

- Monthly GMB task queue
- Review monitoring
- Post scheduler
- Photo update tracker
- Q&A manager
- Insights tracker
- Monthly report generator

---

## Admin AI Assistant

Build an internal Admin AI Assistant for SynaptiReach operations.

The Admin AI Assistant should help with:

- Managing clients
- Reviewing campaigns
- Creating service deliverables
- Auditing CRM accounts
- Finding growth opportunities
- Detecting user issues
- Prioritizing work
- Summarizing accounts
- Generating strategy
- Creating workflows
- Drafting emails/SMS
- Creating landing page copy
- Reviewing funnel performance
- Finding potential clients
- Writing outreach
- Preparing fulfillment checklists
- Suggesting upsells
- Creating client reports
- Detecting churn risk
- Creating tasks for staff
- Explaining analytics
- Improving automations
- Recommending next best actions

AI modes:

1. Command Mode
2. Strategy Mode
3. Fulfillment Mode
4. Intelligence Mode
5. Automation Builder Mode
6. Client Finder Mode
7. Quality Control Mode

Requirements:

- AI must use real selected context when available.
- Show what context the AI is using.
- Do not fake AI results.
- If no AI backend exists, build clean interfaces and UI states ready for real AI calls.
- AI outputs that affect clients must support approval.
- AI should not perform destructive actions without confirmation.
- Staff AI Copilot should only access assigned client/task context.
- Owner-only AI tools should not be available to staff unless permitted.

---

## Admin Mini-Brain

The Mini-Brain is the internal intelligence layer for SynaptiReach.

It should organize:

- SynaptiReach services
- Pricing
- Fulfillment processes
- Client history
- Client preferences
- Staff capabilities
- Brand rules
- Campaign learnings
- Approval patterns
- Denial reasons
- Best-performing templates
- Industry playbooks
- Sales objections
- Outreach strategies
- Upsell patterns
- Workflow recommendations
- Service fit intelligence
- Prospect scoring logic

Features:

- Internal memory per client
- Internal memory per service
- Internal knowledge base
- Best practices library
- Prompt library
- Campaign performance memory
- Offer intelligence database
- Industry playbooks
- Approval pattern learning
- Denial reason tracking
- Workflow recommendation engine
- Upsell recommendation engine
- Client health prediction
- Churn risk prediction
- Lead quality prediction

---

## Client Finder / Prospect Discovery

Build an internal prospect discovery and scoring system.

The Client Finder should help identify businesses that may need SynaptiReach services.

Potential weaknesses to detect:

- Poor website
- No website
- Weak SEO
- Missing or weak Google Business Profile
- Low review count
- Poor review responses
- Inconsistent branding
- No clear offer
- Weak CTA
- Slow website
- No lead capture
- No email follow-up
- No SMS follow-up
- No retargeting
- Poor social activity
- No content calendar
- Bad local SEO
- No visible CRM/funnel system
- Poor mobile experience
- No lead magnet
- No automation
- Inconsistent NAP information
- Outdated logo/branding
- No booking system
- Weak customer journey

Potential real data sources/integration-ready abstractions:

- Google Business Profile / Places API
- Search result APIs
- Public business websites
- Business directories where allowed
- Local chamber directories
- Public social profiles where allowed
- Technology detection APIs
- PageSpeed Insights
- SEO APIs
- Review APIs where permitted
- Manual CSV import
- Manual prospect entry

Client Finder must respect privacy, platform terms, anti-spam laws, and compliant outreach practices.

Prospect filters:

- Industry
- Location
- City
- State
- Country
- Business size
- Review count
- Rating
- Website exists/does not exist
- Website quality score
- SEO score
- GMB score
- Social activity
- Estimated opportunity value
- Service fit
- Contact availability
- Last discovered date
- Outreach status
- Assigned staff
- Priority
- Lead score

Prospect scores:

- Marketing weakness score
- AI automation opportunity score
- CRM opportunity score
- Local SEO opportunity score
- Branding weakness score
- Funnel weakness score
- Outreach readiness score
- Revenue potential score
- Confidence score

Prospect actions:

- Save prospect
- Assign prospect to staff
- Generate mini audit
- Generate outreach email
- Generate SMS script
- Generate call script
- Generate service recommendation
- Add to outreach campaign
- Mark contacted
- Mark interested
- Mark not interested
- Convert to lead
- Convert to client
- Create CRM account
- Create proposal
- Create service package
- Schedule follow-up

Do not create fake prospects. Use real integrations when available. If integrations are missing, build service abstractions and empty states.

---

## Internal Task and Project Management

Create an internal task/project system for admin and staff operations.

Task fields:

- Title
- Description
- Client
- Service
- Related CRM item if available
- Assigned staff
- Priority
- Status
- Due date
- Internal notes
- Attachments if supported
- Checklist
- AI recommendations
- Approval requirements

Task statuses:

- New
- Assigned
- In Progress
- Waiting on Client
- Waiting on Admin
- Needs Revision
- Approved
- Scheduled
- Complete
- Blocked
- Archived

Task views:

- My tasks
- Team tasks
- Client tasks
- Service tasks
- Overdue tasks
- Approval tasks
- High-priority tasks
- Blocked tasks

---

## Client Health and Risk System

Each user/client should have a health score when enough real data exists.

Health inputs may include:

- Login activity
- CRM usage
- Campaign performance
- Automation failures
- Missed tasks
- Subscription status
- Service order activity
- Support complaints
- Low engagement
- Declining lead flow
- Failed payments
- No recent campaigns
- Unapproved pending items
- Poor campaign results

Risk categories:

- Healthy
- Needs Attention
- At Risk
- Critical
- Churn Likely

AI should recommend:

- Retention action
- Upsell opportunity
- Support outreach
- CRM cleanup
- Campaign improvement
- Workflow fix
- Strategy call

---

## Revenue Command Center

Build a real-data revenue center.

Metrics:

- MRR
- ARR
- One-time service revenue
- Monthly service revenue
- Average revenue per user
- Lifetime value if available
- Churn if available
- New subscriptions
- Canceled subscriptions
- Failed payments
- Open invoices
- Service sales by category
- Most profitable services if enough data exists
- Staff productivity vs revenue if enough data exists
- Client revenue history

Actions:

- View invoice if supported
- Mark service paid if supported
- Issue refund only if integration supports it and permission allows it
- Change plan if supported
- Add manual service order
- Create package
- Generate proposal
- Track unpaid balances

Do not fake financial data.

---

## Service Package Builder

Admin should be able to create service bundles.

Package examples:

- Local Growth Starter
- CRM Setup + Workflow Setup
- GMB Optimization + Local SEO
- AI Funnel Optimization + Email Campaign
- Landing Page + Funnel Copywriting
- Social Growth Monthly
- Full Marketing Automation Setup

Package builder fields:

- Selected services
- One-time services
- Monthly services
- Discount
- Total price
- Monthly price
- Proposal copy
- Client-facing summary
- Internal fulfillment plan
- AI-generated recommendation reason
- Save as template
- Send for approval

---

## Proposal Builder

Admin should be able to create proposals for prospects or clients.

Proposal sections:

- Client/prospect
- Problem summary
- Recommended services
- Expected outcomes
- Timeline
- Pricing
- Deliverables
- Terms
- Approval status
- Payment link if available
- Internal notes
- Client-facing summary

AI should assist with:

- Writing persuasive proposals
- Recommending service bundles
- Matching services to business weaknesses
- Creating urgency
- Explaining ROI
- Turning Client Finder audits into proposals

---

## Template Library

Admin should manage reusable templates.

Template types:

- Email campaigns
- SMS campaigns
- Landing pages
- Workflows
- Funnels
- Lead magnets
- Content calendars
- Social posts
- GMB posts
- Review responses
- SEO metadata
- Proposals
- Client reports
- Internal checklists
- Service fulfillment workflows

Template metadata:

- Service type
- Industry
- Goal
- Tone
- Funnel stage
- Approval status
- Usage count
- Performance data if available
- Created by
- Last updated

---

## Knowledge Base

Create an internal knowledge base.

Sections:

- SynaptiReach service playbooks
- Industry playbooks
- Campaign templates
- Workflow templates
- Email templates
- SMS templates
- Landing page templates
- Audit templates
- SEO checklists
- GMB checklists
- Branding checklists
- Sales scripts
- Outreach scripts
- Staff training
- Client onboarding guides
- Internal SOPs

AI should be able to search and use this knowledge base when backend support exists.

---

## Reporting Center

Reports should support:

- Client reports
- Service reports
- Campaign reports
- Staff reports
- Revenue reports
- CRM health reports
- Prospect reports
- Monthly summaries

Reports should be based on real data only.

---

## Integrations Health Center

The Integrations page should show:

- Connected integrations
- Integration status
- Sync status
- Last sync
- Failed syncs
- API connection health
- Required actions
- Permission state
- Webhook status if available

Do not fake integration status.

---

## Audit Logs

Audit logs should track:

- Admin impersonation
- User changes
- CRM changes
- Campaign approvals
- Denials
- Revisions
- Staff actions
- Service order changes
- Workflow changes
- Billing-related changes
- Data exports
- Destructive actions
- Permission changes
- AI-generated actions
- Published campaign actions

Audit logs should be read-only except for owner-level retention/export controls.

---

## Suggested Data/Entity Areas

Use or create real-data-ready entities as appropriate for the existing stack:

- users
- organizations
- crm_accounts
- contacts
- leads
- opportunities
- campaigns
- workflows
- automations
- automation_logs
- service_orders
- service_tasks
- staff_users
- staff_roles
- permissions
- approval_items
- audit_logs
- admin_sessions
- impersonation_logs
- client_notes
- internal_notes
- ai_outputs
- ai_approval_records
- prospects
- prospect_scores
- outreach_messages
- proposals
- packages
- invoices
- subscriptions
- reports
- templates
- knowledge_base_items
- client_health_scores
- integrations
- integration_logs

Adapt names to the existing project/database conventions instead of forcing these names if the project already has equivalents.

---

## High-Tech Upgrade Features

Add architecture and UI support for these advanced admin features:

### Admin Mission Control

A command-style interface where admin can type actions such as:

- Open all pending landing page approvals.
- Find clients who need Local SEO.
- Create a package for a selected client.
- Show failed workflows from this week.
- Audit a staff member's assigned clients.
- Find prospects in a specific industry/location.

### AI Next Best Action Engine

For every client, recommend the next best action:

- Launch reactivation campaign
- Offer CRM Setup
- Fix failed workflow
- Create lead magnet
- Run conversion audit
- Schedule client check-in
- Improve GMB description
- Create SMS follow-up sequence

### SynaptiReach Opportunity Radar

A feed of opportunities:

- Client needs upsell
- Campaign underperforming
- Prospect found
- Staff overloaded
- Service order overdue
- Automation failure
- New client onboarding incomplete
- Approval item waiting too long
- Client at risk
- High-value account growing

### Client Account Snapshot

One-click AI summary of any client:

- Who they are
- What services they bought
- What their CRM contains
- What is working
- What is broken
- What is pending
- What should happen next
- What upsells make sense
- What staff should do

### Internal AI Quality Control

Before content goes to client, AI reviews:

- Clarity
- Brand fit
- Conversion strength
- Compliance
- Grammar
- Offer alignment
- Funnel alignment
- CTA strength
- Risk level
- Missing information

### Staff Copilot

Staff get an AI copilot limited to assigned work.

It helps them:

- Understand client context
- Complete checklists
- Draft deliverables
- Ask for missing info
- Submit work for approval
- Avoid mistakes
- Follow SynaptiReach standards

---

## Feature Flags and Safety Layer

Build feature flag support where appropriate.

Feature flags should allow admin to safely enable/disable:

- CRM impersonation
- Client Finder
- AI Assistant
- Staff Copilot
- Service Fulfillment Engine
- Revenue Command Center
- Proposal Builder
- Package Builder
- Integrations
- Advanced reports

Admin safety layer should include:

- Permission checks
- Confirmation modals
- Audit logging
- Reason capture for high-risk actions
- Owner-only controls
- Restricted staff visibility
- Read-only modes
- Destructive action protection

---

## Expected Implementation Style

When implementing any phase:

1. Inspect the existing codebase first.
2. Reuse existing components where appropriate.
3. Preserve existing working User CRM behavior.
4. Create reusable admin components.
5. Create data-ready hooks/services.
6. Use real database/API sources.
7. Use empty states instead of fake data.
8. Add permission checks.
9. Add audit-ready action points.
10. Keep UI consistent with SynaptiReach branding.
11. Keep code modular and maintainable.
12. Provide a concise implementation summary when done.
13. Mention any missing backend pieces, database migrations, or integrations required.

---

## Final Goal

The SynaptiReach Admin Portal should become the internal operating system for the entire company.

It should combine:

- SaaS admin control
- CRM super-admin access
- Agency service fulfillment
- Staff management
- AI automation
- Prospect discovery
- Approval workflows
- Business intelligence
- Client health monitoring
- Revenue tracking
- Service production tools
- Internal knowledge and memory
- Secure auditability
- Real-data-first architecture

The Admin Staff Portal should be a restricted execution workspace where staff complete assigned work efficiently with AI assistance, while protecting owner-level data and controls.
