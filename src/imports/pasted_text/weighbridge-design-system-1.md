WEIGHBRIDGE MANAGEMENT SOFTWARE
MASTER DESIGN SYSTEM — FINAL VERSION

Design a premium enterprise-grade Weighbridge Management Software for an industrial company operating 5 physical weighbridges.

PRODUCT PERSONALITY:
Industrial, professional, reliable, precise, modern, operational and easy to use for employees working long shifts.

USER ROLES:
1. Super Admin — software provider/company that develops and maintains the platform.
2. Admin — client/company that purchased the software.
3. Employee/Operator — employee who operates a physical weighbridge.

Do not invent additional user roles.

WEIGHBRIDGES:
The client has exactly 5 weighbridges:
WB-01
WB-02
WB-03
WB-04
WB-05

VISUAL DIRECTION:
Use a premium industrial SaaS visual language.
Avoid generic CRM styling.
Avoid excessive gradients, glassmorphism, excessive rounded cards, excessive shadows and decorative elements.
Prioritize operational clarity, data readability and fast interaction.

==================================================
COLOR SYSTEM
==================================================

PRIMARY — SOFT ORANGE

Primary: #F97316
Primary Hover: #EA580C
Primary Pressed: #C2410C
Primary Soft: #FFF7ED
Primary Light: #FFEDD5

SECONDARY — DEEP NAVY

Secondary: #17324D
Secondary Dark: #0F2438
Secondary Hover: #294D6B
Secondary Soft: #EAF2F8

LIGHT MODE

Background: #F8FAFC
Surface: #FFFFFF
Surface Elevated: #FFFFFF

Text Primary: #111827
Text Secondary: #475569
Text Muted: #64748B

Border: #E2E8F0
Divider: #F1F5F9

Input Background: #FFFFFF
Disabled Background: #F1F5F9

DARK MODE

Background: #0F172A
Surface: #172033
Surface Elevated: #1E293B

Text Primary: #F8FAFC
Text Secondary: #CBD5E1
Text Muted: #94A3B8

Border: #334155
Divider: #263449

Primary: #FB923C
Primary Hover: #F97316

Secondary: #294D6B

==================================================
STATUS COLORS
==================================================

Success: #16A34A
Warning: #F59E0B
Error: #DC2626
Information: #2563EB
Processing / Weighing: #8B5CF6
Neutral: #64748B

Always communicate status using:
ICON + COLOR + TEXT

Never rely on color alone.

Examples:
● ONLINE
● AVAILABLE
● WEIGHING
● OFFLINE
● MAINTENANCE
● COMPLETED
● PENDING

==================================================
TYPOGRAPHY
==================================================

Use Inter throughout the product.

Display: 48 / 56 / 700
H1: 32 / 40 / 700
H2: 24 / 32 / 700
H3: 20 / 28 / 600
H4: 18 / 24 / 600

Body Large: 16 / 24 / 400
Body: 14 / 20 / 400
Body Small: 13 / 18 / 400

Label: 12 / 16 / 600
Caption: 11 / 16 / 400

Use tabular numerals for weights, quantities and financial values.

LIVE WEIGHT DISPLAY:
64px / 700 / tabular numerals on desktop.

Example:
38,500 KG

==================================================
SPACING
==================================================

Use a 4px base grid:

4
8
12
16
20
24
32
40
48
64
80

Card padding: 20–24px
Section spacing: 32px
Input height: 44–48px
Button height: 44–48px
Table row height: approximately 56px
Desktop sidebar width: 248px

==================================================
BORDER RADIUS
==================================================

4px — extra small
6px — small
8px — medium
12px — large
16px — extra large
999px — pill

Buttons: 8px
Inputs: 8px
Cards: 12px
Status badges: 999px

==================================================
SHADOWS
==================================================

Use subtle shadows only.

Small:
0 1px 2px rgba(15,23,42,0.05)

Medium:
0 4px 12px rgba(15,23,42,0.08)

