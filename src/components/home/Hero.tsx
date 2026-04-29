import { useEffect, useMemo, useRef, useState } from 'react';
import { useSiteSettings } from '@/hooks';
import { Image, Loader } from '@/components/ui';
import type { HeroMediaItem } from '@/types';

const IMAGE_SLIDE_DURATION_MS = 5500;
const VIDEO_FALLBACK_DURATION_MS = 15000;

function normalizeHeroMedia(items?: HeroMediaItem[], fallback?: HeroMediaItem) {
  const media = Array.isArray(items) ? items : [];
  if (media.length > 0) return media;
  if (!fallback) return [];
  return [fallback];
}

export default function Hero() {
  const { data: settings, isLoading } = useSiteSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const fallbackHeroMedia = useMemo(() => {
    if (!settings?.heroImage) return undefined;
    return {
      ...settings.heroImage,
      contentType: 'image/jpeg',
      kind: 'image' as const,
    };
  }, [settings?.heroImage]);

  const slides = useMemo(
    () => normalizeHeroMedia(settings?.heroMedia, fallbackHeroMedia),
    [settings?.heroMedia, fallbackHeroMedia]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const currentSlide = slides[activeIndex];
    const timeoutMs =
      currentSlide?.kind === 'video'
        ? VIDEO_FALLBACK_DURATION_MS
        : IMAGE_SLIDE_DURATION_MS;

    const timeout = window.setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, timeoutMs);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, slides]);

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative h-[80vh] min-h-[500px] w-full overflow-hidden">
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={`${slide.url}-${index}`}
            className={`absolute inset-0 transition-opacity duration-700 ${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            {slide.kind === 'video' ? (
              <video
                ref={isActive ? videoRef : null}
                className="w-full h-full object-cover"
                src={slide.url}
                autoPlay={isActive}
                muted
                playsInline
                onEnded={() => {
                  if (isActive && slides.length > 1) {
                    setActiveIndex((prev) => (prev + 1) % slides.length);
                  }
                }}
              />
            ) : (
              <Image
                image={slide}
                alt="Hero media"
                priority={index === 0}
                className="w-full h-full"
              />
            )}
          </div>
        );
      })}
    </section>
  );
}
