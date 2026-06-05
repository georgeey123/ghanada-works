import { useProjects } from '@/hooks';
import { ProjectCard } from '@/components/gallery';
import { Loader } from '@/components/ui';

function hasCorporateLivestreamTag(tags?: string[]) {
  if (!tags || tags.length === 0) return false;
  return tags.some(
    (tag) => tag.trim().toLowerCase() === 'corporate-livestream'
  );
}

export default function Livestream() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading livestream projects..." />
      </div>
    );
  }

  const livestreamProjects = (projects ?? []).filter((project) =>
    hasCorporateLivestreamTag(project.tags)
  );

  return (
    <div className="container py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-3">Livestream</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8 md:mb-12 max-w-2xl">
        Livestream coverage and real-time broadcast productions for corporate
        events.
      </p>

      {livestreamProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {livestreamProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} priority={index < 6} />
          ))}
        </div>
      ) : (
        <p className="text-center text-neutral-600 dark:text-neutral-400 py-12">
          No livestream projects yet.
        </p>
      )}
    </div>
  );
}
