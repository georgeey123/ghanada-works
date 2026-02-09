import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-6">
          Page not found
        </p>
        <p className="text-neutral-500 dark:text-neutral-500 mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md hover:opacity-90 transition-opacity"
          >
            Go Home
          </Link>
          <Link
            to="/gallery"
            className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            View Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
