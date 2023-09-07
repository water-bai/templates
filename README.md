# @ali/generator-halo-member-rax-scripts-cloud

使用文档：https://web.npm.alibaba-inc.com/package/@ali/generator-halo-member-rax-scripts-cloud

# 简介

基于 yoman 的 def 云脚手架，功能列表如下：

1. 根据 def 创建应用或者本地命令行问答，创建出 c 端应用模板，包括 h5、pha、weex、小程序等
2. 以命令的形式创建项目中的 页面、组件、接口模板
3. 符合预设工程目录结构的应用都可轻松接入

# 用法

## 创建应用

### 方式一：通过 def 创建（推荐）

https://space.o2.alibaba-inc.com/app/new

选择：基础类型 - web 研发 - web app - 业务平台-用户&营销导购 c 端应用模板解决方案
点击 下一步 进行创建

![alt](https://img.alicdn.com/imgextra/i3/O1CN01lqYa0g1nkfpbtj3WN_!!6000000005128-2-tps-1786-938.png)

![alt](https://gw.alicdn.com/imgextra/i3/O1CN01q40g4e1ZOmHAzprjW_!!6000000003185-2-tps-2202-1246.png)

### 方式二：通过本地命令创建（不推荐）

云脚手架依赖 yoman 进行创建，所以得先在本地安装 yoman

由于 def 打通了 gitlab、aplus 等，可以在创建时直接获取 git 地址和 spmA 等数据，本地创建这部分能力是缺失的。

```bash
npm i yo @ali/generator-halo-member-rax-scripts-cloud -g

```

```bash
mkdir your-app-name

cd your-app-name

yo @ali/halo-member-rax-scripts-cloud
```

## 创建页面、组件或 mtop 接口

首先要确保当前已创建的项目工程目录下，运行

```bash
# 创建页面
npm run create-p
# 创建组件
npm run create-c
# 创建mtop接口
npm run create-s
```

### 快捷调用

如果你已经对它很熟悉了，每次创建都会以问题的形式交互，难免有点繁琐，这里也提供了创建模板的快捷调用，输入参数之后命令行不会出现问题提示

```bash
# 创建页面
npm run create-p --name=your-page-name --type=global|page --page=target-page-name
# 创建组件
npm run create-c --name=component-name
# 创建mtop接口
npm run create-s --name=mtop.your.api.name
```

# 其他 react 仓库接入

## 什么样的仓库才支持

工程目录格式满足如下条件的仓库，能完美支持。

```
├── src // 源码目录
│ ├── components // 自定义业务组件
│ ├── pages // 路由页面组件
| | ├── about
| | | ├── components // 页面级组件
| | | ├── index.tsx
| | | ├── index.module.scss
│ └── app.ts // 应用入口

```

## 如何接入

1. 在工程根目录新建.yo-rc.json，文件内容如下，根据具体需要修改下 value 值

```json
{
  "@ali/generator-halo-member-rax-scripts-cloud": {
    "spmA": "your-spm-a",
    "name": "your-app-name",
    "description": "your-app-description",
    "cssModules": true,
    "safeArea": true,
    "h5": true,
    "pha": true,
    "weex": false,
    "miniapp": true
  }
}
```

2. 安装相关 dev 依赖

```bash
npm i yo @ali/generator-halo-member-rax-scripts-cloud -D
```

3. 添加 scripts

```json
{
  "scripts": {
    "create-c": "yo @ali/halo-member-rax-scripts-cloud:component --name=$npm_config_name --type=$npm_config_type --page=$npm_config_page",
    "create-p": "yo @ali/halo-member-rax-scripts-cloud:page --name=$npm_config_name",
    "create-s": "yo @ali/halo-member-rax-scripts-cloud:service --name=$npm_config_name"
  }
}
```
