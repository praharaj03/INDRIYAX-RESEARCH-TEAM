import { BadRequestException } from '../shared/exceptions/index.js';

/**
 * Validates incoming request data against a Zod schema.
 * @param {import('zod').AnyZodObject} schema 
 */
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate body, query, and params against the schema
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      // Assign the validated data back to the req object
      req.body = parsed.body;
      req.query = parsed.query;
      req.params = parsed.params;
      
      next();
    } catch (error) {
      // Format Zod errors nicely for the client
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.slice(1).join('.'), // turns ["body", "utr"] into "utr"
        message: err.message,
      }));
      
      // Pass a descriptive message to our centralized error handler
      const exception = new BadRequestException('Validation failed');
      exception.errors = formattedErrors; // Attach errors array so middleware can show details
      next(exception);
    }
  };
};