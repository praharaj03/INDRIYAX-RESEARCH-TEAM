import { createClient } from '@supabase/supabase-js';
import { config } from '../../config/env.config.js';
import { BadRequestException, AppError } from '../../shared/exceptions/index.js';

const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

const BUCKET_NAME = 'indriyax-assets';

const EXT_BY_MIME = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

// Marker that appears in every public URL from this bucket, used to extract the
// bucket-relative object path (everything after it).
const PUBLIC_PATH_MARKER = `/storage/v1/object/public/${BUCKET_NAME}/`;

export const uploadService = {
  uploadImage: async (file, folder = 'misc') => {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file provided');
    }

    const ext = EXT_BY_MIME[file.mimetype] || 'bin';
    const uniqueFilename = `${folder}/${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniqueFilename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
        cacheControl: '3600',
      });

    if (error) {
      throw new AppError('Failed to upload file to storage. Please try again.', 502);
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    if (!publicUrlData?.publicUrl) {
      throw new AppError('Upload succeeded but no public URL was returned.', 502);
    }

    return publicUrlData.publicUrl;
  },

  /**
   * Best-effort delete of a previously uploaded image, given its public URL.
   * - Returns false (without throwing) for anything not in OUR bucket, empty
   *   values, or unparseable URLs — so it's always safe to call.
   * - Never throws: cleanup must never break the user action that triggered it.
   * @returns {Promise<boolean>} true if a delete was attempted and succeeded
   */
  deleteImageByUrl: async (url) => {
    try {
      if (!url || typeof url !== 'string') return false;

      const markerIndex = url.indexOf(PUBLIC_PATH_MARKER);
      // Not one of our bucket's URLs (external/CDN/malformed) → never touch it.
      if (markerIndex === -1) return false;

      const objectPath = url.slice(markerIndex + PUBLIC_PATH_MARKER.length);
      if (!objectPath) return false;

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([objectPath]);

      if (error) {
        // Log, but don't propagate — the DB change already succeeded.
        console.error('Storage cleanup failed for', objectPath, '-', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Storage cleanup threw unexpectedly:', err);
      return false;
    }
  },
};