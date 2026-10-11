import { useEffect, useRef, useState } from 'react';
import { ASSET_PATH, storySteps } from '../data';
import { ChanduCanvas } from './ChanduCanvas';
import { OpeningCrowdCanvas } from './OpeningCrowdCanvas';

function StoryText({ parts }) {
  return parts.map((part, index) => typeof part === 'string'
    ? part
    : <span className={part.tone} key={`${part.text}-${index}`}>{part.text}</span>);
}

export function OpeningStory() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(Number(entry.target.dataset.scene));
      });
    }, { threshold: 0.62 });
    stepRefs.current.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return <section className="scrolly" aria-label="Opening story">
    <div className="scene" aria-hidden="true">
      {storySteps.map((step, index) => step.image && <img
        className={`scene-image ${index === 0 ? 'scene-image-opening' : ''} ${active === index ? 'active' : ''}`}
        src={`${ASSET_PATH}${step.image}`}
        alt=""
        key={`${step.image}-${index}`}
      />)}
      {active >= 4 && <ChanduCanvas step={active} />}
      {active === 0 && <><img className="cloud cloud-one" src={`${ASSET_PATH}cloud-1.C1ayEgNb.webp`} alt="" /><img className="cloud cloud-two" src={`${ASSET_PATH}cloud-2.BXvvrTef.webp`} alt="" /><img className="cloud cloud-three" src={`${ASSET_PATH}cloud-3.webp`} alt="" /></>}
      {active === 0 && <OpeningCrowdCanvas layout="queue" />}
      {active === 3 && <OpeningCrowdCanvas layout="wall" />}
    </div>
    <div className="steps">
      {storySteps.map((step, index) => <article
        className={`story-step ${active === index ? 'active' : ''}`}
        data-scene={index}
        ref={(element) => { stepRefs.current[index] = element; }}
        key={index}
      ><p className={step.align === 'center' ? 'story-center' : ''}><StoryText parts={step.parts} /></p></article>)}
    </div>
  </section>;
}
