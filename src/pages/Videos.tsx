import { useProjects } from '@/hooks';
import { ProjectCard } from '@/components/gallery';
import { Loader } from '@/components/ui';

function hasCorporateVideoTag(tags?: string[]) {
  if (!tags || tags.length === 0) return false;
  return tags.some((tag) => tag.trim().toLowerCase() === 'corporate-video');
}

export default function Videos() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading videos..." />
      </div>
    );
  }

  const videoProjects = (projects ?? []).filter((project) =>
    hasCorporateVideoTag(project.tags)
  );

  return (
    <div className="container py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-3">Videos</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8 md:mb-12 max-w-2xl">
        Corporate video projects and event motion highlights.
      </p>

      {videoProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={index < 6}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-neutral-600 dark:text-neutral-400 py-12">
          No video projects yet.
        </p>
      )}
    </div>
  );
}
