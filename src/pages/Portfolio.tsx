import { useCategories, useProjects } from '@/hooks';
import { CategoryCard } from '@/components/gallery';
import { Loader } from '@/components/ui';

export default function Portfolio() {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: projects } = useProjects();

  if (categoriesLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading gallery..." />
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="container py-16">
        <p className="text-center text-neutral-600 dark:text-neutral-400">
          No categories found.
        </p>
      </div>
    );
  }

  // Get cover image for each category (first image from most recent project)
  const getCoverImage = (categorySlug: string) => {
    const categoryProjects = projects?.filter(
      (p) => p.category.slug === categorySlug
    );
    if (!categoryProjects || categoryProjects.length === 0) return undefined;

    // Sort by date and get first image from most recent project
    const sortedProjects = [...categoryProjects].sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
    return sortedProjects[0]?.images[0];
  };

  return (
    <div className="container py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 md:mb-12">Gallery</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              coverImage={getCoverImage(category.slug)}
            />
          ))}
      </div>
    </div>
  );
}
