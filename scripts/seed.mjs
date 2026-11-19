// Generates data/profiles.json (public info) and data/likedYou.json (SECRET: who already liked you).
import fs from 'fs';

const names = ['Aarav','Ananya','Vihaan','Diya','Arjun','Isha','Kabir','Meera','Rohan','Saanvi',
  'Aditya','Kiara','Ishaan','Riya','Dev','Navya','Krish','Tara','Neil','Anika',
  'Yash','Myra','Parth','Sia','Rahul','Zoya','Karan','Pooja','Veer','Aisha',
  'Nikhil','Simran'];
const places = ['VIT Bhopal','IIT Bombay','Delhi University','BITS Pilani','IIIT Hyderabad',
  'Bangalore','Pune','Mumbai','Indore','Jaipur','NIT Bhopal','Christ University'];
const interestPool = ['Football','Coding','Anime','Chai','Photography','Hiking','Guitar','Chess',
  'Cooking','Travel','Gaming','Books','Gym','Movies','Badminton','Poetry','Startups','Dancing'];
const bios = [
  'Will debug your code and your overthinking.',
  'Coffee first, opinions second.',
  'Looking for someone to split fries with.',
  'Weekend trekker, weekday napper.',
  'I make a mean playlist.',
  'Probably reading something right now.',
  'Fluent in sarcasm and memes.',
  'Ask me about my startup idea. Or do not.',
  'Always up for late-night maggi.',
  'Collector of tiny adventures.'
];

// tiny seeded random so the output is the same every run
let seed = 42;
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pickMany = (arr, n) => [...arr].sort(() => rand() - 0.5).slice(0, n);

const profiles = names.map((name, i) => ({
  id: `p${i + 1}`,
  name,
  age: 18 + Math.floor(rand() * 8),
  photo: `https://picsum.photos/seed/coy-${name.toLowerCase()}/600/800`,
  bio: pick(bios),
  place: pick(places),
  interests: pickMany(interestPool, 3 + Math.floor(rand() * 2)),
}));

// 10 profiles already liked the logged-in user. Kept in a SEPARATE file so it can never leak via /feed.
const likedYou = profiles.filter((_, i) => i % 3 === 0).map((p) => p.id);

fs.writeFileSync('data/profiles.json', JSON.stringify(profiles, null, 2));
fs.writeFileSync('data/likedYou.json', JSON.stringify(likedYou, null, 2));
console.log(`Seeded ${profiles.length} profiles, ${likedYou.length} have liked you.`);
