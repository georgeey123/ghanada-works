import { Link } from 'react-router-dom';
import { Image } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Category, ContentfulImage } from '@/types';

interface CategoryCardProps {
  category: Category;
  coverImage?: ContentfulImage;
}

export default function CategoryCard({
  category,
  coverImage,
}: CategoryCardProps) {
  const image = category.heroImage || coverImage;

  return (
    <Link
      to={`/gallery/${category.slug}`}
      className={cn(
        'group relative overflow-hidden rounded-lg',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100'
      )}
    >
      {/* Category image */}
      <div className="aspect-[4/3] overflow-hidden">
        {image ? (
          <Image
            image={image}
            alt={category.name}
            width={800}
            height={600}
            className="w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800" />
        )}
      </div>

      {/* Overlay with category name */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
        <div className="p-6 w-full">
          <h3 className="text-white font-semibold text-xl md:text-2xl">
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
