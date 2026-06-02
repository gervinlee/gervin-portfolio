'use client';

import { ExternalLink, Github, ArrowLeft, ArrowRight, Camera, FileText } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import ImageModal, { WorkItem, Collaborator } from '@/components/image-modal';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';

// ─── Circuit Canvas Animation ─────────────────────────────────────────────────
const GRID = 40;
const NODE_PROB = 0.38;
const BRANCH_PROB = 0.55;
const PULSE_SPEED = 0.012;

type Segment = {
  x1: number; y1: number;
  mx: number | null; my: number | null;
  x2: number; y2: number;
  phase: number; offset: number;
};

type Node = { x: number; y: number };

function buildCircuit(width: number, height: number): { nodes: Node[]; segments: Segment[] } {
  const cols = Math.ceil(width / GRID) + 2;
  const rows = Math.ceil(height / GRID) + 2;
  const nodes: Node[] = [];
  const segments: Segment[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (Math.random() < NODE_PROB) nodes.push({ x: col * GRID, y: row * GRID });
    }
  }

  const dirs = [
    { dx: GRID, dy: 0 }, { dx: -GRID, dy: 0 },
    { dx: 0, dy: GRID }, { dx: 0, dy: -GRID },
  ];

  nodes.forEach(n => {
    dirs.forEach(d => {
      if (Math.random() < BRANCH_PROB) {
        const ex = n.x + d.dx;
        const ey = n.y + d.dy;
        const hasCorner = Math.random() < 0.4;
        if (hasCorner) {
          const midX = Math.random() < 0.5 ? ex : n.x;
          const midY = midX === ex ? n.y : ey;
          segments.push({ x1: n.x, y1: n.y, mx: midX, my: midY, x2: ex, y2: ey, phase: Math.random() * Math.PI * 2, offset: 0 });
        } else {
          segments.push({ x1: n.x, y1: n.y, mx: null, my: null, x2: ex, y2: ey, phase: Math.random() * Math.PI * 2, offset: 0 });
        }
      }
    });
  });

  return { nodes, segments };
}

