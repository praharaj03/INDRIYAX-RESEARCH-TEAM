import { BadRequestException } from '../shared/exceptions/index.js';

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body:   req.body,
        query:  req.query,
        params: req.params,
      });

      req.body   = parsed.body   ?? req.body;
      req.params = parsed.params ?? req.params;

      next();
    } catch (error) {
      // Log the real error so we can see what's actually failing
      console.error('🔴 VALIDATE ERROR name:', error?.name);
      console.error('🔴 VALIDATE ERROR message:', error?.message);
      console.error('🔴 VALIDATE ERROR issues:', JSON.stringify(error?.errors ?? error?.issues, null, 2));

      // Zod throws ZodError which has an .errors array
      const formattedErrors = (error?.errors ?? error?.issues)?.map((err) => ({
        field:   err.path.slice(1).join('.'),
        message: err.message,
      })) || [];

      const exception = new BadRequestException(
        formattedErrors.length
          ? `Validation failed: ${formattedErrors.map(e => `${e.field} — ${e.message}`).join(', ')}`
          : 'Validation failed'
      );
      exception.errors = formattedErrors;
      next(exception);
    }
  };
};
