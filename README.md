# mrblog
一个终于解决了由于activation energy太高导致我总是懒得发东西的问题的博客23333。

下面说明里搭的那个样本博客在[这里](https://miyehniar.github.io/blog/)。

## 写在前面
....写不动了= =。最近还会再更新的，现在先这样吧。

长话短说就是我把自己用的博客整理了一下发出来，欢迎来一起搭个博客碎碎念或者写文~

#### 近期打算更新的东西：
- 本地模式（查看非公开博文）
- 单页显示单条博文
- 修改/删除博文的脚本
- 播放列表为空时隐藏bgm播放器
- 题头图？背景图？背景p5？

## 事先准备

**注意：这个master branch里的是给mac的源码，这个文件是mac版的说明，win版的码和说明在win branch里**

学一点基本的linux命令行操作，会从命令行去各个文件夹，会从命令行里执行命令，知道管理文件的基本术语，绝对路径，相对路径等。

会用一点github，有一个免费的github账号

安装这几个东西：
- [brew](https://brew.sh/) (`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`)
- [node](https://nodejs.org/) (`brew install node`)
- [imagemagick](https://imagemagick.org/index.php)(`brew install imagemagick`)
- pip3 (我怎么装的全忘了... 只知道linux能[这样安装](https://linuxize.com/post/how-to-install-pip-on-ubuntu-18.04/))
- 一个markdown编辑器，并用它关联`.md`文件（我用的是[Markdown Pro](http://www.markdownpro.com/))

## 搭建博客

### 创建相关repo

确保有这两个repo，没有就建：一个是`<用户名>.github.io`，另一个是新建的空repo，这个空repo的名字决定博客地址在域名下面哪个page
* 注意："空的repo" 指的是里面*啥都没*，没有README.md也没有.gitignore

### 把需要的文件下载到本地

回到本地，找一个文件夹，这个文件夹需要满足这几个要求：
* 它的完整路径里只有除了`(`, `)`, `\`之外的[ASCII字符](https://ascii.cl/)（对不起这个blog不是很robust....OTZ
* 你不打算去重命名它的任何母文件夹

从命令行进入这个找好的文件夹，然后
```
$ git clone https://github.com/<你github用户名>/<你github用户名>.github.io.git
```
你会发现多了一个文件夹，接下来我说`<内容文件夹>`就指它。接着
```
$ git clone https://github.com/miyehn/mrblog.git
```
又多了一个文件夹，接下来的`<博客文件夹>`就指它。

两个文件夹是可以随意重命名的，要重命名它们就现在了，以后不好改。

### 本地设置

打开`<博客文件夹>/package.json`，填写这四行：
```
"github_username": "<你github用户名>",
"homepage": "<博客主页>",
"scripts_dir": "<脚本路径>",
"content_dir": "<内容路径>",
```
<博客主页> 就是`https://<你的github用户名>.github.io/<子路径>`，其中<子路径>就是你刚刚创建的第二个repo的名字，比如我用户名是`miyehniar`, 第二个repo叫`blog`，我这里就填`https://miyehniar.github.io/blog`

<脚本路径> 就是`<博客文件夹>/scripts`文件夹的绝对路径

<内容路径> 就是`<内容文件夹>/mrblog-content`文件夹的绝对路径

命令行进入`<博客文件夹>`，执行
```
$ scripts/init
$ source ~/.bash_profile
```
检查一下：
```
$ mrblog
```
如果看到welcome to mrblog啥的，那本地的设置就算完成了。接着确保命令行还在`<博客文件夹>`目录那里，让博客初次上线：
```
$ npm run deploy
```

如果不报错，能看到最后那个"published"的话，博客就搭好了！去网页上应该就能看到一个空博客（可能需要稍微等几分钟）。

## 编写博客
### 基本流程

从命令行
```
$ mrblog new
```
在跳出的`.md`文件里填写
* `title`（标题，选填）
* `date`（时间，一般不用动）
* `tags`（标签，多个标签用英文逗号隔开）
* `public`（是否公开，true即公开，填其它或者不填即不公开，只能本地查看）

↓填好后在下方写博文，写好之后保存退出。

![6B53BAA6-B3CF-447F-B1F0-985A4538D831.png](https://miyehn.me/files/mr-pics/55275E4B05073E67ED775080F3505478.jpg)
然后从命令行
```
$ mrblog publish
```
发布更新。

### 插入图片

从命令行
```
$ mrblog pic
```

然后从文件夹拖一张图片过来，回车。

↓回到正在编写的博文，粘贴。（不成功的话把命令行里`![](...)`那一行复制粘贴到在编写的博文里）
![C8E2F733-1E63-4077-A979-0927D60E21F4.png](https://miyehn.me/files/mr-pics/AAC201B7F46216C852F6AB27F755753A.jpg)

这个时候markdown编辑器里是加载不出图片的，没关系发布之后就有了。还没有的话稍微等几分钟，图片更新有点慢。

ps. 虽然预览里看不出来，发布之后图片是占单独一行的。

ps. jpg和png格式的图片会被缩到横向最多800px，纵向最多600px。

### 置顶

如果把`date`一栏填写为pinned，这条博文就会置顶。


## 自定义设置

命令行去到博客文件夹然后
```
$ npm start
```
会看到浏览器打开博客预览。以下修改都可以通过刷新预览页面看到变化。全部改完后`ctrl + c`关掉预览然后
```
$ npm run deploy
```
重新部署博客。

### 基本设置

打开`<博客文件夹>/src/config.js`。

填写自己的邮箱和社交网站主页地址。
* 社交网站地址填了哪几个就会按顺序显示哪几个。
* 各个社交网站可以重新排序，但是platform只能是这几个（除非你去改源码...）

填写title（博客名）和PostsPerPage（每页显示的博文数量）

填写Intro下面被`<p>...</p>`包裹的博客介绍，不同段落分开用`<p>...</p>`包裹。

替换Friends下面的`friends list↓`为 "友链"，"朋友们" 或者别的什么表示友链的文字，替换`myself`为友链博客名，替换博客名前的地址为友链地址。
* 其实一整个div里面的内容都换成别的什么react component也没问题...

（现阶段无视那个password）

准备一个长宽都不超过240px的博客logo，命名为avatar.png或者avatar.jpg，放在`<博客文件夹>/src`目录下替换掉那个avatar.png。(或者直接删掉那个avatar.png，这样logo的位置会显示博客名）

准备好favicon.ico放在`<博客文件夹>/public`目录下。不放也不影响使用

### 修改博客外观
打开`<博客文件夹>/src/style/style.css`，修改字体，字号，行间距，博客颜色等变量。

或者修改/重写整个`<博客文件夹>/src/style`文件夹里的东西，相当于制作新的主题。

或者修改`<博客文件夹>/src/main.js`里的博客源码。不过这个文件如果被修改过的话，再通过`scripts/update`下载更新的话会有merge conflict。

