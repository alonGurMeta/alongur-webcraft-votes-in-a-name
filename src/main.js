import './style.css';

const A = '/assets/';

const storySteps = [
  ['outside-1.CR7Dnvz8.webp', 'We begin in Wayanad, Kerala. It is voting day.'],
  ['school-1.CftLUXgV.webp', 'You step into the voting booth. The electronic voting machine hums in the converted classroom as the fan whirs overhead.'],
  ['rahul-1.G6UMmSJ3.webp', 'There’s Rahul Gandhi that you recognize, but below sits another — Raghul Gandhi — with a different symbol.'],
  ['rahul-1.G6UMmSJ3.webp', 'In that election, 2,196 voters chose Rahul Gandhi KE. Whether these votes came from confusion or conviction is unclear.'],
];

const matches = [
  ['S. Veeramani', 'S. V. Ramani', 91],
  ['Raghubir Singh', 'Raghvir Singh', 94],
  ['H. D. Kumaraswamy', 'D. Kumaraswamy', 86],
  ['Virender Singh', 'Virandar Singh', 93],
];

const elections = [
  ['2002', 'UK · Champawat', 'Hayat Singh Mahra', 'Madan Singh Mahrana', '637', '68.4%'],
  ['2004', 'KA · Hosakote', 'Bachegowda B N', 'Bachegowda A N', '835', '87.3%'],
  ['2004', 'KL · Alleppey', 'V M Sudheeran', 'V S Sudheeran', '1,009', '85.7%'],
  ['2005', 'BR · Bhore', 'Anil Kumar', 'Anil Kumar Baitha', '1,218', '70.1%'],
  ['2019', 'JH · Khunti', 'Kali Charan Munda', 'Masih Charan Munda', '1,445', '75.3%'],
];

document.querySelector('#app').innerHTML = `
  <main>
    <section class="scrolly" aria-label="Opening story">
      <div class="scene" aria-hidden="true">
        <img class="scene-image" src="${A}${storySteps[0][0]}" alt="" />
        <img class="cloud cloud-one" src="${A}cloud-1.C1ayEgNb.webp" alt="" />
        <img class="cloud cloud-two" src="${A}cloud-2.BXvvrTef.webp" alt="" />
        <div class="crowd">${Array.from({length: 33}, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>
      </div>
      <div class="steps">
        ${storySteps.map((step, index) => `<article class="story-step" data-scene="${index}"><p>${step[1]}</p></article>`).join('')}
      </div>
      <span class="scroll-cue">Scroll to enter the story <b>↓</b></span>
    </section>

    <article class="article">
      <header class="masthead">
        <img src="${A}logo.CsOc2COw.png" alt="Diagram Chasing" class="logo" />
        <span class="presents">presents</span>
        <div class="title-frame">
          <div>
            <span class="hindi">✦ नाम तो सुना ही होगा ✦</span>
            <h1>Votes in a name</h1>
            <p>Namesakes in Indian Elections and How to Find Them</p>
          </div>
        </div>
        <p class="byline">By <strong>Aman Bhargava</strong><br />Art by <strong>Reechik Banerjee</strong></p>
      </header>

      <section class="prose intro">
        <p>India never really stops voting. At any given time, you’ll probably find some state gearing up for polls, managing an electorate that spans from city professionals to farmers across 28 states and dozens of languages.</p>
        <p>To handle this diversity, the system relies heavily on symbols — INC’s hand, BJP’s lotus, AAP’s broom. These visual markers help voters navigate ballots that appear in multiple languages.</p>
        <p>But here’s where it gets interesting. While the system carefully prevents any confusion with party symbols, names are something of a blind spot. Almost nothing stops multiple candidates from having nearly identical names.</p>
      </section>

      <figure class="wide-art reveal"><img src="${A}posters.BxzP8ep4.png" alt="A hand-drawn wall of election posters bearing similar candidate names" /></figure>

      <section class="prose">
        <p>That list is quite long. Alimineti Uma Madhava Reddy faced Alimineti Madhava Reddy; Raghubir Singh appeared on the same ballot as Raghvir Singh; Virender Singh faced Virandar Singh. You get the idea.</p>
        <div class="ticker" aria-label="Examples of similar names">${matches.map(m => `<span>${m[0]} <b>↔</b> ${m[1]}</span>`).join('')}</div>
        <h2>Name games</h2>
        <p>The most interesting cases lie in smaller constituencies and lesser-known candidates, where similar names can have a greater impact.</p>
        <p>The numbers are big. Between 1960 and 2023, across general and state elections, we’re examining approximately <button class="number-toggle" type="button" aria-live="polite">3.5 lakh ⇄</button> individual names.</p>
      </section>

      <section class="lab reveal">
        <p class="eyebrow">A very small experiment</p>
        <h2>Enter any two names</h2>
        <p>See how alike they look using a simplified letter-pair score.</p>
        <div class="inputs">
          <label>First name<input id="name-a" value="Raghubir Singh" /></label>
          <span>vs.</span>
          <label>Second name<input id="name-b" value="Raghvir Singh" /></label>
        </div>
        <div class="score-ring"><strong id="score">94%</strong><span>similar</span></div>
        <div class="letter-track" id="letter-track"></div>
      </section>

      <section class="prose">
        <h2>Differences in scoring</h2>
        <p>Name similarity can be measured in two ways: look-alike and sound-alike comparisons. Familiar algorithms can miss structural patterns or stumble when names use different arrangements.</p>
        <div class="method-grid">
          ${['Levenshtein','Dice','Jaro–Winkler','BI-SIM'].map((name, i) => `<article><span>0${i+1}</span><h3>${name}</h3><p>${['character edits','letter pairs','ordered similarity','sequential pairs'][i]}</p></article>`).join('')}
        </div>
        <h2>We’re not that different, you and I</h2>
        <p>A high similarity score alone cannot prove intent. But it can help us find the ballots worth looking at more closely.</p>
      </section>

      <figure class="break-art reveal"><img src="${A}break-1.DJxeRFio.png" alt="Hand-drawn people peeking into the data" /></figure>

      <section class="impact">
        <div class="impact-copy"><p class="eyebrow">A counterfactual</p><h2>Does it ever make a difference?</h2><p>We simulated what might happen if the votes cast for a namesake returned to the leading candidate.</p></div>
        <div class="impact-number"><strong>28</strong><span>close elections<br />worth a second look</span></div>
      </section>

      <section class="table-section">
        <div class="prose"><h2>Elections that could have flipped</h2><p>Examples where the simulation returned a 50% or greater probability of a changed result.</p></div>
        <div class="table-wrap"><table><thead><tr><th>Year</th><th>Constituency</th><th>Candidate</th><th>Margin</th><th>Namesake</th><th>Chance</th></tr></thead><tbody>
          ${elections.map(row => `<tr>${row.map((cell, i) => `<td${i===3 ? ' class="margin"' : ''}>${cell}</td>`).join('')}</tr>`).join('')}
        </tbody></table></div>
      </section>

      <footer class="prose footer">
        <p>Some of these are incredibly close margins. To repeat what we said in the beginning, it is futile to prove, only statistically, that such examples are intentional rather than coincidental. At least we know something about how to look for them now.</p>
        <hr />
        <h2>Sources and notes</h2>
        <p>The election candidate data comes from the Trivedi Centre for Political Data. The analysis uses Levenshtein, Dice, Jaro–Winkler and BI-SIM comparisons.</p>
        <img src="${A}a-win.rNYIlb2F.webp" alt="This project won the 2024 Pudding Cup" class="award" />
        <span class="presents">Read more at</span><img src="${A}logo.CsOc2COw.png" alt="Diagram Chasing" class="logo bottom-logo" />
      </footer>
    </article>
  </main>`;

