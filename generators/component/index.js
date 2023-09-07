'use strict';

const Generator = require('yeoman-generator');
const readdir = require('../../utils/readdir');
const merge = require('lodash/merge');
const fse = require('fs-extra');
const includes = require('../../utils/includes');
const validate = require('../../utils/validate-file-name');
const changeCase = require('change-case');

module.exports = class extends Generator {
  _params = {};

  initializing() {
    this.option('name', {
      type: String,
    });
    this.option('type', {
      type: String,
    });
    this.option('page', {
      type: String,
    });
  }

  async prompting() {
    const pages = fse.readdirSync(this.destinationPath('src/pages'));

    this._params.name = this.options.name;
    this._params.type = this.options.type;
    this._params.page = this.options.page;

    const answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: '来个牛逼的组件名称(小写短杠命名)',
        when: !this._params.name,
        validate,
      },
      {
        type: 'list',
        name: 'type',
        message: '它是个全局组件还是页面组件',
        when: () => {
          if (includes(['global', 'page'], this._params.type)) {
            return false;
          }
          return true;
        },
        choices: [
          { name: '全局', value: 'global' },
          { name: '页面级', value: 'page' },
        ],
      },
      {
        type: 'list',
        name: 'page',
        message: '它是在哪个页面下的组件？',
        choices: pages.map((name) => {
          return {
            name,
            value: name,
          };
        }),
        when: (answer) => {
          if (includes(pages, this._params.page)) {
            return false;
          }
          return answer.type === 'page' || this._params.type === 'page';
        },
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

        let destinationPath = ``;

        if (this._params.type === 'global') {
          destinationPath = `src/components/${this._params.name}/${file}`;
        }
        if (this._params.type === 'page') {
          destinationPath = `src/pages/${this._params.page}/components/${this._params.name}/${file}`;
        }

        if (file.endsWith('.ejs')) {
          this.fs.copyTpl(
            this.templatePath(templatePath),
            this.destinationPath(`${destinationPath.replace('.ejs', '')}`),
            {
              ...config,
              component: this._params,
            },
          );
        } else {
          this.fs.copy(this.templatePath(templatePath), this.destinationPath(destinationPath));
        }
      },
    });
  }

  end() {
    this.log('生成成功~');
  }
};
