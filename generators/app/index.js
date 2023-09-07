'use strict';

const Generator = require('yeoman-generator');
const fse = require('fs-extra');
const readdir = require('../../utils/readdir');
const includes = require('../../utils/includes');

const prompts = require('./prompts');
const ignore = require('./ignore-content');

/**
 * initializing -- 初始化方法（检查状态、获取配置等）
 * prompting -- 获取用户交互数据（this.prompt()）
 * configuring -- 编辑和配置项目的配置文件
 * default -- 如果generator内部还有不符合任意一个任务队列任务名的方法，将会被放在default这个任务下进行运行
 * writing -- 填充预置模板
 * conflicts -- 处理冲突（仅限内部使用）
 * install -- 进行依赖的安装（eg：npm，bower）
 * end -- 最后调用，做一些clean工作
 */
module.exports = class extends Generator {
  /** 设置config */
  _setConfig(payload) {
    Object.keys(payload).forEach((key) => {
      this.config.set(key, payload[key]);
    });
  }

  /** 获取config，没传key 就获取全部 */
  _getConfig(key) {
    if (key) {
      return this.config.get(key);
    }
    return this.config.getAll();
  }

  initializing() {
    // 当前 generator 是否是在云端运行
    this.isCloud = process.env.GENERATOR_ENV === 'cloud';

    this._setConfig({
      userAccount: process.env.GENERATOR_USER_ACCOUNT || '__TEST_USER_ACCOUNT__',
      repo: JSON.parse(process.env.GENERATOR_REPO || '{}') || '__TEST_REPO__',
      spmA: JSON.parse(process.env.DEF_EXTRA_INFO || '{}').page_spma || '',
    });
  }

  async prompting() {
    let config;

    // 如果是云端，不能有 stdinput 操作，直接从环境变量读取传参
    if (this.isCloud) {
      config = JSON.parse(process.env.GENERATOR_PARAMS);
    } else {
      config = await this.prompt(prompts);
    }

    const { projectType, ...restConfig } = config;

    this._setConfig({
      ...restConfig,
      bizH5: includes(projectType, 'bizH5'),
      h5: includes(projectType, 'h5'),
      pha: includes(projectType, 'pha'),
      weex: includes(projectType, 'weex'),
      miniapp: includes(projectType, 'miniapp'),
    });

    // 商业能力不允许class发生变更，这里禁止掉
    if (this._getConfig('bizH5')) {
      this._setConfig({
        cssModules: false,
      });
    }

    this.log(this.config.getAll());
  }

  writing() {
    const enableCssModules = this._getConfig('cssModules');
    const enableSafeArea = this._getConfig('safeArea');

    const excludeList = [
      '.ice',
      'build',
      'node_modules',
      'package-lock.json',
      '.gitignore',
      enableCssModules ? 'index.scss' : 'index.module.scss',
      !enableSafeArea && 'safe-area.ts',
    ].filter(Boolean);

    // 商业能力h5，去除非相关模板
    if (this._getConfig('bizH5')) {
      excludeList.push('src/utils/mtop.ts', 'src/pages/home', 'src/components/.gitkeep');
    } else {
      // 非商业能力h5，去除商业能力h5模板
      excludeList.push('src/pages/index', 'src/constants', 'src/hooks', 'src/components/Button');
    }

    // const bizH5ExcludeList = ['src/utils/mtop.ts', 'src/pages/home', 'src/components/.gitkeep'];
    // const bizH5IncludeList = ['src/pages/index', 'src/hooks', 'src/components/Button'];

    const rootPath = this.templatePath();

    readdir(rootPath, {
      exclude: excludeList,
      callback: (file, src) => {
        const templatePath = src ? `${src}/${file}` : `${file}`;
        const destinationPath = src ? `${src}/${file}` : `${file}`;

        // if (this._getConfig('bizH5')) {
        //   if (includes(bizH5ExcludeList, `${src}/${file}`) || includes(bizH5ExcludeList, src)) {
        //     return;
        //   }
        // } else if (
        //   includes(bizH5IncludeList, `${src}/${file}`) ||
        //   includes(bizH5IncludeList, src)
        // ) {
        //   return;
        // }

        if (file.endsWith('.ejs')) {
          this.fs.copyTpl(
            this.templatePath(templatePath),
            this.destinationPath(`${destinationPath.replace('.ejs', '')}`),
            this._getConfig(),
          );
        } else {
          this.fs.copy(this.templatePath(templatePath), this.destinationPath(destinationPath));
        }
      },
    });
    this.config.save();
    // .gitignore 文件默认会被
    fse.writeFile(this.destinationPath('.gitignore'), ignore);
  }

  install() {
    if (!this.isCloud) {
      // 云端运行时是为了初始化仓库代码; 自动安装依赖过程只在本地执行
      this.log('安装依赖');
      // this.spawnCommand('npm', ['install']);
    }
  }

  end() {
    this.log('初始化成功~');
  }
};
