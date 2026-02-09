import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { cn } from '@/lib/utils';

const categories = [
  { name: 'Weddings', slug: 'weddings' },
  { name: 'Glamour', slug: 'glamour' },
  { name: 'Family', slug: 'family' },
  { name: 'Portrait', slug: 'portrait' },
  { name: 'Headshots', slug: 'headshots' },
  { name: 'Lifestyle', slug: 'lifestyle' },
];

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Gallery', href: '/gallery', hasDropdown: true },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Livestream', href: '/livestream' },
];

export default function MobileMenu() {
  const location = useLocation();
  const { mobileMenuOpen, closeMobileMenu } = useAppStore();
  const [galleryExpanded, setGalleryExpanded] = useState(false);

  useLockBodyScroll(mobileMenuOpen);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, closeMobileMenu]);

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleLinkClick = () => {
    closeMobileMenu();
    setGalleryExpanded(false);
  };

  if (!mobileMenuOpen) return null;

  return (
    <div
      id="mobile-menu"
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-neutral-950 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-800">
          <span className="text-xl font-semibold">Menu</span>
          <button
            type="button"
            onClick={closeMobileMenu}
            className="p-2 -mr-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          {navItems.map((item) => (
            <div key={item.href}>
              {item.hasDropdown ? (
                <>
                  <button
                    type="button"
                    onClick={() => setGalleryExpanded(!galleryExpanded)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 text-lg font-medium rounded-md transition-colors',
                      isActive(item.href)
                        ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                        : 'text-neutral-600 dark:text-neutral-400'
                    )}
                    aria-expanded={galleryExpanded}
                  >
                    {item.label}
                    <svg
                      className={cn(
                        'w-5 h-5 transition-transform',
                        galleryExpanded && 'rotate-180'
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Expanded category list */}
                  {galleryExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      <Link
                        to="/gallery"
                        onClick={handleLinkClick}
                        className={cn(
                          'block px-4 py-2 text-base rounded-md transition-colors',
                          location.pathname === '/gallery'
                            ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                            : 'text-neutral-600 dark:text-neutral-400'
                        )}
                      >
                        All Categories
                      </Link>
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          to={`/gallery/${category.slug}`}
                          onClick={handleLinkClick}
                          className={cn(
                            'block px-4 py-2 text-base rounded-md transition-colors',
                            location.pathname === `/gallery/${category.slug}`
                              ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                              : 'text-neutral-600 dark:text-neutral-400'
                          )}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    'block px-4 py-3 text-lg font-medium rounded-md transition-colors',
                    isActive(item.href)
                      ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                      : 'text-neutral-600 dark:text-neutral-400'
                  )}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
