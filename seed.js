// Run with: node seed.js
// Inserts one starter letter so the site has something to show immediately.
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Letter from './models/Letter.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Letter.deleteMany({});
  await Letter.create({
    title: 'A letter, just for you',
    eyebrow: 'before anything else',
    paragraphs: [
      "My love, another year of you is arriving, and I could not be more grateful to be the one who gets to watch it unfold. Every ordinary Tuesday feels a little less ordinary because you're in it.",
      "This little page is a keepsake built out of us — the moments I keep close, the version of you I fell for, and the countdown to the day you were born, which I now think of as the finest day on the calendar.",
      'I hope this year hands you everything you deserve, and I hope I get to be there for most of it.',
    ],
    signOff: '— yours, always',
    isActive: true,
  });

  console.log('Seeded one letter.');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
