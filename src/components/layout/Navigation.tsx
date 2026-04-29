import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className }: NavigationProps) {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  return (
    <nav className={cn('items-center gap-6', className)}>
      <Link
        to="/"
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-md transition-colors',
          isActive('/')
            ? 'text-neutral-900 dark:text-white'
            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
        )}
        aria-current={isActive('/') ? 'page' : undefined}
      >
        Home
      </Link>

      <Link
        to="/about"
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-md transition-colors',
          isActive('/about')
            ? 'text-neutral-900 dark:text-white'
            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
        )}
        aria-current={isActive('/about') ? 'page' : undefined}
      >
        About
      </Link>

      <div
        className="relative"
        onMouseEnter={() => setOpenDropdown('corporate-media')}
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <Link
          to="/conferences"
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            isCorporateMediaRoute
              ? 'text-neutral-900 dark:text-white'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          )}
        >
          <span className="flex items-center gap-1">
            Corporate Media
            <svg
              className={cn(
                'w-4 h-4 transition-transform',
                openDropdown === 'corporate-media' && 'rotate-180'
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
          </span>
        </Link>

        {openDropdown === 'corporate-media' && (
          <div className="absolute top-full left-0 mt-1 w-52 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg">
            {corporateMediaItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'block px-4 py-2 text-sm transition-colors',
                  isActive(item.href)
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div
        className="relative"
        onMouseEnter={() => setOpenDropdown('event-media')}
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <Link
          to="/event-media"
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            isEventMediaRoute
              ? 'text-neutral-900 dark:text-white'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          )}
        >
          <span className="flex items-center gap-1">
            Event Media
            <svg
              className={cn(
                'w-4 h-4 transition-transform',
                openDropdown === 'event-media' && 'rotate-180'
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
          </span>
        </Link>

        {openDropdown === 'event-media' && (
          <div className="absolute top-full left-0 mt-1 w-48 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg">
            {eventMediaCategories.map((category) => (
              <Link
                key={category.slug}
                to={`/event-media/${category.slug}`}
                className={cn(
                  'block px-4 py-2 text-sm transition-colors',
                  isEventMediaCategoryActive(category.slug)
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <Link
        to="/contact"
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-md transition-colors',
          isActive('/contact')
            ? 'text-neutral-900 dark:text-white'
            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
        )}
        aria-current={isActive('/contact') ? 'page' : undefined}
      >
        Contact
      </Link>

      <Link
        to="/livestream"
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-md transition-colors',
          isActive('/livestream')
            ? 'text-neutral-900 dark:text-white'
            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
        )}
        aria-current={isActive('/livestream') ? 'page' : undefined}
      >
        Livestream
      </Link>
    </nav>
  );
}
