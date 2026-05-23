import { createClient } from '@supabase/supabase-js'
import prisma from '../config/prisma.config.js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Upsert a system admin user in the DB for admin API key usage
const getOrCreateAdminUser = async () => {
  const adminEmail = 'admin@indriyax.com'
  const adminId   = 'admin-system-user-indriyax'

  let user = await prisma.user.findUnique({ where: { id: adminId } })
  if (!user) {
    user = await prisma.user.upsert({
      where:  { email: adminEmail },
      update: { role: 'ADMIN' },
      create: {
        id:       adminId,
        email:    adminEmail,
        fullName: 'IndriyaX Admin',
        role:     'ADMIN',
      },
    })
  }
  return user
}

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    const token = authHeader.split(' ')[1]

    // ── Admin API key shortcut ──────────────────────────────────────────
    const adminApiKey = process.env.ADMIN_API_KEY
    if (adminApiKey && token === adminApiKey) {
      const adminUser = await getOrCreateAdminUser()
      req.user = adminUser          // real DB user with role: 'ADMIN'
      return next()
    }

    // ── Supabase JWT ────────────────────────────────────────────────────
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data?.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
      })
    }

    // Sync Supabase user into our DB (upsert so first-time users are created)
    const supabaseUser = data.user
    const dbUser = await prisma.user.upsert({
      where:  { id: supabaseUser.id },
      update: { email: supabaseUser.email },
      create: {
        id:       supabaseUser.id,
        email:    supabaseUser.email,
        fullName: supabaseUser.user_metadata?.full_name ?? null,
        imageUrl: supabaseUser.user_metadata?.avatar_url ?? null,
        role:     'USER',
      },
    })

    req.user = dbUser
    next()
  } catch (err) {
    console.error('AUTH ERROR:', err)
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    })
  }
}

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
    }

    if (!roles.length) return next()

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: requires role ${roles.join(' or ')}`
      })
    }

    next()
  }
}
