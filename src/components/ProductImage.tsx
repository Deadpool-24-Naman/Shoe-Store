'use client';

import { useState } from 'react';

const PLACEHOLDER_IMG = '/placeholder-shoe.svg';

interface ProductImageProps {
  src: string;
  alt: string;
}

export default function ProductImage({ src, alt }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER_IMG);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className="w-full h-full object-contain mix-blend-multiply transform group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-700 ease-out"
      onError={() => setImgSrc(PLACEHOLDER_IMG)}
    />
  );
}
