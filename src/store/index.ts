import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ContentfulImage } from '@/types';

interface AppState {
  // Lightbox state
  lightboxOpen: boolean;
  lightboxIndex: number;
  lightboxImages: ContentfulImage[];
  openLightbox: (images: ContentfulImage[], index: number) => void;
  closeLightbox: () => void;
  setLightboxIndex: (index: number) => void;

  // Theme state
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: AppState['theme']) => void;

  // Mobile menu state
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Lightbox
      lightboxOpen: false,
      lightboxIndex: 0,
      lightboxImages: [],
      openLightbox: (images, index) =>
        set({
          lightboxOpen: true,
          lightboxImages: images,
          lightboxIndex: index,
        }),
      closeLightbox: () =>
        set({
          lightboxOpen: false,
          lightboxIndex: 0,
        }),
      setLightboxIndex: (index) => set({ lightboxIndex: index }),

      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // Mobile menu
      mobileMenuOpen: false,
      toggleMobileMenu: () =>
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      closeMobileMenu: () => set({ mobileMenuOpen: false }),
    }),
    {
      name: 'ghanadaworks-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
