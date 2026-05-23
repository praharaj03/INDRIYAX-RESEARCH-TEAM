import { createClient } from '@supabase/supabase-js';
import { createId } from '@paralleldrive/cuid2';
import { config } from './env.config.js';

const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceKey
);

/**
 * Supabase-backed database client that mimics Prisma's API.
 * Used as a fallback when direct Postgres connection is unavailable.
 */
const supabaseDb = {
  event: {
    create: async ({ data }) => {
      // Generate slug from title
      const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const id = createId();
      const now = new Date().toISOString();
      const insertData = { id, ...data, slug, createdAt: now, updatedAt: now };
      const { data: result, error } = await supabase
        .from('Event')
        .insert(insertData)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    },
    findMany: async ({ where = {}, orderBy } = {}) => {
      let query = supabase.from('Event').select('*');
      
      // Apply filters
      for (const [key, value] of Object.entries(where)) {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      }
      
      // Apply ordering
      if (orderBy) {
        const [col, dir] = Object.entries(orderBy)[0];
        query = query.order(col, { ascending: dir === 'asc' });
      } else {
        query = query.order('date', { ascending: true });
      }
      
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data || [];
    },
    findUnique: async ({ where, include } = {}) => {
      let query = supabase.from('Event').select('*');
      
      for (const [key, value] of Object.entries(where)) {
        query = query.eq(key, value);
      }
      
      const { data, error } = await query.single();
      if (error && error.code !== 'PGRST116') throw new Error(error.message);
      return data || null;
    },
    update: async ({ where, data }) => {
      const { data: result, error } = await supabase
        .from('Event')
        .update(data)
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    },
    delete: async ({ where }) => {
      const { error } = await supabase
        .from('Event')
        .delete()
        .eq('id', where.id);
      if (error) throw new Error(error.message);
      return { id: where.id };
    },
  },
  post: {
    create: async ({ data }) => {
      const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const id = createId();
      const now = new Date().toISOString();
      const insertData = { id, ...data, slug, createdAt: now, updatedAt: now };
      const { data: result, error } = await supabase
        .from('Post')
        .insert(insertData)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    },
    findMany: async ({ where = {}, orderBy, include } = {}) => {
      let query = supabase.from('Post').select('*, author:User(id, email, fullName, imageUrl)');
      
      for (const [key, value] of Object.entries(where)) {
        if (key === 'authorId') query = query.eq('authorId', value);
        else if (value !== undefined && value !== null) query = query.eq(key, value);
      }
      
      if (orderBy) {
        const [col, dir] = Object.entries(orderBy)[0];
        query = query.order(col, { ascending: dir === 'asc' });
      } else {
        query = query.order('createdAt', { ascending: false });
      }
      
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data || [];
    },
    findUnique: async ({ where, include } = {}) => {
      let query = supabase.from('Post').select('*, author:User(id, email, fullName, imageUrl)');
      
      for (const [key, value] of Object.entries(where)) {
        query = query.eq(key, value);
      }
      
      const { data, error } = await query.single();
      if (error && error.code !== 'PGRST116') throw new Error(error.message);
      return data || null;
    },
    update: async ({ where, data }) => {
      const { data: result, error } = await supabase
        .from('Post')
        .update(data)
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    },
    delete: async ({ where }) => {
      const { error } = await supabase.from('Post').delete().eq('id', where.id);
      if (error) throw new Error(error.message);
      return { id: where.id };
    },
  },
  user: {
    findUnique: async ({ where }) => {
      let query = supabase.from('User').select('*');
      for (const [key, value] of Object.entries(where)) {
        query = query.eq(key, value);
      }
      const { data, error } = await query.single();
      if (error && error.code !== 'PGRST116') throw new Error(error.message);
      return data || null;
    },
    findMany: async ({ where = {}, orderBy } = {}) => {
      let query = supabase.from('User').select('*');
      for (const [key, value] of Object.entries(where)) {
        if (value !== undefined && value !== null) query = query.eq(key, value);
      }
      if (orderBy) {
        const [col, dir] = Object.entries(orderBy)[0];
        query = query.order(col, { ascending: dir === 'asc' });
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data || [];
    },
    create: async ({ data }) => {
      const id = createId();
      const now = new Date().toISOString();
      const { data: result, error } = await supabase.from('User').insert({ id, ...data, createdAt: now, updatedAt: now }).select().single();
      if (error) throw new Error(error.message);
      return result;
    },
    upsert: async ({ where, create, update }) => {
      const existing = await supabaseDb.user.findUnique({ where });
      if (existing) {
        const { data, error } = await supabase.from('User').update(update).eq('id', existing.id).select().single();
        if (error) throw new Error(error.message);
        return data;
      }
      const { data, error } = await supabase.from('User').insert(create).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    update: async ({ where, data }) => {
      const { data: result, error } = await supabase.from('User').update(data).eq('id', where.id).select().single();
      if (error) throw new Error(error.message);
      return result;
    },
  },
  payment: {
    create: async ({ data }) => {
      const id = createId();
      const now = new Date().toISOString();
      const { data: result, error } = await supabase.from('Payment').insert({ id, ...data, createdAt: now, updatedAt: now }).select().single();
      if (error) throw new Error(error.message);
      return result;
    },
    findMany: async ({ where = {}, orderBy, include } = {}) => {
      let query = supabase.from('Payment').select('*, user:User(id, email, fullName), event:Event(id, title)');
      for (const [key, value] of Object.entries(where)) {
        if (value !== undefined) query = query.eq(key, value);
      }
      if (orderBy) {
        const [col, dir] = Object.entries(orderBy)[0];
        query = query.order(col, { ascending: dir === 'asc' });
      } else {
        query = query.order('createdAt', { ascending: false });
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data || [];
    },
    findUnique: async ({ where, include }) => {
      let query = supabase.from('Payment').select('*, user:User(id, email, fullName), event:Event(id, title)');
      for (const [key, value] of Object.entries(where)) {
        query = query.eq(key, value);
      }
      const { data, error } = await query.single();
      if (error && error.code !== 'PGRST116') throw new Error(error.message);
      return data || null;
    },
    update: async ({ where, data }) => {
      const { data: result, error } = await supabase.from('Payment').update(data).eq('id', where.id).select().single();
      if (error) throw new Error(error.message);
      return result;
    },
  },
  enrollment: {
    create: async ({ data }) => {
      const id = createId();
      const now = new Date().toISOString();
      const { data: result, error } = await supabase.from('Enrollment').insert({ id, ...data, createdAt: now, updatedAt: now }).select().single();
      if (error) throw new Error(error.message);
      return result;
    },
    findMany: async ({ where = {}, include } = {}) => {
      let query = supabase.from('Enrollment').select('*, user:User(id, email, fullName), event:Event(id, title)');
      for (const [key, value] of Object.entries(where)) {
        if (value !== undefined) query = query.eq(key, value);
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data || [];
    },
  },
  comment: {
    create: async ({ data }) => {
      const id = createId();
      const now = new Date().toISOString();
      const { data: result, error } = await supabase.from('Comment').insert({ id, ...data, createdAt: now, updatedAt: now }).select().single();
      if (error) throw new Error(error.message);
      return result;
    },
    findMany: async ({ where = {}, orderBy, include } = {}) => {
      let query = supabase.from('Comment').select('*, user:User(id, email, fullName, imageUrl)');
      for (const [key, value] of Object.entries(where)) {
        if (value !== undefined) query = query.eq(key, value);
      }
      if (orderBy) {
        const [col, dir] = Object.entries(orderBy)[0];
        query = query.order(col, { ascending: dir === 'asc' });
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data || [];
    },
    delete: async ({ where }) => {
      const { error } = await supabase.from('Comment').delete().eq('id', where.id);
      if (error) throw new Error(error.message);
      return { id: where.id };
    },
  },
  $connect: async () => {
    // Test connection by querying a simple row
    const { error } = await supabase.from('Event').select('id').limit(1);
    if (error) throw new Error(`Supabase connection test failed: ${error.message}`);
    console.log('✅ Connected to Supabase via REST API');
  },
};

export default supabaseDb;
