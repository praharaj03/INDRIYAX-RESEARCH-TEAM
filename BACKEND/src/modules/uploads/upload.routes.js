import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from './upload.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { BadRequestException } from '../../shared/exceptions/index.js';

const router = Router();

// In-memory buffer (no disk writes) — the buffer is streamed straight to Supabase.
const storage = multer.memoryStorage();

// Allow-list from upload_docs.md. We check BOTH the declared MIME type and the
// file extension — the MIME header is client-controlled and trivially forged,
// so it alone is not a safe gate. SVG is deliberately excluded: it can carry
// inline <script>, and serving it from our own domain would be stored XSS.
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);
const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);

const getExtension = (filename = '') => {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
};

const fileFilter = (req, file, cb) => {
  const mimeOk = ALLOWED_MIME.has(file.mimetype);
  const extOk = ALLOWED_EXT.has(getExtension(file.originalname));

  if (mimeOk && extOk) {
    return cb(null, true);
  }
  // Operational error → reaches the client as a clean, actionable 400.
  return cb(
    new BadRequestException(
      'Unsupported file type. Allowed: JPG, JPEG, PNG, WEBP, GIF.'
    ),
    false
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB — matches the docs; LIMIT_FILE_SIZE is
    files: 1,                  // mapped to a clean 400 by the global handler.
    fields: 5,                 // we only need `folder`; cap stray form fields.
    fieldNameSize: 100,
    fieldSize: 1024,           // a 'folder' value is tiny; reject oversized fields.
  },
});

// Every upload route requires authentication. Open to ANY logged-in user
// (normal users upload profile images here).
router.use(protect);

// POST /api/v1/uploads/image — multipart/form-data, file field name: "file".
router.post('/image', upload.single('file'), uploadImage);

export default router;