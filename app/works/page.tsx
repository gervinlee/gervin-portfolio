'use client';

import { Play } from 'lucide-react';
import { useState } from 'react';
import ImageModal from '@/components/image-modal';

export default function Works() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Image modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState('');

  // Video modal
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  
  const openImageModal = (images: string[], title: string) => {
    setModalImages(images);
    setModalTitle(title);
    setModalOpen(true);
  };

  const openVideoModal = (video: string, title: string) => {
    setActiveVideo(video);
    setVideoTitle(title);
    setVideoOpen(true);
  };

  const academicWorks = [
    {
      title: 'Vision Board',
      description: 'A vision board design aimed at helping people visualize their goals effectively. The color scheme promotes clarity and focus.',
      details: 'Academic Design Project | 2024',
      image: '/assets/visionboard.png',
    },
    {
      title: 'Ecosia Flyer',
      description: 'A promotional flyer for Ecosia, highlighting the mission to plant trees. Emphasizes sustainability and environmental awareness.',
      details: 'Academic Design Project | 2024',
      image: '/assets/ecosiaflyer.png',
    },
    {
      title: 'About Me Poster',
      description: 'An engaging poster that introduces the creator, discussing skills, interests, and background in a visually appealing format.',
      details: 'Academic Design Project | 2024',
      image: '/assets/aboutmeposter.png',
    },
  ];

  const multimediaWorks = [
    {
      title: 'Artist Profile',
      description:
        "A profile piece showcasing the artist's work, style, and influences. Reflects the artist's unique aesthetic and personality.",
      details: 'Multimedia Project | 2024',
      image: '/assets/artistprofile.jpg',
    },
    {
      title: 'Book Cover Design',
      description:
        "A captivating book cover design where design elements and typography are carefully crafted to reflect the book's theme.",
      details: 'Multimedia Design | 2024',
      image: '/assets/ENERO_BOOKCOVER.png',
    },
    {
      title: 'Brandboard',
      description:
        'A comprehensive brand identity document including logos, color palettes, and typography guidelines for a business.',
      details: 'Branding Project | 2024',
      image: '/assets/brandboard2.png',
    },
  ];

  const networkingWorks = [
    {
      title: 'Subnetting',
      description: 'Network subnetting techniques and implementations.',
      videoLength: '2:39',
      date: 'February 09, 2025',
      thumbnail: '/assets/subnetting.png',
      video: '/assets/subnetting.mp4',
    },
    {
      title: 'DHCP & Static Routing',
      description: 'Configuration of DHCP servers and static routing.',
      videoLength: '5:17',
      date: 'February 09, 2025',
      thumbnail: '/assets/dhcpstatic.png',
      video: '/assets/dhcpstatic.mp4',
    },
    {
      title: 'EIGRP',
      description: 'EIGRP implementation across multiple devices.',
      videoLength: '2:25',
      date: 'February 09, 2025',
      thumbnail: '/assets/eigrp.png',
      video: '/assets/eigrp.mp4',
    },
    {
      title: 'RIP',
      description: 'Routing Information Protocol setup and analysis.',
      videoLength: '2:38',
      date: 'February 09, 2025',
      thumbnail: '/assets/rip.png',
      video: '/assets/rip.mp4',
    },
  ];

  const allWorks = [
    ...academicWorks.map((w) => ({ ...w, category: 'academic', type: 'card' })),
    ...multimediaWorks.map((w) => ({ ...w, category: 'multimedia', type: 'card' })),
    ...networkingWorks.map((w) => ({ ...w, category: 'networking', type: 'video' })),
  ];

  const filteredWorks =
    selectedCategory === 'all' ? allWorks : allWorks.filter((w) => w.category === selectedCategory);

  return (
    <main className="min-h-screen pt-16 bg-background relative mesh-bg">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none circuit-bg opacity-30"></div>
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 gradient-text">My Works</h1>
        <p className="text-lg text-foreground/70 max-w-3xl">
          A collection of my academic designs, multimedia projects, and networking demonstrations. These works showcase my skills across design, multimedia production, and networking technology.
        </p>
      </section>

      {/* Filter Buttons */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-3">
          {[
            { value: 'all', label: 'All' },
            { value: 'academic', label: 'Academic Works' },
            { value: 'multimedia', label: 'Multimedia' },
            { value: 'networking', label: 'Networking Labs' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedCategory(filter.value)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === filter.value
                  ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                  : 'border border-border text-foreground hover:border-primary'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {/* Academic Works */}
      {filteredWorks.some((w) => w.category === 'academic') && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-primary">Academic Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredWorks
              .filter((w) => w.category === 'academic')
              .map((work, idx) => (
                <div
                  key={idx}
                  onClick={() => openImageModal([work.image as string], work.title)}
                  className="rounded-lg border border-border bg-card overflow-hidden hover:border-primary hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg overflow-hidden flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                    <img
                      src={work.image as string || "/placeholder.svg"}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{work.title}</h3>
                    <p className="text-foreground/70 mb-4">{work.description}</p>
                    <p className="text-sm text-foreground/50">{work.details}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Multimedia Works */}
      {filteredWorks.some((w) => w.category === 'multimedia') && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-primary">
            Multimedia Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredWorks
              .filter((w) => w.category === 'multimedia')
              .map((work, idx) => (
                <div
                  key={idx}
                  onClick={() => openImageModal([work.image as string], work.title)}
                  className="rounded-lg border border-border bg-card overflow-hidden hover:border-primary hover:shadow-lg transition-all group cursor-pointer"
                >
                  {/* Image */}
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={work.image as string}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {work.title}
                    </h3>
                    <p className="text-foreground/70 mb-4">
                      {work.description}
                    </p>
                    <p className="text-sm text-foreground/50">
                      {work.details}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Networking */}
      {filteredWorks.some((w) => w.category === 'networking') && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-primary">
            Networking Labs & Demonstrations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredWorks
              .filter((w) => w.category === 'networking')
              .map((work, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg"
                >
                  {/* Thumbnail */}
                  <div
                    className="relative h-64 cursor-pointer"
                    onClick={() => openVideoModal(work.video, work.title)}
                  >
                    <img
                      src={work.thumbnail}
                      alt={work.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="p-4 rounded-full bg-accent">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </span>
                    </div>

                    <span className="absolute bottom-3 right-3 bg-black/70 px-3 py-1 text-white text-sm rounded">
                      {work.videoLength}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{work.title}</h3>
                    <p className="text-foreground/70 mb-4">{work.description}</p>

                    <div className="flex justify-between items-center">
                      <p className="text-sm text-foreground/50">{work.date}</p>
                      <button
                        onClick={() => openVideoModal(work.video, work.title)}
                        className="px-4 py-2 border border-primary text-primary rounded-lg"
                      >
                        Watch
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-20 py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-sm text-foreground/60">
          <p>&copy; 2026 Gervin Lee Enero. All rights reserved.</p>
        </div>
      </footer>

      {/* Video Modal */}
      {videoOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-card rounded-lg max-w-4xl w-full overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold">{videoTitle}</h3>
              <button onClick={() => setVideoOpen(false)}>✕</button>
            </div>
            <video src={activeVideo} controls autoPlay className="w-full max-h-[70vh]" />
          </div>
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        images={modalImages}
        title={modalTitle}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}
