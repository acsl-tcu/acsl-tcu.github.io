'use client';
import * as React from 'react';
import Link from 'next/link';
import { useI18nContext } from '@/contexts/i18nContext';
import { useI18nRouter } from '@/hooks/useI18nRouter';

interface NavButtonProps {
  children?: React.ReactNode;
  icon: string;
  onClick?: () => void;
}

const NavButton = ({ children, icon, onClick }: NavButtonProps) => {
  const { locale } = useI18nContext();

  return (
    <Link
      href={`/${locale}/${children}`}
      className="text-gray-700 hover:text-black flex items-center gap-2 px-2 py-1"
      onClick={onClick}
    >
      <span className="text-sm">{icon}</span>
      {children}
    </Link>
  );
};

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const { switchLocale } = useI18nRouter();
  const { locale } = useI18nContext();

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  return (
    <header className="sticky top-0 z-50 bg-white bg-opacity-40 backdrop-blur-md border-b border-gray-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* PC Navigation */}
        <nav className="hidden md:flex space-x-6">
          <NavButton icon="👥">Member</NavButton>
          <NavButton icon="🎓">Research</NavButton>
          <NavButton icon="📚">Publication</NavButton>
          <NavButton icon="🧑‍🎓">For Applicant</NavButton>
          <NavButton icon="📖">Lecture</NavButton>
          <NavButton icon="📍">Access</NavButton>
        </nav>

        {/* Language switcher */}
        <button
          onClick={() => switchLocale(locale === 'ja' ? 'en' : 'ja')}
          className="border border-gray-500 px-3 py-1 rounded-md hover:bg-gray-200 text-sm"
        >
          {locale === 'ja' ? 'EN' : 'JA'}
        </button>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={toggleDrawer(true)} aria-label="Menu" className="text-lg">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden absolute inset-x-0 top-16 bg-white shadow-lg px-4 py-3 z-40">
          <div className="flex justify-end mb-3">
            <button onClick={toggleDrawer(false)} aria-label="Close menu">
              ✕
            </button>
          </div>
          <nav className="flex flex-col space-y-3">
            <NavButton icon="👥" onClick={toggleDrawer(false)}>Member</NavButton>
            <NavButton icon="🎓" onClick={toggleDrawer(false)}>Research</NavButton>
            <NavButton icon="📚" onClick={toggleDrawer(false)}>Publication</NavButton>
            <NavButton icon="🧑‍🎓" onClick={toggleDrawer(false)}>For Applicant</NavButton>
            <NavButton icon="📖" onClick={toggleDrawer(false)}>Lecture</NavButton>
            <NavButton icon="📍" onClick={toggleDrawer(false)}>Access</NavButton>
          </nav>
        </div>
      )}
    </header>
  );
}
