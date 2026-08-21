DESIGN A COMPLETE ENTERPRISE WEIGHBRIDGE MANAGEMENT SOFTWARE — REPORTS SCREEN.

IMPORTANT:
This is a production enterprise application UI, NOT a generic dashboard template.

STRICTLY FOLLOW THE DESIGN SYSTEM AND COLOR TOKENS BELOW.

DO NOT introduce your own colors.
DO NOT replace the secondary color with gray.
DO NOT use generic blue.
DO NOT use purple unless explicitly specified as a status color.
DO NOT use black as a visual brand color.
DO NOT use random gradients.
DO NOT use excessive shadows.
DO NOT use glassmorphism.

The visual identity must clearly communicate:

SOFT ORANGE + DEEP NAVY

The final result should immediately look like a professional industrial weighbridge management system.

==================================================

1. # PRODUCT

Product:
Weighbridge Management Software

Purpose:
Enterprise software used to manage and monitor physical weighbridge operations.

The client has exactly 5 weighbridges:

WB-01
WB-02
WB-03
WB-04
WB-05

User roles:

1. Super Admin
2. Admin
3. Employee / Operator

This screen is designed for:

ROLE:
Admin

PLATFORM:
Desktop Web

FRAME:
1440 × 1024

================================================== 2. FINAL COLOR SYSTEM — STRICT
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

SECONDARY BRAND COLOR — DEEP NAVY

Secondary:
#17324D

Secondary Dark:
#0F2438

Secondary Hover:
#294D6B

Secondary Soft:
#EAF2F8

IMPORTANT:

DEEP NAVY IS THE SECONDARY BRAND COLOR.

DO NOT USE GRAY AS THE SECONDARY BRAND COLOR.

Gray/slate colors may ONLY be used as neutral text, border and background tokens.

================================================== 3. LIGHT MODE NEUTRALS
==================================================

Page Background:
#F8FAFC

Card / Surface:
#FFFFFF

Elevated Surface:
#FFFFFF

Primary Text:
#111827

Secondary Text:
#475569

Muted Text:
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

#111827 is only for readable text.

It must NOT become the visual theme.

The visual hierarchy must be:

1. Deep Navy
2. Soft Orange
3. Neutral surfaces

================================================== 4. STATUS COLORS
==================================================

Success:
#16A34A

Warning:
#F59E0B

Error:
#DC2626

Information:
#2563EB

Processing:
#8B5CF6

Neutral:
#64748B

Always show:

ICON + COLOR + TEXT

Never communicate status using color alone.

================================================== 5. TYPOGRAPHY
==================================================

Use ONLY:

Inter

Typography:

Page Title:
32px / 40px / 700

Section Heading:
20px / 28px / 600

Card Heading:
16px / 24px / 600

Body:
14px / 20px / 400

Body Medium:
14px / 20px / 500

Label:
12px / 16px / 600

Caption:
11px / 16px / 400

Numbers:
Use tabular numerals.

Financial and weight values must use tabular numerals.

================================================== 6. SPACING
==================================================

Use a 4px spacing system.

Allowed spacing:

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

Main page padding:
24px

Card padding:
20–24px

Section spacing:
24–32px

================================================== 7. BORDER RADIUS
==================================================

Buttons:
8px

Inputs:
8px

Cards:
12px

Large containers:
12px

Status badges:
999px

Do not make every component heavily rounded.

================================================== 8. SHADOWS
==================================================

Use subtle shadows only.

Small:
0 1px 2px rgba(15,23,42,0.05)

Medium:
0 4px 12px rgba(15,23,42,0.08)

Avoid heavy shadows.

================================================== 9. APPLICATION SHELL
==================================================

Create a professional enterprise desktop application layout.

LEFT SIDEBAR:
Width: 248px

Sidebar background:
DEEP NAVY #17324D

Sidebar should be visually strong and clearly establish the brand.

Top of sidebar:

Orange brand icon/container.

Brand:
WEIGHBRIDGE

Company:
Viyan Industries

Navigation:

