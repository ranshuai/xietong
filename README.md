		/**项目解决方案*/
		1:怎么设置tabs位于顶部？不要全局设置的?
			解决：<ion-tabs tabsPlacement="top" color="primary">

		2:如何隐藏自带的返回按钮？
			解决: <ion-navbar hideBackButton="true">

		3:二级页面返回是 header停留延迟
			解决：头部信息都放到ionic自带的ionic-title标签里

		4：phone里数字会自动变成蓝色
      解决方法:  把他识别为手机号了，加上<meta name="format-detection" content="telephone=no" />就好

		5: Unexpected value 'ConfigCommon in /Users/lixiaofei/Desktop/apollo-2/src/common/config.common.ts' imported by the module 'userInfoEditPageModule in /Users/lixiaofei/Desktop/apollo-2/src/pages/user/userInfo-edit/userInfo-edit.module.ts'. Please add a @NgModule annotation.

      解决方法:ConfigCommon 配置文件在 userInfoEditPageModule  错误引入了 


		6：密码字段在重新获取焦点后清楚了内容
			参考文档:https://github.com/ionic-team/ionic/issues/11274
			解决方法: clearOnEdit="false" 
			

		7：如何视觉校对
		页面page {
    background-image: url('../assets/bgImg/1-1首页-客服弹窗.jpg');
    background-repeat: no-repeat;
    background-size:750px 1334px;
    background-position-y: 0;
    ion-content{
      opacity: .3;
    }
    .ion-header{
      opacity: .3;
    }
		}

  8:对象如何神拷贝
    Object.assign()
    参考文档 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign


  9:组件事件传递
  //页面使用
  // (outResetAnswer)="resetAnswer()" 
  //组件
  // resetAnswer() {
  //   this.outResetAnswer.emit()
  // }
  //   @Input() data: any;
  // @Output() outResetAnswer = new EventEmitter(); 



  10：页面根节点跳转问题 在tabs中子页面
    setTimeout(() => {
      this.app.getRootNav().setRoot('BrainpowerTabsPage', {
        type: 'root',
        page:'BrainpowerTabsPage'
      }, 
        {animate: false}
      ).then(() =>{
        this.app.getRootNav().popToRoot();
        //....
    })
    }, 5000);


***********************************ionic命令*************************************************
ionic docs [topic] ·············· 打开Ionic的文档
[topic]  ·············· 指定帮助文档的标题。可以使用“ls”查看全部文档的标题

ionic info ·············· 打印系统\环境信息

ionic help [command] ·············· 显示指定命令的帮助文档

ionic start [options] [path] [template] ·············· 在指定路径新建一个Ionic项目

 [options] ·············· 选项：[--skip-npm]跳过安装npm包、[--list|-l]列出可用的启动模板、[--v2]创建ionic2项目。
 [path] ·············· 新项目的路径。
 [template] ·············· 可以按一个确定的模板新建项目，例如tabs、sidemenu、blank，或者是一个github地址、一个本地路径。该参数默认是“tabs”。

ionic serve [options] ·············· 开启一个本地开发服务用来开发和调试
 [--port|-p] ·············· 指定本地服务端口号（默认8100）。
 [--livereload-port|-r] ·············· 指定即时刷新端口号（默认35729）。
 [--nobrowser|-b] ·············· 禁止启动浏览器
 [--nolivereload|-d] ·············· 禁用即时刷新
 [--noproxy|-x] ·············· 禁用网络代理
 [--browser|-w] ·············· 指定浏览器（safari、firefox、chrome）
 [--platform|-t] ·············· 指定平台（ios、android）

ionic login ·············· 登录Ionic账户
[--email|-e] ·············· ionic账户邮箱
[--password|-p] ·············· ionic账户密码

app命令

ionic upload ·············· 上传app到ionic账户
[--email|-e] ·············· ionic账户邮箱 
[--password|-p] ·············· ionic账户密码 
[--note] ·············· 为本次上传添加注释

ionic share [email] ·············· 使用电子邮件分享app给朋友、客户、合作伙伴或客户端

ionic lib [options] [update] ·············· 获取ionic资源库版本，使用update功能可以更新www/lib/ionic中的Ionic Framework

[--version|-v] ·············· 指定要更新的Ionic版本号，否则默认更新到最新版

ionic io [command] ·············· 将本地app与ionic云服务同步
[command]: init

ionic link [appId] ·············· 为项目设置Ionic App ID
项目命令

ionic g [name]·············· 生成page、component等
[--list] ·············· 列出可用的生成器
[--skipScss] ·············· 在创建page或component时不创建scss文件
[--pagesDir] ·············· 指定创建page的路径，component、directive、pipe、provider同理
ionic generate page home home.html,home.ts,home.scss三个文件之外，还会生成home.module.ts,内容如下：

ionic platform [action] [platform] [options] ·············· 给Ionic app添加（add）或移除（rm）platform
[--noresources|-r] ·············· 不添加默认的默认的ionic图标和闪屏图片
[--nosave|-e] ·············· 不把平台信息保存到package文件（默认就不保存）
[--save] ·············· 把平台信息保存到package文件

ionic run [platform] [options] ·············· 在已连接的设备或者模拟器运行ionic项目
[--livereload|-l] ·············· 即时刷新app的源文件（内测）
[--address] ·············· 使用特定服务器地址（即时刷新模式可用）
[--port|-p] ·············· 指定端口号（即时刷新模式可用，默认8100）
[--livereload-port|-r] ·············· 指定即时刷新的端口（即时刷新模式可用，默认35729）
[--debug|--release] ·············· 选择开发模式或者发布模式
[--device|--emulator|--target=FOO] ·············· 选择设备、模拟器、特定项目

