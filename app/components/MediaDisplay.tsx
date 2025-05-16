'use client'
// components/MediaDisplay.tsx
import React from 'react';
import Image from "next/image";

interface MediaProps {
  src: string;
  caption: string;
  index: number;
}

const Media: React.FC<MediaProps> = ({ src, caption, index }) => {
  const isImage = /\.(jpg|png|tiff|gif)$/.test(src);
  const isVideo = /\.(mp4|avi)$/.test(src);

  if (isImage) {
    return (
      <figure className="flex flex-col items-center">
        <div className="max-h-[300px] flex justify-center items-center overflow-hidden">
          <Image
            src={`/images/${src}`}
            alt={caption}
            width={0}
            height={0}
            sizes="100vw"
            className="h-full max-h-[300px] w-auto object-contain"
          />
        </div>
        <figcaption className="py-3 px-4 bg-gray-200 text-center w-full">
          Fig. {index} : {caption}
        </figcaption>
      </figure>
    );
  } else if (isVideo) {
    const videoType = src.match(/.*\.(mp4|avi)$/)?.[1];
    return (
      <figure className="flex flex-col items-center">
        <div className="max-h-[300px] flex justify-center items-center overflow-hidden">
          <video
            src={`/images/${src}`}
            controls
            className="h-full max-h-[300px] w-auto object-contain"
          >
            <source src={`/images/${src}`} type={`video/${videoType}`} />
            <p>動画を再生するには video タグをサポートしたブラウザが必要です。</p>
          </video>
        </div>
        <figcaption className="py-3 px-4 bg-gray-200 text-center w-full">
          Movie {index} : {caption}
        </figcaption>
      </figure>
    );
  }
  return null;
};

interface MediaDisplayProps {
  figures: { src: string; caption: string }[];
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ figures }) => {
  return (
    <div>
      {figures.slice(0, 2).map((fig, index) => (
        <Media key={index} src={fig.src} caption={fig.caption} index={index + 1} />
      ))}
      {figures.slice(2, 4).map((fig, index) => (
        <Media key={index + 2} src={fig.src} caption={fig.caption} index={index + 3} />
      ))}
    </div>
  );
};

export default MediaDisplay;