Dashboard
Weighbridges
Transactions
Vehicles
Employees
Reports
Settings

Reports must be the ACTIVE navigation item.

ACTIVE NAVIGATION:
Use Soft Orange #F97316.

Active item should have:
Orange background
White text
White icon

Do NOT use gray active navigation.

SIDEBAR TEXT:
White / very light neutral.

Secondary sidebar text:
#CBD5E1

BOTTOM SIDEBAR:

Sign Out

================================================== 10. TOP HEADER
==================================================

Top header background:
#FFFFFF

Bottom border:
#E2E8F0

Left:
Breadcrumb

Viyan Industries
/
Reports

Use Deep Navy for important breadcrumb text.

Use muted slate only for secondary breadcrumb text.

RIGHT SIDE:

Theme toggle
Notification icon
User avatar

User avatar:
Deep Navy or Soft Orange.

Do not use random colors.

================================================== 11. REPORTS PAGE HEADER
==================================================

Main content background:
#F8FAFC

Page title:

Reports

Description:

Analyze weighbridge operations, vehicle movement, material quantities and business performance across all 5 weighbridges.

RIGHT SIDE ACTIONS:

Secondary button:
Export CSV

Secondary button:
Export PDF

Primary button:
Generate Report

IMPORTANT:

Generate Report:
#F97316

Export buttons:
Deep Navy outline/text OR neutral outlined buttons with Deep Navy text.

Do not make all buttons orange.

================================================== 12. REPORT FILTER BAR
==================================================

Create one large filter container.

Background:
#FFFFFF

Border:
#E2E8F0

Radius:
12px

Filters:

Date Range
Weighbridge
Material
Customer
Operator

Date Range default:
Today

Each input should have:

White background
Subtle border
Deep Navy focus state
Soft Orange focus ring

When selected:
Use Soft Orange highlight or Deep Navy text.

Do not use gray as the visual selected color.

================================================== 13. REPORT CATEGORY CARDS
==================================================

Create a horizontal category section.

Cards:

Weight Reports
Weighbridge Reports
Vehicle Reports
Material Reports
Customer Reports
Operator Reports
Billing Reports

Each card should include:

Icon
Title
Number of available reports
Small supporting text

Example:

Weight Reports
24 reports

VISUAL STYLE:

White card
12px radius
Subtle border
Deep Navy icon
Deep Navy title
Muted supporting text

On hover:
Border becomes Soft Orange
Icon becomes Soft Orange
Very subtle elevation

Do not make every card orange.

================================================== 14. KPI / SUMMARY AREA
==================================================

Create four compact KPI cards below the report categories.

KPIs:

Total Net Weight
Total Vehicles
Total Transactions
Average Net Weight

Example values:

2,095 MT
248
1,248
8.45 MT

KPI number:
Deep Navy

Positive/trend indicator:
Soft Orange or Success Green depending on meaning.

Labels:
Muted slate.

Small icon:
Soft Orange or Deep Navy.

================================================== 15. MAIN CHART — NET WEIGHT TREND
==================================================

Create a large white chart card.

Title:

Net Weight Trend

Description:

Cumulative net weight processed across all 5 weighbridges.

Top-right metric:

2,095 MT

Small text:
Today

CHART:

Use a line chart.

PRIMARY CHART COLOR:
Soft Orange #F97316

Secondary comparison/reference:
Deep Navy #17324D

Grid:
Very subtle #E2E8F0

Axis labels:
#64748B

Do NOT use random chart colors.

Chart points:
Soft Orange

Highlight current point with:
Soft Orange + subtle ring.

================================================== 16. WEIGHBRIDGE COMPARISON
==================================================

Create a white card next to the main chart.

Title:

Weighbridge Comparison

Description:

Net weight processed today.

Show exactly:

WB-01
WB-02
WB-03
WB-04
WB-05

Use a bar chart.

PRIMARY BAR:
Deep Navy #17324D

HIGHLIGHT:
Soft Orange #F97316

If a weighbridge has an issue:
Use Error #DC2626

Do NOT use gray bars.

Example:

