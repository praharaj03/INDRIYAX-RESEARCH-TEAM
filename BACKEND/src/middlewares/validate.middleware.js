import { BadRequestException } from '../shared/exceptions/index.js';

// Express 5: req.query and req.params are read-only getters — assigning to them
// throws. Copy validated keys onto the existing object instead of replacing it.
const mutateInPlace = (target, source) => {
  if (!target || !source) return;
  for (const key of Object.keys(target)) delete target[key];
  Object.assign(target, source);
};

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // body is a normal writable property — safe to reassign.
      if (parsed.body !== undefined) req.body = parsed.body;
      // query/params must be mutated in place under Express 5.
      if (parsed.query !== undefined) mutateInPlace(req.query, parsed.query);
      if (parsed.params !== undefined) mutateInPlace(req.params, parsed.params);

      return next();
    } catch (error) {
      // Zod v4 uses `issues`; older versions use `errors`.
      const issues = error.issues || error.errors || [];

      const formattedErrors =
        Array.isArray(issues) && issues.length > 0
          ? issues.map((err) => ({
              // Drop the section prefix ('body'/'query'/'params'); fall back to
              // the section name so top-level refinements still get a field.
              field:
                (err.path || []).slice(1).join('.') ||
                (err.path?.[0] ?? 'unknown'),
              message: err.message,
            }))
          : [{ field: 'unknown', message: error.message || 'Validation failed' }];

      const exception = new BadRequestException('Validation failed');
      exception.errors = formattedErrors;
      return next(exception);
    }
  };
};