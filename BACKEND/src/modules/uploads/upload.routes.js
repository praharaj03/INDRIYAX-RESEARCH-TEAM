import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from './upload.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { BadRequestException } from '../../shared/exceptions/index.js';

const router = Router();

// Configure Multer storage (Memory)
const storage = multer.memoryStorage();

// Multer file filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ANY logged-in user can access upload routes (required for avatars)
router.use(protect);

// POST /api/v1/uploads/image
// Expects a form-data payload with a key named 'file'
router.post('/image', upload.single('file'), uploadImage);

export default router;