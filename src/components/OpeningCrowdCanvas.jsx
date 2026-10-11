import { useEffect, useRef } from 'react';
import { curveNatural, line } from 'd3';

const SPRITES = Array.from({ length: 11 }, (_, index) => `/assets/crowd/${index + 1}.webp`);
const DESKTOP_QUEUE = [[-1.2, 1], [.2, .99], [1.3, .8], [-.2, .6], [.45, .55]];
const MOBILE_QUEUE = [[.2, .9], [.2, .9], [.8, .9], [.2, .6], [.15, .45]];
const QUEUE_PEOPLE = { desktop: 220, mobile: 320 };
const ANIMATION = { duration: 600, staggerDelay: 50, groupCount: 10, elasticStrength: .7, fadeStartDelay: .1 };

const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = src;
});

const elasticOut = (t) => (
  (Math.sin((-13 * (t + 1) * Math.PI) / 2) * (2 ** (-10 * t)) + 1) * ANIMATION.elasticStrength
  + (1 - ANIMATION.elasticStrength)
);
const easeOutQuart = (x) => 1 - ((1 - x) ** 4);

const pathSampler = (points, width, height) => {
  const data = line().x((point) => point[0] * width).y((point) => point[1] * height).curve(curveNatural)(points);
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', data || '');
  const length = path.getTotalLength();
  return (progress) => path.getPointAtLength(progress * length);
};

const queuePositions = ({ count, height, images, mobile, width }) => {
  const positions = [];
  const queueCount = Math.floor(count * .95);
  const sample = pathSampler(mobile ? MOBILE_QUEUE : DESKTOP_QUEUE, width, height);
  const spacing = Math.min(width, height) * .04;
  const minimumDistanceSquared = (spacing * .8) ** 2;
  const tooClose = (x, y) => positions.slice(-10).some((position) => (
    (position.x - x) ** 2 + (position.y - y) ** 2 < minimumDistanceSquared
  ));

  for (let index = 0; index < queueCount; index += 1) {
    const progress = index / (queueCount - 1);
    const base = sample(progress);
    const next = sample(Math.min(1, progress + .01));
    const tangentX = next.x - base.x;
    const tangentY = next.y - base.y;
    const tangentLength = Math.hypot(tangentX, tangentY) || 1;
    const perpendicularX = -tangentY / tangentLength;
    const perpendicularY = tangentX / tangentLength;
    let x = base.x;
    let y = base.y;
    let attempts = 0;
    do {
      const jitter = (Math.random() - .5) * spacing * .15;
      x = base.x + perpendicularX * jitter;
      y = base.y + perpendicularY * jitter;
      attempts += 1;
    } while (tooClose(x, y) && attempts < 5);

    const perspective = .7 + .3 * (base.y / height);
    const jitter = (Math.random() - .5) * spacing * .15 * perspective;
    x += perpendicularX * jitter;
    y += perpendicularY * jitter;
    positions.push({
      x, y, targetY: y, startY: y - 100 * perspective,
      scale: perspective * (.95 + Math.random() * .1),
      sprite: images[Math.floor(Math.random() * images.length)],
      groupDelay: progress * ANIMATION.staggerDelay * ANIMATION.groupCount,
      flip: tangentX < 0,
    });
  }

  for (let index = queueCount; index < count; index += 1) {
    const x = Math.random() * width * .8 + width * .1;
    const y = Math.random() * height * .35 + height * .55;
    const perspective = .7 + .3 * (y / height);
    positions.push({
      x, y, targetY: y, startY: y - 100 * perspective,
      scale: perspective * (.95 + Math.random() * .1),
      sprite: images[Math.floor(Math.random() * images.length)],
      groupDelay: Math.random() * ANIMATION.staggerDelay * ANIMATION.groupCount,
      flip: Math.random() > .5,
    });
  }
  return positions.sort((first, second) => first.y - second.y);
};

