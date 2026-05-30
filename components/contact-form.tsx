'use client';

import { useState } from 'react';
import { Send, CheckCircle2, XCircle } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error();
      setStatus('success');
      setStatusMessage("Message sent! I'll get back to you soon.");
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setStatusMessage('Failed to send. Please try again.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <>
      <style>{`
        .cform-group { display: flex; flex-direction: column; gap: 6px; }
        .cform-label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(251, 146, 60, 0.8);
        }

        .cform-input-shell {
          position: relative;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.25s;
        }

        :root:not(.dark) .cform-input-shell {
          background: rgba(0,0,0,0.04);
          border-color: rgba(0,0,0,0.15);
        }

        .cform-input-shell:focus-within {
          border-color: #fb923c;
          box-shadow: 0 0 0 4px rgba(251,146,60,0.15);
        }

        .cform-input {
          width: 100%;
          padding: 14px 16px;
          background: transparent;
          border: none;
          outline: none;
          font-size: 1rem;
          color: inherit;
          border-radius: 12px;
        }

        .cform-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 640px) {
          .cform-row { grid-template-columns: 1fr 1fr; }
        }

        .cform-btn {
          width: 100%;
          padding: 16px;
          font-size: 1.02rem;
          font-weight: 700;
          border-radius: 12px;
          margin-top: 8px;
          background: linear-gradient(135deg, #c2410c 0%, #ea580c 100%);
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .cform-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(234, 88, 12, 0.4);
        }

        .cform-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="cform-row">
          <div className="cform-group">
            <label className="cform-label">Name</label>
            <div className="cform-input-shell">
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="cform-input"
              />
            </div>
          </div>
          <div className="cform-group">
            <label className="cform-label">Email</label>
            <div className="cform-input-shell">
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="cform-input"
              />
            </div>
          </div>
        </div>

        <div className="cform-group">
          <label className="cform-label">Subject</label>
          <div className="cform-input-shell">
            <input
              type="text"
              name="subject"
              placeholder="What is this about?"
              value={formData.subject}
              onChange={handleChange}
              required
              className="cform-input"
            />
          </div>
        </div>

        <div className="cform-group">
          <label className="cform-label">Message</label>
          <div className="cform-input-shell">
            <textarea
              name="message"
              placeholder="Tell me about your project or idea..."
              rows={7}
              value={formData.message}
              onChange={handleChange}
              required
              className="cform-input"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={status === 'loading'} 
          className="cform-btn"
        >
          {status === 'loading' ? (
            <>Sending...</>
          ) : (
            <>
              <Send className="w-5 h-5" /> 
              Send Message
            </>
          )}
        </button>

        {status === 'success' && (
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 dark:text-green-400">
            <CheckCircle2 size={20} /> {statusMessage}
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400">
            <XCircle size={20} /> {statusMessage}
          </div>
        )}
      </form>
    </>
  );
}