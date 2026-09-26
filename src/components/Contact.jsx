import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiEnvelope,
  HiPaperAirplane,
  HiCheck,
  HiExclamationCircle,
  HiPhone,
  HiMapPin,
  HiClipboard,
} from 'react-icons/hi2';
import { FaLinkedin } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import Toast from './Toast';
import SectionBadge from './SectionBadge';
import { SCROLL_MARGIN_CLASS } from '../constants/layout';
import { useRevealOnce } from '../hooks/useRevealOnce';

const INITIAL_FORM = { name: '', email: '', message: '' };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_ADDRESS = 'akhil1997mukesh@gmail.com';

// Pull EmailJS credentials from Vite env (.env.local). Falls back to
// placeholders so the UI stays usable during development.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function Contact() {
  const [ref, inView] = useRevealOnce();
  const formRef = useRef(null);

  // Track all pending timeouts so they can be cancelled on unmount —
  // prevents "setState on unmounted component" warnings.
  const timeoutsRef = useRef([]);
  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), []);
  const safeTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (message) => {
    setToast({ visible: true, message });
    safeTimeout(() => setToast({ visible: false, message: '' }), 2500);
  };

  const validate = (values) => {
    const next = {};
    if (!values.name.trim()) next.name = 'Name is required';
    if (!values.email.trim()) next.email = 'Email is required';
    else if (!EMAIL_REGEX.test(values.email)) next.email = 'Enter a valid email';
    if (!values.message.trim()) next.message = 'Message is required';
    else if (values.message.trim().length < 10)
      next.message = 'Message should be at least 10 characters';
    return next;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the field error as the user edits
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      showToast('Email copied to clipboard');
    } catch {
      showToast('Could not copy email');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      // EmailJS not configured — surface a helpful state instead of a silent failure
      setStatus('error');
      showToast('EmailJS not configured — see README');
      safeTimeout(() => setStatus('idle'), 4000);
      return;
    }

    setStatus('sending');
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
        publicKey: PUBLIC_KEY,
      });
      setStatus('sent');
      setForm(INITIAL_FORM);
      showToast('Message sent — I\'ll be in touch soon');
      safeTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      safeTimeout(() => setStatus('idle'), 4000);
    }
  };

  const inputClasses = (hasError) =>
    `w-full rounded-2xl border bg-neutral-50 px-4 py-3 text-sm transition-all
     placeholder:text-neutral-400 dark:bg-ink-900 dark:placeholder:text-glow-100/30
     focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-white
     dark:focus:ring-offset-ink-950
     ${hasError
       ? 'border-red-400 focus:ring-red-500 dark:border-red-500/60'
       : 'border-neutral-200 focus:border-transparent focus:ring-teal-400 dark:border-white/10'}`;

  const contactItems = [
    {
      icon: HiEnvelope,
      label: EMAIL_ADDRESS,
      href: `mailto:${EMAIL_ADDRESS}`,
      action: handleCopyEmail,
      actionIcon: HiClipboard,
      actionLabel: 'Copy email',
    },
    {
      icon: HiPhone,
      label: '+91 8618097296',
      href: 'tel:+918618097296',
    },
    {
      icon: FaLinkedin,
      label: 'www.linkedin.com/in/akhil-mukesh-43376a126',
      href: 'https://www.linkedin.com/in/akhil-mukesh-43376a126/',
    },
    {
      icon: HiMapPin,
      label: 'Bengaluru, India',
      href: null,
    },
  ];

  return (
    <section
      id="contact"
      className={`${SCROLL_MARGIN_CLASS} border-t border-neutral-200/70 bg-stone-50/50 dark:border-white/[0.06] dark:bg-ink-950`}
      aria-label="Contact form"
    >
      <motion.div
        ref={ref}
        className="section-container"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mb-12 md:mb-16">
          <SectionBadge align="left">Contact</SectionBadge>
          <h2 className="section-title text-left">Say hi</h2>
          <p className="section-subtitle !mb-0 max-w-2xl text-left">
            Hiring, collaborating, or just curious — drop me a line. I reply to most messages
            within a couple of days.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Info side */}
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-glow-100/55 leading-relaxed">
              Email works best, but LinkedIn or the form below are fine too. If you&apos;re
              reaching out about a role, a couple of lines about the team and stack is plenty to
              start.
            </p>

            <div className="space-y-3">
              {contactItems.map(({ icon: Icon, label, href, action, actionIcon: ActionIcon, actionLabel }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 text-gray-600 dark:text-glow-100/55 group"
                >
                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-ink-900 border
                                  border-gray-200 dark:border-glow-200/[0.08] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm truncate flex-1 hover:text-primary-600 dark:hover:text-glow-100 transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <span className="text-sm truncate flex-1">{label}</span>
                  )}
                  {action && (
                    <button
                      type="button"
                      onClick={action}
                      aria-label={actionLabel}
                      className="p-1.5 rounded text-gray-400 hover:text-primary-600
                                 dark:hover:text-glow-100 transition-colors
                                 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                    >
                      <ActionIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form side */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="sr-only">Your name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={inputClasses(!!errors.name)}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-xs text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Your email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={inputClasses(!!errors.email)}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="sr-only">Your message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Your message"
                value={form.message}
                onChange={handleChange}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className={`${inputClasses(!!errors.message)} resize-none`}
              />
              {errors.message && (
                <p id="message-error" className="mt-1 text-xs text-red-500">
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'sending' && 'Sending...'}
              {status === 'sent' && (<><HiCheck className="w-5 h-5" /> Sent!</>)}
              {status === 'error' && (<><HiExclamationCircle className="w-5 h-5" /> Failed — try again</>)}
              {status === 'idle' && (<><HiPaperAirplane className="w-5 h-5" /> Send Message</>)}
            </button>
          </form>
        </div>
      </motion.div>

      <Toast visible={toast.visible} message={toast.message} />
    </section>
  );
}
