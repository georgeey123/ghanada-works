import { useProjects } from '@/hooks';
import { ProjectCard } from '@/components/gallery';
import { Loader } from '@/components/ui';

function hasCorporateTag(tags?: string[]) {
  if (!tags || tags.length === 0) return false;
  return tags.some((tag) => tag.trim().toLowerCase().startsWith('corporate-'));
}

export default function CorporateGallery() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading corporate gallery..." />
      </div>
    );
  }

  const corporateProjects = (projects ?? []).filter((project) =>
    hasCorporateTag(project.tags)
  );

  return (
    <div className="container py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-3">Corporate Gallery</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8 md:mb-12 max-w-2xl">
        A combined view of all corporate-tagged conference and video projects.
      </p>

      {corporateProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {corporateProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={index < 6}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-neutral-600 dark:text-neutral-400 py-12">
          No corporate projects yet.
        </p>
      )}
    </div>
  );
}
