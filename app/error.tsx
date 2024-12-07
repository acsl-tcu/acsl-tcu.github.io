"use client"
import React from 'react';

const ErrorPage = ({ statusCode }: { statusCode: number }) => {
  return (
    <div>
      <h1>{statusCode} エラーが発生しました。</h1>
      <p>申し訳ありませんが、ページを表示できませんでした。</p>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: { res: any; err: any }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
