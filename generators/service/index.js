'use strict';

const Generator = require('yeoman-generator');
const merge = require('lodash/merge');

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
        message: '输入分组名称（services文件夹下的文件名）',
        when: !this._params.name,
        validate: (v) => {
          return !!v;
        },
      },
    ]);

    this._params = merge({}, this._params, answers);

    this._params.templateType = this.config.get('bizH5') ? 'http' : 'mtop';

    this.log(this._params);
  }

  writing() {
    const config = this.config.getAll();

    const context = {
      ...config,
      service: this._params,
    };

    if (this._params.templateType === 'http') {
      // copy service
      this.fs.copyTpl(
        this.templatePath('http.ts.ejs'),
        this.destinationPath(`src/services/${this._params.name}.ts`),
        context,
      );
    }

    if (this._params.templateType === 'mtop') {
      // copy service
      this.fs.copyTpl(
        this.templatePath('mtop.ts.ejs'),
        this.destinationPath(`src/services/${this._params.name}.ts`),
        context,
      );
    }
  }

  end() {
    this.log('生成成功~');
  }
};
