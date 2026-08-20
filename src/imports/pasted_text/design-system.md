MASTER DESIGN SYSTEM — WEIGHBRIDGE MANAGEMENT SOFTWARE

Design a premium enterprise-grade weighbridge management application for an industrial company operating 5 physical weighbridges.

The product has exactly 3 roles:
1. Super Admin — software provider/platform management
2. Admin — client/company management
3. Employee/Operator — daily weighbridge operations

The client operates 5 weighbridges:
WB-01, WB-02, WB-03, WB-04, WB-05.

VISUAL STYLE:
Modern industrial SaaS, professional, clean, reliable, operational, data-focused and highly usable for employees working long hours.

COLOR THEME:
Primary Orange: #F97316
Primary Hover: #EA580C
Primary Soft: #FFF7ED
Primary Light: #FFEDD5

Light Mode:
Background: #F8FAFC
Surface: #FFFFFF
Elevated Surface: #FFFFFF
Primary Text: #111827
Secondary Text: #4B5563
Muted Text: #6B7280
Border: #E5E7EB
Divider: #F1F5F9

Dark Mode:
Background: #111827
Surface: #1F2937
Elevated Surface: #273449
Primary Text: #F9FAFB
Secondary Text: #D1D5DB
Muted Text: #9CA3AF
Border: #374151

STATUS COLORS:
Success / Online: #16A34A
Warning: #F59E0B
Error / Offline: #DC2626
Information: #2563EB
Processing / Weighing: #8B5CF6
Neutral: #64748B

Always use status color together with an icon and text. Never communicate status using color alone.

TYPOGRAPHY:
Use Inter throughout the product.

Typography:
Display: 40–48px
Heading 1: 32–40px
Heading 2: 24–32px
Heading 3: 20–28px
Heading 4: 18–24px
Body Large: 16–24px
Body: 14–20px
Body Small: 13–18px
Label: 12–16px
Caption: 11–16px

Use bold/tabular numerals for weight measurements and important numeric data.

GRID & SPACING:
Use a 4px spacing system:
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80.

Cards: 20–24px internal padding.
Inputs: 44–48px height.
Buttons: 44–48px height.
Table rows: approximately 56px.
Desktop sidebar: approximately 248px.

BORDER RADIUS:
4px extra-small
6px small
8px medium
12px large
16px extra-large
999px pill/status badges

Use 8px for buttons and inputs.
Use 12px for cards.
Use pill shape for status badges.

SHADOWS:
Use subtle professional shadows only.
Small: 0 1px 2px rgba(0,0,0,0.05)
Medium: 0 4px 12px rgba(0,0,0,0.08)
Large: 0 12px 30px rgba(0,0,0,0.12)

Avoid excessive shadows and decorative effects.

WEB LAYOUT:
Desktop application uses:
- 248px left sidebar
- top navigation/header
- responsive main content area
- maximum content width where appropriate
- generous but efficient spacing
- data-dense enterprise layout

SIDEBAR:
Light mode: white
Dark mode: #1F2937
Active navigation uses Primary Orange with Primary Soft background.
Use clear line-style icons.
Navigation must be consistent across screens.

COMMON COMPONENTS:
Create reusable components and variants for:
- Buttons
- Inputs
- Selects
- Search
- Filters
- Dropdowns
- KPI cards
- Weighbridge cards
- Weight display
- Status badges
- Tables
- Alerts
- Toasts
- Modals
- Drawers
- Tabs
- Pagination
- Charts
- Vehicle cards
- Transaction cards
- Ticket components
- Employee components
- Navigation
- Empty states
- Loading states
- Error states

WEIGHBRIDGE COMPONENT:
Each weighbridge card must support:
- Online
- Available
- Weighing
- Offline
- Maintenance
- Disabled

Example:
WB-01
● ONLINE
Vehicle: TN20AB1234
Weight: 38,500 KG
Operator: Arun
Today's vehicles: 58

LIVE WEIGHT COMPONENT:
Make the actual weight visually dominant.
Example:
38,500 KG
● WEIGHT STABLE

States:
- Stabilizing
- Stable
- Captured
- Offline
- Overload
- Error

Use large tabular numerals for weight.

TABLE DESIGN:
Tables must be clean and highly readable.
Include:
- Search
- Filters
- Sort
- Status
- Row actions
- Pagination
- Export where appropriate

RESPONSIVE DESIGN:
Desktop first for Admin.
Tablet and mobile must adapt rather than simply shrink the desktop layout.
Mobile operator screens must prioritize:
- Live weight
- Start Weighment
- Vehicle information
- Current weighbridge
- Status
- Primary actions

MOBILE NAVIGATION:
Home
Weigh
Transactions
Alerts
More

DARK MODE:
Create a true dark mode using the dark color tokens above.
Do not simply invert colors.
Use borders and surface elevation rather than heavy shadows.
Orange remains the primary action color.

ACCESSIBILITY:
Maintain strong text contrast.
Use icons + labels for statuses.
Do not rely on color alone.
Buttons must have clear labels.
Interactive controls must have obvious hover, focus, active, disabled and error states.

DESIGN QUALITY:
Use Auto Layout.
Use reusable components.
Use Figma Variables where possible.
Maintain consistent spacing and alignment.
Avoid unnecessary gradients, excessive rounded corners, glassmorphism, excessive illustrations or decorative UI.
Prioritize operational clarity over visual decoration.

IMPORTANT:
Do not invent additional roles.
Do not invent additional weighbridges.
Always use the 5-weighbridge architecture.
Keep the UI consistent across all screens.