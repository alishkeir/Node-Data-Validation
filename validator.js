const Joi = require('joi');

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false }); //use {abortEarly: false} to see all the errors at once

//   create a Joi schema
const signupSchema = Joi.object({
  /**
   * string(): field should be a string
   * email(): field should be a valid email
   * required(): field is required
   * min(): minimum length of field
   * max(): maximum length of field
   * ref(): reference another field // same validations and shouold have equal value
   * date(): field should be a date
   * greater(): field should be greater than a given value // depends on the field type
   * boolean(): field should be a boolean (true/false or 'yes'/'no')
   * when(): field typing is created based on another field
   * array(): field should be an array
   * items(): field array items should be of a specific types
   * valid(): the only valid values of the field
   * truthy(): if the field is equal to the value then resolve to true // hintful values
   *
   */
  email: Joi.string().email().required(),

  password: Joi.string().min(3).max(10).required(),

  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    // Custom error message for password mismatch -- it will always return mismatch error only because we used valid(Joi.ref('password')) that gives an error if the value is not matched
    'any.only': 'Passwords do not match',
  }),

  // make it an object that can have nested properties
  address: {
    state: Joi.string().length(2).required(),
  },

  DOB: Joi.date().greater(new Date('2012-01-01')).required(),

  referred: Joi.boolean().required(),

  // referred is the field name
  referralDetails: Joi.string().when('referred', {
    is: true, // if the referred field is available
    then: Joi.string().required().min(3).max(50), // then --  create typing
    otherwise: Joi.string().optional(), //  else --  let the field be optional
  }),

  hobbies: Joi.array().items(Joi.string(), Joi.number()),

  acceptTos: Joi.boolean().truthy('Yes').valid(true).required(),
});

exports.validateSignup = validator(signupSchema);
