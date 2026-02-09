import YARLightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { useAppStore } from '@/store';
import { getContentfulImageUrl } from '@/lib/utils';

export default function Lightbox() {
  const { lightboxOpen, lightboxImages, lightboxIndex, closeLightbox, setLightboxIndex } =
    useAppStore();

  const slides = lightboxImages.map((image) => ({
    src: getContentfulImageUrl(image.url, { width: 1920, quality: 90 }),
    width: image.width,
    height: image.height,
  }));

  return (
    <YARLightbox
      open={lightboxOpen}
      close={closeLightbox}
      slides={slides}
      index={lightboxIndex}
      on={{
        view: ({ index }) => setLightboxIndex(index),
      }}
      plugins={[Thumbnails]}
      thumbnails={{
        position: 'bottom',
        width: 80,
        height: 60,
        border: 0,
        borderRadius: 4,
        padding: 0,
        gap: 8,
        imageFit: 'cover',
      }}
      carousel={{
        finite: false,
        preload: 2,
      }}
      animation={{
        fade: 200,
        swipe: 300,
      }}
      controller={{
        closeOnBackdropClick: true,
        closeOnPullDown: true,
      }}
      styles={{
        container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
      }}
      render={{
        // Hide captions - image only per spec
        slideHeader: () => null,
        slideFooter: () => null,
      }}
    />
  );
}
