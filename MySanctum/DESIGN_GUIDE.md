# MYSANCTUM.AI - Design Guide

## 🎨 The Visual Physics

MYSANCTUM.AI is not a utility—it is a **digital artifact** with mass, texture, and light.

---

## 1. MATERIALITY

### The Stone Canvas

**Background**: `#FAFAF9` (Warm Stone)
- Mimics high-end stationery or honed limestone
- Overlaid with sub-perceptual fractal noise grain
- Creates tactile, premium feel

**Implementation**:
```css
body {
  background: var(--stone-50);
  background-image: url("data:image/svg+xml,..."); /* Fractal noise */
}
```

### The Deep Void

**Desktop Background**: `#0F172A`
- Used only on screens >480px
- App floats as "Monolith" within this void
- Creates depth and focus

**Implementation**:
```css
@media (min-width: 480px) {
  .sanctum-void-bg {
    background: var(--void);
    min-height: 100vh;
  }
}
```

### Glass on Stone

**Overlays & Modals**: Frosted glass effect
- `backdrop-filter: blur(20px)`
- High-opacity white wash
- Creates layered depth

**Implementation**:
```css
.sanctum-glass {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95);
}
```

---

## 2. THE LOCUS SHIELD

### Geometry

Two interlocking arcs that form the mark:

**Shield Arc (270°)**
- Heavy, protective
- Color: Stone-900 (`#1C1917`)
- Represents: The Vault (Fortress)
- Stroke: Thicker (8% of size)

**User/Key Arc (180°)**
- Luminous, active
- Color: Sapphire (`#1D4ED8`)
- Represents: Agency (The Key)
- Stroke: Slightly thinner (7.2% of size)

### States

1. **Idle**: Static, neutral colors
2. **Forging**: Animated assembly with physics
3. **Locked**: Green center, success state
4. **Active**: Glowing, pulsing effect

### Physics Animation

The "Forge" sequence uses cubic-bezier easing:
```css
cubic-bezier(0.34, 1.56, 0.64, 1)
```

This creates:
- Initial acceleration
- Overshoot (bounce)
- Settle into place
- Implies physical weight and locking

---

## 3. COLOR STATES (The Emotional Gradient)

### Amber (Entropy)

**Primary**: `#D97706` (Hearth Gold)

**Signifies**:
- Potential energy
- Unsealed perimeters
- Pending actions
- Warmth, invitation

**Use Cases**:
- Upload buttons
- Grant tokens
- Pending states
- Primary CTAs

**Example**:
```tsx
<Button className="bg-amber-600 hover:bg-amber-700">
  Upload to Vault
</Button>
```

### Sapphire (Harmony)

**Primary**: `#1D4ED8` (Sovereign Sapphire)

**Signifies**:
- Security achieved
- Active leases
- Order and structure
- Trust and reliability

**Use Cases**:
- Security indicators
- Active states
- Lease streams
- Connected wallets

**Example**:
```tsx
<Badge className="border-sapphire-600 text-sapphire-600">
  <Lock className="h-3 w-3" />
  Encrypted
</Badge>
```

### Platinum (Master)

**Primary**: `#E0E7FF`

**Signifies**:
- High-value assets
- Mature "Year 1" state
- Premium features
- Excellence

**Use Cases**:
- Premium badges
- High-value highlights
- Mature account indicators

### Stone (Foundation)

**Range**: `#FAFAF9` to `#1C1917`

**Signifies**:
- Neutrality
- Foundation
- Permanence
- Reliability

**Use Cases**:
- Backgrounds
- Borders
- Text
- Structural elements

---

## 4. TYPOGRAPHY

### Font Stack

