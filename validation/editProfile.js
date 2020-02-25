const isEmpty = require("./is-empty");
const Validator = require("validator");

const validateEditName = function(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters!";
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = "New name field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
const validateNewPassword = function(data) {
  let errors = {};

  data.password = !isEmpty(data.password) ? data.password : "";
  data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : "";
  data.newPassword2 = !isEmpty(data.newPassword2) ? data.newPassword2 : "";

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isLength(data.newPassword, { min: 6, max: 30 })) {
    errors.newPassword = "Password must be at least 6 characters";
  }

  if (Validator.isEmpty(data.newPassword2)) {
    errors.newPassword2 = "Confirm password field is required";
  }

  if (!Validator.equals(data.newPassword, data.newPassword2)) {
    errors.newPassword2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
module.exports = { validateNewPassword, validateEditName };
