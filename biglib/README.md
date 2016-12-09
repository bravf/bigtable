## 前端组公共代码库

---
### 作者
`
dongdong.zhang
`

---
### 简介
`
美利金融前端公共代码库，包括但不限于js、css、html、py、图片、字体文件、配置文件等一切前端工程所需资源。
`

---
### 依赖

`
无
`

---
### 使用方法

(使用)

1. git clone git@gitlab.youjie.com:web/biglib.git (克隆代码)
2. cd my-product (进入业务工程目录)
3. python ../biglib/sync.py (执行同步脚本)

(更新biglib)

1. cd biglib
2. git pull

(贡献代码)

1. cd biglib
2. git checkout -b new-branch (创建分支，master被锁定)
3. 更新代码后提交
4. gitlab上提pr
5. 维护者（dongdong.zhang）进行review，并merge或者打回

---
### 注意事项

1. 一定要是公共代码，会被复用的代码，不要提交业务代码，注意代码质量。
2. 如果目录格式的组件，需要在目录中增加README.md，对组件进行说明，格式如此文档。
3. 如果单文件格式，在文件头增加readme注释，对文件进行说明。
