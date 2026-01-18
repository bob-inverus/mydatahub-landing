# MYSANCTUM.AI - The Universal Truth Protocol

**From Fortress (Defense) → Sanctuary (Prosperity) → Agency (Creation) → Infrastructure (Base Layer)**

## 🎯 MVP Overview

This is the MVP implementation of MYSANCTUM.AI, a sovereign data vault built on Web3 principles with consumer-grade simplicity.

## 🏗️ Architecture

### Core Philosophy
MYSANCTUM embodies four pillars of progression:

1. **Fortress (Defense)** - Encrypted data vault with absolute sovereignty
2. **Sanctuary (Prosperity)** - Transform data into revenue through licensing
3. **Agency (Creation)** - Create and sign content with C2PA standards
4. **Infrastructure (Base Layer)** - Built on Base L2, IPFS, and cryptographic truth

### Technical Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4 with custom design system
- **Animations**: Framer Motion
- **UI Components**: Radix UI (shadcn/ui)
- **Auth (Planned)**: Coinbase CDP Embedded Wallets with MPC
- **Storage (Planned)**: IPFS with client-side encryption
- **Blockchain (Planned)**: Base L2 smart contracts for permissions
- **Provenance (Planned)**: C2PA content authenticity

## 🎨 Design System

### Colors

#### The Stone Canvas
- Primary background: `#FAFAF9` (Warm Stone)
- Overlaid with fractal noise grain texture
- Mimics high-end stationery or honed limestone

#### The Deep Void (Desktop Background)
- Background color: `#0F172A`
- App floats as "Monolith" (400px × 800px) on desktop

#### Emotional Gradients

**Amber (Entropy/Hearth Gold)**
- Primary: `#D97706`
- Signifies: Potential, unsealed perimeters, pending action

**Sapphire (Harmony/Sovereign)**
- Primary: `#1D4ED8`
- Signifies: Security, active leases, order

**Platinum (Master)**
- Highlight: `#E0E7FF`
- Used for: High-value assets, mature "Year 1" state

### The Locus Shield

The brand mark consists of two interlocking arcs:

- **Shield Arc (270°)**: Heavy, protective (Stone-900). Represents the Vault.
- **User/Key Arc**: Luminous, active (Sapphire). Represents Agency (The Key).

During the "Forge" sequence, these parts animate together with physics-based easing to imply physical weight and locking.

## 📁 Project Structure

