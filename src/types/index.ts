import type { Document } from '@contentful/rich-text-types';

// Contentful Image type
export interface ContentfulImage {
  url: string;
  title?: string;
  description?: string;
  width: number;
  height: number;
}

export interface HeroMediaItem {
  url: string;
  title?: string;
  description?: string;
  width: number;
  height: number;
  contentType?: string;
  kind: 'image' | 'video';
}

// Category content type
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  heroImage?: ContentfulImage;
  sortOrder?: number;
}

// Project content type
export interface Project {
  id: string;
  title: string;
  slug: string;
  category: Category;
  images: ContentfulImage[];
  featured: boolean;
  publishedDate: string;
  description?: string;
  location?: string;
  clientName?: string;
  tags?: string[];
}

// Social link type
export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

// Site settings singleton
export interface SiteSettings {
  heroImage?: ContentfulImage;
  heroMedia?: HeroMediaItem[];
  heroTitle?: string;
  heroSubtitle?: string;
  recentWorkCount: number;
  photographerPhoto?: ContentfulImage;
  bio?: Document | string;
  processContent?: Document | string;
  email: string;
  phone: string;
  location: string;
  socialLinks: SocialLink[];
}

// Grid layout type based on category
export type GridLayout = 'masonry' | 'uniform';

// Category to layout mapping
// Uniform is used across categories to preserve consistent orientation.
export const CATEGORY_LAYOUTS: Record<string, GridLayout> = {
  weddings: 'uniform',
  glamour: 'uniform',
  family: 'uniform',
  portrait: 'uniform',
  headshots: 'uniform',
  lifestyle: 'uniform',
};

// Navigation item type
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Image loading state
export type ImageLoadState = 'idle' | 'loading' | 'loaded' | 'error';
