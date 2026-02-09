import { Link } from 'react-router-dom';
import { useRecentWork } from '@/hooks';
import { Image, Loader } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function RecentWork() {
  const { data: projects, isLoading } = useRecentWork();

  if (isLoading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex justify-center">
            <Loader size="lg" text="Loading recent work..." />
          </div>
        </div>
      </section>
    );
  }

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12">
          Recent Work
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              to={`/${project.slug}`}
              className={cn(
                'group relative overflow-hidden rounded-lg',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100'
              )}
            >
              {/* Project thumbnail */}
              <div className="aspect-[4/3] overflow-hidden">
                {project.images[0] && (
                  <Image
                    image={project.images[0]}
                    alt={project.title}
                    width={600}
                    height={450}
                    priority={index < 3}
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>

              {/* Overlay with title */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg">
                    {project.title}
                  </h3>
                  <p className="text-white/80 text-sm capitalize">
                    {project.category.name}
                  </p>
                </div>
              </div>

              {/* Always visible title on mobile */}
              <div className="mt-3 md:hidden">
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 capitalize">
                  {project.category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-12 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            View all work
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