const wallPositions = ({ count, height, images, mobile, width }) => {
  const positions = [];
  const maximumWidth = width * (mobile ? .95 : .9);
  const totalRows = mobile
    ? Math.ceil(Math.sqrt(count / (maximumWidth / height)) * 1.5)
    : Math.ceil(Math.sqrt(count / (maximumWidth / height)));
  const peoplePerRow = mobile ? Math.ceil((count / totalRows) * .8) : Math.ceil(count / totalRows);
  for (let row = 0; row < totalRows; row += 1) {
    const invertedRow = totalRows - row - 1;
    const rowScale = 1 + invertedRow * .02;
    const rowWidth = maximumWidth * (.8 + (invertedRow / totalRows) * .2);
    const rowY = height * .92 - row * 80;
    const rowCount = Math.floor(peoplePerRow * (1 + invertedRow * .1));
    const spacing = rowWidth / rowCount;
    for (let column = 0; column < rowCount && positions.length < count; column += 1) {
      const baseX = width / 2 - rowWidth / 2 + column * spacing;
      const addPerson = (x, y) => positions.push({
        x, y, targetY: y, startY: y - 200,
        scale: rowScale * (.9 + Math.random() * .2),
        sprite: images[Math.floor(Math.random() * images.length)],
        groupDelay: Math.random() * ANIMATION.staggerDelay * ANIMATION.groupCount,
        flip: false,
      });
      if (Math.random() < .3) {
        const clusterSize = 2 + Math.floor(Math.random());
        for (let cluster = 0; cluster < clusterSize && positions.length < count; cluster += 1) {
          const offset = spacing * 10;
          addPerson(baseX + (Math.random() * offset * 2 - offset), rowY + (Math.random() * offset - offset / 2));
        }
      } else {
        addPerson(baseX + (Math.random() * spacing * .5 - spacing * .25), rowY + (Math.random() * spacing * .2 - spacing * .1));
      }
    }
  }
  return positions.sort((first, second) => first.y - second.y);
};

export function OpeningCrowdCanvas({ layout }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    let cancelled = false;
    let frameId;
    let images = [];
    let positions = [];
    let context;
    let width = 0;
    let height = 0;
    let mobile = false;
    let startTime = null;

    const draw = (timestamp) => {
      if (cancelled || !context) return;
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      context.clearRect(0, 0, width, height);
      positions.forEach((position) => {
        const progress = Math.min(1, Math.max(0, elapsed - position.groupDelay) / ANIMATION.duration);
        const movement = elasticOut(progress);
        const y = position.startY + (position.targetY - position.startY) * movement;
        const opacity = progress < ANIMATION.fadeStartDelay ? 0 : easeOutQuart((progress - ANIMATION.fadeStartDelay) / (1 - ANIMATION.fadeStartDelay));
        const size = 190 * (mobile ? .5 : 1) * position.scale * (.5 + .5 * movement);
        context.save();
        context.globalAlpha = opacity;
        if (position.flip) {
          context.scale(-1, 1);
          context.drawImage(position.sprite, Math.round(-position.x - size / 2), Math.round(y - size), size, size);
        } else {
          context.drawImage(position.sprite, Math.round(position.x - size / 2), Math.round(y - size), size, size);
        }
        context.restore();
      });
      if (elapsed < ANIMATION.duration + ANIMATION.staggerDelay * ANIMATION.groupCount) frameId = requestAnimationFrame(draw);
    };

    const resize = () => {
      if (images.length === 0 || cancelled) return;
      cancelAnimationFrame(frameId);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      mobile = width <= 768;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context = canvas.getContext('2d');
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      const count = layout === 'queue'
        ? (mobile ? QUEUE_PEOPLE.mobile : QUEUE_PEOPLE.desktop)
        : (mobile ? 1860 : 1040);
      positions = layout === 'queue'
        ? queuePositions({ count, height, images, mobile, width })
        : wallPositions({ count, height, images, mobile, width });
      startTime = null;
      frameId = requestAnimationFrame(draw);
    };

    Promise.all(SPRITES.map(loadImage)).then((loaded) => { images = loaded; resize(); });
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => { cancelled = true; cancelAnimationFrame(frameId); observer.disconnect(); };
  }, [layout]);
  return <canvas className={`opening-crowd-canvas opening-crowd-${layout}`} ref={canvasRef} aria-hidden="true" />;
}
