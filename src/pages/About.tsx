import { useSiteSettings } from '@/hooks';
import { Image, Loader } from '@/components/ui';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Document } from '@contentful/rich-text-types';

export default function About() {
  const { data: settings, isLoading } = useSiteSettings();

  const renderRichContent = (content?: Document | string) => {
    if (!content) return null;
    if (typeof content === 'string') {
      return content
        .split('\n')
        .filter((line) => line.trim().length > 0)
        .map((line) => <p key={line}>{line}</p>);
    }
    return documentToReactComponents(content);
  };

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
          {settings?.bio ? (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {renderRichContent(settings.bio)}
            </div>
          ) : (
            <p className="text-neutral-600 dark:text-neutral-400">
              Bio content is unavailable right now.
            </p>
          )}
        </div>
      </div>

      {/* Process Section */}
      {settings?.processContent && (
        <section className="mt-16 md:mt-24">
          <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
            {renderRichContent(settings.processContent)}
          </div>
        </section>
      )}
    </div>
  );
}