const sceneImage = document.querySelector('.scene-image');
const storyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.story-step').forEach(step => step.classList.remove('active'));
    entry.target.classList.add('active');
    sceneImage.classList.add('changing');
    window.setTimeout(() => {
      sceneImage.src = `${A}${storySteps[Number(entry.target.dataset.scene)][0]}`;
      sceneImage.classList.remove('changing');
    }, 180);
  });
}, { threshold: .65 });
document.querySelectorAll('.story-step').forEach(step => storyObserver.observe(step));

const revealObserver = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)), { threshold: .18 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const toggle = document.querySelector('.number-toggle');
let indian = true;
toggle.addEventListener('click', () => { indian = !indian; toggle.textContent = indian ? '3.5 lakh ⇄' : '350,000 ⇄'; });

function bigrams(value) {
  const clean = value.toLowerCase().replace(/[^a-z]/g, '');
  return Array.from({length: Math.max(0, clean.length - 1)}, (_, i) => clean.slice(i, i + 2));
}
function updateScore() {
  const a = bigrams(document.querySelector('#name-a').value);
  const b = bigrams(document.querySelector('#name-b').value);
  const pool = [...b]; let hits = 0;
  a.forEach(pair => { const i = pool.indexOf(pair); if (i >= 0) { hits++; pool.splice(i, 1); } });
  const score = a.length + b.length ? Math.round((2 * hits / (a.length + b.length)) * 100) : 0;
  document.querySelector('#score').textContent = `${score}%`;
  document.querySelector('.score-ring').style.setProperty('--score', `${score * 3.6}deg`);
  document.querySelector('#letter-track').innerHTML = a.map(pair => `<i class="${b.includes(pair) ? 'match' : ''}">${pair}</i>`).join('');
}
document.querySelectorAll('.inputs input').forEach(input => input.addEventListener('input', updateScore));
updateScore();
