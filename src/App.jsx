import { useEffect, useRef, useState } from 'react';
import { ASSET_PATH } from './data';
import criticalCases from './reference-data/critical_cases.json';
import bibliography from './reference-data/bibliography.json';
import { OpeningStory } from './components/OpeningStory';
import { AlgorithmBarcode, CandidatePools, MarginHistogram, NameLab, PatternExplorer, ScoreTable } from './components/Visualizations';
import { FaceCanvas } from './components/FaceCanvas';
import { ArticleCrowdCanvas } from './components/ArticleCrowdCanvas';

const STATE_CODES = { Andhra_Pradesh: 'AP', Bihar: 'BR', Jharkhand: 'JH', Karnataka: 'KA', Kerala: 'KL', Madhya_Pradesh: 'MP', Maharashtra: 'MH', Punjab: 'PB', Tamil_Nadu: 'TN', Uttar_Pradesh: 'UP', Uttarakhand: 'UK' };
const IDENTICAL_METRICS = { biSim: 1, dice: 1, jaroWinkler: 1, average: 1 };
const titleCase = (value) => value.toLowerCase().replace(/\b\w/g, (character) => character.toUpperCase());
const nameSeed = (name) => [...name].reduce((sum, character) => sum + character.charCodeAt(0), 0);

function Masthead() {
  return <header className="masthead">
    <a href="https://diagramchasing.fun" target="_blank" rel="noreferrer"><img src={`${ASSET_PATH}logo.CsOc2COw.png`} alt="Diagram Chasing" className="logo" /></a>
    <span className="presents">presents</span>
    <div className="title-frame"><div>
      <span className="hindi">✦ नाम तो सुना ही होगा ✦</span>
      <h1>Votes in a name</h1>
      <p>Namesakes in Indian Elections and How to Find Them</p>
    </div></div>
    <p className="byline">By <a href="https://diagramchasing.fun/authors/aman" target="_blank" rel="noreferrer">Aman Bhargava</a><br />Art by <a href="https://diagramchasing.fun/authors/reechik" target="_blank" rel="noreferrer">Reechik Banerjee</a></p>
  </header>;
}

