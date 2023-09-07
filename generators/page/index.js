'use strict';

const Generator = require('yeoman-generator');
const readdir = require('../../utils/readdir');
const merge = require('lodash/merge');
const changeCase = require('change-case');
const fse = require('fs-extra');
const parser = require('@babel/parser');
const validate = require('../../utils/validate-file-name');
const { default: traverse } = require('@babel/traverse');
const types = require('@babel/types');
const { default: generate } = require('@babel/generator');

module.exports = class extends Generator {
  _params = {};

  initializing() {
    this.option('name', {
      type: String,
    });
  }

  async prompting() {
    this._params.name = this.options.name;

    const answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: '来个页面名称(小写短杠命名)',
        when: !this._params.name,
        validate,
      },
    ]);

    this._params = merge({}, this._params, answers);

    this._params.pascalCase = changeCase.pascalCase(this._params.name);

    this.log(this._params);
  }

  writing() {
    const config = this.config.getAll();
    const excludeList = [config.cssModules ? 'index.scss.ejs' : 'index.module.scss'];
    const rootPath = this.templatePath();

    readdir(rootPath, {
      exclude: excludeList,
      callback: (file) => {
        const templatePath = `${file}`;
        const destinationPath = `src/pages/${this._params.name}/${file}`;
        if (file.endsWith('.ejs')) {
          this.fs.copyTpl(
            this.templatePath(templatePath),
            this.destinationPath(`${destinationPath.replace('.ejs', '')}`),
            {
              ...config,
              page: this._params,
            },
          );
        } else {
          this.fs.copy(this.templatePath(templatePath), this.destinationPath(destinationPath));
        }
      },
    });
    if (config.pha || config.miniapp) {
      const filePath = this.destinationPath('src/app.ts');

      if (!fse.existsSync(filePath)) {
        return;
      }

      const app = fse.readFileSync(filePath, 'utf-8');

      const ast = parser.parse(app, {
        sourceType: 'module',
        plugins: ['typescript'],
      });

      traverse(ast, {
        Property: (path) => {
          if (path.node.key.name === 'routes') {
            const routes = path.get('value');
            routes.node.elements.push(types.stringLiteral(this._params.name));
          }
        },
      });

      const { code } = generate(
        ast,
        {
          /* options */
          retainLines: true,
        },
        app,
      );

      fse.writeFileSync(filePath, code);
    }
  }

  end() {
    // this.spawnCommand('f2elint', ['scan', '-i', this.destinationPath('src/app.ts')]);
    this.log('生成成功~');
  }
};
