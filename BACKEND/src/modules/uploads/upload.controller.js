import { catchAsync } from '../../shared/utils/catchAsync.js';
import { uploadService } from './upload.service.js';

/**
 * @desc    Upload an image file to Supabase Storage
 * @route   POST /api/v1/uploads/image
 * @access  Private (Admins & Authors)
 */
export const uploadImage = catchAsync(async (req, res, next) => {
  // We can pass a folder name in the body, defaulting to 'misc'
  const folder = req.body.folder || 'misc'; 
  
  const publicUrl = await uploadService.uploadImage(req.file, folder);

  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      url: publicUrl
    }
  });
});