function ElectionTable() {
  const scrollRef = useRef(null);
  const sortedCases = [...criticalCases].sort((first, second) => first.Original_Margin - second.Original_Margin);
  useEffect(() => {
    if (window.innerWidth <= 768 && scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, []);
  return <section className="table-section">
    <header className="critical-table-heading"><h2>Elections that could have flipped</h2><p>Instances with similarly-named candidates and close margins</p></header>
    <div className="table-wrap" ref={scrollRef}><table><thead><tr><th>Year</th><th>Election <small>(State/Constituency)</small></th><th className="align-right">Candidate</th><th>Election<br />margin</th><th>Namesake</th><th>Similarity</th></tr></thead>
      <tbody>{sortedCases.map((row, index) => {
        const firstSeed = nameSeed(row.Ref_Candidate);
        const similarityMetrics = { biSim: row.Similarity, dice: row.Similarity, jaroWinkler: row.Similarity, average: row.Similarity };
        const heat = Math.min(1, row.Original_Margin / 1000);
        return <tr key={`${row.Year}-${row.Constituency_Name}-${index}`}>
        <td>{row.Year}</td><td><span className="state-code">{STATE_CODES[row.State_Name] || row.State_Name.slice(0, 2).toUpperCase()}</span> {titleCase(row.Constituency_Name)}</td>
        <td><div className="candidate-cell candidate-reference"><span><strong>{titleCase(row.Ref_Candidate)}</strong><small>{row.Ref_Votes.toLocaleString()} votes</small></span><FaceCanvas size={40} seed={firstSeed} metrics={IDENTICAL_METRICS} /></div></td>
        <td className="margin" style={{ '--margin-heat': heat, color: heat > .55 ? '#fff' : '#000' }}>{row.Original_Margin.toLocaleString()}</td>
        <td><div className="candidate-cell"><FaceCanvas size={40} seed={firstSeed} metrics={similarityMetrics} /><span><strong>{titleCase(row.Dummy_Candidate)}</strong><small>{row.Dummy_Votes.toLocaleString()} votes</small></span></div></td>
        <td className="similarity">{(row.Similarity * 100).toFixed(1)}%</td>
      </tr>;
      })}</tbody>
    </table></div>
    <p className="table-footnote">Only state assembly elections are considered.<br />¹ Examples where the simulation returned a 50% or greater probability of the candidate winning.</p>
  </section>;
}

function CrowdBand({ mobileScale = .8 }) {
  return <ArticleCrowdCanvas mobileScale={mobileScale} />;
}

function References() {
  const entries = bibliography.map((entry) => ({
    id: entry.id,
    authors: entry.author?.map((author) => `${author.given} ${author.family}`) || [],
    year: entry.issued?.['date-parts']?.[0]?.[0] || null,
    title: entry.title || '',
    publication: entry['container-title'] || entry.publisher || '',
    url: entry.DOI ? `https://doi.org/${entry.DOI}` : entry.URL,
    doi: entry.DOI,
  })).sort((first, second) => (first.authors[0]?.split(' ').pop() || '').localeCompare(second.authors[0]?.split(' ').pop() || '') || String(first.year || '').localeCompare(String(second.year || '')));
  const formatAuthors = (authors) => authors.length > 2 ? `${authors[0]} et al.` : authors.join(' and ');
  return <section className="bibliography"><h2>References</h2>{entries.map((entry) => <p className="reference-item" id={entry.id} key={entry.id}>
    {entry.authors.length > 0 && <><strong>{formatAuthors(entry.authors)}</strong>{' '}</>}
    {entry.year && <>({entry.year}) </>}{entry.title}. {entry.publication && <em>{entry.publication}. </em>}
    {entry.url && <a href={entry.url} target="_blank" rel="noreferrer">{entry.doi ? `doi:${entry.doi}` : '[link]'}</a>}
  </p>)}</section>;
}

export default function App() {
  const [indianFormat, setIndianFormat] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle('visible', entry.isIntersecting)), { threshold: 0.18 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return <main>
    <OpeningStory />
    <article className="article">
      <Masthead />
      <section className="prose intro">
        <p>India never really stops voting. At any given time, you’ll probably find some state gearing up for polls, managing an electorate that spans from city professionals to farmers across 28 states and dozens of languages.</p>
        <p>To handle this diversity, the system relies heavily on symbols — INC’s hand, BJP’s lotus, AAP’s broom. These visual markers help voters navigate ballots that appear in multiple languages and help unify the message in a country where illiteracy is still high. While party candidates carry these established symbols, independents choose from Election Commission-approved ones, usually common objects like pressure cookers or ceiling fans.</p>
        <p>But here’s where it gets interesting. While the system carefully prevents any confusion with party symbols, names are something of a blind spot. No two parties can share a lotus or a hand, but almost nothing stops multiple candidates from having nearly identical names. Until recently, choices only appeared as names and symbols — which could also be alike — with no photographs of the people voters were choosing. That changed less than a decade ago. Even so, voters can find themselves doing double-takes at the ballot box, faced with names suspiciously similar to major contenders.</p>
      </section>
      <figure className="wide-art reveal"><img src={`${ASSET_PATH}posters.BxzP8ep4.png`} alt="A hand-drawn wall of election posters bearing similar candidate names" /></figure>
      <section className="prose">
        <p>That list is quite long. In their constituencies, names like Alimineti Uma Madhava Reddy faced Alimineti Madhava Reddy, Raghubir Singh appeared on the same ballot as Raghvir Singh, H.D. Kumaraswamy faced D. Kumaraswamy, S.V. Ramani competed with S. Veeramani, Virender Singh faced Virandar Singh, and a specific Mohan Lal Badoli faced a more ambiguous Mohan Lal… you get the idea.</p>
        <p>If you’re thinking, “Of course these are confusing to me, I just heard of them”, that’s sort of the point. Unless a candidate gets the coverage of those who dominate the headlines, part of their electorate may be just as unfamiliar when a campaign has limited reach. A namesake does not need to fool everyone — only enough voters in what might be a tight race.</p>
        <p>It is unlikely that most namesakes could sway an entire electorate, and some cases may be genuine coincidence. But it is still an interesting exercise to find where these cases appear and just how similar the names can get.</p>
        <CrowdBand />
        <h2>Name games</h2>
        <p>The Rahul and Raghul case, while high-profile, is less interesting precisely because it is so visible. Voters are unlikely to be confused by such a well-known example. Most voters first see a local candidate’s written name at the EVM, where they must match what they have heard to what they see, in whichever script or language that may be. The more interesting cases lie in smaller constituencies and lesser-known candidates, where similar names have a greater impact.</p>
        <p>The numbers are big. Between 1960 and 2023, across general and state elections, we’re examining approximately <button className="number-toggle" type="button" onClick={() => setIndianFormat((value) => !value)}>{indianFormat ? '3.5 lakh' : '350,000'} ⇄</button> individual names. After cleaning the data, candidates in each constituency were divided into two groups — those who might face a namesake and the rest, who might be a namesake.</p>
      </section>
      <CandidatePools />
      <section className="prose"><p>Name similarity can be measured through look-alike and sound-alike comparisons. For this story, the focus is visual.</p><p>The usual approaches proved inadequate on their own. Levenshtein counts edits but misses structural patterns; Dice compares letter pairs but stumbles on rearrangements; Jaro–Winkler rewards ordered similarity; and BI-SIM follows sequential pairs while maintaining word order.</p><p>Have a look at a sample of matches and how each algorithm scores them.</p></section>
      <ScoreTable />
      <section className="prose"><p>They all do well in most cases, but some eagerly create false matches while others miss obvious similarities. Instead of relying on one algorithm, the analysis used all of them with different weights and only treated a pair as similar when at least two agreed.</p><p>Let the algorithms vote too, if you will.</p><p>The process is sensitive to small threshold changes. Names vary greatly by region, so the next plot shows what each metric captures and how that changes by state.</p></section>
      <AlgorithmBarcode />
      <section className="prose"><p>The plot is fascinating because it shows the range of names that each metric manages to capture, but also how certain states have names that are easier to capture. The values are shown to three decimal places because a difference between 0.754 and 0.775 is not insignificant here.</p><p>Each algorithm brings its own bias. Jaro–Winkler tends toward optimistic matching, BI-SIM remains conservative, and Dice usually splits the difference. When two or more agree, genuine similarity is more likely than an algorithmic quirk. Given the mixed salad these ballots can be — last names before first names, fondly used terms appearing randomly, honorifics wherever they may, and transliteration chaos between scripts — this is useful.</p></section>
      <figure className="break-art reveal"><img src={`${ASSET_PATH}break-1.DJxeRFio.png`} alt="Hand-drawn people peeking into the data" /></figure>
      <section className="prose"><h2>We’re not that different, you and I</h2><p>That was a long explanation, but now we can stop looking only at numbers. Up to this point it has been numbers, numbers, numbers. Yes, 0.9 is more similar than 0.57, but it would be nicer to translate that back into a visual.</p><p>Look-alike contests are all the rage now. Want to have one of our own? <s>$50 cash prize</s>.</p><p>We’ll work our way back from the numbers and try to construct what visual similarity means for people looking at things together for the first time and trying to make sense of which is which.</p></section>
      <NameLab />
      <section className="prose"><p>Sufficiently different names are easy to spot, but when they are not, it takes a bit of work.</p><p>I still can’t imagine having to sort between around a dozen <span className="namesake">Chandu Lal Sahus</span>.</p><p>These similar candidates come in several recurring forms. You’ve already seen how algorithms differ by state, so there must be some underlying structure. Well, there is.</p><h4>So what changed between us?</h4></section>
      <PatternExplorer />
      <section className="prose"><p>Certain states are much more represented than others, but there are still interesting patterns. First names are more likely to vary a little. It’s easier to find someone with a matching last name but a different first name in the same constituency, since surnames often indicate communities that cluster geographically. In Punjab, “Singh” usually remains the same and first names differ, whereas Tamil Nadu trends the opposite way. Tamil Nadu also has the most cases where only an initial changes.</p><h2>Does it ever make a difference?</h2><p>So far, you’ve seen how namesakes can be identified. The question that kept nagging was whether there were cases where these candidates actually flipped elections.</p><p>Most namesake candidates barely register in the final tallies, typically receiving less than one percent of the vote. Can even a small vote share matter in some circumstances?</p></section>
      <MarginHistogram />
      <section className="prose"><p>For each pair of similar names, the analysis ran 400 simulations asking a simple question: what if those votes had gone elsewhere?</p><p>Different scenarios moved 20%, 40%, 60%, and other portions of a namesake candidate’s votes to the candidate with the similar name. Those scenarios were weighted using the matching scores.</p><p>Voters are complex and elections are messy, but the exercise identifies races where namesakes might have had their greatest impact. The table shows cases where the simulation favored the non-independent candidate at least half the time.</p></section>
      <ElectionTable />
      <footer className="prose footer"><p>Some of these are incredibly close margins. Interestingly, all happened in state assembly elections rather than general elections, where campaigns and candidates receive broader attention.</p><p>It remains futile to prove, only statistically, that these examples are intentional rather than coincidental. At least we know something about how to look for them now.</p><hr /><h4>Sources and notes</h4><p>The election candidate data comes from the <a href="https://tcpd.ashoka.edu.in/lok-dhaba/" target="_blank" rel="noreferrer">Trivedi Centre for Political Data</a>. The analysis uses Levenshtein, Dice, Jaro–Winkler and BI-SIM comparisons. The original analysis and website source are available on <a href="https://github.com/diagram-chasing/votes-in-a-name" target="_blank" rel="noreferrer">GitHub</a>. Artwork is licensed under CC BY-SA.</p><img src={`${ASSET_PATH}a-win.rNYIlb2F.webp`} alt="This project won the 2024 Pudding Cup" className="award" /><References /><h4>Acknowledgements</h4><p className="small-copy">Thanks to Rhea, who suggested generating faces from numbers, and to the stubborn chair that finally let the original author sit at the right height.</p><h4>AI Disclosure</h4><p className="small-copy">No LLM was used for the original data cleaning, annotation, insights, or article text. The original author used Cursor and Claude as coding assistants.</p><span className="presents">Read more at</span><a className="bottom-link" href="https://diagramchasing.fun" target="_blank" rel="noreferrer"><img src={`${ASSET_PATH}logo.CsOc2COw.png`} alt="Diagram Chasing" className="logo bottom-logo" /></a><CrowdBand mobileScale={1} /></footer>
    </article>
  </main>;
}
