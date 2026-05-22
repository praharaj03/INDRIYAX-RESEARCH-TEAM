import { createClient } from '@supabase/supabase-js';
import { config } from '../../config/env.config.js';
import { BadRequestException } from '../../shared/exceptions/index.js';

// Initialize Supabase client
const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

// Define the name of your public bucket in Supabase
const BUCKET_NAME = 'indriyax-assets'; 

export const uploadService = {
  uploadImage: async (file, folder = 'general') => {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Generate a unique filename: folder/timestamp-random.extension
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFilename = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExtension}`;

    // Upload the file buffer to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniqueFilename, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error('Failed to upload file to storage');
    }

    // Retrieve the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  }
};