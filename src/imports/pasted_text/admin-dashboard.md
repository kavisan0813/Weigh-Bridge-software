SCREEN 01 — ADMIN DASHBOARD

ROLE:
Admin

PLATFORM:
Desktop Web

FRAME:
1440 × 1024

DESIGN MODE:
Light Mode

Use the MASTER DESIGN SYSTEM above exactly.

Do not change any design tokens.

==================================================
PURPOSE
==================================================

Create the primary Admin Dashboard for a company operating exactly 5 weighbridges.

The dashboard should provide an immediate operational overview of:

- All 5 weighbridges
- Current weighbridge status
- Today's weight processed
- Today's transactions
- Active vehicles
- Pending transactions
- Recent weighments
- Operational alerts
- Weight trends

This is an operational control dashboard, not a generic analytics dashboard.

==================================================
APPLICATION SHELL
==================================================

LEFT SIDEBAR:

Company branding:

WEIGHBRIDGE

ABC Industries

Navigation:

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

Bottom:

Help & Support
Sign Out

Active navigation:
Dashboard

Use Soft Orange #F97316 for the active navigation state.

Sidebar must use the warm dark industrial surface defined in the Master Design System.

DO NOT use blue/navy sidebar.

==================================================
TOP HEADER
==================================================

Breadcrumb:

ABC Industries / Dashboard

Right side:

Search
Notifications
Help
User Avatar

User:
Admin

==================================================
PAGE HEADER
==================================================

Title:

Dashboard

Description:

Monitor weighbridge operations, transactions and system activity across all 5 weighbridges.

Right side:

Date selector:
Today

Secondary action:
Export

==================================================
KPI SECTION
==================================================

Create 5 primary KPI cards.

CARD 1:

TOTAL WEIGHT TODAY

2,095 MT

+12.4%

Compared with yesterday

Use Soft Orange accent.

CARD 2:

TOTAL TRANSACTIONS

248

+8.2%

Compared with yesterday

Use Gold accent.

CARD 3:

ACTIVE WEIGHBRIDGES

4 / 5

1 Offline

Use Gold accent.

CARD 4:

VEHICLES TODAY

186

+6.8%

Compared with yesterday

Use Soft Orange accent.

CARD 5:

PENDING TRANSACTIONS

18

Requires attention

Use Warning status.

Use small icons and accent indicators.

Do not create giant colored cards.

==================================================
WEIGHBRIDGE STATUS SECTION
==================================================

Section title:

Weighbridge Status

Description:

Live operational status of all 5 weighbridges.

Display exactly 5 cards:

WB-01
WB-02
WB-03
WB-04
WB-05

SAMPLE STATES:

WB-01
● ONLINE

Current Vehicle:
TN20AB1234

Current Weight:
38,500 KG

Operator:
Arun Kumar

Today:
58 transactions

WB-02
● ONLINE

Current Vehicle:
TN38CD4589

Current Weight:
42,200 KG

Operator:
Suresh

Today:
51 transactions

WB-03
● WEIGHING

Current Vehicle:
TN45EF7812

Current Weight:
31,850 KG

Operator:
Ravi

Today:
62 transactions

WB-04
● OFFLINE

Current Vehicle:
--

Weight:
-- KG

Issue:
Weight indicator disconnected

Today:
21 transactions

WB-05
● ONLINE

Current Vehicle:
TN10GH2356

Current Weight:
27,400 KG

Operator:
Manoj

Today:
56 transactions

IMPORTANT:

WB-04 must visibly show an offline state.

Use:
Orange for important active interaction.
Gold for secondary/premium highlights.
Red ONLY for the actual offline/error status.

==================================================
LIVE OPERATIONS PANEL
==================================================

Create a prominent operational panel titled:

Live Weighing Activity

Show the current active transaction.

Example:

WB-03

● WEIGHING

Vehicle:
TN45EF7812

Material:
Gravel

Customer:
ABC Construction

Current Weight:

31,850 KG

● WEIGHT STABLE

Operator:
Ravi Kumar

Actions:

View Weighment
Open Weighbridge

The weight must be visually dominant.

==================================================
WEIGHT TREND CHART
==================================================

Create a large chart:

Today's Weight Processed

X-axis:

06:00
07:00
08:00
09:00
10:00
11:00
12:00

Y-axis:

0 MT
500 MT
1000 MT
1500 MT
2000 MT
2500 MT

Primary chart line:
Soft Orange #F97316

Use Gold #C99A2E for a secondary comparison line if required.

Do NOT use blue.

Show:

Current:
2,095 MT

Compared with yesterday:
+12.4%

==================================================
WEIGHBRIDGE COMPARISON
==================================================

Create a compact horizontal bar chart.

Title:

Today's Weight by Weighbridge

Show exactly:

WB-01 — 1,245 MT
WB-02 — 980 MT
WB-03 — 1,120 MT
WB-04 — 720 MT
WB-05 — 1,030 MT

Primary bars:
Soft Orange

Secondary comparison/highlight:
Gold

WB-04 can use red only because it has an operational issue.

==================================================
RECENT TRANSACTIONS
==================================================

Create a table titled:

Recent Weighments

Columns:

Ticket
Vehicle
Weighbridge
Customer
Gross
Tare
Net
Operator
Time
Status

Sample:

WB-2026-00458
TN20AB1234
WB-01
ABC Construction
38,500 KG
12,500 KG
26,000 KG
Arun
10:28 AM
Completed

WB-2026-00457
TN38CD4589
WB-02
XYZ Logistics
42,200 KG
15,200 KG
27,000 KG
Suresh
10:25 AM
Completed

WB-2026-00456
TN45EF7812
WB-03
ABC Construction
31,850 KG
12,100 KG
19,750 KG
Ravi
10:21 AM
Weighing

Use compact professional table styling.

==================================================
ALERTS
==================================================

Create a right-side or lower section titled:

Operational Alerts

Alert 1:

CRITICAL

WB-04 Weight Indicator Offline

5 minutes ago

Action:
View Weighbridge

Alert 2:

WARNING

Printer paper low on WB-02

18 minutes ago

Action:
View Hardware

Alert 3:

INFORMATION

Correction request received for ticket WB-2026-00441

32 minutes ago

Action:
Review Request

Use proper status colors only for severity.

==================================================
QUICK ACTIONS
==================================================

Provide a compact Quick Actions section.

Actions:

Start Weighment
View Transactions
Manage Vehicles
View Reports
Manage Weighbridges

Primary:
Start Weighment → Soft Orange

Secondary:
Other actions → Gold outline or neutral outline.

==================================================
RESPONSIVE BEHAVIOR
==================================================

Desktop first.

At smaller desktop widths:

KPI cards should wrap.

Weighbridge cards should become a responsive grid.

Charts should resize.

Tables should horizontally scroll rather than becoming unreadable.

==================================================
FINAL VISUAL REQUIREMENT
==================================================

The completed dashboard must visually communicate:

PREMIUM INDUSTRIAL CONTROL SYSTEM

The brand must clearly read as:

SOFT ORANGE + PREMIUM GOLD

#F97316
+
#C99A2E

Do not allow the screen to become primarily gray.

Do not use blue or navy as a brand color.

Use neutral colors only for structure.

Use Orange for primary actions and active operational elements.

Use Gold for secondary emphasis and premium industrial accents.

Use red/green/yellow/blue only for their defined status meanings.

Maintain the exact MASTER DESIGN SYSTEM across every component.

Use realistic enterprise data.

Make the dashboard polished, production-ready and suitable for a professional Figma portfolio and real-world SaaS application.