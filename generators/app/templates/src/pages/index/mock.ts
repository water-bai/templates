export default {
  api: {
    modifyMobileUri: '/mock/send_code',
  },
  bizData: {
    maskMobile: '144******45',
  },
  text: {
    pageHeader: '手机号',
  },
  view: {
    layout: {
      root: 'root_component',
      structure: {
        root_component: ['Button', 'Input'],
      },
    },
    module: {
      Button: {
        options: {
          type: 'primary',
          btnText: '修改手机号',
        },
        type: 'Button',
      },
      Input: {
        options: {
          value: '我是Input',
        },
        type: 'Input',
      },
    },
    theme: {
      '--color-brand1-6': '#02b6fd',
    },
  },
};
