import React, { useRef } from 'react'
import { Helmet } from 'react-helmet'

export const FB = () => {
  const ref = useRef(null)

  return (
    <>
      <Helmet>
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v10.0"
          nonce="F5crYADj"
        />
      </Helmet>

      <div
        ref={ref}
        className="fb-page"
        data-href="https://www.facebook.com/cl.mse.tcu.ac.jp/"
        data-tabs="timeline"
        //data-width={ref?.current?.clientWidth ?? ''}
        data-width={ref.current}
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

