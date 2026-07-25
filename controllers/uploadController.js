import { Readable } from 'stream';
import mongoose from 'mongoose';
import { getBucket } from '../config/db.js';
import Media from '../models/Media.js';

/**
 * Writes an in-memory buffer (from multer) into the GridFS bucket
 * and resolves with the new file's ObjectId.
 */
const streamToGridFS = (buffer, filename, contentType) =>
  new Promise((resolve, reject) => {
    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(filename, { contentType });

    Readable.from(buffer)
      .pipe(uploadStream)
      .on('error', reject)
      .on('finish', () => resolve(uploadStream.id));
  });

// POST /api/upload
// multipart/form-data: file=<binary>, category=gallery|film, caption, subCaption, order
export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file was uploaded (field name must be "file")' });
    }

    const { originalname, buffer, mimetype } = req.file;
    const { category = 'gallery', caption = '', subCaption = '', order = 0 } = req.body;

    const mediaType = mimetype.startsWith('video') ? 'video' : 'image';

    const fileId = await streamToGridFS(buffer, originalname, mimetype);

    const media = await Media.create({
      fileId,
      filename: originalname,
      contentType: mimetype,
      mediaType,
      category,
      caption,
      subCaption,
      order,
    });

    res.status(201).json(media);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/upload/:id  -> removes both the Media doc and the GridFS file
export const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);
    if (!media) return res.status(404).json({ message: 'Media not found' });

    const bucket = getBucket();
    await bucket.delete(new mongoose.Types.ObjectId(media.fileId));
    await media.deleteOne();

    res.json({ message: 'Media deleted' });
  } catch (err) {
    next(err);
  }
};