```
MySanctum/
├── app/
│   ├── sanctum/              # Main Sanctum application
│   │   ├── page.tsx          # Entry point with induction
│   │   └── layout.tsx        # Monolith layout wrapper
│   ├── vault/                # Direct vault access
│   │   └── page.tsx
│   ├── page.tsx              # Landing page
│   └── globals.css           # Design system & animations
├── components/
│   └── sanctum/              # All Sanctum components
│       ├── locus-shield.tsx           # Logo with forge animation
│       ├── induction-flow.tsx         # Onboarding experience
│       ├── vault-dashboard.tsx        # Main vault interface
│       ├── file-upload-modal.tsx      # Encryption & upload UI
│       ├── grant-permission-modal.tsx # Permission management
│       ├── wallet-connect.tsx         # Wallet connection UI
│       ├── sanctum-landing.tsx        # Marketing landing page
│       └── index.ts                   # Barrel exports
└── lib/
    └── sanctum/              # (Future) Core logic
        ├── encryption/       # Client-side encryption
        ├── ipfs/            # IPFS integration
        └── contracts/       # Smart contract ABIs
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the landing page.

### Key Routes

- `/` - Landing page introducing MYSANCTUM
- `/sanctum` - Main application (includes induction flow)
- `/vault` - Direct vault access (for authenticated users)

## 🎭 Key Features (MVP)

### ✅ Implemented

1. **Visual Identity**
   - Complete design system with Stone Canvas aesthetic
   - Fractal noise grain texture
   - Monolith layout on desktop (400×800px floating slab)
   - Responsive mobile-first design

2. **The Locus Shield**
   - Animated SVG logo with forge sequence
   - Multiple states: idle, forging, locked, active
   - Physics-based animations

3. **Induction Flow**
   - Beautiful onboarding experience
   - Four-step journey: Welcome → Philosophy → Forge → Identity
   - Introduces the four pillars
   - Simulated "forging" animation

4. **Vault Dashboard**
   - File listing with metadata
   - Status cards (Total Encrypted, Active Grants, Active Leases)
   - Tab-based navigation (Vault, Permissions)
   - Mock data for demonstration

5. **File Upload Modal**
   - Multi-stage upload process
   - Visual encryption animation
   - IPFS upload simulation
   - Success state with CID display

6. **Permission Management**
   - Grant (temporary access token) creation
   - Lease (payment stream) creation
   - Access level selection (View, Download, Full)
   - Duration/price configuration

7. **Wallet Connection**
   - Foundation for Coinbase CDP integration
   - MPC explanation UI
   - Connected state display
   - Sovereign eject messaging

### 🔜 Planned for Production

1. **Real Authentication**
   - Coinbase CDP Embedded Wallets integration
   - Email/Social login with MPC key splitting
   - "Sovereign Eject" functionality for full custody

2. **IPFS Integration**
   - Real client-side encryption using wallet signatures
   - IPFS pinning service integration
   - CID storage and retrieval

3. **Smart Contracts (Base L2)**
   - Grant token contract (ERC-721 Soulbound)
   - Lease stream contract (ERC-20 payment streams)
   - Permission revocation ("Sever" function)

4. **C2PA Integration**
   - Content signing for user-created content
   - Manifest embedding
   - Verification UI

5. **Real Data Persistence**
   - User accounts and vault data
   - Permission tracking
   - Access logs and analytics

## 🔐 Security Model

### Current (MVP)
- Simulated encryption workflows
- No real data persistence
- Client-side state management

### Planned (Production)

1. **Client-Side Encryption**
   - Files encrypted with wallet signature before upload
   - AES-256-GCM encryption
   - Key derivation from wallet private key

2. **Air-Gapped Privacy**
   - Encrypted blob pinned to IPFS
   - Only CID stored on-chain
   - Without user's key, data is mathematical noise

3. **Smart Contract Permissions**
   - On-chain permission management
   - Instant revocation capability
   - Non-transferable access tokens

## 🎨 Design Principles

### Materiality
- Stone Canvas with fractal noise
- Glass overlays with backdrop blur
- Physical weight in animations
- Tactile, premium feel

### Responsive Design
- **Mobile (< 480px)**: Full-screen experience
- **Desktop (≥ 480px)**: Monolith (400×800px) floating in Void

### Animation Philosophy
- Physics-based easing curves
- "Forge slam" for component assembly
- Pulse glow for active states
- Smooth state transitions

## 🛠️ Development Guidelines

### Adding New Features

1. Follow the design system in `globals.css`
2. Use Sanctum color palette (Stone, Amber, Sapphire, Platinum)
3. Maintain the Monolith layout for desktop
4. Add components to `components/sanctum/`
5. Export from `components/sanctum/index.ts`

### Color Usage Guidelines

- **Stone**: Neutral UI, backgrounds, borders
- **Amber**: Pending actions, unsealed states, primary CTAs
- **Sapphire**: Active states, security indicators, success
- **Platinum**: Premium features, high-value items

### Animation Guidelines

- Use Framer Motion for complex animations
- CSS animations for simple states
- Maintain 60fps performance
- Add loading states for all async operations

## 📊 State Management

### Current Approach
- React hooks (`useState`, `useEffect`)
- Local storage for persistence
- Client-side only

### Future Considerations
- Zustand for global state
- React Query for server state
- IndexedDB for offline support

## 🔗 Integration Points

### Wallet Connection (Future)
```typescript
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'

// Initialize CDP
const sdk = new CoinbaseWalletSDK({
  appName: 'MYSANCTUM.AI',
  appChainIds: [8453], // Base L2
})
```

### IPFS (Future)
```typescript
import { create } from 'ipfs-http-client'

// Upload encrypted file
const cid = await ipfs.add(encryptedBlob)
```

### Smart Contracts (Future)
```typescript
// Grant permission on-chain
await grantContract.mint(recipientAddress, tokenId, metadata)
```

## 🎯 MVP vs. Production Checklist

### MVP (Current) ✅
- [x] Design system implementation
- [x] Locus Shield logo with animation
- [x] Induction flow
- [x] Vault dashboard UI
- [x] File upload modal (simulated)
- [x] Permission management UI (simulated)
- [x] Wallet connection UI (simulated)
- [x] Landing page
- [x] Responsive design
- [x] Dark mode support

### Production (Next Steps) 🚧
- [ ] Coinbase CDP wallet integration
- [ ] Real client-side encryption
- [ ] IPFS pinning service
- [ ] Base L2 smart contracts
- [ ] C2PA signing integration
- [ ] User authentication & persistence
- [ ] Backend API for metadata
- [ ] Access control enforcement
- [ ] Payment processing for leases
- [ ] Analytics dashboard

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+
- Chrome Android 90+

## 🤝 Contributing

This is an MVP. For production development:

1. Follow the existing component structure
2. Maintain the design system
3. Add TypeScript types for all props
4. Include JSDoc comments
5. Test on mobile and desktop
6. Ensure dark mode compatibility

## 📄 License

Proprietary - MYSANCTUM.AI

---

**Built with sovereignty. Powered by truth.**

*"From Fortress to Sanctuary to Agency to Infrastructure"*

