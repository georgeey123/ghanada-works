import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CATEGORY_LAYOUTS, type GridLayout } from '@/types';

/**
 * Merge class names with Tailwind CSS conflict resolution
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Get Contentful image URL with transformations
 */
export function getContentfulImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    format?: 'jpg' | 'png' | 'webp' | 'avif';
    quality?: number;
    fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb';
  } = {}
): string {
  // Handle non-Contentful URLs (e.g., picsum for mock data)
  if (!url.includes('ctfassets.net') && !url.includes('images.ctfassets.net')) {
    // For picsum.photos, we can append size
    if (url.includes('picsum.photos')) {
      const baseUrl = url.split('?')[0];
      const width = options.width || 800;
      const height = options.height || 600;
      return `${baseUrl}/${width}/${height}`;
    }
    return url;
  }

  const params = new URLSearchParams();

  if (options.width) params.set('w', String(options.width));
  if (options.height) params.set('h', String(options.height));
  if (options.format) params.set('fm', options.format);
  if (options.quality) params.set('q', String(options.quality));
  if (options.fit) params.set('fit', options.fit);

  // Progressive JPEG for better loading experience
  if (options.format === 'jpg' || !options.format) {
    params.set('fl', 'progressive');
  }

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

/**
 * Get grid layout type based on category slug
 */
export function getCategoryLayout(categorySlug: string): GridLayout {
  return CATEGORY_LAYOUTS[categorySlug.toLowerCase()] || 'uniform';
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
}

/**
 * Generate slug from string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
