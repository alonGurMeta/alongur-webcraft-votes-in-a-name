import { useEffect, useRef } from 'react';
import seedrandom from 'seedrandom';

const paths = {
  backHair: '/assets/face-gen/back-hair.png', faceShape: '/assets/face-gen/face-shape.png',
  frontHair: '/assets/face-gen/front-hair.png', face: '/assets/face-gen/face.png',
  minor: '/assets/face-gen/minor.png', major: '/assets/face-gen/major.png',
};
const featureOrder = ['backHair', 'faceShape', 'major', 'frontHair', 'face', 'minor'];
const weights = { faceShape: 0.7, backHair: 0.15, frontHair: 0.05, face: 0, minor: 0.1, major: 0 };
const counts = { backHair: 4, faceShape: 3, frontHair: 3, face: 3, minor: 1, major: 1 };
const spriteSize = 1080;
const padding = 5;

const loadImage = (src) => new Promise((resolve) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.src = src;
});

function featureIndex(feature, seed, metrics) {
  const similarity = metrics.biSim * 0.7 + metrics.dice * 0.25 + metrics.jaroWinkler * 0.05;
  const count = counts[feature];
  if (metrics.average < 0.35 || similarity < 0.35) return (seed + Math.floor(count / 2)) % count;
  const adjusted = similarity ** 2;
  const maximum = adjusted > 0.7 ? Math.max(1, Math.floor(2 * (1 - adjusted))) : Math.max(1, Math.floor(1 / Math.max(adjusted, 0.01)));
  const random = seedrandom(`${seed}-${weights[feature]}`);
  return (seed + Math.floor(random() * maximum)) % count;
}

export function FaceCanvas({ seed, metrics, size = 86 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(featureOrder.map((feature) => loadImage(paths[feature]))).then((images) => {
      if (cancelled || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = size * ratio;
      canvas.height = size * ratio;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      const context = canvas.getContext('2d');
      context.scale(ratio, ratio);
      context.clearRect(0, 0, size, size);
      const scratch = document.createElement('canvas');
      scratch.width = spriteSize;
      scratch.height = spriteSize;
      const scratchContext = scratch.getContext('2d');
      featureOrder.forEach((feature, imageIndex) => {
        const index = featureIndex(feature, seed, metrics);
        scratchContext.clearRect(0, 0, spriteSize, spriteSize);
        scratchContext.drawImage(images[imageIndex], index * (spriteSize + padding * 2) + padding, padding, spriteSize, spriteSize, 0, 0, spriteSize, spriteSize);
        context.drawImage(scratch, 0, 0, spriteSize, spriteSize, 0, 0, size, size);
      });
    });
    return () => { cancelled = true; };
  }, [metrics, seed, size]);

  return <canvas className="face-canvas" ref={canvasRef} aria-hidden="true" />;
}
