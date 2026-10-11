import { useEffect, useRef } from 'react';

const sources = Array.from({ length: 11 }, (_, index) => `/assets/crowd/${index + 1}.webp`);
const figureSize = 250;
const loadImage = (src) => new Promise((resolve) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.src = src;
});

export function ArticleCrowdCanvas({ mobileScale = .8 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    let sprites = [];
    let cancelled = false;
    const draw = () => {
      if (cancelled || sprites.length === 0) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      const context = canvas.getContext('2d');
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      const count = 200;
      const size = figureSize * (width <= 768 ? mobileScale : 1);
      for (let index = 0; index < count; index += 1) {
        const x = width * .05 + (index / (count - 1)) * width * .9 + Math.sin(index * 9.3) * 2;
        const y = height * .94 + Math.cos(index * 5.7) * 3;
        context.drawImage(sprites[index % sprites.length], x - size / 2, y - size, size, size);
      }
    };
    Promise.all(sources.map(loadImage)).then((loaded) => {
      sprites = loaded;
      draw();
    });
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [mobileScale]);

  return <canvas className="article-crowd" ref={canvasRef} aria-hidden="true" />;
}
