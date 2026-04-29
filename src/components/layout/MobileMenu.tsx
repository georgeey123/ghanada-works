import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { cn } from '@/lib/utils';

const eventMediaCategories = [
  { name: 'Weddings', slug: 'weddings' },
  { name: 'Glamour', slug: 'glamour' },
  { name: 'Family', slug: 'family' },
  { name: 'Portrait', slug: 'portrait' },
  { name: 'Headshots', slug: 'headshots' },
  { name: 'Lifestyle', slug: 'lifestyle' },
];

const corporateMediaItems = [
  { label: 'Conferences', href: '/conferences' },
  { label: 'Videos', href: '/videos' },
  { label: 'Livestream', href: '/livestream' },
  { label: 'Gallery', href: '/corporate-gallery' },
];

export default function MobileMenu() {
  const location = useLocation();
  const { mobileMenuOpen, closeMobileMenu } = useAppStore();
  const [corporateExpanded, setCorporateExpanded] = useState(false);
  const [eventMediaExpanded, setEventMediaExpanded] = useState(false);

  useLockBodyScroll(mobileMenuOpen);

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

  const isEventMediaRoute =
    location.pathname.startsWith('/event-media') ||
    location.pathname.startsWith('/gallery');

  const isCorporateMediaRoute =
    location.pathname.startsWith('/conferences') ||
    location.pathname.startsWith('/videos') ||
    location.pathname.startsWith('/livestream') ||
    location.pathname.startsWith('/corporate-gallery');

  const isEventMediaCategoryActive = (slug: string) =>
    location.pathname === `/event-media/${slug}` ||
    location.pathname === `/gallery/${slug}`;

  const handleLinkClick = () => {
    closeMobileMenu();
    setCorporateExpanded(false);
    setEventMediaExpanded(false);
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
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-neutral-950 shadow-xl">
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

        <nav className="p-4 space-y-1">
          <Link
            to="/"
            onClick={handleLinkClick}
            className={cn(
              'block px-4 py-3 text-lg font-medium rounded-md transition-colors',
              isActive('/')
                ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                : 'text-neutral-600 dark:text-neutral-400'
            )}
            aria-current={isActive('/') ? 'page' : undefined}
          >
            Home
          </Link>

          <Link
            to="/about"
            onClick={handleLinkClick}
            className={cn(
              'block px-4 py-3 text-lg font-medium rounded-md transition-colors',
              isActive('/about')
                ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                : 'text-neutral-600 dark:text-neutral-400'
            )}
            aria-current={isActive('/about') ? 'page' : undefined}
          >
            About
          </Link>

          <button
            type="button"
            onClick={() => setCorporateExpanded((prev) => !prev)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3 text-lg font-medium rounded-md transition-colors',
              isCorporateMediaRoute
                ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                : 'text-neutral-600 dark:text-neutral-400'
            )}
            aria-expanded={corporateExpanded}
          >
            Corporate Media
            <svg
              className={cn(
                'w-5 h-5 transition-transform',
                corporateExpanded && 'rotate-180'
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

          {corporateExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {corporateMediaItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    'block px-4 py-2 text-base rounded-md transition-colors',
                    isActive(item.href)
                      ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                      : 'text-neutral-600 dark:text-neutral-400'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setEventMediaExpanded((prev) => !prev)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3 text-lg font-medium rounded-md transition-colors',
              isEventMediaRoute
                ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                : 'text-neutral-600 dark:text-neutral-400'
            )}
            aria-expanded={eventMediaExpanded}
          >
            Event Media
            <svg
              className={cn(
                'w-5 h-5 transition-transform',
                eventMediaExpanded && 'rotate-180'
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

          {eventMediaExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              <Link
                to="/event-media"
                onClick={handleLinkClick}
                className={cn(
                  'block px-4 py-2 text-base rounded-md transition-colors',
                  isEventMediaRoute &&
                    !location.pathname.includes('/event-media/')
                    ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                    : 'text-neutral-600 dark:text-neutral-400'
                )}
              >
                All Categories
              </Link>
              {eventMediaCategories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/event-media/${category.slug}`}
                  onClick={handleLinkClick}
                  className={cn(
                    'block px-4 py-2 text-base rounded-md transition-colors',
                    isEventMediaCategoryActive(category.slug)
                      ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                      : 'text-neutral-600 dark:text-neutral-400'
                  )}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/contact"
            onClick={handleLinkClick}
            className={cn(
              'block px-4 py-3 text-lg font-medium rounded-md transition-colors',
              isActive('/contact')
                ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                : 'text-neutral-600 dark:text-neutral-400'
            )}
            aria-current={isActive('/contact') ? 'page' : undefined}
          >
            Contact
          </Link>

          <Link
            to="/livestream"
            onClick={handleLinkClick}
            className={cn(
              'block px-4 py-3 text-lg font-medium rounded-md transition-colors',
              isActive('/livestream')
                ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                : 'text-neutral-600 dark:text-neutral-400'
            )}
            aria-current={isActive('/livestream') ? 'page' : undefined}
          >
            Livestream
          </Link>
        </nav>
      </div>
    </div>
  );
}
