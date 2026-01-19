module.exports = function policyCheck(password) {
  const errors = [];

  if (password.length < 12)
    errors.push("Minimum length should be 12");

  if (!/[A-Z]/.test(password))
    errors.push("Add at least one uppercase letter");

  if (!/[a-z]/.test(password))
    errors.push("Add at least one lowercase letter");

  if (!/[0-9]/.test(password))
    errors.push("Add at least one number");

  if (!/[^A-Za-z0-9]/.test(password))
    errors.push("Add at least one special character");

  if (/(.)\1{2,}/.test(password))
    errors.push("Repeated characters detected");

  return errors;
};
