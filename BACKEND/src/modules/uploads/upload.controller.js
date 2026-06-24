import { catchAsync } from '../../shared/utils/catchAsync.js';
import { BadRequestException } from '../../shared/exceptions/index.js';
import { uploadService } from './upload.service.js';

// Folders the app actually uses. Anything else falls back to 'misc' rather than
// letting clients create arbitrary or hostile paths (e.g. "../", "..%2F").
const ALLOWED_FOLDERS = new Set(['events', 'posts', 'avatars', 'misc']);

/**
 * @desc    Upload an image file to Supabase Storage
 * @route   POST /api/v1/uploads/image
 * @access  Private (any authenticated user)
 */
export const uploadImage = catchAsync(async (req, res, next) => {
  // If no file reached us, fail clearly. (Wrong field name, empty body, or a
  // file rejected upstream all land here as "no file".)
  if (!req.file) {
    throw new BadRequestException('No image file provided. Use form field "file".');
  }

  // Whitelist the folder; never trust it as a raw path segment.
  const requested = typeof req.body.folder === 'string' ? req.body.folder.trim() : '';
  const folder = ALLOWED_FOLDERS.has(requested) ? requested : 'misc';

  const publicUrl = await uploadService.uploadImage(req.file, folder);

  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      url: publicUrl,
    },
  });
});