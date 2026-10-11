import { useEffect, useRef, useState } from 'react';
import { bin, group, hierarchy, max, pack, scaleLinear, scalePoint } from 'd3';
import { comparisonRows } from '../data';
import { compareNames } from '../score';
import sampleNames from '../reference-data/sample_names.json';
import { FaceCanvas } from './FaceCanvas';
import similarityByState from '../reference-data/similarity_by_state.json';
import voteShares from '../reference-data/vote_share.json';
import nameChangePatterns from '../reference-data/name_change_patterns.json';
import stateDistribution from '../reference-data/change_patterns_state_distribution.json';

const PATTERN_COLORS = ['#422040', '#DDB967', '#BA5B38', '#639A88', '#7D8491', '#8B4B62', '#A7866A', '#4A725A'];
const PATTERN_LABELS = {
  Removed_Initials: 'Removed initials', Middle_Name_Modified: 'Middle name modified',
  First_Name_Only: 'First name only', Removal: 'Name removed',
  Both_Names_Changed: 'Both names changed', Addition: 'Name added',
  Last_Name_Only: 'Last name only', Added_Initials: 'Added initials',
};
const seededPatternRandom = (seed) => {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
};
const IDENTICAL_FACE_METRICS = { biSim: 1, dice: 1, jaroWinkler: 1, average: 1 };
const STATE_GRID = [
  ['JK', 'Jammu and Kashmir', 'Jammu_&_Kashmir', 1, 3], ['PB', 'Punjab', 'Punjab', 2, 3], ['HP', 'Himachal Pradesh', 'Himachal_Pradesh', 2, 4],
  ['HR', 'Haryana', 'Haryana', 3, 3], ['UK', 'Uttarakhand', 'Uttarakhand', 3, 4], ['AR', 'Arunachal Pradesh', 'Arunachal_Pradesh', 3, 9],
  ['RJ', 'Rajasthan', 'Rajasthan', 4, 2], ['DL', 'Delhi', 'Delhi', 4, 3], ['UP', 'Uttar Pradesh', 'Uttar_Pradesh', 4, 4],
  ['BR', 'Bihar', 'Bihar', 4, 5], ['SK', 'Sikkim', 'Sikkim', 4, 7], ['AS', 'Assam', 'Assam', 4, 8], ['NL', 'Nagaland', 'Nagaland', 4, 9],
  ['GJ', 'Gujarat', 'Gujarat', 5, 1], ['MP', 'Madhya Pradesh', 'Madhya_Pradesh', 5, 3], ['JH', 'Jharkhand', 'Jharkhand', 5, 5],
  ['WB', 'West Bengal', 'West_Bengal', 5, 6], ['ML', 'Meghalaya', 'Meghalaya', 5, 8], ['MN', 'Manipur', 'Manipur', 5, 9],
  ['MH', 'Maharashtra', 'Maharashtra', 6, 2], ['TS', 'Telangana', 'Telangana', 6, 3], ['CG', 'Chhattisgarh', 'Chhattisgarh', 6, 4],
  ['OD', 'Odisha', 'Odisha', 6, 5], ['TR', 'Tripura', 'Tripura', 6, 8], ['MZ', 'Mizoram', 'Mizoram', 6, 9],
  ['GA', 'Goa', 'Goa', 7, 2], ['KA', 'Karnataka', 'Karnataka', 7, 3], ['AP', 'Andhra Pradesh', 'Andhra_Pradesh', 7, 4],
  ['KL', 'Kerala', 'Kerala', 8, 3], ['TN', 'Tamil Nadu', 'Tamil_Nadu', 8, 4],
];

