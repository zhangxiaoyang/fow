[![Build Status](https://travis-ci.org/zhangxiaoyang/fow.svg?branch=master)](https://travis-ci.org/zhangxiaoyang/fow)

FOW - Focus On Writing

Demo: <http://zhangxiaoyang.me/>

<!--more-->

快速入门
========

第一步：使用[npm](https://npmjs.org/)安装fow并更新。

```
npm install fow -g

```

第二步：创建静态博客。

```
fow init myblog
cd myblog
fow build
fow serve
```

第三步：访问<http://localhost:8090/>。

Fow简介
=======

- [NodeJS](http://nodejs.org/)编写，飞快生成静态博客，绿色无污染
- 使用[GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown/)、[YAML](http://www.yaml.org/)写文章、配置博客
- 基于**目录**生成静态博客，这一点和市面上的生成器不太一样哦
- 可以部署到[GitHub](https://github.com/)
- 自带[代码高亮](http://code.google.com/p/google-code-prettify/)、[LaTeX数学公式](http://www.mathjax.org/)、[多说评论](http://duoshuo.com/)、[FontAwesome](http://fortawesome.github.io/Font-Awesome/)图标字体
- 支持扩展插件
- 支持自定义主题
- 支持自定义页面

命令行
======

- fow [i/init] [DIR_NAME]
创建博客
- fow [n/new] [ARTICLE_ID]
创建一篇文章，ARTICLE_ID是`CATEGORY_NAME/ARTICLE_NAME`这样的格式，比如当前文章的ARTICLE_ID是`fow/quickstart`
- fow [b/build]
构建静态资源，默认情况下只构建修改后的`ARTICLE_ID`，可以加`--force`参数强制构建所有
- fow [s/serve] [PORT]
开启本地服务器，默认端口为8090，可以访问<http://localhost:8090/>预览博客
- fow [h/help]
显示帮助信息

在任意fow目录的层次中，均可以使用fow命令（init命令除外）。
ARTICLE_ID说明：ARTICLE_ID是固定的，即目录名+斜线+文章名。

写文章
======

执行`fow new ARTICLE_ID`创建的文章，对应于`drafts/categories/ARTICLE_ID.md`文件。

可以使用[GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown/)写文章。

## 摘要

```
我是摘要

<!--more-->

继续写文章

```

`<!--more-->`前面的内容将被作为摘要，就目前而言，摘要与其它内容的不同之处仅仅是样式不同。

## 图片

图片默认放在文章所在目录的`images`文件夹内，示例`![](xiyangyang.jpg)`。

## 公式

`${\widehat{C_i}} = C_i + \Phi(i) - \Phi(i-1)$`将会转换为以下公式。

${\widehat{C_i}} = C_i + \Phi(i) - \Phi(i-1)$

可以使用[在线公式编辑器](http://www.codecogs.com/latex/eqneditor.php?lang=zh-cn)来辅助生成LaTeX代码。


## 代码

<pre>
```python
    if __name__ == '__main__':
        print 'Fow!'
```
</pre>

转换后的代码如下。

```python
    if __name__ == '__main__':
        print 'Fow!'
```

元数据
======

元数据文件`drafts/meta.yml`是整个博客是索引，**非常重要**，示例如下。

```
- id: howto/helloworld
title: helloworld
category: howto
tags:
  - others
create_time: 2015-02-18 14:45:52
update_time: 2015-02-17 09:07:55
```

其中，id不建议修改，fow会自动管理。
建议修改title、category、tags、create_time、update_time，如下。

```
- id: howto/helloworld
title: 这是helloworld
category: 使用说明
tags:
  - fow
  - nodejs
  - 使用说明
create_time: 2015-02-18 14:45:52
update_time: 2015-02-17 09:07:55
```

博客配置
========

修改`config.yml`可以定制自己的博客，参数说明如下。

- title
会显示在浏览器的标签页上
- subtitle
会显示在个人头像的下方
- meta
html中相应的meta信息
- profile
avatar为个人头像，duoshuo为多说评论的id
- navigation
定制设置导航条，比如新加了一个自定义页面
- site
生成博客需要的一些基本信息，可以在此自定义博客的主题，博客的banner

自定义页面
=========

如果想新加一个页面，比如about（关于）的页面，可以在`drafts`文件夹中添加文件`about.md`，然后设置`config.yml`的`navigation`参数。

博客主题
========

可以在`themes`文件夹中添加自定义的主题，然后设置`config.yml`的`theme`参数。

默认主题为`themes/default`，修改自[Oishi](https://github.com/henryhuang/oishi/)。


博客插件
========

插件放置于`plugins`文件夹，目前有2个文件，`plugins/header_plugin.ejs`、`plugins/footer_plugin.ejs`，分别进行html的头部注入和尾部注入。

贡献
====

期待你的贡献！

- [Fow](https://github.com/zhangxiaoyang/fow) 核心代码
- [Fow Custom](https://github.com/zhangxiaoyang/fow-custom) 定制（包括布局、主题、插件）

感谢
====

Fow的开发离不开以下项目：

- <http://nodejs.org/>
- <https://github.com/hexojs/hexo>
- <https://github.com/ericzhang-cn/papery>

License
=======

MIT
