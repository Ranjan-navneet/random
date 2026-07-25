import mongoose from 'mongoose';

const { Schema } = mongoose;

const mediaSchema = new Schema(
  {
    // Points at the file document GridFS created in uploads.files
    fileId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    filename: String,
    contentType: String,
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    // Which section of the site this belongs to
    category: {
      type: String,
      enum: ['gallery', 'film'],
      default: 'gallery',
    },
    caption: {
      type: String,
      default: '',
      trim: true,
    },
    subCaption: {
      type: String, // e.g. "reel one" sub-label for films
      default: '',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Media', mediaSchema);
