WEIGHBRIDGE MANAGEMENT SOFTWARE
MASTER DESIGN SYSTEM — FINAL LOCKED VERSION

IMPORTANT:
This design system is the single source of truth for the entire application.

Every screen must follow this exact visual language.
Do NOT create a generic SaaS dashboard.
Do NOT introduce alternative colors.
Do NOT replace the brand colors with gray, blue, purple or other colors.
Do NOT change typography, spacing, radius or component styling between screens.

The product is an enterprise-grade industrial Weighbridge Management Software.

==================================================

1. # PRODUCT

Product:
Weighbridge Management Software

The system manages physical weighbridge operations, vehicles, materials, customers, operators, transactions, tickets, reports and hardware.

The client has EXACTLY 5 weighbridges:

WB-01
WB-02
WB-03
WB-04
WB-05

USER ROLES:

1. Super Admin
   The software provider/company that develops and maintains the platform.

2. Admin
   The client/company that purchased and operates the software.

3. Employee / Operator
   The employee who works at and operates a physical weighbridge.

Do NOT invent additional roles.

================================================== 2. DESIGN PERSONALITY
==================================================

The interface must feel:

Premium
Industrial
Professional
Reliable
Precise
Modern
Operational
Trustworthy
Data-focused

Visual inspiration:
Premium industrial control room + modern enterprise SaaS.

The interface should communicate:
WEIGHT
PRECISION
CONTROL
RELIABILITY
OPERATIONAL VISIBILITY

Avoid the appearance of:
Generic CRM
Generic accounting software
Generic HR software
Generic analytics dashboard
Marketing website

================================================== 3. BRAND COLOR SYSTEM
==================================================

PRIMARY BRAND COLOR — SOFT ORANGE

Primary:
#F97316

Primary Hover:
#EA580C

Primary Pressed:
#C2410C

Primary Soft:
#FFF7ED

Primary Light:
#FFEDD5

SECONDARY BRAND COLOR — PREMIUM GOLD

Secondary:
#C99A2E

Secondary Hover:
#B58924

Secondary Pressed:
#9A741E

Secondary Soft:
#FBF5E6

Secondary Light:
#F5E8BF

IMPORTANT COLOR RULE:

The secondary brand color is GOLD.

DO NOT use blue, navy, purple or gray as the secondary brand color.

Orange and Gold must be visually recognizable throughout the product.

Orange = Primary Action / Energy / Live Operations

Gold = Premium Secondary / Important Information / Industrial Highlight / Supporting Brand Accent

================================================== 4. NEUTRAL COLORS
==================================================

Neutrals are ONLY structural colors.

They must NOT visually compete with Orange and Gold.

LIGHT MODE:

Background:
#F8FAFC

Surface:
#FFFFFF

Surface Elevated:
#FFFFFF

Text Primary:
#111827

Text Secondary:
#475569

Text Muted:
#64748B

Border:
#E2E8F0

Divider:
#F1F5F9

Input Background:
#FFFFFF

Disabled Background:
#F1F5F9

IMPORTANT:

Gray is NOT the secondary brand color.

Gray may ONLY be used for:
backgrounds
borders
dividers
muted text
disabled controls
neutral UI states

Do not create gray-heavy layouts.

================================================== 5. DARK MODE
==================================================

Dark Background:
#11100D

Dark Surface:
#1B1915

Dark Elevated Surface:
#242118

Dark Text Primary:
#FFF9ED

Dark Text Secondary:
#D6CDBA

Dark Text Muted:
#A69D8A

Dark Border:
#403A2D

Dark Divider:
#332F25

Dark Primary:
#FB923C

Dark Secondary:
#D4A72C

Dark Secondary Soft:
#3A321E

Dark mode should feel warm, premium and industrial.

Do NOT use a blue/navy dark theme.

================================================== 6. STATUS COLORS
==================================================

Success:
#16A34A

Warning:
#F59E0B

Error:
#DC2626

Information:
#2563EB

Processing / Weighing:
#8B5CF6

Neutral:
#64748B

Status must always use:

ICON + COLOR + TEXT

Never communicate status using color alone.

Examples:

● ONLINE
● AVAILABLE
● WEIGHING
● STABLE
● OFFLINE
● MAINTENANCE
● COMPLETED
● PENDING
● ERROR

================================================== 7. COLOR USAGE RATIO
==================================================

Use the colors intentionally.

Approximately:

60% Neutral / Surface
25% Deep structural contrast
10% Soft Orange
5% Gold

However, the UI must visibly feel like an Orange + Gold product.

Orange should dominate important actions.

Gold should provide premium secondary accents.

Do not turn the entire interface orange or gold.

Do not make everything gray.

================================================== 8. TYPOGRAPHY
==================================================

Font:
Inter

Display:
48px / 56px / 700

H1:
32px / 40px / 700

H2:
24px / 32px / 700

H3:
20px / 28px / 600

H4:
18px / 24px / 600

Body Large:
16px / 24px / 400

Body:
14px / 20px / 400

Body Small:
13px / 18px / 400

Label:
12px / 16px / 600

Caption:
11px / 16px / 400

Use tabular numerals for:

Weight
Quantity
Vehicle counts
Transaction counts
Financial values

LIVE WEIGHT:

64px / 700

Example:

38,500 KG

================================================== 9. SPACING
==================================================

Use a 4px spacing system.

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

Card padding:
20–24px

Section spacing:
32px

Input height:
44–48px

Button height:
44–48px

Table row:
56px

Desktop sidebar:
248px

================================================== 10. BORDER RADIUS
==================================================

4px:
Small elements

6px:
Compact controls

8px:
Buttons and inputs

12px:
Cards and panels

