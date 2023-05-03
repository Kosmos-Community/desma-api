import Joi from "joi";

const customMessages = {
  'string.min': 'Password must have at least {#limit} characters',
  'string.pattern.base': 'The password must contain at least one uppercase letter, one lowercase letter, and one special character (., -, *, $, #, etc)'
};

export const passwordSchema = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>\\/?-])/)
  .required()
  .messages(customMessages);