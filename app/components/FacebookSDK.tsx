"use client"
import React, { useRef, useEffect } from 'react'
import Script from 'next/script'

export const FB = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Facebook SDK がロードされた後、XFBML を解析
    if ((window as any).FB && typeof (window as any).FB.XFBML.parse === 'function') {
      (window as any).FB.XFBML.parse()
    }
  }, [])

  return (
    <>
      {/* Facebook SDK を head に埋め込む（Next.js の Script コンポーネントを使用） */}
      <Script
        src="https://connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v10.0"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        nonce="F5crYADj"
      />

      <div
        ref={ref}
        className="fb-page"
        data-href="https://www.facebook.com/cl.mse.tcu.ac.jp/"
        data-tabs="timeline"
        data-width={ref.current?.clientWidth ?? ''}
        data-height="700"
        data-small-header="true"
        data-adapt-container-width="true"
        data-hide-cover="true"
        data-show-facepile="false"
      />
      <blockquote cite="https://www.facebook.com/cl.mse.tcu.ac.jp/" className="fb-xfbml-parse-ignore">
        <a href="https://www.facebook.com/cl.mse.tcu.ac.jp/">
          高機能機械制御研究室・機械システム工学科・東京都市大学
        </a>
      </blockquote>
    </>
  )
}
