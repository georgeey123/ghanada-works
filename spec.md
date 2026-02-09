# Ghanadaworks Photography Portfolio - Technical Specification

## Project Overview

A photography portfolio website for **Ghanadaworks**, a mixed/generalist photographer. The site should convey an **authentic and heartfelt** brand feeling while maintaining a minimal, clean aesthetic that lets the photography speak for itself.

---

## Tech Stack

### Core Framework
- **React** with **Vite** (existing setup, CSR)
- **TypeScript** with strict mode enabled
- **React Router v6** for navigation

### Styling
- **Tailwind CSS** with autoprefixer for browser compatibility
- System font stack with web font fallback (modern sans-serif)
- CSS custom properties for theming

### State Management
- **Zustand** for global UI state (lightbox, navigation, theme preferences)
- **TanStack Query** for server state and Contentful data fetching

### CMS
- **Contentful** (headless CMS)
- Contentful Delivery SDK for API access
- Rich content model with flexible fields

### Deployment
- **Vercel** for hosting and CI/CD
- Environment variables: `.env` for local development, Vercel dashboard for production

### Testing
- **Playwright** for E2E testing
- Focus on critical user paths

### Development Tooling
- ESLint + Prettier
- TypeScript strict mode
- `.env.example` for environment documentation

---

## Site Architecture

### Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Full-bleed hero image + recent work grid |
| `/gallery` | Portfolio | Category cards grid |
| `/gallery/:category` | Category | Category intro + project list |
| `/:project-slug` | Project | Individual project gallery |
| `/about` | About | Photographer bio + photo + process |
| `/contact` | Contact | Email + phone + location |
| `/livestream` | Livestream | "Coming Soon" placeholder |
| `/*` | 404 | Custom not found page |

### Navigation Structure

**Main Navigation (hidden on scroll down, shows on scroll up):**
- Home
- Gallery (dropdown with categories)
  - Weddings
  - Glamour
  - Family
  - Portrait
  - Headshots
  - Lifestyle
- About
- Contact
- Livestream

**Logo:** "Ghanadaworks" (capitalized text logo, links to home)

---

## Content Model (Contentful)

### Category
```
- name: Short Text (required)
- slug: Short Text (required, unique)
- description: Long Text (optional)
- heroImage: Media (single, optional) - manually set by client; if empty, falls back to first image of most recent project in category
- sortOrder: Number (optional)
```

### Project
```
- title: Short Text (required)
- slug: Short Text (required, unique)
- category: Reference to Category (required)
- images: Media (multiple, required)
- featured: Boolean (default: false)
- publishedDate: Date (required)
- description: Long Text (optional)
- location: Short Text (optional)
- clientName: Short Text (optional)
- tags: Short Text (list, optional)
```

### Image (via Contentful Assets)
```
- file: Asset (required)
- title: Short Text (optional, used as alt text fallback)
- description: Long Text (optional)
```

### Site Settings (Singleton)
```
- heroImage: Media (single)
- heroTitle: Short Text (optional)
- heroSubtitle: Short Text (optional)
- recentWorkCount: Number (configurable, default: 6)
- photographerPhoto: Media (single)
- bio: Rich Text
- processContent: Rich Text (flexible, photographer structures it)
- email: Short Text
- phone: Short Text
- location: Short Text (city/region)
- socialLinks: JSON (array of {platform, url})
```

---

## Page Specifications

### Home Page

**Hero Section:**
- Full-bleed hero image (CMS-managed, static)
- Photographer can update via Contentful
- Minimal text overlay (optional title/subtitle from CMS)

**Recent Work Section:**
- Grid of recent projects across all categories
- Count configurable from CMS (default: 6)
- Auto-populated from most recent `publishedDate`
- Each item shows project thumbnail + title
- Links to individual project pages

### Portfolio Landing (`/gallery`)

**Layout:**
- Grid of category cards
- Each card: Cover image + category name
- Cover image: Uses category `heroImage` if set in CMS, otherwise falls back to first image of most recent project in that category

**Categories:**
1. Weddings
2. Glamour
3. Family
4. Portrait
5. Headshots
6. Lifestyle

### Category Page (`/gallery/:category`)

