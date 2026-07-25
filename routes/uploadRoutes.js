import { Router } from "express";
import multer from "multer";
import { uploadMedia, deleteMedia } from "../controllers/uploadController.js";

// Keep the file in memory as a Buffer; we stream it straight into GridFS
// instead of writing it to disk first.
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 600 * 1024 * 1024 }, // 200MB ceiling, adjust as needed
});

const router = Router();

router.post("/", upload.single("file"), uploadMedia);
router.delete("/:id", deleteMedia);

export default router;
