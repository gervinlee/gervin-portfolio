'use client';

import { Mail, Github, Linkedin, ArrowUpRight } from 'lucide-react';

export function ContactInfo() {
  const contactLinks = [
    {
      icon: Mail,
      label: 'Email',
      value: 'gervinlee10@gmail.com',
      href: 'mailto:gervinlee10@gmail.com',
      external: false,
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'github.com/gervinlee',
      href: 'https://github.com/gervinlee',
      external: true,
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/gervin-lee-enero',
      href: 'https://linkedin.com/in/gervin-lee-enero',
      external: true,
    },
  ];

  return (
    <>
      <style>{`
        .cinfo-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          text-decoration: none;
          color: inherit;
          transition: all 0.25s ease;
        }

        :root:not(.dark) .cinfo-card {
          border-color: rgba(0,0,0,0.1);
          background: rgba(0,0,0,0.02);
        }

        .cinfo-card:hover {
          border-color: #fb923c;
          background: rgba(251,146,60,0.08);
          transform: translateY(-3px);
        }

        .cinfo-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(251,146,60,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cinfo-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 2px;
        }

        .cinfo-value {
          font-weight: 600;
          font-size: 0.95rem;
          word-break: break-all;
        }
      `}</style>

      <div className="space-y-4">
        {contactLinks.map((contact) => {
          const Icon = contact.icon;
          return (
            <a
              key={contact.label}
              href={contact.href}
              target={contact.external ? '_blank' : undefined}
              rel={contact.external ? 'noopener noreferrer' : undefined}
              className="cinfo-card block"
            >
              <div className="cinfo-icon-wrap">
                <Icon size={22} className="text-orange-400" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="cinfo-label">{contact.label}</p>
                <p className="cinfo-value text-foreground">{contact.value}</p>
              </div>

              {contact.external && <ArrowUpRight size={18} className="text-orange-400/50" />}
            </a>
          );
        })}
      </div>
    </>
  );
}