**Structure:**
1. Category hero image + description (if provided in CMS)
2. Grid of projects in that category

**Project Cards:**
- Thumbnail image
- Title only (no date/location)
- Subtle scale on hover

### Project Gallery Page (`/:project-slug`)

**Layout Strategy by Category:**
- **Masonry:** Weddings, Family, Lifestyle (dynamic, storytelling content)
- **Uniform Grid:** Glamour, Portrait, Headshots (structured, posed content)

**Image Loading:**
- Progressive JPEG format
- Initial batch: 12 images
- Subsequent batches: 12 images
- Infinite scroll with fallback "Load More" button for accessibility (users who prefer reduced motion or use keyboard navigation can use the button instead)
- Contentful Images API for responsive sizing

**Lightbox (Yet Another React Lightbox):**
- Image only (no captions, metadata, or sharing buttons)
- Navigation: Arrow buttons, keyboard arrows, swipe gestures
- Thumbnail filmstrip at bottom
- Escape to close
- Clean, distraction-free viewing

**Image Protection:**
- Right-click disabled on images (basic deterrent)

### About Page

**Structure:**
1. Photographer photo (from CMS)
2. Bio text (rich text from CMS)
3. Process section (flexible rich text from CMS - photographer can structure as numbered steps, paragraphs, or whatever suits their brand)

### Contact Page

**Content:**
- Email (clickable `mailto:` link)
- Phone (clickable `tel:` link)
- Location/region (text, CMS-managed)
- Social media links (configurable from CMS)

### Livestream Page

**Coming Soon State:**
- Simple text message: "Coming Soon"
- Brief description of what's planned
- No email signup or countdown (kept simple)

### 404 Page

**Design:**
- Branded error page
- "Page not found" message
- Navigation links back to main sections
- Consistent with site design

---

## UI/UX Specifications

### Design System

**Visual Direction:**
- Minimal/clean aesthetic
- Authentic and heartfelt feeling
- Photography is the hero - UI should not compete

**Color Palette:**
- Neutral grays (pure black/white with gray accents)
- Dark mode: System preference detection (auto-switch)
- High contrast for WCAG AA compliance

**Typography:**
- Modern sans-serif (Inter, DM Sans, or similar)
- System font fallback stack for fast loading
- Ensure system fallback looks nearly identical to web font

### Navigation

**Desktop:**
- Fixed top navbar, hidden on scroll down, revealed on scroll up
- Gallery item has dropdown showing all categories
- Text logo "Ghanadaworks" on left

**Mobile:**
- Hamburger menu
- Same dropdown behavior for Gallery
- Full-screen menu overlay

### Animations

**Approach:** Minimal transitions
- Subtle fade-ins for content
- Page transitions: Instant (no animation)
- Gallery images: Subtle scale on hover
- No preloader - content loads immediately

### Responsive Design

**Priority:** Mobile-first
- Design for mobile screens first, enhance for desktop
- Touch-friendly tap targets
- Swipe gestures in lightbox

### Footer

**Content:**
- Navigation links (mirror main nav)
- Category quick links (all 6 categories)
- Social media icons (from CMS)
- Contact info
- Copyright
- No newsletter signup

---

## Technical Specifications

### Image Handling

**Contentful Images API:**
- Request exact dimensions needed per context
- Thumbnails: ~400px width
- Grid images: ~800px width
- Lightbox: Full resolution (up to 2000px)
- Progressive JPEG format

**Lazy Loading:**
- Paginated batch loading (12 initial, 12 per load)
- Infinite scroll with fallback "Load More" button (accessibility)
- Respects `prefers-reduced-motion` - disables auto-scroll loading when enabled
- Browser/CDN caching only (no service worker)

### State Management

**Zustand Store:**
```typescript
interface AppState {
  // Lightbox
  lightboxOpen: boolean;
  lightboxIndex: number;
  openLightbox: (index: number) => void;
  closeLightbox: () => void;

  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: AppState['theme']) => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}
```

**TanStack Query:**
- Cache Contentful responses
- Stale time: 5 minutes (reasonable for portfolio content)
- Error handling with graceful degradation

### Data Fetching

