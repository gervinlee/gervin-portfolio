'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Moon,
  Sun,
  Download,
  Menu,
  X,
} from 'lucide-react';
import {
  useEffect,
  useState,
} from 'react';

export default function Navigation() {
  const pathname = usePathname();

  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  // NEW
  const [scrolled, setScrolled] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // NEW
  // Detect scroll for homepage navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener(
      'scroll',
      handleScroll
    );

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll
      );
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
  ];

  const isActive = (href: string) =>
    pathname === href;

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500

        ${
          pathname === '/'
            ? scrolled
              ? 'translate-y-0 opacity-100 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
              : '-translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden group-hover:shadow-lg transition-all duration-300">
              <img
                src="/gervin-picture.jpg"
                alt="GLE"
                className="w-full h-full object-cover"
              />
            </div>

            <span className="font-bold text-lg gradient-text">
              Gervin Lee
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary hover:text-secondary-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* View CV Button */}
            <a
              href="/cv.txt"
              className="inline-flex items-center gap-2 ml-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-all duration-300"
              download="Gervin_Lee_Enero_CV.txt"
            >
              <Download className="w-4 h-4" />

              <span className="text-sm">
                CV
              </span>
            </a>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() =>
                  setTheme(
                    theme === 'dark'
                      ? 'light'
                      : 'dark'
                  )
                }
                className="ml-2 p-2 rounded-md border border-border hover:bg-secondary transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-accent" />
                ) : (
                  <Moon className="w-5 h-5 text-primary" />
                )}
              </button>
            )}
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            {/* Theme Toggle for Mobile */}
            {mounted && (
              <button
                onClick={() =>
                  setTheme(
                    theme === 'dark'
                      ? 'light'
                      : 'dark'
                  )
                }
                className="p-2 rounded-md border border-border hover:bg-secondary transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-accent" />
                ) : (
                  <Moon className="w-5 h-5 text-primary" />
                )}
              </button>
            )}

            {/* Hamburger Menu Button */}
            <button
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
              className="p-2 rounded-md border border-border hover:bg-secondary transition-all duration-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden border-t border-border bg-background/95 backdrop-blur transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary hover:text-secondary-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* View CV Button for Mobile */}
          <a
            href="/cv.txt"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-all duration-300"
            download="Gervin_Lee_Enero_CV.txt"
          >
            <Download className="w-4 h-4" />

            <span className="text-sm">
              Download CV
            </span>
          </a>
        </div>
      </div>
    </nav>
  );
}