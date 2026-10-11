import { useEffect, useRef } from 'react';
import spriteData from '../reference-data/chandu-sprites.json';
import { createShuffleOrder } from '../chanduLayout';

const cardCount = 12;
const columns = 4;
const rows = 3;

export function ChanduCanvas({ step }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const image = new Image();
    let frameId;
    let start = performance.now();
    let positions = [];
    let shuffleRounds = [];

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const columnGap = Math.min(width * 0.06, 60);
      const rowGap = Math.min(height * 0.075, 70);
      const cardWidth = Math.min(
        (width - columnGap * (columns - 1)) / columns,
        (height - rowGap * (rows - 1)) / rows / 1.5,
        150,
      );
      const cardHeight = cardWidth * 1.5;
      const gridWidth = cardWidth * columns + columnGap * (columns - 1);
      const gridHeight = cardHeight * rows + rowGap * (rows - 1);
      const originX = (width - gridWidth) / 2;
      const originY = (height - gridHeight) / 2;
      const slots = Array.from({ length: cardCount }, (_, index) => ({
        x: originX + (index % columns) * (cardWidth + columnGap),
        y: originY + Math.floor(index / columns) * (cardHeight + rowGap),
        width: cardWidth,
        height: cardHeight,
      }));
      shuffleRounds = [slots];
      for (let round = 1; round <= 3; round += 1) {
        const previous = shuffleRounds[round - 1];
        const order = createShuffleOrder(round, cardCount);
        shuffleRounds.push(order.map((slotIndex) => ({ ...previous[slotIndex] })));
      }
      positions = (step >= 7 ? shuffleRounds[3] : slots).map((position) => ({ ...position }));
    };

    const drawSprite = (position, cardIndex, flip) => {
      const face = cardIndex === 0 ? 'chandu.png' : 'fake.png';
      const frame = spriteData.frames[flip > 0.5 ? 'front.png' : face].frame;
      const scaleX = Math.max(0.04, Math.abs(Math.cos(flip * Math.PI)));
      context.save();
      context.translate(position.x + position.width / 2, position.y + position.height / 2);
      context.scale(scaleX, 1);
      context.drawImage(image, frame.x, frame.y, frame.w, frame.h, -position.width / 2, -position.height / 2, position.width, position.height);
      context.restore();
    };

    const animate = (now) => {
      const elapsed = now - start;
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      if (step === 6) {
        const roundDuration = 1800;
        const round = Math.min(2, Math.floor(elapsed / roundDuration));
        const progress = Math.min(1, (elapsed % roundDuration) / 1500);
        const eased = 1 - (1 - progress) ** 3;
        positions = shuffleRounds[round].map((position, index) => ({
          ...position,
          x: position.x + (shuffleRounds[round + 1][index].x - position.x) * eased,
          y: position.y + (shuffleRounds[round + 1][index].y - position.y) * eased,
        }));
      }
      positions.forEach((position, index) => {
        const delay = index * 90;
        const progress = Math.max(0, Math.min(1, (elapsed - delay) / 650));
        const flip = step === 5 || step === 6 ? progress : step >= 7 ? 1 - progress : 0;
        drawSprite(position, index, flip);
      });
      frameId = requestAnimationFrame(animate);
    };

    image.onload = () => {
      resize();
      start = performance.now();
      frameId = requestAnimationFrame(animate);
    };
    image.src = '/assets/reference/chandhu-sprites.png';
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [step]);

  return <canvas className="chandu-canvas" ref={canvasRef} aria-hidden="true" />;
}
