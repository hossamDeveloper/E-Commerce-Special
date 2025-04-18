import React, { useEffect, useRef } from 'react';
import { lazyLoad } from '@img/browser';

const LazyImage = ({ src, alt, className, width, height, ...props }) => {
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current) {
      lazyLoad(imgRef.current, {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      });
    }
  }, []);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

export default LazyImage; 