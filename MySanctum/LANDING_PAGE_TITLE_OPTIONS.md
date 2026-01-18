# MySanctum Landing Page - Title Variations

## Current Implementation (Option 1)
**Title:** MySanctum  
**Subtitle:** Your Personal Data Vault

This emphasizes the secure, personal nature of the data storage.

---

## Option 2: Universal Truth Focus
**Title:** MySanctum  
**Subtitle:** The Universal Truth Protocol

This emphasizes the verification and authenticity aspects.

---

## Option 3: Security & Privacy Focus
**Title:** MySanctum  
**Subtitle:** Secure. Private. Yours.

This emphasizes the three core values in a punchy, memorable way.

---

## How to Switch Between Options

Edit `/apps/frontend/src/components/home/landing-page.tsx` around line 167-172:

```tsx
<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-foreground">
  MySanctum
</h1>

<p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-light">
  [CHOOSE YOUR SUBTITLE HERE]
</p>
```

**Subtitle Options:**
- `Your Personal Data Vault` (Current - Option 1)
- `The Universal Truth Protocol` (Option 2)
- `Secure. Private. Yours.` (Option 3)

---

## Additional Variations to Consider

### Option 4: Action-Oriented
**Title:** MySanctum  
**Subtitle:** Own Your Data. Control Your Truth.

### Option 5: Technical
**Title:** MySanctum  
**Subtitle:** Decentralized Data Sovereignty

### Option 6: Simple & Direct
**Title:** MySanctum  
**Subtitle:** Your Data. Your Rules.

