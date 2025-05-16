// app/[locale]/ClientLayout.tsx
'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import Title from './Title';
import NavBar from './NavBar';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.clientHeight);
    }
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="sm:sticky sm:top-0 bg-white dark:bg-gray-900 bg-opacity-40 backdrop-blur-md border-b border-gray-300 shadow-md z-[5]"
      >
        <Title />
        <NavBar />
      </header>
      <main
        className="container mx-auto flex flex-col pb-[120px]"
        style={{ minHeight: `${headerHeight - 120}px` }}
      >
        {children}
      </main>
    </>
  );
}
