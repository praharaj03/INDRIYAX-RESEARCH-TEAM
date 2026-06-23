import { BadRequestException } from '../shared/exceptions/index.js';

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body:   req.body,
        query:  req.query,
        params: req.params,
      });
      
      // Assign the validated data back to the req object
      req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;
      
      next();
    } catch (error) {
      // Format Zod errors nicely for the client
      // Zod v4 uses `error.issues`, older versions use `error.errors`
      const zodErrors = error.issues || error.errors || [];
      
      let formattedErrors = [];
      if (Array.isArray(zodErrors) && zodErrors.length > 0) {
        formattedErrors = zodErrors.map((err) => ({
          field: (err.path || []).slice(1).join('.'),
          message: err.message,
        }));
      } else {
        // Fallback: use the error message directly
        formattedErrors = [{ field: 'unknown', message: error.message || 'Validation failed' }];
      }
      
      const exception = new BadRequestException('Validation failed');
      exception.errors = formattedErrors;
      next(exception);
    }
  };
};