function IndiaGrid({ selected, onSelect }) {
  const stateCounts = Object.fromEntries(stateDistribution.map((row) => [row.State_Name, row.n]));
  const maximum = max(stateDistribution, (row) => row.n);
  const selectedEntry = STATE_GRID.find((state) => state[2] === selected);
  const choose = (state) => onSelect(state[2]);
  return <svg className="india-grid" viewBox="0 0 335 298" role="group" aria-label="Select a state">
    {STATE_GRID.map((state) => {
      const [code, name, fullName, row, column] = state;
      const barHeight = ((stateCounts[fullName] || 0) / maximum) * 35;
      return <g className={selected === fullName ? 'selected' : ''} transform={`translate(${(column - 1) * 37} ${(row - 1) * 37})`} role="button" tabIndex="0" aria-label={name} onClick={() => choose(state)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') choose(state); }} key={code}>
        <rect width="35" height="35" rx="4" fill="#f0f0f0" stroke="white" strokeWidth="2" />
        <rect y={35 - barHeight} width="35" height={barHeight} rx="2" fill="#b44e2f" opacity=".8" />
        <text x="17.5" y="18" textAnchor="middle" dominantBaseline="middle">{code}</text>
      </g>;
    })}
    <text className="state-grid-label" x="221" y="98" textAnchor="middle">{selectedEntry?.[1]}</text>
  </svg>;
}

export function CandidatePools() {
  const left = [[176, 54, 22], [146, 89, 22], [188, 94, 22], [158, 130, 22], [172, 172, 22]];
  const right = [[397, 39, 12], [429, 45, 12], [384, 72, 12], [416, 77, 15], [402, 105, 13], [433, 108, 18], [384, 129, 11], [415, 137, 16], [399, 163, 14], [432, 166, 15], [414, 194, 14], [422, 224, 14]];
  return <figure className="pool-viz reveal" aria-label="Candidates divided into two analysis pools">
    <svg viewBox="0 0 640 350" role="img">
      <defs><pattern id="pool-lines" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 1.5H3" stroke="#d26d55" strokeWidth="1" /></pattern></defs>
      {left.map(([cx, cy, r], index) => <circle className="pool-dot pool-dot-solid" cx={cx} cy={cy} r={r} key={`left-${index}`} />)}
      {right.map(([cx, cy, r], index) => <circle className="pool-dot pool-dot-lined" cx={cx} cy={cy} r={r} key={`right-${index}`} />)}
      <text x="172" y="285" textAnchor="middle"><tspan x="172">National or state party</tspan><tspan x="172" dy="19">candidates</tspan></text>
      <text x="416" y="270" textAnchor="middle"><tspan x="416">Independent, candidates</tspan><tspan x="416" dy="19">with &lt;5% vote share or</tspan><tspan x="416" dy="19">first time running</tspan></text>
    </svg>
  </figure>;
}

export function ScoreTable() {
  const scrollRef = useRef(null);
  useEffect(() => {
    if (window.innerWidth <= 768 && scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, []);
  return <section className="score-table reveal" aria-label="Name similarity score comparison">
    <h3>Differences in scoring</h3>
    <div className="score-scroll" ref={scrollRef}>
    <div className="score-row score-head"><span>State</span><span>Reference name</span><span>Similar name</span><span>JW¹</span><span>BI-SIM¹</span><span>Dice¹</span></div>
    {comparisonRows.map((row) => <div className="score-row" key={`${row[0]}-${row[1]}`}>
      {row.slice(0, 3).map((value) => <span className="score-name" key={value}>{value}</span>)}
      {row.slice(3).map((score) => <span className="score-cell" style={{ '--heat': `${Math.max(0, (score - 64) / 36)}` }} key={score}>{score.toFixed(1)}%</span>)}
    </div>)}</div>
    <p className="table-note">¹ JW = Jaro-Winkler, BI-SIM = BI-SIM (Kondrak, 2003), Dice = Dice Coefficient</p>
  </section>;
}

export function AlgorithmBarcode() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const algorithms = ['Bi-gram Similarity', 'Dice Coefficient', 'Jaro-Winkler'];
  const [visibleAlgorithms, setVisibleAlgorithms] = useState(algorithms);
  const [tooltip, setTooltip] = useState(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const draw = () => {
      const width = canvas.clientWidth;
      const mobile = width <= 700;
      const height = mobile ? 900 : 600;
      const left = mobile ? 5 : 140;
      const right = mobile ? 5 : 25;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.height = `${height}px`;
      const context = canvas.getContext('2d');
      context.scale(ratio, ratio);
      context.clearRect(0, 0, width, height);
      const states = [...new Set(similarityByState.map((row) => row.State_Name))];
      const y = scalePoint(states, [50, height - 22]).padding(0.25);
      const x = scaleLinear([0.5, 1], [left, width - right]);
      const colors = { 'Bi-gram Similarity': '#809848', 'Dice Coefficient': '#9893DA', 'Jaro-Winkler': '#fdc086' };
      context.font = '11px Asap';
      context.globalAlpha = 1;
      context.strokeStyle = '#d9d6cf';
      context.beginPath();
      context.moveTo(left, 50);
      context.lineTo(width - right, 50);
      context.stroke();
      [0.5, 0.6, 0.7, 0.8, 0.9, 1].forEach((tick) => {
        const tickX = x(tick);
        context.beginPath();
        context.moveTo(tickX, 50);
        context.lineTo(tickX, 40);
        context.stroke();
        context.fillStyle = '#676258';
        context.textAlign = 'center';
        context.fillText(tick.toFixed(1), tickX, 31);
      });
      context.font = '700 10px Asap';
      context.textAlign = 'left';
      context.fillText('← LESS SIMILARITY', left, 12);
      context.textAlign = 'right';
      context.fillText('MORE SIMILARITY →', width - right, 12);
      context.font = '11px Asap';
      states.forEach((state) => {
        context.globalAlpha = 1;
        context.fillStyle = '#676258';
        context.textAlign = mobile ? 'center' : 'right';
        context.fillText(state.replaceAll('_', ' '), mobile ? width / 2 : left - 10, y(state) + (mobile ? 13 : 4));
        similarityByState.filter((row) => row.State_Name === state && visibleAlgorithms.includes(row.algorithm)).forEach((row) => {
          context.strokeStyle = colors[row.algorithm] || '#555';
          context.lineWidth = 1;
          context.globalAlpha = .72;
          row.points.forEach((point) => {
            context.beginPath();
            context.moveTo(x(point.score), y(state) - (mobile ? 5 : 10));
            context.lineTo(x(point.score), y(state) + (mobile ? 5 : 10));
            context.stroke();
          });
        });
      });
      context.globalAlpha = 1;
      chartRef.current = { states, y, x };
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [visibleAlgorithms]);
  const toggleAlgorithm = (algorithm) => setVisibleAlgorithms((current) => current.length === 1 && current[0] === algorithm ? algorithms : [algorithm]);
  const inspectPoint = (event) => {
    if (!chartRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const { states, y, x } = chartRef.current;
    const state = states.reduce((closest, candidate) => Math.abs(y(candidate) - mouseY) < Math.abs(y(closest) - mouseY) ? candidate : closest, states[0]);
    if (Math.abs(y(state) - mouseY) > 15) { setTooltip(null); return; }
    let nearest = null;
    similarityByState.filter((row) => row.State_Name === state && visibleAlgorithms.includes(row.algorithm)).forEach((row) => row.points.forEach((point) => {
      const distance = Math.abs(x(point.score) - mouseX);
      if (distance < 10 && (!nearest || distance < nearest.distance)) nearest = { ...point, distance };
    }));
    if (!nearest) { setTooltip(null); return; }
    const scores = similarityByState.filter((row) => row.State_Name === state).map((row) => ({
      algorithm: row.algorithm,
      score: row.points.find((point) => point.ref === nearest.ref && point.dummy === nearest.dummy)?.score,
    })).filter((row) => row.score !== undefined);
    setTooltip({ state: state.replaceAll('_', ' '), names: [nearest.ref, nearest.dummy], parties: [nearest.refParty, nearest.dummyParty], scores, x: mouseX, y: mouseY });
  };
  return <section className="barcode reveal"><div className="barcode-legend">{algorithms.map((algorithm) => <button className={visibleAlgorithms.includes(algorithm) ? 'active' : ''} type="button" onClick={() => toggleAlgorithm(algorithm)} key={algorithm}>{algorithm === 'Bi-gram Similarity' ? 'BI-SIM' : algorithm}</button>)}</div>{tooltip && <div className="chart-tooltip barcode-tooltip" style={{ left: tooltip.x, top: tooltip.y }}><h3>{tooltip.state}</h3><p><strong>{tooltip.names[0]}</strong> <small>({tooltip.parties[0]})</small><br /><span>compared to</span><br /><strong>{tooltip.names[1]}</strong> <small>({tooltip.parties[1]})</small></p>{tooltip.scores.map((score) => <div className="tooltip-score" key={score.algorithm}><b>{score.algorithm === 'Bi-gram Similarity' ? 'BI-SIM' : score.algorithm}</b><strong>{score.score.toFixed(3)}</strong></div>)}</div>}<canvas ref={canvasRef} onMouseMove={inspectPoint} onMouseLeave={() => setTooltip(null)} aria-label="Barcode plot showing name similarity scores by state" /></section>;
}

export function NameLab() {
  const [first, setFirst] = useState('Raghubir Singh');
  const [second, setSecond] = useState('Raghvir Singh');
  const result = compareNames(first, second);
  const faceSize = window.innerWidth < 600 ? 38 : 100;
  const metrics = [['BI-SIM', result.biSim], ['Dice', result.dice], ['JW', result.jaroWinkler], ['Total Similarity', result.average]];
  const firstSeed = [...first].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const secondSeed = result.average < .3 ? firstSeed + 999 : firstSeed;
  const chooseSample = () => {
    const pair = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    setFirst(pair.Ref_Candidate);
    setSecond(pair.Dummy_Candidate);
  };

  return <section className="lab reveal">
    <div className="lab-heading"><div><h4>Enter any two names</h4><p>...and see what your face cards look like</p></div>
    <button className="sample-button" type="button" onClick={chooseSample}>Or choose a random pair from an election ↻</button></div>
    <div className="inputs">
      <label><span className="sr-only">First name</span><input value={first} onChange={(event) => setFirst(event.target.value)} placeholder="Type a name..." autoComplete="off" /></label>
      <span>compared to</span>
      <label><span className="sr-only">Second name</span><input value={second} onChange={(event) => setSecond(event.target.value)} placeholder="Type another name..." autoComplete="off" /></label>
    </div>
    <div className="evm-shell" aria-label="Generated candidate portraits">
      <img src="/assets/evm.D55slFqv.png" alt="Electronic voting machine" />
      <div className="evm-faces"><div><FaceCanvas size={faceSize} seed={firstSeed} metrics={IDENTICAL_FACE_METRICS} /><strong>{first || '—'}</strong></div><div><FaceCanvas size={faceSize} seed={secondSeed} metrics={result} /><strong>{second || '—'}</strong></div></div>
    </div>
    <div className="metrics">{metrics.map(([label, score]) => <span key={label}>{label}<b>{(score * 100).toFixed(1)}%</b></span>)}</div>
  </section>;
}

export function PatternExplorer() {
  const [selected, setSelected] = useState('Punjab');
  const [tooltip, setTooltip] = useState(null);
  const canvasRef = useRef(null);
  const hitPointsRef = useRef([]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const draw = () => {
      const width = canvas.clientWidth;
      const height = width;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.height = `${height}px`;
      const context = canvas.getContext('2d');
      context.scale(ratio, ratio);
      context.clearRect(0, 0, width, height);
      const grouped = [...group(nameChangePatterns, (row) => row.change_pattern)]
        .map(([name, values]) => ({ name, values, value: values.length }));
      const root = hierarchy({ children: grouped }).sum((node) => node.value || 0);
      pack().size([width - 20, height - 20]).padding(8)(root);
      const hitPoints = [];
      root.leaves().forEach((leaf, patternIndex) => {
        const rows = leaf.data.values;
        const dotRadius = width < 768 ? 2.5 : 3.5;
        rows.forEach((row, index) => {
          const angle = seededPatternRandom(421221 + index) * Math.PI * 2;
          const distance = seededPatternRandom(422221 + index) * Math.max(0, leaf.r * .9);
          const pointX = leaf.x + 10 + Math.cos(angle) * distance;
          const pointY = leaf.y + 10 + Math.sin(angle) * distance;
          context.beginPath();
          context.arc(pointX, pointY, dotRadius, 0, Math.PI * 2);
          context.fillStyle = PATTERN_COLORS[patternIndex % PATTERN_COLORS.length];
          context.globalAlpha = row.State_Name === selected ? .6 : .048;
          context.fill();
          if (row.State_Name === selected) {
            context.globalAlpha = 1;
            context.strokeStyle = PATTERN_COLORS[patternIndex % PATTERN_COLORS.length];
            context.lineWidth = 1;
            context.stroke();
            hitPoints.push({ x: pointX, y: pointY, row, color: PATTERN_COLORS[patternIndex % PATTERN_COLORS.length] });
          }
        });
        context.globalAlpha = 1;
        const angleToCenter = Math.atan2(leaf.y - height / 2, leaf.x - width / 2);
        const labelX = leaf.x + 10 + Math.cos(angleToCenter) * leaf.r;
        const labelY = leaf.y + 10 + Math.sin(angleToCenter) * leaf.r;
        const label = PATTERN_LABELS[leaf.data.name] || leaf.data.name;
        const labelSize = width < 768 ? 12 : 16;
        const countSize = width < 768 ? 10 : 14;
        context.font = `700 ${labelSize}px Asap, sans-serif`;
        const backgroundWidth = Math.max(context.measureText(label).width, context.measureText(`(${rows.length})`).width) + 16;
        context.fillStyle = 'rgb(255 255 255 / .9)';
        context.beginPath();
        context.roundRect(labelX - backgroundWidth / 2, labelY - 16, backgroundWidth, 28, 4);
        context.fill();
        context.fillStyle = '#1a1a1a';
        context.textAlign = 'center';
        context.fillText(label, labelX, labelY - 7);
        context.fillStyle = '#666';
        context.font = `${countSize}px Asap, sans-serif`;
        context.fillText(`(${rows.length})`, labelX, labelY + 13);
      });
      hitPointsRef.current = hitPoints;
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [selected]);
  const inspectPattern = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let nearest = null;
    hitPointsRef.current.forEach((point) => {
      const distance = Math.hypot(point.x - x, point.y - y);
      if (distance < 9 && (!nearest || distance < nearest.distance)) nearest = { ...point, distance };
    });
    setTooltip(nearest ? { ...nearest, x, y } : null);
  };
  return <section className="pattern-explorer reveal">
    <div className="pattern-canvas-wrap"><div className="mobile-state-grid"><IndiaGrid selected={selected} onSelect={setSelected} /></div>{tooltip && <div className="chart-tooltip pattern-tooltip" style={{ left: tooltip.x, top: tooltip.y }}><span className="pattern-label" style={{ background: tooltip.color }}>{PATTERN_LABELS[tooltip.row.change_pattern] || tooltip.row.change_pattern}</span><h3>{tooltip.row.State_Name.replaceAll('_', ' ')}</h3><p><strong>{tooltip.row.Ref_Candidate}</strong><br /><span>compared to</span><br /><strong>{tooltip.row.Dummy_Candidate}</strong></p><small>Similarity</small><b className="pattern-similarity">{tooltip.row.Weighted_Similarity.toFixed(3)}</b></div>}<canvas ref={canvasRef} onMouseMove={inspectPattern} onMouseLeave={() => setTooltip(null)} aria-label={`Name change patterns, highlighting ${selected.replaceAll('_', ' ')}`} /><div className="desktop-state-grid"><IndiaGrid selected={selected} onSelect={setSelected} /></div></div>
    <p className="pattern-caption">Each dot is one candidate pair. Showing <strong>{nameChangePatterns.filter((row) => row.State_Name === selected).length}</strong> pairs from {selected.replaceAll('_', ' ')} in full color.</p>
  </section>;
}

export function MarginHistogram() {
  const width = 640;
  const height = 200;
  const margin = { top: 23, right: 20, bottom: 40, left: 25 };
  const buckets = bin().thresholds(4)(voteShares);
  const x = scaleLinear([0, max(buckets, (bucket) => bucket.x1)], [margin.left, width - margin.right]);
  const y = scaleLinear([0, max(buckets, (bucket) => bucket.length)], [height - margin.bottom, margin.top]);
  const yTicks = y.ticks(5);
  return <section className="histogram reveal" aria-label="Distribution of election margins">
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Histogram of namesake candidate vote shares">
      {buckets.map((bucket, index) => <rect key={index} x={x(bucket.x0)} y={y(bucket.length)} width={Math.max(0, x(bucket.x1) - x(bucket.x0))} height={height - margin.bottom - y(bucket.length)} fill="#b44e2f" />)}
      {[0, .05, .1, .15, .2].map((tick) => <g transform={`translate(${x(tick)} ${height - margin.bottom})`} key={tick}><line y2="5" stroke="#211f17" /><text y="20" textAnchor="middle">{(tick * 100).toFixed(1)}</text></g>)}
      {yTicks.map((tick, index) => <g transform={`translate(${margin.left} ${y(tick)})`} key={tick}><line x2="-5" stroke="#211f17" /><text x="-9" dy=".32em" textAnchor="end">{index === yTicks.length - 1 ? `${(tick / 1000).toFixed(0)}K` : tick / 1000}</text></g>)}
      <text x={width / 2} y={height - 5} textAnchor="middle">Vote Share (%)</text>
      <text x={x(buckets[0].x1 / 2)} y={margin.top + 20} textAnchor="middle" fill="white" fontWeight="700"><tspan x={x(buckets[0].x1 / 2)}>Namesake</tspan><tspan x={x(buckets[0].x1 / 2)} dy="16">candidates</tspan></text>
    </svg>
  </section>;
}
