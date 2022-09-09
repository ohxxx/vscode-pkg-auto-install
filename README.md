<sub><em>Pkg Auto Install for VS Code</em></sub>
<h1 align="center">
  <img src="./assets/logo.png" height="100">
</h1>

## 简介

自动执行 `install` 指令，无需手动打开命令行操作

## 特性

- 保存 package.json 后自动 `install`

## 效果

![](assets/preview.gif)

## TODOs

- [ ] 精确 install 触发条件（dependencies、devDependencies 修改触发）
- [ ] 支持 install 中额外配置（--force、–legacy-peer-deps...）
- [ ] terminal 自动切换地址（monorepo 问题）
- [ ] 支持 monorepo（pnpm、lerna）
- [ ] （???）删除 terminal 模式，直接在后台运行更新 