ionic emluate [platform] [options] ·············· 在模拟器或者其他仿真设备
ionic build [platform] [options] ·············· 创建一个指定平台下的Ionic项目（即预编译和编译）
[--nohooks|-n] ·············· 不添加默认的hooks

ionic plugin add [options] [spec] ·············· 添加cordova plugin，[spec] 可以是一个插件ID、一个本地路径或者一个git url
[--searchpath [directory]] ·············· 当使用插件ID搜索插件时，首先搜索插件中的目录和子目录，然后再搜索注册时的目录
[--nosave|-e] ·············· 不把插件信息保存到package文件（默认就不保存）
[--save] ·············· 把插件信息保存到package文件

ionic resources ·············· 自动创建app的图标和闪屏图片资源（内测），将图片放在./resources目录，接受扩展名为.png、.ai、.psd，图标不能带圆角，尺寸是192x192px，闪屏页图片必须在中央，尺寸是2208x2208px
[--icon|-i] ·············· 生成图标资源
[--splash|-s] ·············· 生成闪屏图片资源

hooks [add|remove|permissions|perm] ·············· 管理cordova hook
state [command] ·············· 将Ionic应用的状态保存到package.json或者从package.json中恢复Ionic应用状态（可用来保存平台和插件状态或一键安装平台和插件）
[save]  ·············· 将Ionic应用的状态保存到package.json
[restore]  ·············· 从package.json中恢复Ionic应用状态
[clear]  ·············· 在package.json中清除cordova平台和插件信息，相当于移除了platforms和plugins文件夹
[reset]  ·············· 移除platforms和plugins文件夹，然后再重新安装platforms和plugins
[--plugins]  ·············· 只对plugins操作
[--platforms]  ·············· 只对platforms操作

Ionic3命令大全
全局命令
ionic docs ·············· 打开Ionic官方文档
ionic info ·············· 打印系统\环境信息
ionic login ·············· 使用Ionic ID登录
ionic signup ·············· 注册一个Ionic账号
ionic start ·············· 创建一个新项目
ionic telemetry ·············· 打开Ionic用户改善反馈
项目命令
ionic g [page] [pageName] ·············· 生成pipe、component、page、directive、provider和tab
ionic link ·············· 将本地app连接到Ionic服务器
ionic serve ·············· 开启一个本地开发服务用来开发和调试
ionic upload ·············· 上传app的快照（需要先运行ionic link）
cordova命令
ionic cordova build [platform] ·············· 创建一个指定平台下的Ionic项目（即预编译和编译）
ionic cordova compile [platform] ·············· 编译native平台代码
ionic cordova emulate [platform] ·············· 在模拟器上运行
ionic cordova platform [platform] ·············· 管理cordova平台
可操作的指令有： 
add ·············· 添加平台 
rm ·············· 移除平台 
update ·············· 更新平台 
ls ·············· 查看平台列表 
save ·············· 保存当前平台状态
可操作的平台有： 
ios ·············· iOS 
android ·············· Android
ionic cordova plugin ·············· 管理cordova插件
ionic cordova plugin可操作的指令有： 
add ·············· 添加插件 
rm ·············· 移除插件 
ls ·············· 查看已安装插件列表 
save ·············· 保存当前插件状态
可操作的插件有： 
ionicFramework里自己找
ionic cordova prepare [platform] ·············· 将元数据转化成平台源文件，将资源拷贝到cordova项目中（可以指定平台），根据config.xml来恢复平台和插件目录
ionic cordova resources [platform] ·············· 自动生成appIcon和闪屏图片
ionic cordova run [platform] ·············· 在已连接的设备或模拟器上运行
package命令
ionic package build ·············· 启动打包
ionic package download ·············· 下载已打包的app
ionic package info ·············· 查看包的信息
ionic package list ·············· 查看服务器上的包的列表
ionic cordova build android --release --prod 打包签名压缩包






-----------------------------------------------------------------------------------
headers  接收多余参数接口改动
 
     delivery/takeGoods    李昊
     delivery/grabOrder    李昊
     delivery/overSchedule 李昊



     /delivery/saveReceivOrderType  选择接单类型（多选） 东升 


apply-role.ts 依赖 gouxaingke文件夹中设置手机页面/user-set-mobile


  config {
     StoreId; 店铺ID
     PLATFORM; 平台类型 { app, storeApp}

  }

  需求 
  1.把店铺app合并到calink
    店铺app 不显示分类和消息，但是有购物车。

    1.1 ok 
      判断 PLATFORM 的属性
      如果是APP 显示域商城的tabs
      如果是STOREAPP 显示店铺商城的tabs  
    1.2首页模版 （新建店铺首页模版）
      this.userHomePage = "UserStoreHomePage" //店铺主页 
    1.2.1
      调用接口传递StoreId 从config读取




差异代码

分类 

  'WX': {
        'home': 'v2/category/queryCategory',
        'list':'v2/category/queryCategory'
      },
  'STOREAPP': {
    'home': 'v2/category/queryHomeCategory',
    'list':'v2/goods/queryGoodsList'



遇到的问题
(this.mainCtrl.commonModel.userInfo as any).isPayPwd=1;

购享客 space

DF4D69929FD7F405

独角鲸 

92E21DE17C0CE872
修改
config 文件 和 HttpConfig文件