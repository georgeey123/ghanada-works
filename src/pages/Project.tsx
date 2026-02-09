import { useParams, Link } from 'react-router-dom';
import { useProject } from '@/hooks';
import { MasonryGrid, UniformGrid, Lightbox } from '@/components/gallery';
import { Loader } from '@/components/ui';
import { getCategoryLayout } from '@/lib/utils';

export default function Project() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProject(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading project..." />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          The project you&apos;re looking for doesn&apos;t exist.
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

  const layout = getCategoryLayout(project.category.slug);
  const GridComponent = layout === 'masonry' ? MasonryGrid : UniformGrid;

  return (
    <>
      <div className="container py-12 md:py-16">
        {/* Project Header */}
        <div className="mb-8 md:mb-12">
          <Link
            to={`/gallery/${project.category.slug}`}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors mb-4"
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
            {project.category.name}
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>

          {project.description && (
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mb-4">
              {project.description}
            </p>
          )}

          {project.location && (
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              <span className="inline-flex items-center gap-1">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {project.location}
              </span>
            </p>
          )}
        </div>

        {/* Project Gallery */}
        {project.images.length > 0 ? (
          <GridComponent images={project.images} batchSize={12} />
        ) : (
          <p className="text-center text-neutral-600 dark:text-neutral-400 py-12">
            No images in this project yet.
          </p>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox />
    </>
  );
}
