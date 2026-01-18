# Panta Brand Guidelines

## Core Identity
**Apps**: Consistent prototype styling for Panta (Commercial Insurance).
**Aesthetic**: Premium, Trustworthy, Professional, yet Modern.

---

## 1. Color Palette

### Primary Colors
- **Forest Green** (Primary Brand Color): `#0A3F2F`
  - *Usage*: Main headers, primary buttons (background), strong borders, active states.
- **Vibrant Green** (Call to Action / Success): `#22C55E`
  - *Usage*: Primary call-to-action buttons, success states, highlights.

### Neutral / Surface Colors
- **Cream White** (Main Background): `#F9F7F2`
  - *Usage*: Page background, section backgrounds.
- **Pure White** (Card / Surface): `#FFFFFE`
  - *Usage*: Card backgrounds, input fields, modal backgrounds.
- **Muted Gold / Beige** (Secondary / Borders): `#D4C5A6`
  - *Usage*: Dividers, secondary borders, subtle accents, decorative lines.

---

## 2. Typography

### Primary Font Stack
- **Headings**: `Playfair Display`, serif.
- **Body**: `Inter`, sans-serif.

### Implementation Details
- **Display / Hero**: Font-family: 'Playfair Display'; Weight: 700; Color: `#0A3F2F`; Line-height: 1.1.
- **H1 - H3**: Font-family: 'Playfair Display'; Weight: 600; Color: `#0A3F2F`.
- **Body Text**: Font-family: 'Inter'; Weight: 400; Color: `#0A3F2F` (or `slate-900` equivalent).
- **Labels/Tiny**: Font-family: 'Inter'; Weight: 500; Uppercase tracking for elegance.
- **Inverse Text (Dark Backgrounds)**: Headings in `#F9F7F2` (Cream) or `#FFFFFE` (White); Body in `#D4C5A6` (Beige) or muted white.

---

## 3. ShadCN UI Implementation Criteria

### CSS Variables (Tailwind Config)
Add these to your `globals.css` / Tailwind config for ShadCN.

```css
:root {
  /* Backgrounds */
  --background: 60 10% 98%;      /* #F9F7F2 - Cream (Default Light Section) */
  --foreground: 164 73% 14%;     /* #0A3F2F - Dark Green text */

  /* Surface / Cards */
  --card: 0 0% 100%;             /* #FFFFFE - White */
  --card-foreground: 164 73% 14%;

  /* Primary Action */
  --primary: 164 73% 14%;        /* #0A3F2F - Forest Green */
  --primary-foreground: 0 0% 100%;

  /* Secondary / Accents */
  --secondary: 35 34% 74%;       /* #D4C5A6 - Beige */
  --secondary-foreground: 164 73% 14%;

  /* Destructive / Accent */
  --accent: 142 69% 58%;         /* #22C55E - Vibrant Green */
  --accent-foreground: 0 0% 100%;
  
  /* Borders */
  --border: 35 34% 74%;          /* Use Beige for distinct but soft borders */
  --input: 35 34% 74%;
  --ring: 142 69% 58%;           /* Focus ring uses vibrant green */
  
  /* Border Radius */
  --radius: 0.25rem;             /* Keep it crisp, slightly rounded */
}

/* Dark Section overrides (e.g. .dark-section class) */
.dark-section {
  --background: 164 73% 14%;     /* #0A3F2F - Forest Green */
  --foreground: 60 10% 98%;      /* #F9F7F2 - Cream text */
  --card: 164 73% 12%;           /* Slightly darker/lighter green or transparent */
  --card-foreground: 0 0% 100%;
  --border: 35 34% 74%;          /* Beige borders still apply */
}
```

### Component Styling
- **Buttons**:
  - *Primary*: `bg-[#22C55E] hover:bg-[#1faf53] text-white font-semibold rounded-md` (Use Vibrant Green for high conversion actions).
  - *Secondary*: `bg-[#0A3F2F] text-white` (Use Forest Green for standard actions).
  - *Outline*: `border-[#D4C5A6] text-[#0A3F2F] hover:bg-[#F9F7F2]`.
- **Cards**:
  - Background: `#FFFFFE`.
  - Border: `1px solid #D4C5A6` (Beige).
  - Shadow: `shadow-md` (Subtle).
- **Inputs**:
  - Background: `#FFFFFE`.
  - Border: `#D4C5A6` (Focus ring: `#22C55E`).

### Logos & Icons
- Use the @pantainsure_logo.png
