const validate = require('validate-npm-package-name');

module.exports = (name) => {
  const result = validate(name);
  if (result.validForNewPackages) {
    return true;
  }
  const { warnings = [], errors = [] } = result;

  return warnings.concat(errors).join(',');
};
