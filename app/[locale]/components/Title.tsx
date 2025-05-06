'use client';
import Link from 'next/link';
import { useI18nContext } from '@/contexts/i18nContext';
import { useI18nRouter } from '@/hooks/useI18nRouter';
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareXTwitter } from 'react-icons/fa6';
import { GoTriangleRight } from 'react-icons/go';
export default function Title() {
  const { messages, locale } = useI18nContext();
  const { switchLocale } = useI18nRouter();

  return (
    <>
      <div className="flex items-start justify-between w-full ">
        {/* 左側の大きなテキスト */}
        <h1 className="p-2 text-3xl font-bold m-0">{messages.title}</h1>

        {/* 右側のボタン3つ */}
        <div className="flex gap-2 pt-1 mr-3">
          <Link href={messages.links.tcu} className="text-gray-700 dark:text-gray-200 hover:text-blue-500  text-sm px-1 py-0.5 ">
            <div className="flex items-center"><GoTriangleRight />TCU</div>
          </Link>
          <Link href={messages.links.se} className="text-gray-700 dark:text-gray-200 hover:text-blue-500  text-sm px-1 py-0.5 transition">
            <div className="flex items-center"><GoTriangleRight /> Faculty</div>
          </Link>
          <Link href={messages.links.mse} className="text-gray-700 dark:text-gray-200 hover:text-blue-500  text-sm px-1 py-0.5 transition" >
            <div className="flex items-center"><GoTriangleRight /> Department</div>
          </Link>
          <Link href="https://www.facebook.com/cl.mse.tcu.ac.jp/" className="text-3xl text-gray-700 dark:text-gray-200 hover:text-blue-500 transition">
            <FaFacebookSquare />
          </Link>
          <Link href="https://twitter.com/ACSL_TCU" className="text-gray-700 dark:text-gray-200 hover:text-blue-500 text-3xl transition">
            <FaSquareXTwitter />
          </Link>

          {/* Language switcher */}
          <button
            onClick={() => switchLocale(locale === 'ja' ? 'en' : 'ja')}
            className="border border-gray-500 px-3 py-1 rounded-md hover:bg-gray-200 text-sm"
          >
            {locale === 'ja' ? 'EN' : 'JA'}
          </button>
        </div >
      </div >
      <title>{messages.title}</title>
      <h4 className="px-2">{messages.slogan}</h4>
    </>
  );
}