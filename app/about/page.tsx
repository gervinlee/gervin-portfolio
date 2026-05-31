'use client';

import { 
  Code2, Database, Network, Palette, Star, User, ChevronLeft, ChevronRight, 
  Calendar, MapPin, Zap, ArrowRight, Cpu, Globe, GitBranch, Layers, 
  Target, Coffee, Monitor, Smartphone, Server, Cloud 
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// ─── Skill data with proficiency ────────────────────────────────────────────
const skillGroups = [
  {
    category: 'Frontend',
    icon: Globe,
    color: 'from-orange-500 to-amber-400',
    glow: 'rgba(249,115,22,0.35)',
    skills: [
      { name: 'React', level: 75 },
      { name: 'Next.js', level: 75 },
      { name: 'TypeScript', level: 75 },
      { name: 'JavaScript', level: 85 },
      { name: 'Tailwind CSS', level: 80 },
      { name: 'HTML & CSS', level: 95 },
    ],
  },
  {
    category: 'Design & Tools',
    icon: Layers,
    color: 'from-orange-400 to-red-400',
    glow: 'rgba(251,146,60,0.30)',
    skills: [
      { name: 'Figma', level: 95 },
      { name: 'Canva', level: 98 },
      { name: 'VS Code', level: 95 },
      { name: 'PyCharm', level: 80 },
    ],
  },
  {
    category: 'Backend & Deployment',
    icon: Cpu,
    color: 'from-rose-500 to-orange-400',
    glow: 'rgba(244,63,94,0.30)',
    skills: [
      { name: 'Supabase', level: 75 },
      { name: 'Vercel', level: 90 },
    ],
  },
];

const allSkills = skillGroups.flatMap(group => group.skills);

// ─── Skill PNG/SVG Icon Map via devicons CDN ─────────────────────────────────
const skillIconMap: Record<string, string> = {
  'React':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Next.js':      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'TypeScript':   'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'JavaScript':   'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
  'HTML & CSS':   'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'Figma':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  'Canva':        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/canva/canva-original.svg',
  'VS Code':      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
  'PyCharm':      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pycharm/pycharm-original.svg',
  'Supabase':     'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg',
  'Vercel':       'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg',
};

// Icons that are dark/black and need inversion on dark backgrounds
const needsInvert = new Set(['Next.js', 'Vercel']);

// Duplicate 6× so the strip is always wider than the viewport for seamless infinite loop.
// CSS translates -50% (half of total width), which lands on a perfect copy boundary.
function makeInfiniteRow<T>(arr: T[], copies = 6): T[] {
  const out: T[] = [];
  for (let i = 0; i < copies; i++) out.push(...arr);
  return out;
}

const row1Skills = makeInfiniteRow(allSkills, 6);
const row2Skills = makeInfiniteRow([...allSkills.slice(3), ...allSkills.slice(0, 3)], 6);

// ─── Education data ─────────────────────────────────────────────────────────
const educationData = [
  {
    period: '2023 — Present',
    degree: 'B.S. Information Technology',
    school: 'Pamantasan ng Lungsod ng Valenzuela',
    shortSchool: 'PLV',
    focus: 'Full-Stack Web Development',
    description: 'Pursuing BSIT with a focus on full-stack web development, software engineering, and modern programming paradigms. Engaged in hands-on projects and collaborative tech initiatives.',
    achievements: ["Dean's List", 'Tech Organizations', 'Full-Stack Projects'],
    image: '/assets/plv.jpg',
    accent: '#f97316',
    index: 1,
  },
  {
    period: '2021 — 2023',
    degree: 'Senior High School — STEM',
    school: 'Our Lady of Fatima University',
    shortSchool: 'OLFU',
    focus: 'Science & Technology',
    description: 'Completed STEM strand with honors, building a strong foundation in mathematics, physics, and computer science. Joined programming competitions and technology workshops.',
    achievements: ['Academic Honors', 'STEM Excellence', 'Research & Innovation'],
    image: '/assets/olfu.jpg',
    accent: '#fb923c',
    index: 2,
  },
  {
    period: '2020 — 2021',
    degree: 'Junior High School',
    school: 'Caruhatan National High School',
    shortSchool: 'CNHS',
    focus: 'General Education',
    description: 'Maintained consistent academic excellence while developing early interest in technology. Participated in school tech clubs and computer literacy programs.',
    achievements: ['Honor Student', 'Digital Skills Enthusiast', 'Computer Literacy'],
    image: '/assets/cnhs.jpg',
    accent: '#f59e0b',
    index: 3,
  },
  {
    period: '2017 — 2020',
    degree: 'Junior High School',
    school: 'St. Joseph Academy of Valenzuela',
    shortSchool: 'SJAV',
    focus: 'Foundation Education',
    description: 'Discovered passion for technology during elementary years. First exposure to computers sparked a lifelong interest in digital innovation and problem-solving.',
    achievements: ['Consistent Honor Student', 'First Computer Experience', 'Tech Enthusiast'],
    image: '/assets/sjav.jpg',
    accent: '#ea580c',
    index: 4,
  },
  {
    period: '2010 — 2017',
    degree: 'Preschool & Primary Education',
    school: 'Mother Shepherd Academy of Valenzuela',
    shortSchool: 'MSA',
    focus: 'Foundation & Development',
    description: 'Built strong foundational skills in reading, writing, and mathematics. Developed creativity and curiosity that would later fuel interest in technology.',
    achievements: ['Foundation Skills', 'Creative Development', 'Early Learning'],
    image: '/assets/msa.jpg',
    accent: '#c2410c',
    index: 5,
  },
];

// ─── SkillBar Component ──────────────────────────────────────────────────────
function SkillBar({ name, level, color, delay = 0 }: { name: string; level: number; color: string; delay?: number }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-semibold text-foreground/85 tracking-wide">{name}</span>
        <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--orange-strong)' }}>
          {animated ? `${level}%` : '0%'}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-border/60 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${color} transition-all`}
          style={{
            width: animated ? `${level}%` : '0%',
            transitionDuration: '1.2s',
            transitionDelay: `${delay}ms`,
            transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
    </div>
  );
}

// ─── EduCard Component ───────────────────────────────────────────────────────
function EduCard({ data, isActive, onClick }: { data: typeof educationData[0]; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left transition-all duration-500 group ${isActive ? 'scale-[1.02]' : 'scale-[0.99] opacity-75 hover:opacity-90 hover:scale-[1.01]'}`}
    >
      <div
        className="relative rounded-2xl border overflow-hidden transition-all duration-500"
        style={{
          background: isActive
            ? `linear-gradient(135deg, var(--card) 0%, color-mix(in oklch, ${data.accent} 10%, var(--card)) 100%)`
            : 'var(--card)',
          borderColor: isActive ? data.accent : 'var(--border)',
          boxShadow: isActive
            ? `0 0 0 1px ${data.accent}50, 0 12px 40px ${data.accent}25`
            : 'none',
        }}
      >
        <div className="h-0.5 w-full transition-all duration-500" style={{ background: isActive ? `linear-gradient(90deg, ${data.accent}, transparent)` : 'transparent' }} />

        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-300" style={{
              background: isActive ? `linear-gradient(135deg, ${data.accent}, ${data.accent}ee)` : 'var(--muted)',
              color: isActive ? '#fff' : 'var(--muted-foreground)',
              boxShadow: isActive ? `0 4px 12px ${data.accent}60` : 'none',
            }}>
              {data.shortSchool.slice(0, 2)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: data.accent }}>
                  {data.period}
                </span>
              </div>
              <h4 className="text-sm font-bold text-foreground leading-snug mb-0.5">{data.degree}</h4>
              <p className="text-xs text-foreground/55 truncate">{data.school}</p>
            </div>

            <div className="flex-shrink-0 transition-transform duration-300" style={{ transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)', color: isActive ? data.accent : 'var(--muted-foreground)' }}>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div className="overflow-hidden transition-all duration-500" style={{ maxHeight: isActive ? '320px' : '0', opacity: isActive ? 1 : 0 }}>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: `${data.accent}30` }}>
              <p className="text-xs text-foreground/65 leading-relaxed mb-3">{data.description}</p>
              <div className="flex flex-wrap gap-2">
                {data.achievements.map((a) => (
                  <span key={a} className="text-xs px-3 py-1 rounded-full font-medium" style={{
                    background: `${data.accent}18`,
                    color: data.accent,
                    border: `1px solid ${data.accent}35`,
                  }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── SkillCard with PNG icon ─────────────────────────────────────────────────
function SkillCard({ skill }: { skill: { name: string; level: number } }) {
  const iconSrc = skillIconMap[skill.name];
  return (
    <div className="flex-shrink-0 w-72 sm:w-80 bg-card/90 border border-border/60 rounded-3xl p-5 backdrop-blur-xl hover:border-orange-500/50 hover:scale-105 transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Icon box */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center border border-white/10 overflow-hidden flex-shrink-0">
          {iconSrc ? (
            <img
              src={iconSrc}
              alt={skill.name}
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
              style={needsInvert.has(skill.name) ? { filter: 'invert(1)' } : undefined}
            />
          ) : (
            <Monitor className="w-9 h-9 text-orange-400" />
          )}
        </div>
        {/* Name + bar */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-lg truncate">{skill.name}</p>
          <div className="mt-3 h-2.5 bg-border/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: `${skill.level}%` }} />
          </div>
        </div>
        <span className="font-mono text-2xl font-bold text-orange-500 flex-shrink-0">{skill.level}%</span>
      </div>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────
export default function About() {
  const [activeEdu, setActiveEdu] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="circuit-overlay" />
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30" style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20" style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }} />
      </div>

      {/* HERO SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 data-reveal="fade" className="text-5xl sm:text-6xl lg:text-7xl font-black text-center mb-16 tracking-tight gradient-text leading-none">Who I Am</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          
          {/* Profile Card */}
          <div data-reveal="slide-left" className="lg:col-span-2 flex justify-center">
            <div
              className="relative group w-full max-w-sm"
              style={{ '--mouse-x': `${mousePosition.x}%`, '--mouse-y': `${mousePosition.y}%` } as React.CSSProperties}
            >
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-orange-500 via-amber-500 to-red-500 opacity-30 group-hover:opacity-50 blur-3xl transition-all duration-700" />
              <div className="relative rounded-3xl border border-border/60 bg-card/95 backdrop-blur-2xl overflow-hidden shadow-2xl">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-red-500" />
                <div className="p-8">
                  <div className="relative mx-auto mb-6 w-52 h-52">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 animate-spin-slow opacity-20" />
                    <div className="relative w-52 h-52 rounded-full overflow-hidden border-4 border-background shadow-inner">
                      <img
                        src="/gervin-picture.jpg"
                        alt="Gervin Lee Enero"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute -bottom-2 right-4 bg-emerald-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      Open to Work
                    </div>
                  </div>

                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-black gradient-text tracking-tight">Gervin Lee Enero</h3>
                    <p className="text-orange-500 font-medium mt-1">BSIT Student</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center mb-8">
                    {[['4','Projects'],['4','Certificates'],['?','Years Exp']].map(([val, label]) => (
                      <div key={label} className="bg-muted/50 rounded-2xl p-3">
                        <div className="text-xl font-bold text-orange-500">{val}</div>
                        <div className="text-xs text-foreground/60">{label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-4">
                    <a href="https://facebook.com/gervinlee.enero" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-orange-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12.07C22 6.477 17.523 2 12 2S2 6.477 2 12.07c0 5.017 3.657 9.176 8.438 9.93v-7.03H7.898v-2.9h2.54V9.845c0-2.522 1.492-3.918 3.777-3.918 1.095 0 2.24.198 2.24.198v2.477h-1.262c-1.243 0-1.63.775-1.63 1.57v1.885h2.773l-.443 2.9h-2.33V22c4.78-.754 8.437-4.913 8.437-9.93z" />
                      </svg>
                    </a>
                    <a href="https://linkedin.com/in/gervin-lee-enero" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-orange-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452H16.89v-5.569c0-1.328-.026-3.037-1.85-3.037-1.85 0-2.134 1.445-2.134 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM7.119 20.452H3.555V9h3.564v11.452z" />
                      </svg>
                    </a>
                    <a href="https://github.com/gervinlee" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-orange-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .5C5.648.5.5 5.648.5 12a11.5 11.5 0 0 0 7.863 10.92c.575.105.785-.25.785-.556 0-.274-.01-1-.015-1.962-3.2.696-3.877-1.542-3.877-1.542-.523-1.328-1.278-1.682-1.278-1.682-1.045-.715.08-.7.08-.7 1.155.082 1.763 1.186 1.763 1.186 1.026 1.758 2.692 1.25 3.348.955.103-.743.402-1.25.73-1.538-2.554-.29-5.24-1.277-5.24-5.686 0-1.256.448-2.283 1.183-3.088-.119-.29-.513-1.46.112-3.043 0 0 .965-.309 3.162 1.18a10.96 10.96 0 0 1 5.756 0c2.196-1.489 3.16-1.18 3.16-1.18.627 1.583.233 2.753.115 3.043.737.805 1.182 1.832 1.182 3.088 0 4.42-2.69 5.393-5.252 5.678.413.355.78 1.055.78 2.126 0 1.536-.014 2.773-.014 3.15 0 .309.207.667.79.554A11.502 11.502 0 0 0 23.5 12C23.5 5.648 18.352.5 12 .5z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right info cards */}
          <div data-reveal="slide-right" className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: <User className="w-6 h-6 text-orange-500" />, title: 'Who I Am', text: "I’m Gervin Lee, a BSIT student and aspiring Frontend Developer and UI/UX Designer focused on building modern, interactive, and user-friendly web experiences." },
                { icon: <Code2 className="w-6 h-6 text-orange-500" />, title: 'What I Build', text: 'I work on simple responsive websites and UI ideas, focusing on learning how to make them both functional and visually clear.' },
                { icon: <Target className="w-6 h-6 text-orange-500" />, title: 'My Vision', text: 'To grow as a Web Developer and UI/UX Designer by creating meaningful digital experiences and continuously learning new technologies.' },
                { icon: <Coffee className="w-6 h-6 text-orange-500" />, title: 'Beyond Coding', text: 'I enjoy exploring UI/UX design, experimenting with new tools, and staying updated with the latest trends in web development.' },
              ].map(({ icon, title, text }) => (
                <div key={title} className="group bg-card border border-border/60 rounded-3xl p-6 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-11 h-11 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    {icon}
                  </div>
                  <h3 className="font-bold text-xl mb-2">{title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK & TOOLS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div data-reveal="fade" className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight gradient-text">Tech Stack &amp; Tools</h2>
          <p className="text-foreground/60 mt-3">The technologies powering my ideas and creations</p>
        </div>

        <div data-reveal="scale" className="relative overflow-hidden py-8">
          {/* Edge fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex flex-col gap-10">
            {/* Row 1 — left scroll */}
            <div className="overflow-hidden">
              <div className="marquee">
                {row1Skills.map((skill, i) => (
                  <SkillCard key={`r1-${i}`} skill={skill} />
                ))}
              </div>
            </div>

            {/* Row 2 — right scroll */}
            <div className="overflow-hidden">
              <div className="marquee-reverse">
                {row2Skills.map((skill, i) => (
                  <SkillCard key={`r2-${i}`} skill={skill} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div data-reveal="fade" className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight gradient-text">Certifications</h2>
          <p className="text-foreground/60 mt-3">Cisco Professional Credentials • Verified on Credly</p>
        </div>

        <div data-reveal data-reveal-stagger className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Networking Basics",
              subtitle: "Cisco Certified Network Associate",
              date: "2025",
              image: "/assets/certificates/networking-basics-img.jpg",
              url: "https://www.credly.com/badges/54eb2af8-f6c7-4bcb-bc1d-d6a903c8e929/public_url"
            },
            {
              title: "Networking Devices and Initial Configuration",
              subtitle: "Cisco Certified Network Associate",
              date: "2025",
              image: "/assets/certificates/networking-devices-and-initial-img.jpg",
              url: "https://www.credly.com/badges/8f90a364-fd98-4b24-a375-67033b277660/public_url"
            },
            {
              title: "Network Addressing and Basic Troubleshooting",
              subtitle: "Cisco Certified Network Associate",
              date: "2025",
              image: "/assets/certificates/network-addressing-and-basic-img.jpg",
              url: "https://www.credly.com/badges/5d25f131-384c-4487-9de0-044733319ee6/public_url"
            },
            {
              title: "Network Support and Security",
              subtitle: "Cisco Certified Network Associate",
              date: "2025",
              image: "/assets/certificates/network-support and-security-img.jpg",
              url: "https://www.credly.com/badges/4e4aaffb-37d4-4f82-b2d8-e7fa660332a1/public_url"
            },
          ].map((cert, index) => (
            <a 
              key={index} 
              href={cert.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative bg-card border border-border/60 rounded-3xl overflow-hidden hover:border-orange-500/40 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 block"
            >
              {/* Certificate Image Container */}
              <div className="relative aspect-[16/9] overflow-hidden bg-zinc-950">
                <img 
                  src={cert.image} 
                  alt={cert.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                
                {/* Date Badge */}
                <div className="absolute top-5 right-5 px-4 py-1.5 bg-black/80 backdrop-blur-md text-xs font-mono tracking-widest text-orange-400 border border-orange-500/30 rounded-full">
                  {cert.date}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8 pb-10">
                <h3 className="text-xl font-bold leading-tight mb-3 text-foreground group-hover:text-orange-400 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-foreground/70 text-[15.2px] leading-relaxed mb-6">
                  {cert.subtitle}
                </p>
                
                <div className="flex items-center gap-3 text-emerald-400">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Verified on Credly</span>
                </div>
              </div>

              {/* Accent Bar */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 w-3/4" />
            </a>
          ))}
        </div>

        <p className="text-center text-foreground/50 text-sm mt-12">
          More certifications (Web Development, UI/UX, Cloud, etc.) coming soon
        </p>
      </section>

      {/* ACADEMIC JOURNEY SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div data-reveal="fade" className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight gradient-text">Academic Journey</h2>
          <p className="text-foreground/60 mt-3 max-w-md mx-auto">Flip through the pages of my educational story</p>
        </div>

        <div data-reveal="scale" className="flex justify-center">
          <div className="relative w-full max-w-[1100px] min-h-[720px]">
            {/* Mobile View */}
            <div className="lg:hidden space-y-6">
              {educationData.map((edu, i) => (
                <div key={i} className="bg-card rounded-3xl overflow-hidden border border-border shadow-xl">
                  <div className="relative h-52">
                    <img src={edu.image} alt={edu.school} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs text-orange-400 font-mono">{edu.period}</p>
                      <h3 className="text-white font-bold text-xl">{edu.school}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-xl mb-3">{edu.degree}</h4>
                    <p className="text-foreground/70 mb-6">{edu.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {edu.achievements.map((a, idx) => (
                        <span key={idx} className="text-xs px-4 py-2 bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Open Book */}
            <div className="hidden lg:block relative w-full h-[720px]" style={{ perspective: '2400px' }}>
              <div className="relative w-full h-full bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-900 dark:to-black rounded-3xl shadow-2xl border border-border overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                
                {/* LEFT PAGE */}
                <div className="absolute left-0 top-0 bottom-0 w-5/12 bg-white dark:bg-zinc-950 border-r border-orange-500/20 p-10 overflow-hidden">
                  <h3 className="text-2xl font-bold mb-8 text-foreground flex items-center gap-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-orange-500" />
                    CHAPTERS
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-orange-500" />
                  </h3>

                  {educationData.map((edu, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveEdu(i)}
                      className={`w-full text-left p-6 rounded-2xl mb-4 transition-all group ${activeEdu === i 
                        ? 'bg-orange-500/10 border border-orange-500/40 shadow-lg scale-[1.02]' 
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-900/70'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-mono text-orange-500 block">{edu.period}</span>
                          <p className="font-semibold text-lg mt-2 group-hover:text-orange-400 transition-colors">{edu.shortSchool}</p>
                        </div>
                        <div className="text-4xl font-black text-foreground/10 group-hover:text-orange-500/30 transition-colors">{edu.index}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* RIGHT PAGE */}
                <div className="absolute right-0 top-0 bottom-0 w-7/12 overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                  {educationData.map((edu, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 transition-all duration-700 ease-out"
                      style={{
                        transformOrigin: 'left center',
                        transform: activeEdu === i ? 'rotateY(0deg)' : activeEdu > i ? 'rotateY(-160deg)' : 'rotateY(10deg)',
                        zIndex: activeEdu === i ? 50 : activeEdu > i ? 10 : 25,
                      }}
                    >
                      <div className="h-full bg-white dark:bg-zinc-950 flex flex-col border border-border">
                        <div className="relative h-80 overflow-hidden">
                          <img 
                            src={edu.image} 
                            alt={edu.school} 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                          <div className="absolute bottom-8 left-8 right-8">
                            <p className="text-orange-400 font-mono tracking-widest text-sm">{edu.period}</p>
                            <h3 className="text-3xl font-bold text-white mt-2 leading-tight">{edu.school}</h3>
                          </div>
                        </div>

                        <div className="flex-1 p-10 flex flex-col">
                          <h4 className="text-2xl font-bold text-foreground mb-2">{edu.degree}</h4>
                          <p className="text-orange-500 mb-8">{edu.focus}</p>
                          
                          <p className="text-foreground/80 leading-relaxed flex-1 text-[15.5px]">
                            {edu.description}
                          </p>

                          <div className="mt-10">
                            <p className="uppercase text-xs tracking-widest text-foreground/50 mb-4">Achievements</p>
                            <div className="grid grid-cols-1 gap-4">
                              {edu.achievements.map((achievement, idx) => (
                                <div key={idx} className="flex gap-4 bg-zinc-100 dark:bg-zinc-900/80 border border-border rounded-2xl p-5">
                                  <Star className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                                  <p className="text-foreground/90 text-[15px] leading-snug">{achievement}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Book Spine */}
                <div className="absolute left-[41.5%] top-0 bottom-0 w-7 bg-gradient-to-b from-transparent via-orange-500/50 to-transparent z-40 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer data-reveal="fade" className="py-8 px-4 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center text-sm text-foreground/40">
          <p>&copy; 2026 Gervin Lee Enero. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Scroll Reveal ─────────────────────────────────────────────── */
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
          animation: _staggerFadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        [data-reveal-stagger].reveal-visible > *:nth-child(1) { animation-delay: 0.05s; }
        [data-reveal-stagger].reveal-visible > *:nth-child(2) { animation-delay: 0.15s; }
        [data-reveal-stagger].reveal-visible > *:nth-child(3) { animation-delay: 0.25s; }
        [data-reveal-stagger].reveal-visible > *:nth-child(4) { animation-delay: 0.35s; }

        @keyframes _staggerFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /*
          Infinite marquee:
          - Inner strip is 6× the base list width (made above with makeInfiniteRow)
          - CSS translates by -50% of the rendered width, landing on the 3rd copy
            which is visually identical to the start → perfect seamless loop
        */
        .marquee {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          animation: marquee 55s linear infinite;
          will-change: transform;
          transform: translateZ(0);
        }

        .marquee-reverse {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          animation: marquee-reverse 60s linear infinite;
          will-change: transform;
          transform: translateZ(0);
        }

        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes marquee-reverse {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .marquee:hover,
        .marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </main>
  );
}