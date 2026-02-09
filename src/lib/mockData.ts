import type {
  Category,
  Project,
  SiteSettings,
  ContentfulImage,
} from '@/types';

// Helper to generate picsum image URLs
function generateImage(
  id: number,
  width = 1200,
  height = 800
): ContentfulImage {
  return {
    url: `https://picsum.photos/id/${id}/${width}/${height}`,
    title: `Image ${id}`,
    width,
    height,
  };
}

// Generate a set of images for a project
function generateProjectImages(
  startId: number,
  count: number,
  isPortrait = false
): ContentfulImage[] {
  return Array.from({ length: count }, (_, i) => {
    const id = startId + i;
    // Mix of landscape and portrait for variety, or all portrait for headshots
    if (isPortrait) {
      return generateImage(id, 800, 1200);
    }
    // Alternate between landscape and portrait for variety
    return i % 3 === 0
      ? generateImage(id, 800, 1200) // portrait
      : generateImage(id, 1200, 800); // landscape
  });
}

// Categories
export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Weddings',
    slug: 'weddings',
    description:
      'Capturing the magic of your special day with authentic, heartfelt imagery that tells your unique love story.',
    heroImage: generateImage(1015, 1920, 1080),
    sortOrder: 1,
  },
  {
    id: 'cat-2',
    name: 'Glamour',
    slug: 'glamour',
    description:
      'Elegant and sophisticated portraits that showcase your beauty and confidence.',
    heroImage: generateImage(1027, 1920, 1080),
    sortOrder: 2,
  },
  {
    id: 'cat-3',
    name: 'Family',
    slug: 'family',
    description:
      'Preserving precious family moments and connections that will be treasured for generations.',
    heroImage: generateImage(1025, 1920, 1080),
    sortOrder: 3,
  },
  {
    id: 'cat-4',
    name: 'Portrait',
    slug: 'portrait',
    description:
      'Personal portraits that capture your essence and tell your individual story.',
    heroImage: generateImage(1005, 1920, 1080),
    sortOrder: 4,
  },
  {
    id: 'cat-5',
    name: 'Headshots',
    slug: 'headshots',
    description:
      'Professional headshots for business, acting, and personal branding.',
    heroImage: generateImage(1074, 1920, 1080),
    sortOrder: 5,
  },
  {
    id: 'cat-6',
    name: 'Lifestyle',
    slug: 'lifestyle',
    description:
      'Natural, candid photography that captures the beauty of everyday moments.',
    heroImage: generateImage(1011, 1920, 1080),
    sortOrder: 6,
  },
];

