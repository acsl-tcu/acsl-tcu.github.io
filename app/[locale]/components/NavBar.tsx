'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx' // Tailwind と相性の良い条件付きクラスライブラリ
import { House, UsersRound, GraduationCap, LibraryBig, Sprout, BookOpenText, MapPinHouse } from 'lucide-react' // 例: lucideアイコンを使用
import { useI18nContext } from '@/contexts/i18nContext';

export default function NavBar() {
  const { locale } = useI18nContext();
  const pathname = usePathname();
  const navItems = [
    { icon: House, label: "Home", href: `/${locale}/Home` },
    { icon: UsersRound, label: "Member", href: `/${locale}/Member` },
    { icon: GraduationCap, label: "Research", href: `/${locale}/Research` },
    {
      icon: LibraryBig, label: "Publication", href: `/${locale}/Publication`
    },
    { icon: Sprout, label: "For Applicant", href: `/${locale}/ForApplicant` },
    {
      icon: BookOpenText, label: "Lecture", href: `/${locale}/Lecture`
    },
    { icon: MapPinHouse, label: "Access", href: `/${locale}/Access` },
  ]

  return (
    <>
      <nav className="bg-gray dark:bg-gray-900 shadow w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-screen items-center justify-center">
            <h1 className="bg-blue-700 text-3xl font-bold text-blue-500">
              Tailwind CSS は動作しています！
            </h1>
          </div>
          <ul className="h-12 flex items-center justify-between">
            {navItems.map(({ icon: Icon, label, href }) => (
              <li key={label} className="flex-1">
                <Link
                  href={href}
                  className={clsx('flex flex-col items-center justify-center h-full transition-colors',
                    pathname === href
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-200 hover:text-blue-500'
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="mt-1 text-sm hidden sm:inline">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>);
}