**Sans**: System fonts for performance
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...
```

**Mono**: For addresses, CIDs, code
```css
font-family: 'Geist Mono', monospace;
```

### Hierarchy

**Hero (Landing)**
```css
font-size: 3.5rem;    /* 56px */
font-weight: 700;
letter-spacing: -0.02em;
```

**Page Title**
```css
font-size: 2rem;      /* 32px */
font-weight: 700;
```

**Section Title**
```css
font-size: 1.5rem;    /* 24px */
font-weight: 600;
```

**Body**
```css
font-size: 1rem;      /* 16px */
font-weight: 400;
line-height: 1.5;
```

**Caption**
```css
font-size: 0.875rem;  /* 14px */
font-weight: 400;
color: var(--stone-600);
```

---

## 5. SPACING & LAYOUT

### The Monolith

**Desktop (≥480px)**:
```css
max-width: 400px;
min-height: 800px;
border-radius: 1.5rem;
margin: 0 auto;
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
```

**Mobile (<480px)**:
- Full screen
- No border radius
- No shadow
- Natural mobile experience

### Spacing Scale

Based on 4px base unit:

```
xs:  4px   (0.25rem)
sm:  8px   (0.5rem)
md:  16px  (1rem)
lg:  24px  (1.5rem)
xl:  32px  (2rem)
2xl: 48px  (3rem)
3xl: 64px  (4rem)
```

### Component Padding

**Cards**: `1rem` (16px)
**Modals**: `1.5rem` (24px)
**Page Container**: `1rem` mobile, `2rem` desktop

---

## 6. ANIMATION PRINCIPLES

### Timing Functions

**Standard Ease**:
```css
transition: all 0.3s ease;
```

**Forge Physics** (bounce):
```css
cubic-bezier(0.34, 1.56, 0.64, 1)
```

**Smooth In-Out**:
```css
cubic-bezier(0.4, 0, 0.2, 1)
```

### Duration Guidelines

- **Micro**: 150ms (hover states)
- **Standard**: 300ms (transitions)
- **Emphasis**: 500ms (important changes)
- **Forge**: 800ms (logo assembly)
- **Sequence**: 2000ms (multi-step processes)

### Animation Types

**Fade In Up**:
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

**Scale Pop**:
```tsx
initial={{ scale: 0 }}
animate={{ scale: 1 }}
transition={{ type: "spring", duration: 0.6 }}
```

**Pulse Glow**:
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(29, 78, 216, 0.3); }
  50% { box-shadow: 0 0 40px rgba(29, 78, 216, 0.6); }
}
```

---

## 7. COMPONENT PATTERNS

### Cards

**Standard Card**:
```tsx
<Card className="border-stone-200 dark:border-stone-700">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

**Status Card** (Amber - Pending):
```tsx
<Card className="border-amber-200 bg-amber-50/50">
  {/* Pending state content */}
</Card>
```

**Status Card** (Sapphire - Active):
```tsx
<Card className="border-sapphire-200 bg-sapphire-50/50">
  {/* Active state content */}
</Card>
```

### Buttons

**Primary (Sapphire)**:
```tsx
<Button className="bg-sapphire-600 hover:bg-sapphire-700 text-white">
  Action
</Button>
```

**Accent (Amber)**:
```tsx
<Button className="bg-amber-600 hover:bg-amber-700 text-white">
  Upload
</Button>
```

**Outline**:
```tsx
<Button variant="outline">
  Secondary Action
</Button>
```

### Badges

**Encrypted**:
```tsx
<Badge className="border-sapphire-600 text-sapphire-600">
  <Lock className="h-3 w-3 mr-1" />
  Encrypted
</Badge>
```

**Pending**:
```tsx
<Badge className="bg-amber-100 text-amber-700">
  Pending
</Badge>
```

**Success**:
```tsx
<Badge className="bg-green-100 text-green-700">
  <CheckCircle className="h-3 w-3 mr-1" />
  Complete
</Badge>
```

---

## 8. ICONOGRAPHY

### Icon Library

Using **Lucide React** icons:
```tsx
import { Shield, Key, Lock, Upload } from 'lucide-react';
```

### Icon Sizes

- **Small**: `h-4 w-4` (16px) - In badges, buttons
- **Medium**: `h-5 w-5` (20px) - In headers
- **Large**: `h-6 w-6` (24px) - In cards
- **XL**: `h-8 w-8` (32px) - Feature highlights
- **Hero**: `h-12 w-12` (48px) - Empty states

### Icon Colors

Match the emotional state:
```tsx
// Security/Active
<Shield className="text-sapphire-600" />

// Pending/Action
<Upload className="text-amber-600" />

// Success
<CheckCircle className="text-green-600" />

