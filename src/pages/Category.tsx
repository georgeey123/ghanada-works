import { useParams, Link } from 'react-router-dom';
import { useCategory, useProjects } from '@/hooks';
import { ProjectCard } from '@/components/gallery';
import { Image, Loader } from '@/components/ui';

export default function Category() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const { data: category, isLoading: categoryLoading } = useCategory(
    categorySlug || ''
  );
  const { data: projects, isLoading: projectsLoading } = useProjects(categorySlug);

  const isLoading = categoryLoading || projectsLoading;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading category..." />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          The category you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          to="/gallery"
          className="text-neutral-900 dark:text-white underline hover:no-underline"
        >
          Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Category Hero */}
      {category.heroImage && (
        <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
          <Image
            image={category.heroImage}
            alt={category.name}
            priority
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container pb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg text-white/90 max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Projects Grid */}
      <div className="container py-12 md:py-16">
        {/* Header if no hero image */}
        {!category.heroImage && (
          <div className="mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
        )}

        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                priority={index < 6}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-600 dark:text-neutral-400 py-12">
            No projects in this category yet.
          </p>
        )}

        {/* Back link */}
        <div className="mt-12 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
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
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Back to Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
