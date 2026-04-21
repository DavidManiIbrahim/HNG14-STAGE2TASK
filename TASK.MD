:rocket: Frontend Wizards — Stage 2 Task. Build an Invoice Management App

Overview
Welcome to Stage 2. You will build a responsive Invoice Management Application based on the provided Figma design. Build this as a full-stack application.

:dart: Core Objective
Build a fully functional invoice app that allows users to:

Create invoices
Read (view) invoices
Update invoices
Delete invoices
Save drafts
Mark invoices as paid
Filter by invoice status
Toggle light/dark mode
Experience full responsiveness
See hover states on interactive elements
Persist data and state using:
LocalStorage
IndexedDB
Or a backend (Node/Express, Next.js API, etc.)



:receipt: Core Features

:one: Create, Read, Update, Delete (CRUD)
Users must be able to:
Create

Open invoice form
Fill out required fields
Save invoice
Read

View invoice list
Click invoice to view full details
Update

Edit existing invoice
Persist updated values
Delete

Delete invoice
Show confirmation modal before deletion


:two: Form Validations
When creating or editing invoices:

Required fields must be validated
Invalid fields should:
Show error message
Have visual error state
Prevent submission if invalid

Example validations:
Client name required
Valid email format
At least one invoice item
Quantity and price must be positive numbers



:three: Draft & Payment Flow
Invoices can have one of three statuses:

Draft
Pending
Paid
Required behavior:

Users can save invoice as Draft
Draft invoices can later be edited
Pending invoices can be marked as Paid
Paid invoices cannot be marked back to Draft
Status must clearly reflect in:

List view
Detail view
Status badge color/style


:four: Filter by Status
Users must be able to filter invoices by:

All
Draft
Pending
Paid
Requirements:

Filter control should be intuitive (checkbox filter)
Filtered state must update the list immediately
Empty state should display when no invoices match filter


:five: Light & Dark Mode Toggle
Users must be able to:

Toggle between light mode and dark mode


Requirements:

Theme should apply globally
All components must adapt
Store preference (LocalStorage recommended)
Good color contrast in both modes


:six: Responsive Design
The layout must adapt to:

Mobile (320px+)
Tablet (768px+)
Desktop (1024px+)
Requirements:

Invoice list adapts to screen size
Forms are usable on mobile
No horizontal overflow
Proper spacing and hierarchy


:seven: Hover & Interactive States
All interactive elements must have visible hover states:

Buttons
Links
Invoice list items
Status filters
Form inputs


:jigsaw: Recommended Architecture
Suggested structure:

Invoice List Page
Invoice Detail Page
Invoice Form Component
Status Badge Component
Filter Component
Theme Provider / Context


NOTE: USE REACT ONLY.

:test_tube: Acceptance Criteria
You will be graded on:

CRUD functionality works
Form validation prevents invalid submissions
Status logic behaves correctly
Filtering works accurately
Theme toggle works across reload
Fully responsive layout
Clean component structure
No console errors
Good accessibility practices


:wheelchair: Accessibility Expectations

Proper semantic HTML
Form fields with <label>
Buttons must be <button>
Modal must:
Trap focus
Close via ESC key
Keyboard navigable

Good color contrast (WCAG AA)


:package: Submission Requirements

Live URL (Vercel / Netlify / etc.)
GitHub repository
README including:
Setup instructions
Architecture explanation
Trade-offs
Accessibility notes
Any improvements beyond requirements



AIRTABLE LINK
SUBMISSION LINK
https://docs.google.com/forms/d/e/1FAIpQLScwBeDPp672SP-hUQ3PTN2NFAUbvaWmHdeDbie560iJMDQC_w/viewform

Deadline: 23/04/2026. 11:59pmAirtableAirtable | Everyone's app platformAirtable is a low-code platform for building collaborative apps. Customize your workflow, collaborate, and achieve ambitious outcomes. Get started for free.https://airtable.com/appZPpwy4dtvVBWU4/shrMH9P1zv4TPhvns?TK29T=b%3AWzAsWyJURWtBWiIsNixbInJlY29ySkh6Ym5KdHlXaGVKIl1dXQ&C3OrT=recCkXkt7TEH3Kk22invoice‒apphttps://api-cdn.figma.com/resize/thumbnails/73de382a-4a89-4e5a-b2e8-092c02e302bb?expiration=1777248000&signature=ac0ef7e869319a55be2e500605be208c5b64caa6e64ed688c588914996272723&height=112&bucket=figma-alphaAdded by Figma