16px:
Large feature panels

999px:
Status badges / pills

Avoid excessive rounded UI.

The product should feel industrial and precise.

================================================== 11. SHADOWS
==================================================

Use subtle shadows.

Small:
0 1px 2px rgba(15,23,42,0.05)

Medium:
0 4px 12px rgba(15,23,42,0.08)

Large:
0 12px 30px rgba(15,23,42,0.12)

Do not use dramatic floating shadows.

================================================== 12. DESKTOP APPLICATION SHELL
==================================================

Use:

248px Sidebar

- Top Header
- Main Content

SIDEBAR STYLE:

Use a warm premium dark surface.

Light Mode Sidebar:
#1C1915

Dark Mode Sidebar:
#0F0E0B

Sidebar text:
#F8F4EA

Active navigation:
Soft Orange #F97316

Secondary navigation highlights may use Gold #C99A2E.

The sidebar should NOT be blue or navy.

================================================== 13. ADMIN NAVIGATION
==================================================

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

Show appropriate icons.

Active item:
Orange background or Orange left indicator.

================================================== 14. TOP HEADER
==================================================

Top header should include:

Breadcrumb
Page title when appropriate
Search where appropriate
Notifications
Help
Current company
User avatar/profile

Example company:

Viyan Industries

================================================== 15. WEIGHBRIDGE SYSTEM
==================================================

The system has exactly:

WB-01
WB-02
WB-03
WB-04
WB-05

Never invent WB-06 or any additional weighbridge.

Each weighbridge can have:

ONLINE
AVAILABLE
WEIGHING
OFFLINE
MAINTENANCE
DISABLED

Reusable Weighbridge Card must display:

Weighbridge ID
Location
Status
Current Vehicle
Current Weight
Operator
Today's Transactions
Hardware Status

================================================== 16. LIVE WEIGHT COMPONENT
==================================================

Core component of the product.

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

Stable example:

38,500 KG

● WEIGHT STABLE

Stabilizing:

38,420 KG

● STABILIZING

Offline:

-- KG

● INDICATOR OFFLINE

Weight must always be the most visually dominant value.

================================================== 17. BUTTON SYSTEM
==================================================

PRIMARY BUTTON:

Soft Orange #F97316
White text

Example:
Start Weighment
Capture Weight
Generate Report
Add Vehicle

SECONDARY BUTTON:

Gold #C99A2E
White text where contrast is sufficient.

Example:
View Details
Configure
Export

TERTIARY:

Text / outline

DESTRUCTIVE:

Red

SUCCESS:

Green

Every button must support:

Default
Hover
Pressed
Focus
Disabled
Loading

================================================== 18. FORM SYSTEM
==================================================

Inputs support:

Default
Hover
Focus
Filled
Error
Disabled
Read Only

Focus:
Orange border and subtle Orange focus ring.

Labels must always be visible.

Do not rely only on placeholders.

================================================== 19. TABLE SYSTEM
==================================================

Tables must be clean and operational.

Support:

Search
Filter
Sort
Pagination
Column visibility
Export
Row actions

Use:
White surfaces
Soft borders
Clear hierarchy
Compact spacing

Use Orange for important interactive elements.

Use Gold for selected secondary emphasis.

Do not make tables gray-heavy.

================================================== 20. DATA VISUALIZATION
==================================================

Charts must follow the brand palette.

Primary chart:
Soft Orange #F97316

Secondary chart:
Gold #C99A2E

Supporting data:
Neutral tones only when necessary.

Avoid blue/purple chart palettes.

Example:

Orange:
Net Weight

Gold:
Previous Period

Use status colors only for status-related data.

================================================== 21. KPI CARDS
==================================================

KPI cards should be clean and premium.

Example:

TOTAL WEIGHT
2,095 MT

Orange accent

WEIGHBRIDGES ACTIVE
4 / 5

Gold accent

TOTAL VEHICLES
248

Neutral or Orange accent

PENDING TRANSACTIONS
18

Warning accent

Cards should not all look identical.

Use small colored accent lines/icons instead of huge color blocks.

================================================== 22. MOBILE
==================================================

Mobile is NOT a compressed desktop.

Prioritize:

Current Weighbridge
Vehicle
Live Weight
Primary Action
Transaction Status

Minimum touch target:
44 × 44px

Bottom navigation:

Home
Weigh
Transactions
Alerts
More

================================================== 23. ACCESSIBILITY
==================================================

Maintain strong contrast.

Never rely on color alone.

Use:
Icons
Text labels
Status indicators

Minimum touch target:
44 × 44px

Clear focus states.

Readable typography.

================================================== 24. FIGMA IMPLEMENTATION
==================================================

Use:

Auto Layout
Components
Component Variants
Figma Variables
Reusable components
Responsive constraints
Design tokens

Create reusable:

Buttons
Inputs
Selects
Dropdowns
Tabs
Status Badges
KPI Cards
Weighbridge Cards
Weight Display
Vehicle Cards
Transaction Rows
Tables
Alerts
Modals
Drawers
Toasts
Pagination
Sidebar
Header
Charts
Empty States
Loading States
Error States

Do not duplicate components unnecessarily.

================================================== 25. FINAL VISUAL RULE
==================================================

Every screen must immediately look like the SAME WEIGHBRIDGE PRODUCT.

The dominant brand identity is:

SOFT ORANGE + PREMIUM GOLD

#F97316 + #C99A2E

Not:

Orange + Gray
Orange + Blue
Orange + Navy
Orange + Purple

Neutral colors are only structural.

The UI must feel:

PREMIUM
INDUSTRIAL
PRECISE
RELIABLE
MODERN

Do not change this design system.