function CircuitCanvas({ color }: { color: [number, number, number] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const dataRef = useRef<{ nodes: Node[]; segments: Segment[] } | null>(null);
  const [r, g, b] = color;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      dataRef.current = buildCircuit(canvas.width, canvas.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx || !dataRef.current) return;
      const { nodes, segments } = dataRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      segments.forEach(s => {
        s.offset = (s.offset + PULSE_SPEED) % 1;
        const alpha = 0.15 + 0.12 * Math.sin(s.offset * Math.PI * 2 + s.phase);
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(s.x1, s.y1);
        if (s.mx !== null) { ctx.lineTo(s.mx, s.my!); ctx.lineTo(s.x2, s.y2); }
        else ctx.lineTo(s.x2, s.y2);
        ctx.stroke();

        const pulseAlpha = 0.7 * Math.max(0, Math.sin(s.offset * Math.PI * 2 + s.phase));
        if (pulseAlpha > 0.05) {
          const t = s.offset;
          let px: number, py: number;
          if (s.mx !== null) {
            if (t < 0.5) { const tt = t * 2; px = s.x1 + (s.mx - s.x1) * tt; py = s.y1 + (s.my! - s.y1) * tt; }
            else { const tt = (t - 0.5) * 2; px = s.mx + (s.x2 - s.mx) * tt; py = s.my! + (s.y2 - s.my!) * tt; }
          } else { px = s.x1 + (s.x2 - s.x1) * t; py = s.y1 + (s.y2 - s.y1) * t; }
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${pulseAlpha})`;
          ctx.fill();
        }
      });

      nodes.forEach(n => {
        const pulse = 0.35 + 0.3 * Math.sin(Date.now() * 0.002 + n.x * 0.1 + n.y * 0.1);
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${pulse})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animRef.current); ro.disconnect(); };
  }, [r, g, b]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}

// ─── Three.js Background ─────────────────────────────────────────────────────
function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-20 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1.8], fov: 55 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.15} />
        <pointLight position={[15, 10, 10]} intensity={0.8} color="#f59e0b" />
        <pointLight position={[-12, -8, -15]} intensity={0.5} color="#fb923c" />
        <Stars radius={300} depth={70} count={7200} factor={4} saturation={0.6} fade speed={0.5} />
        <group>
          {Array.from({ length: 28 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 160,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 90 - 30
              ]}
            >
              <sphereGeometry args={[1.8 + Math.random() * 2.8]} />
              <meshBasicMaterial
                color={i % 4 === 0 ? "#f59e0b" : i % 4 === 1 ? "#fb923c" : "#fed7aa"}
                transparent
                opacity={0.05 + Math.random() * 0.08}
              />
            </mesh>
          ))}
        </group>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.08} />
      </Canvas>
    </div>
  );
}

// ─── Projects Data ───────────────────────────────────────────────────────────
type Project = {
  title: string;
  category: string;
  description: string;
  tech: string[];
  features: string[];
  image: string;
  images: string[];
  link: string | null;
  github: string | null;
  bgColor: string;
  circuitColor: [number, number, number];
  featured?: boolean;
};

const projects: Project[] = [
  {
    title: 'ResearchConnect+',
    category: 'Web Development',
    description: "A research management platform built for PLV's IT department — covering ERC compliance, topic proposals, repository access, and mentorship coordination.",
    tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    features: ['ERC Compliance System', 'Topic Proposal', 'Repository', 'Mentorship Coordination'],
    image: '/assets/researchconnect-login.png',
    images: ['/assets/researchconnect-login.png', '/assets/researchconnect-2.png'],
    link: 'https://erc-system.vercel.app/',
    github: null,
    bgColor: '#2a1f14',
    circuitColor: [249, 115, 22],
    featured: true,
  },
  {
    title: 'Inventory Management System',
    category: 'Web Development',
    description: 'An inventory management system developed for tracking products, monitoring stock levels, managing branches and flavors, and keeping records of expiration dates to improve inventory control and business operations.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Java'],
    features: ['Product inventory management', 'Branch and flavor tracking', 'Stock level monitoring','Expiration date management'],
    image: '/assets/elegantea-cover.png',
    images: ['/assets/elegantea-login.png', '/assets/elegantea-main.png'],
    link: null,
    github: null,
    bgColor: '#1a1f14',
    circuitColor: [234, 88, 12],
  },
  {
    title: 'SatisTrack',
    category: 'Full Stack',
    description: 'A customer satisfaction survey platform designed to collect, analyze, and visualize feedback through interactive dashboards, satisfaction metrics, trend monitoring, and automated reporting.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    features: ['Customer feedback collection', 'Real-time analytics dashboard', 'Satisfaction trend analysis', 'Automated survey reporting'],
    image: '/assets/satistrack-landing.png',
    images: ['/assets/satistrack-landing.png', '/assets/satistrack-login.png'],
    link: 'https://satis-track.vercel.app/',
    github: null,
    bgColor: '#141a2a',
    circuitColor: [251, 146, 60],
    featured: true,
  },
  {
    title: 'EA Printworks',
    category: 'Web Development',
    description: 'A full-featured printworks web platform covering orders, gallery, services, and contact — built for real client use.',
    tech: ['HTML & CSS', 'JavaScript', 'PHP', 'SQL'],
    features: ['Real-time inventory tracking', 'Order management', 'Delivery coordination', 'Analytics dashboard'],
    image: '/assets/ea-printworks-landing.png',
    images: ['/assets/ea-printworks-home.png', '/assets/ea-printworks-about.png', '/assets/ea-printworks-services.png', '/assets/ea-printworks-gallery.png', '/assets/ea-printworks-contact.png', '/assets/ea-printworks-order.png'],
    link: null,
    github: null,
    bgColor: '#1a1420',
    circuitColor: [249, 115, 22],
  },
  {
    title: 'Grade Management System',
    category: 'System',
    description: 'A comprehensive grade management system designed to streamline grading, reporting, and analytics with real-time updates.',
    tech: ['HTML', 'CSS', 'SQL', 'Python'],
    features: ['Real-time grade tracking', 'Automated reporting', 'Performance analytics', 'User management'],
    image: '/assets/grade-system-portal.png',
    images: ['/assets/grade-system-student.png', '/assets/grade-system-admin.png'],
    link: null,
    github: null,
    bgColor: '#141a14',
    circuitColor: [234, 88, 12],
  },
];

// ─── Works Data ──────────────────────────────────────────────────────────────

const academicWorks: WorkItem[] = [
  {
    title: 'Vision Board',
    description:
      'A vision board design aimed at helping people visualize their goals effectively.',
    details: 'Academic Design Project | 2024',
    category: 'Academic',
    image: '/assets/visionboard.png',
    images: [
      '/assets/visionboard.png',
    ],
    tags: ['Design', 'Academic'],
    link: null,
  },
  {
    title: 'Ecosia Flyer',
    description:
      'A promotional flyer for Ecosia, highlighting the mission to plant trees.',
    details: 'Academic Design Project | 2024',
    category: 'Academic',
    image: '/assets/ecosiaflyer.png',
    images: [
      '/assets/ecosiaflyer.png',
    ],
    tags: ['Flyer', 'Academic'],
    link: null,
  },
  {
    title: 'About Me Poster',
    description:
      'An engaging poster that introduces the creator, discussing skills, interests, and background.',
    details: 'Academic Design Project | 2024',
    category: 'Academic',
    image: '/assets/aboutmeposter.png',
    images: [
      '/assets/aboutmeposter.png',
    ],
    tags: ['Poster', 'Academic'],
    link: null,
  },
  {
    title: 'Mood Boards',
    description:
      "A collection of visual references, color palettes, typography, and design inspirations used to establish the creative direction of a project.",
    details: 'Academic Design Project | 2025',
    category: 'Academic',
    image: '/assets/port-1.png',
    images: [
      '/assets/port-1.png',
      '/assets/port-2.png',
      '/assets/ea-1.png',
      '/assets/ea-2.png',
    ],
    tags: ['Mood Board', 'Academic'],
    link: null,
  },
  {
    title: 'Barikada Game Manual',
    description: 'A comprehensive manual for the Barikada game.',
    details: 'Academic Design Project | 2025',
    category: 'Academic',
    image: '/assets/manual-cover.png',
    pdf: '/assets/manual.pdf',
    tags: ['Manual Design', 'Print'],
    link: null,
  },
  {
    title: 'Barikada Rule Book',
    description: 'A comprehensive rulebook for the Barikada game.',
    details: 'Game Rule Book | 2025',
    category: 'Academic',
    image: '/assets/rulebook-cover.png',
    pdf: '/assets/rulebook.pdf',
    tags: ['Rule Book Design', 'Print'],
    link: null,
  },
];

const multimediaWorks: WorkItem[] = [
  {
    title: 'Artist Profile',
    description:
      "A profile piece showcasing the artist's work, style, and influences.",
    details: 'Multimedia Project | 2024',
    category: 'Multimedia',
    image: '/assets/artistprofile.jpg',
    images: [
      '/assets/artistprofile.jpg',
    ],
    tags: ['Photography', 'Profile'],
    link: null,
  },
  {
    title: 'Book Cover Design',
    description:
      "A captivating book cover design reflecting the book's theme.",
    details: 'Multimedia Design | 2024',
    category: 'Multimedia',
    image: '/assets/ENERO_BOOKCOVER.png',
    images: [
      '/assets/ENERO_BOOKCOVER.png',
    ],
    tags: ['Book Design', 'Print'],
    link: null,
  },
  {
    title: 'Minimalist Design',
    description:
      "A minimalist design exploring clean lines, ample whitespace, and simple forms.",
    details: 'Multimedia Design | 2024',
    category: 'Multimedia',
    image: '/assets/minimalist.png',
    images: [
      '/assets/minimalist.png',
    ],
    tags: ['Minimalist', 'Design'],
    link: null,
  },
  {
    title: 'Typographic',
    description:
      'A typographic design exploring visual hierarchy, font pairing, and layout composition.',
    details: 'Multimedia Works | 2024',
    category: 'Multimedia',
    image: '/assets/typographic.png',
    images: [
      '/assets/typographic.png',
    ],
    tags: ['Typography', 'Design'],
    link: null,
  },
  {
    title: 'Geometric',
    description:
      'A geometric design piece exploring shapes, patterns, and visual balance.',
    details: 'Multimedia Works | 2024',
    category: 'Multimedia',
    image: '/assets/geometric.png',
    images: [
      '/assets/geometric.png',
    ],
    tags: ['Geometric', 'Design'],
    link: null,
  },
  {
    title: 'Brandboard',
    description:
      'A comprehensive brand identity document including logos, color palettes, and design guidelines.',
    details: 'Branding Project | 2024',
    category: 'Multimedia',
    image: '/assets/brandboard.png',
    images: [
      '/assets/brandboard.png',
      'https://picsum.photos/seed/bb2/800/600',
      'https://picsum.photos/seed/bb3/800/600',
    ],
    tags: ['Branding', 'Identity'],
    link: null,
  },
];

const personalWorks: WorkItem[] = [
  {
    title: 'Old Personal Portfolio',
    description:
      'My old modern portfolio website built with HTML, CSS, and JavaScript, featuring smooth animations and a brown aesthetic.',
    details: 'Personal Project | 2025',
    category: 'Personal',
    image: '/assets/port-hero.png',
    images: [
      '/assets/port-home.png',
      '/assets/port-about.png',
      '/assets/port-works.png',
      '/assets/port-projects.png',
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'Web Dev'],
    link: null,
  },
  {
    title: 'VITS Gallery Page',
    description:
      'My old modern portfolio website built with HTML, CSS, and JavaScript, featuring smooth animations and a brown aesthetic.',
    details: 'Personal Project | 2025',
    category: 'Personal',
    image: '/assets/vits-hero.png',
    images: [
      '/assets/vits-home.png',
      '/assets/vits-about.png',
      '/assets/vits-gallery.png',
      '/assets/vits-contact.png',
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'Web Dev'],
    link: null,
  },
];

const prototypingWorks: WorkItem[] = [
  {
    title: 'ResearchConnect+',
    description:
      'A research collaboration platform designed to help students, researchers, and institutions connect, share knowledge, and manage research projects efficiently.',
    details: 'Prototyping | 2025',
    category: 'Prototyping',
    image: '/assets/rs-login.png',
    images: [
      '/assets/rs-admin.png',
      '/assets/rs-faculty.png',
      '/assets/rs-student.png',
    ],
    tags: ['UI/UX', 'Research'],
    link: null,
  },
  {
    title: 'SatisTrack',
    description:
      'An analytics dashboard prototype for monitoring satisfaction metrics through real-time insights, trend visualization, and performance tracking.',
    details: 'Prototyping | 2025',
    category: 'Prototyping',
    image: '/assets/css-login.png',
    images: [
      '/assets/css-logins.png',
      '/assets/css-consent.png',
      '/assets/css-surveys.png',
      '/assets/css-dashboards.png',
      '/assets/css-survey-builder.png',
      '/assets/css-analytics.png',
      '/assets/css-admin.png',
    ],
    tags: ['UI/UX', 'Analytics'],
    link: null,
  },
  {
    title: 'HopeHub',
    description:
      'A volunteer and charity platform that connects donors, volunteers, and organizations to support community initiatives and social causes.',
    details: 'Prototyping | 2023',
    category: 'Prototyping',
    image: '/assets/vc-onboarding-screens.png',
    images: [
      '/assets/vc-launching-screens.png',
      '/assets/vc-login-signup.png',
      '/assets/vc-main-screens.png',
      '/assets/vc-donation-screens.png',
      '/assets/vc-profile-screens.png',
      '/assets/vc-notifications.png',
    ],
    tags: ['UI/UX', 'Volunteer'],
    link: null,
  },
  {
    title: 'EA Printworks',
    description:
      'A volunteer and charity platform that connects donors, volunteers, and organizations to support community initiatives and social causes.',
    details: 'Prototyping | 2025',
    category: 'Prototyping',
    image: '/assets/ea-proto/ea-1.png',
    images: [
      '/assets/ea-proto/ea-2.png',
      '/assets/ea-proto/ea-3.png',
      '/assets/ea-proto/ea-4.png',
      '/assets/ea-proto/ea-5.png',
      '/assets/ea-proto/ea-6.png',
      '/assets/ea-proto/ea-7.png',
      '/assets/ea-proto/ea-8.png',
      '/assets/ea-proto/ea-9.png',
      '/assets/ea-proto/ea-10.png',
      '/assets/ea-proto/ea-11.png',
      '/assets/ea-proto/ea-12.png',
      '/assets/ea-proto/ea-13.png',
      '/assets/ea-proto/ea-14.png',
      '/assets/ea-proto/ea-15.png',
      '/assets/ea-proto/ea-16.png',
      '/assets/ea-proto/ea-17.png',
      '/assets/ea-proto/ea-18.png',
    ],
    tags: ['UI/UX', 'Print Shop'],
    link: null,
  },
];

// ─── Slide Transition ────────────────────────────────────────────────────────
type SlideDirection = 'left' | 'right' | null;

function useSlideTransition(current: number) {
  const [displayed, setDisplayed] = useState(current);
  const [phase, setPhase] = useState<'idle' | 'exit' | 'enter'>('idle');
  const [direction, setDirection] = useState<SlideDirection>(null);
  const prevRef = useRef(current);

  useEffect(() => {
    if (current === prevRef.current) return;
    const dir: SlideDirection = current > prevRef.current ? 'right' : 'left';
    setDirection(dir);
    setPhase('exit');

    const t1 = setTimeout(() => {
      setDisplayed(current);
      setPhase('enter');
      prevRef.current = current;
    }, 220);

    const t2 = setTimeout(() => setPhase('idle'), 500);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [current]);

  return { displayed, phase, direction };
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ProjectsAndWorks() {
  const [currentProject, setCurrentProject] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'academic' | 'multimedia' | 'personal' | 'prototyping'>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalPdf, setModalPdf] = useState<string | null>(null);
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);

  const startXRef = useRef(0);
  const totalProjects = projects.length;
  const { displayed, phase } = useSlideTransition(currentProject);

  const goToProject = useCallback((idx: number) => {
    if (animating) return;
    const clamped = Math.max(0, Math.min(totalProjects - 1, idx));
    if (clamped === currentProject) return;
    setAnimating(true);
    setCurrentProject(clamped);
    setTimeout(() => setAnimating(false), 500);
  }, [animating, currentProject, totalProjects]);

  const openModal = (images: string[], title: string, pdf?: string) => {
    setModalImages(images);
    setModalTitle(title);
    setModalPdf(pdf || null);
    setModalOpen(true);
  };

  const currentProjectData = projects[displayed];

  const filteredWorks: WorkItem[] = selectedCategory === 'all'
    ? [...academicWorks, ...multimediaWorks, ...personalWorks, ...prototypingWorks]
    : selectedCategory === 'academic' ? academicWorks
    : selectedCategory === 'multimedia' ? multimediaWorks
    : selectedCategory === 'prototyping' ? prototypingWorks
    : personalWorks;

  const imageClasses = `absolute inset-0 bg-cover bg-center transition-transform duration-[700ms] ease-out ${phase === 'idle' ? 'scale-100' : 'scale-[1.08]'}`;

  // ── Scroll reveal ──────────────────────────────────────────────────────────
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.10, rootMargin: '0px 0px -60px 0px' }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen pt-16 bg-background relative overflow-x-hidden">
      <ThreeBackground />

      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="circuit-overlay" />
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30" style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20" style={{ background: 'radial-gradient(circle, #fb923c 0%, transparent 70%)' }} />
      </div>

      {/* Featured Projects */}
      <section className="py-10 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 data-reveal="fade" className="text-3xl sm:text-5xl lg:text-7xl font-black text-center mb-4 sm:mb-6 tracking-tight gradient-text">Featured Projects</h1>
        <p data-reveal="fade" className="text-center text-foreground/60 text-base sm:text-lg max-w-2xl mx-auto">Turning ideas into functional and beautiful digital experiences</p>
      </section>

      {/* Compact Project Carousel */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div
          data-reveal="scale"
          className="rounded-3xl overflow-hidden border border-border/60 shadow-2xl bg-card/95 backdrop-blur-2xl"
          onPointerDown={(e) => { startXRef.current = e.clientX; }}
          onPointerUp={(e) => {
            const diff = startXRef.current - e.clientX;
            if (Math.abs(diff) > 40) diff > 0 ? goToProject(currentProject + 1) : goToProject(currentProject - 1);
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[380px]">
            <div className="relative overflow-hidden min-h-[200px] sm:min-h-[260px] lg:min-h-[380px] group">
              <div className={imageClasses} style={{ backgroundImage: `url('${currentProjectData.image}')`, backgroundColor: currentProjectData.bgColor }} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
              <CircuitCanvas color={currentProjectData.circuitColor} />

              <button
                onClick={() => openModal(currentProjectData.images, currentProjectData.title)}
                className="absolute bottom-4 left-4 z-30 flex items-center gap-2 bg-black/70 backdrop-blur-md text-white/90 text-xs px-4 py-1.5 rounded-2xl border border-white/10 hover:bg-black/90 hover:scale-105 transition-all"
              >
                <Camera className="w-4 h-4" /> Screenshots
              </button>
            </div>

            <div className="p-5 lg:p-8 flex flex-col justify-between bg-card border-l border-border/60">
              <div className={`transition-all duration-500 ${phase === 'idle' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase px-2.5 sm:px-3.5 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                    {currentProjectData.category}
                  </span>
                  {currentProjectData.featured && (
                    <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase px-2.5 sm:px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">Featured</span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl lg:text-3xl font-black tracking-tight mb-2 sm:mb-3">{currentProjectData.title}</h2>
                <p className="text-foreground/70 leading-tight mb-4 sm:mb-6 text-[13px] sm:text-[14.5px] line-clamp-3 sm:line-clamp-none">{currentProjectData.description}</p>

                <div className="mb-4 sm:mb-6">
                  <h3 className="uppercase text-xs tracking-widest text-foreground/50 mb-2">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProjectData.tech.map((tech, i) => (
                      <span key={i} className="text-xs px-3 py-1 bg-muted rounded-xl border border-border hover:border-orange-500/50 hover:bg-orange-500/5 transition-all">{tech}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="uppercase text-xs tracking-widest text-foreground/50 mb-2">Key Features</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 sm:gap-y-2 text-[12px] sm:text-[14px] text-foreground/70">
                    {currentProjectData.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2"><span className="text-orange-500 mt-1">•</span><span>{f}</span></li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 sm:pt-6">
                {currentProjectData.link ? (
                  <a href={currentProjectData.link} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all">
                    View Project <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-muted text-muted-foreground font-semibold rounded-2xl">Unavailable</span>
                )}
                {currentProjectData.github ? (
                  <a href={currentProjectData.github} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 border border-orange-500/30 text-orange-500 hover:bg-orange-500/10 font-semibold rounded-2xl transition-all">
                    <Github className="w-4 h-4" /> Code
                  </a>
                ) : (
                  <span className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-muted-foreground font-semibold rounded-2xl"><Github className="w-4 h-4" /> Code</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div data-reveal="fade" className="flex items-center justify-between mt-6 px-2">
          <div className="flex gap-3">
            {projects.map((_, i) => (
              <button key={i} onClick={() => goToProject(i)} className={`h-2 rounded-full transition-all ${i === currentProject ? 'w-12 bg-orange-500' : 'w-6 bg-border hover:bg-orange-500/50'}`} />
            ))}
          </div>
          <span className="text-sm tabular-nums text-foreground/50">{currentProject + 1} / {totalProjects}</span>
          <div className="flex gap-3">
            <button onClick={() => goToProject(currentProject - 1)} disabled={currentProject === 0 || animating} className="w-10 h-10 rounded-2xl border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-all"><ArrowLeft className="w-4 h-4" /></button>
            <button onClick={() => goToProject(currentProject + 1)} disabled={currentProject === totalProjects - 1 || animating} className="w-10 h-10 rounded-2xl border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-all"><ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      </section>

      {/* More Works Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div data-reveal="fade" className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight gradient-text">More Works</h2>
          <p className="text-foreground/60 mt-2">Academic • Multimedia • Personal Works • Prototyping</p>
        </div>

        <div data-reveal className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {[
            { value: 'all', label: 'All Works' },
            { value: 'academic', label: 'Academic' },
            { value: 'multimedia', label: 'Multimedia' },
            { value: 'personal', label: 'Personal Works' },
            { value: 'prototyping', label: 'Prototyping' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedCategory(filter.value as 'all' | 'academic' | 'multimedia' | 'personal' | 'prototyping')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base rounded-full font-medium transition-all ${selectedCategory === filter.value ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg' : 'border border-border hover:border-orange-500 text-foreground'}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div data-reveal data-reveal-stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((work: WorkItem, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedWork(work)}
              className="group rounded-3xl overflow-hidden border border-border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative"
            >
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={work.image} 
                  alt={work.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-semibold tracking-wide">Click to view →</span>
                </div>
                {work.pdf && (
                  <div className="absolute top-3 right-3 bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    <FileText className="w-3 h-3" /> PDF
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-base group-hover:text-orange-500 transition-colors leading-tight">{work.title}</h3>
                </div>
                <p className="text-foreground/60 text-xs mb-3 line-clamp-2">{work.description}</p>
                <p className="text-[10px] text-foreground/40 font-medium">{work.details}</p>
                {work.tags && work.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {work.tags.slice(0, 3).map((tag: string, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-muted rounded-lg border border-border text-foreground/60">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div data-reveal="scale" className="rounded-3xl border border-border/60 bg-card/80 p-6 sm:p-12 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3 sm:mb-4">Interested in collaborating?</h2>
          <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto mb-6 sm:mb-10">I'm always open to new opportunities and exciting projects. Let's create something amazing together.</p>
          <a href="mailto:gervinleobi@gmail.com" className="inline-flex items-center gap-2 sm:gap-3 px-7 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all text-base sm:text-lg">
            Get In Touch <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer data-reveal="fade" className="py-8 px-4 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center text-sm text-foreground/40">
          <p>&copy; 2026 Gervin Lee Enero. All rights reserved.</p>
        </div>
      </footer>

      {/* Legacy modal — featured project screenshots */}
      <ImageModal
        isOpen={modalOpen}
        work={null}
        images={modalImages}
        title={modalTitle}
        pdf={modalPdf}
        onClose={() => { setModalOpen(false); setModalPdf(null); }}
      />

      {/* Rich work modal — More Works section */}
      <ImageModal
        isOpen={!!selectedWork}
        work={selectedWork}
        onClose={() => setSelectedWork(null)}
      />
   
      <style jsx>{`
        /* ── Scroll Reveal ───────────────────────────────────────────────── */
        [data-reveal] {
          opacity: 0;
          transform: translateY(52px);
          transition:
            opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform;
        }
        [data-reveal="slide-left"]  { transform: translateX(-52px); }
        [data-reveal="slide-right"] { transform: translateX(52px); }
        [data-reveal="scale"]       { transform: translateY(32px) scale(0.96); }
        [data-reveal="fade"]        { transform: none; }

        [data-reveal].reveal-visible {
          opacity: 1;
          transform: translateY(0) translateX(0) scale(1);
        }

        /* Stagger grid children */
        [data-reveal-stagger].reveal-visible > * {
          animation: _staggerFadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        [data-reveal-stagger].reveal-visible > *:nth-child(1) { animation-delay: 0.04s; }
        [data-reveal-stagger].reveal-visible > *:nth-child(2) { animation-delay: 0.11s; }
        [data-reveal-stagger].reveal-visible > *:nth-child(3) { animation-delay: 0.18s; }
        [data-reveal-stagger].reveal-visible > *:nth-child(4) { animation-delay: 0.25s; }
        [data-reveal-stagger].reveal-visible > *:nth-child(5) { animation-delay: 0.32s; }
        [data-reveal-stagger].reveal-visible > *:nth-child(6) { animation-delay: 0.39s; }
        [data-reveal-stagger].reveal-visible > *:nth-child(7) { animation-delay: 0.46s; }
        [data-reveal-stagger].reveal-visible > *:nth-child(8) { animation-delay: 0.53s; }
        [data-reveal-stagger].reveal-visible > *:nth-child(9) { animation-delay: 0.60s; }

        @keyframes _staggerFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </main>
  );
}