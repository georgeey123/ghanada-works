import { useState, useCallback } from 'react';
import { cn, getContentfulImageUrl } from '@/lib/utils';
import type { ContentfulImage } from '@/types';

interface ImageProps {
  image: ContentfulImage;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
}

export default function Image({
  image,
  alt,
  width,
  height,
  className,
  priority = false,
  onClick,
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
  }, []);

  // Prevent right-click for image protection
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
    },
    []
  );

  const imageUrl = getContentfulImageUrl(image.url, {
    width: width || image.width,
    height: height || image.height,
    format: 'jpg',
    quality: 85,
  });

  const altText = alt || image.title || 'Gallery image';

  if (error) {
    return (
      <div
        className={cn(
          'bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center',
          className
        )}
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
      >
        <span className="text-neutral-400 dark:text-neutral-600 text-sm">
          Image unavailable
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
    >
      {/* Placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      )}

      {/* Image */}
      <img
        src={imageUrl}
        alt={altText}
        width={width || image.width}
        height={height || image.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleLoad}
        onError={handleError}
        onContextMenu={handleContextMenu}
        onClick={onClick}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300 no-context-menu',
          loaded ? 'opacity-100' : 'opacity-0',
          onClick && 'cursor-pointer'
        )}
        draggable={false}
      />
    </div>
  );
}
