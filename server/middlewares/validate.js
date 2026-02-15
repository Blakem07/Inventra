/**
 * Validates req.body using a validator function.
 * Validator must throw an Error with `status` on failure.
 */
export function validateBody(validator) {
  return (req, res, next) => {
    try {
      validator(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}
