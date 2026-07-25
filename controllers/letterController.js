import Letter from '../models/Letter.js';

// GET /api/letters  -> all letters (newest first)
export const getLetters = async (req, res, next) => {
  try {
    const letters = await Letter.find().sort({ createdAt: -1 });
    res.json(letters);
  } catch (err) {
    next(err);
  }
};

// GET /api/letters/active -> the single letter currently shown on the site
export const getActiveLetter = async (req, res, next) => {
  try {
    const letter = await Letter.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!letter) return res.status(404).json({ message: 'No active letter found' });
    res.json(letter);
  } catch (err) {
    next(err);
  }
};

// POST /api/letters
// body: { title, eyebrow, paragraphs: string[], signOff, isActive }
export const createLetter = async (req, res, next) => {
  try {
    const { title, eyebrow, paragraphs, signOff, isActive } = req.body;

    if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
      return res.status(400).json({ message: 'paragraphs must be a non-empty array of strings' });
    }

    // If this new letter should be active, deactivate the others first
    if (isActive) {
      await Letter.updateMany({}, { $set: { isActive: false } });
    }

    const letter = await Letter.create({ title, eyebrow, paragraphs, signOff, isActive });
    res.status(201).json(letter);
  } catch (err) {
    next(err);
  }
};

// PUT /api/letters/:id
export const updateLetter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.isActive) {
      await Letter.updateMany({ _id: { $ne: id } }, { $set: { isActive: false } });
    }

    const letter = await Letter.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!letter) return res.status(404).json({ message: 'Letter not found' });
    res.json(letter);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/letters/:id
export const deleteLetter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const letter = await Letter.findByIdAndDelete(id);
    if (!letter) return res.status(404).json({ message: 'Letter not found' });
    res.json({ message: 'Letter deleted' });
  } catch (err) {
    next(err);
  }
};