```typescript
// Example query keys structure
const queryKeys = {
  categories: ['categories'],
  category: (slug: string) => ['category', slug],
  projects: (categorySlug?: string) => ['projects', categorySlug],
  project: (slug: string) => ['project', slug],
  siteSettings: ['siteSettings'],
  recentWork: (count: number) => ['recentWork', count],
};
```

### Error Handling

**Strategy:** Graceful degradation
- Failed images show placeholder
- API errors show cached data if available
- Basic content always accessible
- User-friendly error messages where needed

### Browser Support

**Target:** Maximum compatibility
- All reasonably modern browsers
- Safari 14+
- Use autoprefixer for CSS
- Avoid cutting-edge JS features without polyfills

### Accessibility (WCAG AA)

**Requirements:**
- Color contrast ratios meet AA standards (4.5:1 for text)
- Keyboard navigation throughout
- Screen reader support (semantic HTML, ARIA where needed)
- Alt text: CMS optional field, fallback to project title
- Focus indicators visible
- Skip links for main content

### SEO

**Priority:** Low (referral-focused traffic)
- Basic meta tags
- Sitemap for image indexing
- Semantic HTML structure
- No SSR/SSG needed (CSR acceptable)

### URL Structure

**Pattern:** Flat paths
- `/weddings` (category)
- `/sarah-tom-wedding` (project)
- Clean, shareable URLs
- No deep linking to individual images

---

## Third-Party Dependencies

### Production
- `react`, `react-dom`
- `react-router-dom`
- `@tanstack/react-query`
- `zustand`
- `contentful`
- `yet-another-react-lightbox`
- `tailwindcss`

### Development
- `typescript`
- `vite`
- `eslint`, `prettier`
- `@playwright/test`
- `autoprefixer`, `postcss`

---

## Environment Variables

```env
# .env.example
VITE_CONTENTFUL_SPACE_ID=your_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token
VITE_CONTENTFUL_ENVIRONMENT=master
```

---

## File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── MobileMenu.tsx
│   ├── gallery/
│   │   ├── CategoryCard.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── MasonryGrid.tsx
│   │   ├── UniformGrid.tsx
│   │   └── Lightbox.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   └── RecentWork.tsx
│   └── ui/
│       ├── Image.tsx
│       ├── Loader.tsx
│       └── ErrorBoundary.tsx
├── pages/
│   ├── Home.tsx
│   ├── Portfolio.tsx
│   ├── Category.tsx
│   ├── Project.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Livestream.tsx
│   └── NotFound.tsx
├── hooks/
│   ├── useContentful.ts
│   ├── useScrollDirection.ts
│   └── useInfiniteScroll.ts
├── lib/
│   ├── contentful.ts
│   ├── queries.ts
│   └── utils.ts
├── store/
│   └── index.ts
├── styles/
│   └── globals.css
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

---

## E2E Test Coverage (Playwright)

### Critical Paths
1. **Navigation Flow**
   - Home → Gallery → Category → Project
   - Dropdown navigation works
   - Mobile menu functionality

2. **Gallery Loading**
   - Categories display correctly
   - Projects load in category view
   - Infinite scroll triggers new batches

3. **Lightbox**
   - Opens on image click
   - Navigation (arrows, keyboard, swipe)
   - Closes on escape/overlay click

4. **Responsive**
   - Mobile layout renders correctly
   - Desktop layout renders correctly

5. **Content Loading**
   - Contentful data fetches successfully
   - Graceful error handling

---

## Performance Targets

- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

---

## Future Considerations (Not in Scope)

- Livestream functionality (page is placeholder only)
- Print sales / e-commerce
- Client proofing galleries
- Blog/journal
- Newsletter integration
- Analytics


  1. Create Contentful account at https://www.contentful.com/
  2. Create content models (Category, Project, SiteSettings) as described earlier
  3. Get API keys from Settings → API keys
  4. Create .env file:
  VITE_CONTENTFUL_SPACE_ID=your_space_id
  VITE_CONTENTFUL_ACCESS_TOKEN=your_delivery_token
  VITE_CONTENTFUL_ENVIRONMENT=master
  5. Add same variables to Vercel (Settings → Environment Variables)
  6. Add some test content in Contentful
  7. Test locally with npm run dev