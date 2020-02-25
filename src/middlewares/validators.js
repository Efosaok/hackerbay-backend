import Validator from 'validatorjs';

const errorMessages = {
  required: 'this field is required',
  url: 'this field should be a valid url',
};

const validate = (fields, rule, res, next) => {
  const validation = new Validator(fields, rule, errorMessages);
  if (validation.passes()) {
    return next();
  }

  const errors = validation.errors.all();
  return res.status(400).json({
    message: 'Invalid Credentials',
    errors,
  });
};

export const validateUsernameAndPassword = ({ body }, res, next) => {
  const rule = {
    username: 'required',
    password: 'required',
  };

  return validate(body, rule, res, next);
};

export const validateImageurl = ({ body }, res, next) => {
  const rule = {
    imageUrl: 'required|url',
  };

  return validate(body, rule, res, next);
};

export const validatePatchAndDocument = ({ body }, res, next) => {
  const rule = {
    document: 'required',
    operations: 'required',
  };

  return validate(body, rule, res, next);
};
