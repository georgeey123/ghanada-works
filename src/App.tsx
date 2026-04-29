import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import {
  Home,
  Portfolio,
  Category,
  Project,
  About,
  Contact,
  Conferences,
  Videos,
  CorporateGallery,
  Livestream,
  NotFound,
} from '@/pages';
import Layout from '@/components/layout/Layout';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Portfolio />} />
            <Route path="/gallery/:category" element={<Category />} />
            <Route path="/event-media" element={<Portfolio />} />
            <Route path="/event-media/:category" element={<Category />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/conferences" element={<Conferences />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/corporate-gallery" element={<CorporateGallery />} />
            <Route path="/livestream" element={<Livestream />} />
            <Route path="/:slug" element={<Project />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
