import mongoose from 'mongoose';
import { getBucket } from '../config/db.js';
import Media from '../models/Media.js';

// GET /api/media?category=gallery|film
export const getMediaList = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const items = await Media.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

// GET /api/media/file/:fileId -> streams the raw image/video bytes
export const streamMediaFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const bucket = getBucket();
    const _id = new mongoose.Types.ObjectId(fileId);

    const files = await bucket.find({ _id }).toArray();
    if (!files.length) return res.status(404).json({ message: 'File not found' });

    const file = files[0];
    res.set('Content-Type', file.contentType || 'application/octet-stream');
    res.set('Content-Length', file.length);
    // Videos benefit from range requests for seeking; kept simple here.
    res.set('Cache-Control', 'public, max-age=31536000, immutable');

    bucket.openDownloadStream(_id).on('error', next).pipe(res);
  } catch (err) {
    next(err);
  }
};
