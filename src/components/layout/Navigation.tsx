import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className }: NavigationProps) {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className={cn('items-center gap-6', className)}>
      {navItems.map((item) => (
        <div
          key={item.href}
          className="relative"
          onMouseEnter={() => item.hasDropdown && setDropdownOpen(true)}
          onMouseLeave={() => item.hasDropdown && setDropdownOpen(false)}
        >
          <Link
            to={item.href}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              isActive(item.href)
                ? 'text-neutral-900 dark:text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            )}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            <span className="flex items-center gap-1">
              {item.label}
              {item.hasDropdown && (
                <svg
                  className={cn(
                    'w-4 h-4 transition-transform',
                    dropdownOpen && 'rotate-180'
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
              )}
            </span>
          </Link>

          {/* Dropdown for Gallery */}
          {item.hasDropdown && dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/gallery/${category.slug}`}
                  className={cn(
                    'block px-4 py-2 text-sm transition-colors',
                    location.pathname === `/gallery/${category.slug}`
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
      ))}
    </nav>
  );
}
