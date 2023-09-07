const fse = require('fs-extra');
const path = require('path');

module.exports = function readdir(src, options) {
  const { exclude, callback } = options;

  fse.readdir(src, (err, files) => {
    for (const file of files) {
      const fullPath = path.join(src, file);
      if (fse.lstatSync(fullPath).isDirectory()) {
        readdir(fullPath, options);
      } else {
        const templatePath = src.split('templates/')[1] || '';

        const filePath = `${templatePath ? `${templatePath}/` : ''}${file}`;

        if (exclude.every((exc) => !filePath.includes(exc))) {
          callback(file, templatePath);
        }
      }
    }
  });
};
