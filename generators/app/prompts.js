const validate = require('../../utils/validate-file-name');

module.exports = [
  {
    type: 'input',
    name: 'name',
    message: '来个牛逼的项目名称',
    default: this.appname, // Default to current folder name
    validate,
  },
  {
    type: 'input',
    name: 'description',
    message: '简单描述下这个项目',
  },
  {
    type: 'confirm',
    name: 'cssModules',
    message: '是否启用css modules（该配置在商业能力模板不生效）',
    default: true,
  },
  {
    type: 'confirm',
    name: 'safeArea',
    message: '是否生成适配安全区的css代码？',
    default: true,
  },
  {
    type: 'checkbox',
    name: 'projectType',
    message: '你想要创建一个什么样的应用？',
    choices: [
      { name: '商业能力H5', value: 'bizH5', short: '商业能力H5、' },
      { name: '普通h5', value: 'h5', short: '普通h5、' },
      { name: 'PHA', value: 'pha', short: 'PHA、' },
      { name: 'Weex(Beta)', value: 'weex', short: 'Weex、' },
      { name: '小程序', value: 'miniapp', short: '小程序、' },
    ],
  },
];
