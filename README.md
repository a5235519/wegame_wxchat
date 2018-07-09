# 自定义小程序Mpvue脚手架

---

# 脚手架工程介绍

![脚手架工程介绍](https://a5235519.github.io/imgfile/imgfile_wxchat_2.png)

> **wxchat_cli**：用于存放小程序脚手架的配置与相关插件

> **wxchat_project**：用于存放小程序实际开发项目，项目会通过脚手架自动生成初始模版，命名规范为 wxchat_stenli(负责人)_项目名

> **wxchat_standard**：用于存放小程序开发规范

# 脚手架开发流程

> 的是以小程序项目来推动重构的Vue开发，高效完成重构页面的制作同时，打破UI开发与前端之间的技术局限，丰富和拓展UI开发的技术储备，能够使小程序支持组件化开发，减少小程序的学习成本，同时优化小程序开发成本。

![脚手架开发流程](https://a5235519.github.io/imgfile/imgfile_wxchat_1.png)

## 为什么要在开发小程序时，还要进行静态页面开发，不直接采用mpvue的方式进行开发？

* 1. 重构开发初期时如果同时考虑结构——样式——数据——渲染——组件，直接进行架构会降低重构开发速度

* 2. 无法直观的查看页面初始版本，经过开发后初始项目无法保存

* 3. 在开发时，小程序页面刷新有几秒的延迟，对重构实时查看样式与结构的改变极其不友好

* 4. 小程序的调试工具在使用上不太方便

---

# 小程序环境安装

## 全局安装Yeoman

`tnpm install -g yo`

---

## 脚手架的配置安装

* 对 **wxchat_cli/package.json** 配置进行安装，在目录下执行 **tnpm install** 命令。该配置主要是小程序开发环境依赖 **（该配置主要是小程序开发环境依赖）**

* 接着对 **wxchat_cli/generator-wxchatCli/package.json** 配置进行安装 **（如果不做此操作，yeoman脚手架无法找到自定义的脚手架命令，作用是帮助yeoman识别程序脚手架**

---

## 将脚手架添加到全局

在 **wxchat_cli/generator-wxchatCli** 项目中，执行 **tnpm link**

作用是将小程序脚手架提到全局环境，这样才能在 wxchat_project 项目中找到对应的脚手架进行配置

![示例](https://a5235519.github.io/imgfile/imgfile_wxchat_4.png)

---

# 构建环境介绍

![构建流程](https://a5235519.github.io/imgfile/imgfile_wxchat_3.png)

*	**重构开发环境构建命令：gulp  static**
*	**项目部署构建命令：gulp  dev**
*	**前端开发环境构建命令：tnpm  run dev**
*	**前端生产环境构建命令：tnpm  run build**