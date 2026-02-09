import { Link } from 'react-router-dom';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';

export default function Header() {
  const scrollDirection = useScrollDirection();
  const { mobileMenuOpen, toggleMobileMenu } = useAppStore();

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 transition-transform duration-300',
          scrollDirection === 'down' && !mobileMenuOpen && '-translate-y-full'
        )}
      >
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
            >
              Ghanadaworks
            </Link>

            {/* Desktop Navigation */}
            <Navigation className="hidden md:flex" />

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="md:hidden p-2 -mr-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16" />
    </>
  );
}
