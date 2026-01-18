# MYSANCTUM.AI - Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Step 1: Install Dependencies

```bash
cd MySanctum
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

### Step 3: Visit the Application

Open your browser and navigate to:

```
http://localhost:3000
```

## 🎯 What You'll See

### Landing Page (/)
- Beautiful introduction to MYSANCTUM.AI
- The Four Pillars explained
- Call-to-action to enter the Sanctum

### Sanctum Application (/sanctum)

**First Visit - Induction Flow:**
1. **Welcome Screen** - Introduction with animated Locus Shield
2. **Philosophy Screen** - The Four Pillars detailed
3. **Forge Screen** - Simulated vault creation
4. **Identity Screen** - Wallet connection options

**After Induction - Vault Dashboard:**
- Status cards showing vault metrics
- File listing with mock data
- Upload and permission management

### Direct Vault Access (/vault)
- Skips induction
- Directly shows vault dashboard

## 🎨 Testing the MVP Features

### 1. Experience the Induction Flow

```
Visit: http://localhost:3000/sanctum
```

Clear your localStorage to see it again:
```javascript
// In browser console:
localStorage.removeItem('sanctum_inducted');
location.reload();
```

### 2. Test File Upload (Simulated)

1. Go to `/sanctum` (complete induction first)
2. Click "Upload to Vault"
3. Select any file
4. Watch the encryption → upload → completion flow

### 3. Test Permission Management

1. On the vault dashboard
2. Find a file and click "Manage Access"
3. Choose between:
   - **Grant**: Temporary access token
   - **Lease**: Payment stream
4. Configure and create

### 4. Test Wallet Connection

1. Go to vault dashboard
2. Click "Settings"
3. Click "Connect with Coinbase"
4. Watch the simulated connection

## 🎭 Exploring Components

All components are in `components/sanctum/`:

```typescript
import {
  LocusShield,           // The logo
  InductionFlow,         // Onboarding
  VaultDashboard,        // Main UI
  FileUploadModal,       // Upload flow
  GrantPermissionModal,  // Permissions
  WalletConnect,         // Wallet UI
  SanctumLanding,        // Landing page
} from '@/components/sanctum';
```

### Using the Locus Shield

```tsx
import { LocusShield } from '@/components/sanctum';

// Basic usage
<LocusShield size={120} />

// With animation
<LocusShield size={160} animated={true} state="forging" />

// Different states
<LocusShield state="idle" />      // Default
<LocusShield state="forging" />   // Animating
<LocusShield state="locked" />    // Success/locked
<LocusShield state="active" />    // Active/glowing
```

## 🎨 Customizing the Design

### Colors

Edit `app/globals.css` to modify the design system:

```css
:root {
  --stone-50: #FAFAF9;      /* Background */
  --amber-600: #D97706;      /* Pending/CTA */
  --sapphire-600: #1D4ED8;   /* Active/Security */
  --platinum: #E0E7FF;       /* Premium */
}
```

### Layout

Desktop monolith dimensions:
```css
.sanctum-monolith {
  max-width: 400px;
  min-height: 800px;
}
```

## 🔧 Configuration

Edit `lib/sanctum/config.ts` to change settings:

```typescript
export const SANCTUM_CONFIG = {
  ui: {
    monolith: {
      width: 400,  // Change width
      minHeight: 800,
    },
  },
  limits: {
    maxFileSize: 100 * 1024 * 1024, // 100 MB
  },
  // ...
};
```

## 🎬 Animation Speeds

Adjust in `app/globals.css`:

```css
.animate-forge-slam {
  animation: forge-slam 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
```

Or in config:
```typescript
animations: {
  forgeSequence: 2000,  // ms
  encryption: 1000,
  upload: 1500,
}
```

## 📱 Testing Responsive Design

### Desktop View (≥480px)
- Monolith floats in void
- 400px × 800px container
- Dark background

### Mobile View (<480px)
- Full screen
- No monolith wrapper
- Standard mobile layout

**To test:**
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Try different screen sizes

## 🐛 Common Issues

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm run dev
```

### Styles Not Updating

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npm run type-check
```

## 📊 Mock Data

The MVP uses simulated data. To modify:

**File Mock Data** - Edit in `components/sanctum/vault-dashboard.tsx`:
```typescript
const [items, setItems] = useState<VaultItem[]>([
  {
    id: '1',
    name: 'Medical Records 2024.pdf',
    // ... add more mock files
  }
]);
```

## 🚀 Next Steps

### For Development
1. Review `MYSANCTUM_README.md` for architecture
2. Explore components in `components/sanctum/`
3. Check `lib/sanctum/config.ts` for settings

### For Production
1. Integrate Coinbase CDP SDK
2. Set up IPFS pinning service
3. Deploy Base L2 smart contracts
4. Add backend API for persistence

## 💡 Tips

### Dark Mode
- Automatically supported
- Uses system preferences
- Toggle in browser DevTools

### Performance
- Built with Next.js 15 App Router
- Turbopack for fast refresh
- Optimized animations with Framer Motion

### Accessibility
- Semantic HTML
- Keyboard navigation
- ARIA labels (to be enhanced)

## 📖 Resources

- [Main README](./MYSANCTUM_README.md) - Full documentation
- [Components](./components/sanctum/) - Source code
- [Config](./lib/sanctum/config.ts) - Settings

## 🆘 Need Help?

Check these files:
1. `MYSANCTUM_README.md` - Full documentation
2. `lib/sanctum/config.ts` - Configuration options
3. Component source files - Well-commented code

---

**Happy Building! 🏗️**

*"From Fortress to Sanctuary to Agency to Infrastructure"*

