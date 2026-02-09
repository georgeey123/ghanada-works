import { useState, useCallback, useEffect } from 'react';
import { Image, Button, Loader } from '@/components/ui';
import { useAppStore } from '@/store';
import { cn, prefersReducedMotion } from '@/lib/utils';
import type { ContentfulImage } from '@/types';

interface MasonryGridProps {
  images: ContentfulImage[];
  batchSize?: number;
}

export default function MasonryGrid({
  images,
  batchSize = 12,
}: MasonryGridProps) {
  const [displayCount, setDisplayCount] = useState(batchSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { openLightbox } = useAppStore();

  const displayedImages = images.slice(0, displayCount);
  const hasMore = displayCount < images.length;
  const reducedMotion = prefersReducedMotion();

  const loadMore = useCallback(() => {
    setIsLoadingMore(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + batchSize, images.length));
      setIsLoadingMore(false);
    }, 300);
  }, [batchSize, images.length]);

  // Infinite scroll observer
  useEffect(() => {
    if (reducedMotion || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    const sentinel = document.getElementById('load-more-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore, reducedMotion]);

  const handleImageClick = (index: number) => {
    openLightbox(images, index);
  };

  return (
    <div className="space-y-8">
      {/* Masonry grid using CSS columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {displayedImages.map((image, index) => (
          <button
            key={`${image.url}-${index}`}
            type="button"
            onClick={() => handleImageClick(index)}
            className={cn(
              'w-full break-inside-avoid overflow-hidden rounded-lg',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100',
              'transition-transform hover:scale-[1.02]'
            )}
          >
            <Image
              image={image}
              alt={image.title || `Gallery image ${index + 1}`}
              width={600}
              className="w-full"
            />
          </button>
        ))}
      </div>

      {/* Load more section */}
      {hasMore && (
        <div className="flex flex-col items-center gap-4 py-8">
          {/* Sentinel for infinite scroll */}
          {!reducedMotion && <div id="load-more-sentinel" className="h-1" />}

          {/* Loading indicator */}
          {isLoadingMore && <Loader text="Loading more images..." />}

          {/* Load more button (always visible for accessibility) */}
          {!isLoadingMore && (
            <Button
              variant="secondary"
              onClick={loadMore}
              className={cn(!reducedMotion && 'opacity-50')}
            >
              Load More ({images.length - displayCount} remaining)
            </Button>
          )}
        </div>
      )}

      {/* Image count */}
      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        Showing {displayedImages.length} of {images.length} images
      </p>
    </div>
  );
}