WB-01 — 1,245 MT
WB-02 — 980 MT
WB-03 — 1,120 MT
WB-04 — 720 MT
WB-05 — 1,030 MT

================================================== 17. VEHICLE VOLUME
==================================================

Create a full-width white chart card.

Title:

Vehicle Volume

Description:

Total vehicles processed per weighbridge today.

Use a vertical bar chart.

Primary:
Deep Navy

Selected/highlight:
Soft Orange

Offline/issue:
Error Red

Show:

WB-01
WB-02
WB-03
WB-04
WB-05

Example:

WB-01 — 58 vehicles
WB-02 — 46 vehicles
WB-03 — 52 vehicles
WB-04 — 0 vehicles
WB-05 — 48 vehicles

For WB-04:
Clearly communicate:

OFFLINE

Do not simply leave the chart visually empty.

================================================== 18. REPORT INSIGHTS
==================================================

Add a compact insights section below the charts.

Title:

Operational Insights

Create 3 insight cards:

1.

Highest Volume

WB-01 processed the highest vehicle volume today.

2.

Lowest Volume

WB-04 is currently offline and has no active transactions.

3.

Top Material

Granite accounts for the highest net weight processed today.

Use:

Deep Navy headings
Muted supporting text
Soft Orange icons
Status colors where appropriate.

================================================== 19. TABLE / RECENT REPORTS
==================================================

Add a recent reports table.

Title:

Recently Generated Reports

Columns:

Report Name
Type
Date Range
Generated By
Generated At
Status
Action

Example:

Daily Weight Summary
Weight
Today
Admin
10:32 AM
Completed
View

Weighbridge Performance
Weighbridge
Today
Admin
09:48 AM
Completed
View

Vehicle Movement Report
Vehicle
Yesterday
Admin
08:20 AM
Completed
Download

STATUS BADGES:

Completed:
Green

Processing:
Purple

Failed:
Red

================================================== 20. FINAL VISUAL HIERARCHY
==================================================

The screen MUST visually communicate:

DEEP NAVY:
Navigation
Headings
Secondary actions
Important data
Charts
Structural elements

SOFT ORANGE:
Primary actions
Active navigation
Highlights
Chart highlights
Important interaction states

WHITE:
Cards
Tables
Inputs
Surfaces

LIGHT SLATE:
Page background
Borders
Secondary information

Do NOT let gray dominate the UI.

Do NOT let black dominate the UI.

The overall appearance must clearly look like:

SOFT ORANGE + DEEP NAVY ENTERPRISE SOFTWARE.

================================================== 21. UX REQUIREMENTS
==================================================

The Reports screen must support:

Search
Filtering
Date range selection
Weighbridge filtering
Material filtering
Customer filtering
Operator filtering
CSV export
PDF export
Report generation
Chart visualization
Report history
Report preview

================================================== 22. RESPONSIVE BEHAVIOR
==================================================

Design the desktop version first.

The layout must be responsive.

Cards should resize gracefully.

Charts should remain readable.

Tables should support horizontal scrolling on smaller screens.

Do not shrink text excessively.

================================================== 23. FIGMA IMPLEMENTATION
==================================================

Use:

Auto Layout
Components
Component Variants
Figma Variables
Reusable components
Responsive constraints

Create reusable:

Sidebar
Header
Button
Filter
Dropdown
KPI Card
Report Category Card
Chart Card
Status Badge
Table
Table Row
Insight Card

================================================== 24. FINAL INSTRUCTION
==================================================

DO NOT redesign this as a generic orange-and-gray dashboard.

DO NOT use gray as the secondary brand color.

DO NOT introduce random colors.

DO NOT use random blue.

DO NOT use generic dashboard templates.

The final screen must strongly follow:

PRIMARY:
SOFT ORANGE #F97316

SECONDARY:
DEEP NAVY #17324D

BACKGROUND:
#F8FAFC

SURFACE:
#FFFFFF

TEXT:
#111827

BORDER:
#E2E8F0

The result should look like a polished, production-ready industrial weighbridge management application designed for real-world daily operations.
