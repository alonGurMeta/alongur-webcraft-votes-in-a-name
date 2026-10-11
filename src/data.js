export const ASSET_PATH = '/assets/';

export const storySteps = [
  { image: 'outside-1.CR7Dnvz8.webp', align: 'center', parts: ['We begin in Wayanad, Kerala. It is voting day.'] },
  { image: 'school-1.CftLUXgV.webp', parts: ['You step into the voting booth. The electronic voting machine hums in the converted classroom as the fan whirs overhead. Other voters behind you wait their turn. Your eyes search for the familiar symbol and name amid the rows of text.'] },
  { image: 'rahul-1.G6UMmSJ3.webp', parts: ['This is a little weird. There’s ', { text: 'Rahul Gandhi', tone: 'reference' }, ' that you recognize, but below sits another — ', { text: 'Raghul Gandhi', tone: 'namesake' }, ', with a different symbol. There’s another man with the Gandhi last name right below. And one ', { text: 'Rahul Gandhi KE', tone: 'namesake' }, ' more. That’s a lot of Gandhis in one place.'] },
  { image: null, parts: ['In that election, 2,196 voters chose ', { text: 'Rahul Gandhi KE', tone: 'namesake' }, ' — a candidate whose campaign began at the last moment and political aspirations ended right after the polls. Whether these votes were because of confusion for the other Rahul Gandhi, or real conviction, is unclear.'] },
  { image: null, parts: ['In 2014, before photos of the candidates were put on EVMs, voters of a constituency in Chhattisgarh were faced with the choice of BJP candidate ', { text: 'Chandu Lal Sahu', tone: 'reference' }, ' and 11 other ', { text: 'Chandu Lal Sahu', tone: 'namesake' }, 's. All spelt almost the same. Symbols, names, but no photos.'] },
  { image: null, align: 'center', parts: ['There is one real ', { text: 'Chandu Lal Sahu', tone: 'reference' }, ' in here…'] },
  { image: null, align: 'center', parts: ['…did you keep track of him?'] },
  { image: null, parts: ['The real ', { text: 'Chandu', tone: 'reference' }, ' still won, but would have gotten at least 30,000 more votes without his duplicates in the running.'] },
  { image: null, parts: ['This doesn’t just happen to a single party. Between 1960 and 2024, there are over 8,000 candidates who share very similar names with their rivals — close enough to give careful voters pause, and perhaps misdirect the less aware into voting for namesakes who would disappear after election day.'] },
];

export const matches = [
  ['S. Veeramani', 'S. V. Ramani'], ['Raghubir Singh', 'Raghvir Singh'],
  ['H. D. Kumaraswamy', 'D. Kumaraswamy'], ['Virender Singh', 'Virandar Singh'],
];

export const comparisonRows = [
  ['Assam', 'Prodip Hazarika', 'Pradip Hazarika', 81.3, 86.7, 85.7],
  ['Bihar', 'Devandra Prasad Yadav', 'Devendra Prasad Yadav', 83.5, 90.5, 80],
  ['Gujarat', 'Rajeshbhai Chimanbhai Vasava', 'Ramanbhai Chimanbhai Vasava', 77, 82.1, 64.2],
  ['Madhya Pradesh', 'Mahendra Singh Bhadoriya', 'Devendra Singh Bhadoriya', 75, 81.2, 87],
  ['Tamil Nadu', 'Nageswari Thirumathi N.', 'Maheswari Thirumathi A.', 76.9, 84.1, 66.7],
  ['Uttar Pradesh', 'Dr. Narendra Kumar Singh Gaur', 'Narendra Kumar Singh Yadava', 70.8, 78.6, 71.7],
];

export const elections = [
  ['2002', 'UK · Champawat', 'Hayat Singh Mahra', 'Madan Singh Mahrana', '637', '68.4%'],
  ['2004', 'KA · Hosakote', 'Bachegowda B N', 'Bachegowda A N', '835', '87.3%'],
  ['2004', 'KL · Alleppey', 'V M Sudheeran', 'V S Sudheeran', '1,009', '85.7%'],
  ['2005', 'BR · Bhore', 'Anil Kumar', 'Anil Kumar Baitha', '1,218', '70.1%'],
  ['2019', 'JH · Khunti', 'Kali Charan Munda', 'Masih Charan Munda', '1,445', '75.3%'],
];
