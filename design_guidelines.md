# TazzyoSnap Invoice Generator - Design Guidelines

## Design Approach
**Selected Approach:** Design System (Material Design/Carbon hybrid)
**Justification:** Utility-focused productivity tool requiring efficiency, data organization, and professional credibility. Users need clear information hierarchy and reliable interaction patterns.

## Core Design Elements

### Color Palette
**Light Mode:**
- Primary: 216 87% 42% (Professional blue)
- Background: 210 20% 98% (Soft white)
- Surface: 0 0% 100% (Pure white)
- Text Primary: 220 13% 18% (Charcoal)
- Text Secondary: 220 9% 46% (Medium gray)
- Border: 220 13% 91% (Light gray)
- Success: 142 71% 45% (Green for totals)

**Dark Mode:**
- Primary: 216 87% 65% (Lighter blue for contrast)
- Background: 222 47% 11% (Dark blue-gray)
- Surface: 215 28% 17% (Card background)
- Text Primary: 210 40% 98% (Near white)
- Text Secondary: 215 20% 65% (Light gray)
- Border: 215 28% 25% (Dark border)
- Success: 142 71% 55% (Brighter green)

### Typography
- **Primary Font:** Inter (Google Fonts)
- **Headings:** 600-700 weight, varying sizes
- **Body:** 400-500 weight
- **Labels:** 500-600 weight, smaller sizes
- **Invoice Numbers/Amounts:** 600 weight for emphasis

### Layout System
**Spacing Units:** Tailwind 2, 4, 6, 8, 12 (p-2, m-4, gap-6, etc.)
- Form fields: p-4, gap-4
- Sections: p-6, gap-6
- Major containers: p-8, gap-8
- Micro spacing: p-2, gap-2

### Component Library

**Navigation:**
- Top header with TazzyoSnap logo (left)
- Theme toggle button (right)
- Clean, minimal navigation bar

**Form Components:**
- Input fields with floating labels
- Date pickers for invoice dates
- Add/remove buttons for line items
- Auto-calculating total fields
- Professional styling with clear focus states

**Preview Panel:**
- Split-screen layout (form left, preview right)
- Live-updating invoice preview
- Professional invoice template with:
  - Company header section
  - Bill-to/Ship-to sections
  - Itemized table with quantities, rates, amounts
  - Subtotal, tax, and total calculations
  - Clean typography hierarchy

**Actions:**
- Primary "Download PDF" button (prominent placement)
- Secondary actions for saving/clearing
- Loading states during PDF generation

**Data Display:**
- Responsive table for line items
- Clear visual separation between sections
- Proper alignment for numbers (right-aligned)
- Consistent spacing and borders

### Responsive Behavior
- **Desktop:** Side-by-side form and preview
- **Tablet:** Stacked layout with tabs to switch views
- **Mobile:** Single column, collapsible preview

### Interactions
- **Minimal animations:** Smooth transitions on theme toggle, subtle hover states
- **Live preview updates:** Instant reflection of form changes
- **Auto-calculations:** Real-time totals as items are added/modified
- **PDF generation feedback:** Loading spinner and success confirmation

### Professional Invoice Design
- Clean, business-appropriate layout
- Consistent alignment and spacing
- Professional color scheme
- Clear information hierarchy
- Print-friendly formatting
- Company branding area
- Sequential invoice numbering

This design prioritizes functionality and professional appearance while maintaining excellent usability across devices and themes.