<sub><em>Pkg Auto Install for VS Code</em></sub>
<h1 align="center">
  <img src="./assets/logo.png" height="100">
</h1>

## 简介

自动执行 `install` 指令，无需手动打开命令行操作

## 特性

- 在 package.json 文件中修改后自动 `install`
  - dependencies
  - devDependencies
  - peerDependencies
- 支持 monorepo

## 效果

![](assets/preview.gif)

## TODOs

- [ ] 支持 install 中额外配置（--force、–legacy-peer-deps...）
- [ ] （???）删除 terminal 模式，直接在后台运行更新 