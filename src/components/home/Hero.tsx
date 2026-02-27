import { useSiteSettings } from '@/hooks';
import { Image, Loader } from '@/components/ui';

export default function Hero() {
  const { data: settings, isLoading } = useSiteSettings();

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!settings?.heroImage) {
    return null;
  }

  const hasCopy = Boolean(settings?.heroTitle || settings?.heroSubtitle);

  return (
    <section className="relative h-[80vh] min-h-[500px] w-full overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <Image
          image={settings.heroImage}
          alt="Hero image"
          priority
          className="w-full h-full"
        />
        {hasCopy && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        )}
      </div>

      {/* Hero Content */}
      {hasCopy && (
        <div className="relative h-full flex items-end">
          <div className="container pb-16 md:pb-24">
            {settings.heroTitle && (
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                {settings.heroTitle}
              </h1>
            )}
            {settings.heroSubtitle && (
              <p className="text-xl md:text-2xl text-white/90 max-w-xl">
                {settings.heroSubtitle}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
