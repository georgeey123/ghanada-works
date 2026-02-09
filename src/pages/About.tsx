import { useSiteSettings } from '@/hooks';
import { Image, Loader } from '@/components/ui';

export default function About() {
  const { data: settings, isLoading } = useSiteSettings();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="container py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-12">About</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Photographer Photo */}
        {settings?.photographerPhoto && (
          <div className="lg:order-2">
            <Image
              image={settings.photographerPhoto}
              alt="Photographer"
              className="rounded-lg w-full max-w-md mx-auto lg:max-w-none"
            />
          </div>
        )}

        {/* Bio */}
        <div className="lg:order-1">
          {settings?.bio && (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {settings.bio.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Process Section */}
      {settings?.processContent && (
        <section className="mt-16 md:mt-24">
          <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
            {settings.processContent.split('\n').map((line, index) => {
              // Handle markdown-style headers
              if (line.startsWith('## ')) {
                return (
                  <h2
                    key={index}
                    className="text-3xl font-bold mt-12 mb-6 first:mt-0"
                  >
                    {line.replace('## ', '')}
                  </h2>
                );
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <h3 key={index} className="text-xl font-semibold mt-8 mb-3">
                    {line.replace(/\*\*/g, '')}
                  </h3>
                );
              }
              if (line.trim() === '') {
                return null;
              }
              return (
                <p key={index} className="mb-4 text-neutral-600 dark:text-neutral-400">
                  {line}
                </p>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
