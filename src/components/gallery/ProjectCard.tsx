import { Link } from 'react-router-dom';
import { Image } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export default function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const thumbnail = project.images[0];

  return (
    <Link
      to={`/${project.slug}`}
      className={cn(
        'group block',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 rounded-lg'
      )}
    >
      {/* Project thumbnail */}
      <div className="aspect-[4/3] overflow-hidden rounded-lg">
        {thumbnail ? (
          <Image
            image={thumbnail}
            alt={project.title}
            width={600}
            height={450}
            priority={priority}
            className="w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800" />
        )}
      </div>

      {/* Project title */}
      <h3 className="mt-3 font-medium group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
        {project.title}
      </h3>
    </Link>
  );
}