Large:
0 12px 30px rgba(15,23,42,0.12)

Dark mode should rely primarily on surface contrast and borders.

==================================================
DESKTOP APPLICATION STRUCTURE
==================================================

Use a consistent enterprise application shell:

248px sidebar
+
top header
+
main content area

SIDEBAR:
Use Deep Navy as the primary navigation structure.

Light mode:
Navy sidebar with white text.

Dark mode:
Dark Navy surface.

Active navigation:
Soft Orange background/accent with clear white/navy text depending on contrast.

ADMIN NAVIGATION:

Dashboard
Weighbridges
Transactions
Vehicles
Drivers
Customers
Transporters
Materials
Employees
Tickets
Corrections
Billing
Reports
Audit Logs
Settings

==================================================
TOP HEADER
==================================================

Include:
Page title
Page description where appropriate
Search where appropriate
Notifications
Help
Current company
User profile

Admin example:
ABC Industries

Operator example:
WB-01 — Main Gate

==================================================
WEIGHBRIDGE COMPONENT
==================================================

Create reusable Weighbridge Card components with variants:

Online
Available
Weighing
Offline
Maintenance
Disabled

Example:

WB-01
● ONLINE

TN20AB1234

38,500 KG

● WEIGHT STABLE

Operator:
Arun Kumar

58 vehicles today

Each card may include:
- Weighbridge ID
- Location
- Status
- Vehicle
- Current weight
- Operator
- Today's transaction count
- Hardware status
- View Details action

==================================================
LIVE WEIGHT COMPONENT
==================================================

This is a core product component.

States:

Waiting
Vehicle Detected
Positioning
Stabilizing
Stable
Captured
Overload
Error
Offline

Stable:

38,500 KG
● WEIGHT STABLE

Stabilizing:

38,420 KG
● STABILIZING

Offline:

-- KG
● INDICATOR OFFLINE

Make weight visually dominant.

==================================================
BUTTON SYSTEM
==================================================

Primary:
Soft Orange background + white text.

Secondary:
Deep Navy background + white text.

Tertiary:
Text button.

Destructive:
Red.

Success:
Green.

Support:
Default
Hover
Pressed
Focus
Disabled
Loading

==================================================
FORM SYSTEM
==================================================

Inputs support:

Default
Hover
Focus
Filled
Error
Disabled
Read Only

Focus state:
Orange border/ring.

Labels should always be visible.
Do not rely only on placeholder text.

==================================================
TABLE SYSTEM
==================================================

Tables should be clean and data-focused.

Support:
Search
Filters
Sort
Pagination
Row selection where appropriate
Column visibility
Export
Row actions

Use sticky headers when useful.

Do not make tables visually overcrowded.

==================================================
MOBILE SYSTEM
==================================================

Mobile is NOT a compressed desktop interface.

Prioritize:
Current weighbridge
Vehicle
Live weight
Primary action
Transaction status

Minimum touch target:
44 × 44px

Bottom navigation:

Home
Weigh
Transactions
Alerts
More

Use stacked cards and mobile-first interaction patterns.

==================================================
ACCESSIBILITY
==================================================

Maintain strong contrast.
Do not rely on color alone.
Use icons + labels for status.
Use clear focus states.
Use minimum 44px touch targets.
Use readable typography.
Use descriptive button labels.

==================================================
FIGMA IMPLEMENTATION
==================================================

Use:
Auto Layout
Components
Component Variants
Figma Variables
Reusable styles
Responsive constraints

Do not create duplicate components unnecessarily.

Maintain consistent spacing and naming.

==================================================
IMPORTANT PRODUCT RULES
==================================================

Always use exactly 5 weighbridges.

WB-01
WB-02
WB-03
WB-04
WB-05

Do not invent additional weighbridges.

Do not invent additional user roles.

Keep the same color tokens, typography, spacing, radius, component styles and interaction patterns across every screen.

The application must feel like one unified product.

Design for real-world industrial operations, not a marketing website.