import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

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

    // Check if it's an admin API key
    const adminApiKey = process.env.ADMIN_API_KEY
    if (adminApiKey && token === adminApiKey) {
      // Set a mock admin user
      req.user = {
        id: 'admin',
        role: 'ADMIN',
        email: 'admin@indriyax.com'
      }
      return next()
    }

    console.log('TOKEN RECEIVED:', token.substring(0, 30))

    const { data, error } = await supabase.auth.getUser(token)

    console.log('SUPABASE RESPONSE:', { data, error })

    if (error || !data?.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
      })
    }

    req.user = data.user

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

    // If no roles provided, allow access
    if (!roles.length) {
      return next()
    }

    // Supabase default role fallback
    const userRole = req.user.role || 'authenticated'

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden'
      })
    }

    next()
  }
}