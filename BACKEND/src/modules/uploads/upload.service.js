import { createClient } from '@supabase/supabase-js';
import { config } from '../../config/env.config.js';
import { BadRequestException, AppError } from '../../shared/exceptions/index.js';

const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

const BUCKET_NAME = 'indriyax-assets';

// Mirror of the route allow-list, used to pick a safe extension for the stored
// object name regardless of what the original filename claimed.
const EXT_BY_MIME = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export const uploadService = {
  uploadImage: async (file, folder = 'misc') => {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file provided');
    }

    // Choose extension from the (already-validated) MIME type, not the raw
    // filename — avoids odd or doubled extensions in storage keys.
    const ext = EXT_BY_MIME[file.mimetype] || 'bin';
    const uniqueFilename = `${folder}/${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniqueFilename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
        cacheControl: '3600', // CDN/browser cache for 1h; URLs are unique anyway.
      });

    if (error) {
      // OPERATIONAL: a storage outage isn't a code bug. Marking it operational
      // (statusCode 502) means the global handler forwards a real message the
      // frontend can show — "upload service unavailable, try again" — instead of
      // a bare 500.
      throw new AppError(
        'Failed to upload file to storage. Please try again.',
        502
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    if (!publicUrlData?.publicUrl) {
      throw new AppError('Upload succeeded but no public URL was returned.', 502);
    }

    return publicUrlData.publicUrl;
  },
};