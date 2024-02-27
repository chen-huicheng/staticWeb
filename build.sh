#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

cp google68903f220cfe3fbb.html .vuepress/dist/

# 进入生成的文件夹
cd .vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/chen-huicheng/leoblog.git master

cd -