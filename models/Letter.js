import mongoose from 'mongoose';

const { Schema } = mongoose;

const letterSchema = new Schema(
  {
    title: {
      type: String,
      default: 'A letter, just for you',
      trim: true,
    },
    eyebrow: {
      type: String,
      default: 'before anything else',
      trim: true,
    },
    // Each string in this array renders as its own <p> paragraph
    paragraphs: {
      type: [String],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    signOff: {
      type: String,
      default: '— yours, always',
      trim: true,
    },
    // Only one letter is shown on the site at a time.
    // Flip this to swap which letter is "live" without deleting old ones.
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Letter', letterSchema);
