import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries';
import {
  getMockCategories,
  getMockCategory,
  getMockProjects,
  getMockProject,
  getMockSiteSettings,
  getMockRecentWork,
} from '@/lib/mockData';
import {
  isContentfulConfigured,
  fetchCategories,
  fetchCategory,
  fetchProjects,
  fetchProject,
  fetchSiteSettings,
  fetchRecentWork,
} from '@/lib/contentful';
import type { Category, Project, SiteSettings } from '@/types';

// Use mock data if Contentful is not configured
const useMockData = !isContentfulConfigured;

/**
 * Hook to fetch all categories
 */
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: queryKeys.categories,
    queryFn: async () => {
      if (useMockData) {
        return getMockCategories();
      }
      return fetchCategories();
    },
  });
}

/**
 * Hook to fetch a single category by slug
 */
export function useCategory(slug: string) {
  return useQuery<Category | null>({
    queryKey: queryKeys.category(slug),
    queryFn: async () => {
      if (useMockData) {
        return getMockCategory(slug);
      }
      return fetchCategory(slug);
    },
    enabled: !!slug,
  });
}

/**
 * Hook to fetch projects, optionally filtered by category
 */
export function useProjects(categorySlug?: string) {
  return useQuery<Project[]>({
    queryKey: queryKeys.projects(categorySlug),
    queryFn: async () => {
      if (useMockData) {
        return getMockProjects(categorySlug);
      }
      return fetchProjects(categorySlug);
    },
  });
}

/**
 * Hook to fetch a single project by slug
 */
export function useProject(slug: string) {
  return useQuery<Project | null>({
    queryKey: queryKeys.project(slug),
    queryFn: async () => {
      if (useMockData) {
        return getMockProject(slug);
      }
      return fetchProject(slug);
    },
    enabled: !!slug,
  });
}

/**
 * Hook to fetch site settings
 */
export function useSiteSettings() {
  return useQuery<SiteSettings>({
    queryKey: queryKeys.siteSettings,
    queryFn: async () => {
      if (useMockData) {
        return getMockSiteSettings();
      }
      return fetchSiteSettings();
    },
  });
}

/**
 * Hook to fetch recent work for the homepage
 */
export function useRecentWork(count?: number) {
  const { data: settings } = useSiteSettings();
  const workCount = count ?? settings?.recentWorkCount ?? 6;

  return useQuery<Project[]>({
    queryKey: queryKeys.recentWork(workCount),
    queryFn: async () => {
      if (useMockData) {
        return getMockRecentWork(workCount);
      }
      return fetchRecentWork(workCount);
    },
  });
}
