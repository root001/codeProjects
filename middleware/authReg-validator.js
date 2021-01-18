const { check, validationResult } = require('express-validator')
const userValidationRules = () => {
  return [
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email', 'Email is required')
    .isEmail(),
    check('phone', 'phone number is required')
    .isMobilePhone(),
    check('password', 
    'password must contain 8 characters, with at least one digit, one lower case and one upper case').isLength({ min: 6})
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  userValidationRules,
  validate,
}