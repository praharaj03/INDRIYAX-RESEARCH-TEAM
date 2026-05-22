# Supabase Configuration Guide

This guide will help you configure Supabase environment variables for the INDRIYAX application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com if you don't have one)
- A Supabase project created for INDRIYAX

## Step 1: Get Your Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your INDRIYAX project (or create a new one)
3. Navigate to **Project Settings** → **API**

You'll see the following values:

### Project URL
- Look for "Project URL" 
- Example: `https://abcdefghijklmnop.supabase.co`

### API Keys
- **anon/public key**: Used by the frontend (safe to expose in browser)
- **service_role key**: Used by the backend (keep secret, never expose to frontend)

### JWT Secret
- Look for "JWT Secret" under the JWT Settings section
- This is used to verify tokens issued by Supabase

## Step 2: Configure Frontend Environment Variables

Open `FRONTEND/.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: These variables start with `NEXT_PUBLIC_` so they are exposed to the browser. Only use the **anon/public key**, never the service role key.

## Step 3: Configure Backend Environment Variables

Open `BACKEND/.env` and replace the placeholder values:

```env
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase-dashboard
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: The service role key has admin privileges. Keep it secret and never commit it to version control.

## Step 4: Configure Database Connection

Your backend also needs a PostgreSQL connection string. If you're using Supabase's database:

1. In Supabase dashboard, go to **Project Settings** → **Database**
2. Copy the "Connection string" (choose "URI" format)
3. Replace the `DATABASE_URL` in `BACKEND/.env`:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres
```

## Step 5: Restart Your Applications

After configuring the environment variables:

1. **Stop** both frontend and backend servers (Ctrl+C)
2. **Restart** them:
   ```bash
   # In BACKEND directory
   npm run dev
   
   # In FRONTEND directory
   npm run dev
   ```

## Verification

To verify the configuration is working:

1. Open your frontend application (http://localhost:3000)
2. Try to sign up or sign in
3. You should no longer see the "Supabase env vars not configured" error

## Troubleshooting

### Error: "Supabase env vars not configured"
- Check that you've replaced ALL placeholder values in `.env.local`
- Verify the variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart the frontend server after making changes

### Error: "Invalid JWT"
- Check that `SUPABASE_JWT_SECRET` in backend `.env` matches the JWT Secret from your Supabase dashboard
- Ensure there are no extra spaces or quotes around the secret

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check that your Supabase project is active
- Ensure your IP is allowed in Supabase's database settings (or disable IP restrictions for development)

## Security Notes

- ✅ **DO** commit `.env.local` and `.env` to `.gitignore` (already configured)
- ✅ **DO** use different Supabase projects for development and production
- ❌ **DON'T** commit actual credentials to version control
- ❌ **DON'T** share your service role key publicly
- ❌ **DON'T** use the service role key in frontend code

## Next Steps

Once configured, your application will:
- Use Supabase for user authentication (sign up, sign in, sign out)
- Verify JWT tokens in the backend
- Store user profiles in your PostgreSQL database
- Upload files to Supabase Storage

For more information, see:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
