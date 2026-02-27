import { useState, useCallback, useEffect, useMemo } from 'react';
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
  const [sourceUrl, setSourceUrl] = useState('');
  const [triedFallback, setTriedFallback] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const normalizedUrl = useMemo(() => {
    if (!image?.url) return '';
    return image.url.startsWith('//') ? `https:${image.url}` : image.url;
  }, [image?.url]);

  // Prevent right-click for image protection
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const imageWidth = width || image.width || 800;
  const imageHeight = height || image.height || 600;

  const imageUrl = useMemo(
    () =>
      getContentfulImageUrl(normalizedUrl, {
        width: imageWidth,
        height: imageHeight,
        format: 'jpg',
        quality: 85,
      }),
    [normalizedUrl, imageWidth, imageHeight]
  );

  useEffect(() => {
    setLoaded(false);
    setError(false);
    setTriedFallback(false);
    setSourceUrl(imageUrl);
  }, [imageUrl]);

  const handleError = useCallback(() => {
    if (!triedFallback && normalizedUrl && sourceUrl !== normalizedUrl) {
      setTriedFallback(true);
      setSourceUrl(normalizedUrl);
      return;
    }
    setError(true);
  }, [normalizedUrl, sourceUrl, triedFallback]);

  const altText = alt || image.title || 'Gallery image';

  if (error) {
    return (
      <div
        className={cn(
          'bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center',
          className
        )}
        style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}
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
      style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}
    >
      {/* Placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      )}

      {/* Image */}
      <img
        src={sourceUrl}
        alt={altText}
        width={imageWidth}
        height={imageHeight}
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