// Neutral
<FileText className="text-stone-600" />
```

---

## 9. RESPONSIVE BREAKPOINTS

### Breakpoint System

```css
/* Mobile First */
/* Default: < 480px */

/* Small Desktop */
@media (min-width: 480px) {
  /* Monolith appears */
}

/* Tablet */
@media (min-width: 768px) {
  /* Multi-column layouts */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Full desktop experience */
}
```

### Layout Patterns

**Mobile (<480px)**:
- Single column
- Full width
- Stack vertically
- Touch-optimized spacing

**Desktop (≥480px)**:
- Monolith container
- Multi-column grids
- Hover states
- Larger spacing

---

## 10. DARK MODE

### Color Adjustments

**Background**:
```css
.dark {
  --background: var(--void);  /* #0F172A */
}
```

**Text**:
```css
.dark {
  --foreground: var(--stone-50);  /* #FAFAF9 */
}
```

**Borders**:
```css
.dark {
  --border: rgba(255, 255, 255, 0.1);
}
```

### Dark Mode Patterns

**Card in Dark Mode**:
```tsx
<Card className="bg-void-light border-stone-700">
  {/* Content adapts automatically */}
</Card>
```

**Glass in Dark Mode**:
```css
.dark .sanctum-glass {
  background: rgba(15, 23, 42, 0.95);
}
```

---

## 11. ACCESSIBILITY

### Contrast Ratios

All text meets WCAG AA standards:
- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum
- **UI components**: 3:1 minimum

### Focus States

```css
:focus-visible {
  outline: 2px solid var(--sapphire-600);
  outline-offset: 2px;
}
```

### Keyboard Navigation

All interactive elements are keyboard accessible:
- Tab order follows visual order
- Enter/Space activate buttons
- Escape closes modals

---

## 12. DESIGN CHECKLIST

When creating new components:

- [ ] Uses Stone Canvas background
- [ ] Follows color emotional states
- [ ] Includes dark mode styles
- [ ] Has hover/focus states
- [ ] Uses appropriate spacing scale
- [ ] Includes loading states
- [ ] Has error states
- [ ] Responsive on mobile
- [ ] Keyboard accessible
- [ ] Meets contrast requirements
- [ ] Uses Lucide icons
- [ ] Follows animation principles

---

## 13. COMMON PATTERNS

### Empty State

```tsx
<Card className="border-dashed border-2">
  <CardContent className="py-16 text-center">
    <Upload className="h-16 w-16 text-stone-400 mx-auto mb-4" />
    <h3 className="text-lg font-semibold mb-2">
      No items yet
    </h3>
    <p className="text-stone-600 mb-4">
      Get started by uploading your first file
    </p>
    <Button className="bg-amber-600">
      Upload File
    </Button>
  </CardContent>
</Card>
```

### Loading State

```tsx
<div className="flex items-center gap-2">
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <Loader className="h-5 w-5" />
  </motion.div>
  <span>Loading...</span>
</div>
```

### Success State

```tsx
<div className="text-center">
  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
    <CheckCircle className="h-10 w-10 text-green-600" />
  </div>
  <h3 className="text-lg font-semibold mt-4">
    Success!
  </h3>
</div>
```

---

## 14. DESIGN RESOURCES

### Color Palette (CSS Variables)

```css
/* Stone Canvas */
--stone-50: #FAFAF9
--stone-100: #F5F5F4
--stone-200: #E7E5E4
--stone-300: #D6D3D1
--stone-500: #78716C
--stone-700: #44403C
--stone-900: #1C1917

/* Amber (Entropy) */
--amber-500: #F59E0B
--amber-600: #D97706
--amber-700: #B45309

/* Sapphire (Harmony) */
--sapphire-500: #3B82F6
--sapphire-600: #1D4ED8
--sapphire-700: #1E40AF

/* Platinum (Master) */
--platinum: #E0E7FF
--platinum-dark: #C7D2FE

/* Void */
--void: #0F172A
--void-light: #1E293B
```

### Quick Reference

**See it in action**: Visit `/showcase` in the app

**Component examples**: Check `components/sanctum/`

**Full documentation**: See `MYSANCTUM_README.md`

---

*"Design is not just what it looks like. Design is how it works."*

**MYSANCTUM.AI - Where form meets function in perfect sovereignty.**

