/**
 * TanStack Query key factory for consistent cache keys
 */
export const queryKeys = {
  // Categories
  categories: ['categories'] as const,
  category: (slug: string) => ['category', slug] as const,

  // Projects
  projects: (categorySlug?: string) =>
    categorySlug ? ['projects', categorySlug] : (['projects'] as const),
  project: (slug: string) => ['project', slug] as const,

  // Site settings
  siteSettings: ['siteSettings'] as const,

  // Recent work (for homepage)
  recentWork: (count: number) => ['recentWork', count] as const,
} as const;
