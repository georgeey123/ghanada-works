import { createClient } from 'contentful';
import type { Category, Project, SiteSettings, ContentfulImage } from '@/types';

// Check if Contentful is configured
export const isContentfulConfigured = Boolean(
  import.meta.env.VITE_CONTENTFUL_SPACE_ID &&
  import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN
);

// Create Contentful client only if configured
export const contentfulClient = isContentfulConfigured
  ? createClient({
      space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
      accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
      environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
    })
  : null;

// ============================================
// Type definitions for Contentful responses
// ============================================

/* eslint-disable @typescript-eslint/no-explicit-any */

// ============================================
// Transform functions
// ============================================

function transformAsset(asset: any): ContentfulImage | undefined {
  if (!asset?.fields?.file) return undefined;

  const { file, title, description } = asset.fields;
  return {
    url: file.url.startsWith('//') ? `https:${file.url}` : file.url,
    title: title || undefined,
    description: description || undefined,
    width: file.details?.image?.width || 0,
    height: file.details?.image?.height || 0,
  };
}

function transformCategory(entry: any): Category {
  const fields = entry.fields;
  return {
    id: entry.sys.id,
    name: String(fields.name || ''),
    slug: String(fields.slug || ''),
    description: fields.description ? String(fields.description) : undefined,
    heroImage: transformAsset(fields.heroImage),
    sortOrder: typeof fields.sortOrder === 'number' ? fields.sortOrder : 0,
  };
}

function transformProject(entry: any): Project {
  const fields = entry.fields;
  const categoryEntry = fields.category;

  return {
    id: entry.sys.id,
    title: String(fields.title || ''),
    slug: String(fields.slug || ''),
    category: transformCategory(categoryEntry),
    images: Array.isArray(fields.images)
      ? fields.images
          .map(transformAsset)
          .filter((img: any): img is ContentfulImage => img !== undefined)
      : [],
    featured: Boolean(fields.featured),
    publishedDate: String(fields.publishedDate || ''),
    description: fields.description ? String(fields.description) : undefined,
    location: fields.location ? String(fields.location) : undefined,
    clientName: fields.clientName ? String(fields.clientName) : undefined,
    tags: Array.isArray(fields.tags) ? fields.tags.map(String) : undefined,
  };
}

function transformSiteSettings(entry: any): SiteSettings {
  const fields = entry.fields;
  return {
    heroImage: transformAsset(fields.heroImage),
    heroTitle: fields.heroTitle ? String(fields.heroTitle) : undefined,
    heroSubtitle: fields.heroSubtitle ? String(fields.heroSubtitle) : undefined,
    recentWorkCount:
      typeof fields.recentWorkCount === 'number' ? fields.recentWorkCount : 6,
    photographerPhoto: transformAsset(fields.photographerPhoto),
    bio: fields.bio ?? undefined,
    processContent: fields.processContent ?? undefined,
    email: String(fields.email || ''),
    phone: String(fields.phone || ''),
    location: String(fields.location || ''),
    socialLinks: Array.isArray(fields.socialLinks) ? fields.socialLinks : [],
  };
}

/* eslint-enable @typescript-eslint/no-explicit-any */

// ============================================
// Fetch functions
// ============================================

export async function fetchCategories(): Promise<Category[]> {
  if (!contentfulClient) {
    throw new Error('Contentful client not configured');
  }

  const response = await contentfulClient.getEntries({
    content_type: 'category',
    order: ['fields.sortOrder'] as any,
  });

  return response.items.map(transformCategory);
}

export async function fetchCategory(slug: string): Promise<Category | null> {
  if (!contentfulClient) {
    throw new Error('Contentful client not configured');
  }

  const response = await contentfulClient.getEntries({
    content_type: 'category',
    'fields.slug': slug,
    limit: 1,
  } as any);

  if (response.items.length === 0) {
    return null;
  }

  return transformCategory(response.items[0]);
}

export async function fetchProjects(categorySlug?: string): Promise<Project[]> {
  if (!contentfulClient) {
    throw new Error('Contentful client not configured');
  }

  // If categorySlug is provided, first get the category ID
  let categoryId: string | undefined;
  if (categorySlug) {
    const category = await fetchCategory(categorySlug);
    if (category) {
      categoryId = category.id;
    }
  }

  const query: Record<string, unknown> = {
    content_type: 'project',
    order: ['-fields.publishedDate'],
    include: 2, // Include linked entries (category)
  };

  if (categoryId) {
    query['fields.category.sys.id'] = categoryId;
  }

  const response = await contentfulClient.getEntries(query as any);

  return response.items.map(transformProject);
}

export async function fetchProject(slug: string): Promise<Project | null> {
  if (!contentfulClient) {
    throw new Error('Contentful client not configured');
  }

  const response = await contentfulClient.getEntries({
    content_type: 'project',
    'fields.slug': slug,
    include: 2,
    limit: 1,
  } as any);

  if (response.items.length === 0) {
    return null;
  }

  return transformProject(response.items[0]);
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!contentfulClient) {
    throw new Error('Contentful client not configured');
  }

  const response = await contentfulClient.getEntries({
    content_type: 'siteSettings',
    include: 2,
    limit: 1,
  } as any);

  if (response.items.length === 0) {
    // Return default settings if none exist
    return {
      recentWorkCount: 6,
      email: '',
      phone: '',
      location: '',
      socialLinks: [],
    };
  }

  const entry = response.items[0];

  const resolveAsset = async (assetRef: any) => {
    if (!assetRef) return undefined;
    if (assetRef.fields?.file) return assetRef;
    if (assetRef.sys?.id) {
      try {
        return await contentfulClient.getAsset(assetRef.sys.id);
      } catch {
        return undefined;
      }
    }
    return undefined;
  };

  const [heroImage, photographerPhoto] = await Promise.all([
    resolveAsset(entry.fields.heroImage),
    resolveAsset(entry.fields.photographerPhoto),
  ]);

  const resolvedEntry = {
    ...entry,
    fields: {
      ...entry.fields,
      heroImage,
      photographerPhoto,
    },
  };

  return transformSiteSettings(resolvedEntry);
}

export async function fetchRecentWork(count: number): Promise<Project[]> {
  if (!contentfulClient) {
    throw new Error('Contentful client not configured');
  }

  const response = await contentfulClient.getEntries({
    content_type: 'project',
    order: ['-fields.publishedDate'],
    include: 2,
    limit: count,
  } as any);

  return response.items.map(transformProject);
}

export async function fetchFeaturedProjects(): Promise<Project[]> {
  if (!contentfulClient) {
    throw new Error('Contentful client not configured');
  }

  const response = await contentfulClient.getEntries({
    content_type: 'project',
    'fields.featured': true,
    order: ['-fields.publishedDate'],
    include: 2,
  } as any);

  return response.items.map(transformProject);
}