// Projects
export const mockProjects: Project[] = [
  // Weddings
  {
    id: 'proj-1',
    title: 'Sarah & James',
    slug: 'sarah-james-wedding',
    category: mockCategories[0],
    images: generateProjectImages(100, 45),
    featured: true,
    publishedDate: '2024-10-15',
    description: 'An intimate garden ceremony filled with love and laughter.',
    location: 'Botanical Gardens',
  },
  {
    id: 'proj-2',
    title: 'Emma & Michael',
    slug: 'emma-michael-wedding',
    category: mockCategories[0],
    images: generateProjectImages(150, 52),
    featured: false,
    publishedDate: '2024-09-22',
    description: 'A stunning beachside celebration at sunset.',
    location: 'Malibu Beach',
  },
  {
    id: 'proj-3',
    title: 'Olivia & Daniel',
    slug: 'olivia-daniel-wedding',
    category: mockCategories[0],
    images: generateProjectImages(200, 38),
    featured: false,
    publishedDate: '2024-08-10',
    description: 'Classic elegance meets modern romance.',
    location: 'Grand Estate',
  },

  // Glamour
  {
    id: 'proj-4',
    title: 'Elegance Collection',
    slug: 'elegance-collection',
    category: mockCategories[1],
    images: generateProjectImages(250, 24, true),
    featured: true,
    publishedDate: '2024-11-01',
    description: 'A series celebrating timeless beauty and grace.',
  },
  {
    id: 'proj-5',
    title: 'Golden Hour',
    slug: 'golden-hour-glamour',
    category: mockCategories[1],
    images: generateProjectImages(280, 18, true),
    featured: false,
    publishedDate: '2024-10-05',
    description: 'Capturing natural light at its most magical.',
  },

  // Family
  {
    id: 'proj-6',
    title: 'The Johnson Family',
    slug: 'johnson-family',
    category: mockCategories[2],
    images: generateProjectImages(300, 28),
    featured: true,
    publishedDate: '2024-11-10',
    description: 'Three generations coming together for a special portrait session.',
    location: 'City Park',
  },
  {
    id: 'proj-7',
    title: 'Summer with the Petersons',
    slug: 'peterson-summer',
    category: mockCategories[2],
    images: generateProjectImages(330, 35),
    featured: false,
    publishedDate: '2024-07-15',
    description: 'A fun-filled summer session by the lake.',
    location: 'Lake House',
  },
  {
    id: 'proj-8',
    title: 'Williams Family Reunion',
    slug: 'williams-reunion',
    category: mockCategories[2],
    images: generateProjectImages(370, 42),
    featured: false,
    publishedDate: '2024-06-20',
    description: 'Capturing the joy of family coming together.',
  },

  // Portrait
  {
    id: 'proj-9',
    title: 'Creative Expressions',
    slug: 'creative-expressions',
    category: mockCategories[3],
    images: generateProjectImages(420, 20, true),
    featured: true,
    publishedDate: '2024-11-05',
    description: 'Artistic portraits exploring light and shadow.',
  },
  {
    id: 'proj-10',
    title: 'Natural Beauty',
    slug: 'natural-beauty-portraits',
    category: mockCategories[3],
    images: generateProjectImages(450, 16, true),
    featured: false,
    publishedDate: '2024-09-18',
    description: 'Celebrating authentic, unfiltered beauty.',
  },

  // Headshots
  {
    id: 'proj-11',
    title: 'Executive Portraits',
    slug: 'executive-portraits',
    category: mockCategories[4],
    images: generateProjectImages(480, 15, true),
    featured: true,
    publishedDate: '2024-10-28',
    description: 'Professional headshots for corporate leaders.',
  },
  {
    id: 'proj-12',
    title: 'Actor Headshots',
    slug: 'actor-headshots',
    category: mockCategories[4],
    images: generateProjectImages(500, 22, true),
    featured: false,
    publishedDate: '2024-09-10',
    description: 'Versatile headshots for casting directors.',
  },

  // Lifestyle
  {
    id: 'proj-13',
    title: 'Morning Coffee',
    slug: 'morning-coffee',
    category: mockCategories[5],
    images: generateProjectImages(530, 18),
    featured: true,
    publishedDate: '2024-11-12',
    description: 'Cozy moments at a local café.',
  },
  {
    id: 'proj-14',
    title: 'Urban Adventures',
    slug: 'urban-adventures',
    category: mockCategories[5],
    images: generateProjectImages(550, 25),
    featured: false,
    publishedDate: '2024-10-01',
    description: 'Exploring the city through a candid lens.',
    location: 'Downtown',
  },
  {
    id: 'proj-15',
    title: 'Weekend Wanderings',
    slug: 'weekend-wanderings',
    category: mockCategories[5],
    images: generateProjectImages(580, 30),
    featured: false,
    publishedDate: '2024-08-25',
    description: 'Capturing the joy of spontaneous moments.',
  },
];

// Site Settings
export const mockSiteSettings: SiteSettings = {
  heroImage: generateImage(1018, 1920, 1080),
  heroTitle: 'Authentic Moments',
  heroSubtitle: 'Captured with Heart',
  recentWorkCount: 6,
  photographerPhoto: generateImage(1012, 800, 1000),
  bio: `I'm a passionate photographer based in the heart of the city, dedicated to capturing life's most precious moments with authenticity and heart.

With over a decade of experience, I've had the privilege of documenting countless love stories, family milestones, and personal journeys. My approach is simple: create a comfortable, relaxed environment where genuine emotions can shine through.

Every photograph tells a story, and I'm honored to help tell yours.`,
  processContent: `## My Process

**1. Consultation**
We start with a conversation about your vision, preferences, and the story you want to tell. This helps me understand your unique needs and style.

**2. The Session**
On the day of your shoot, I create a relaxed atmosphere where you can be yourself. I guide you through poses while capturing authentic moments in between.

**3. Curation & Editing**
I carefully select and edit the best images from our session, enhancing them while maintaining a natural, timeless feel.

**4. Delivery**
Your final images are delivered through a private online gallery, ready for you to download, share, and print.`,
  email: 'hello@ghanadaworks.com',
  phone: '+1 (555) 123-4567',
  location: 'Los Angeles, California',
  socialLinks: [
    { platform: 'Instagram', url: 'https://instagram.com/ghanadaworks' },
    { platform: 'Facebook', url: 'https://facebook.com/ghanadaworks' },
    { platform: 'Pinterest', url: 'https://pinterest.com/ghanadaworks' },
  ],
};

// Helper functions to simulate async data fetching
export async function getMockCategories(): Promise<Category[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockCategories;
}

export async function getMockCategory(slug: string): Promise<Category | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockCategories.find((c) => c.slug === slug) || null;
}

export async function getMockProjects(categorySlug?: string): Promise<Project[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (categorySlug) {
    return mockProjects.filter((p) => p.category.slug === categorySlug);
  }
  return mockProjects;
}

export async function getMockProject(slug: string): Promise<Project | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProjects.find((p) => p.slug === slug) || null;
}

export async function getMockSiteSettings(): Promise<SiteSettings> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockSiteSettings;
}

export async function getMockRecentWork(count: number): Promise<Project[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [...mockProjects]
    .sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    )
    .slice(0, count);
}
