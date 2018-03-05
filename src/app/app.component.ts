import { Component, ViewChild, ElementRef } from "@angular/core";
import {
    Platform, IonicApp, App, Nav, ModalController, Keyboard, ToastController, Events, LoadingController,
    ActionSheetController
} from "ionic-angular";
import { NativeService } from "../providers/NativeService";
import { MainCtrl } from "../providers/MainCtrl";
import { CommonModel } from "../providers/CommonModel";
import { Utils } from "../providers/Utils";
import { HttpService } from "../providers/HttpService";
import { SpringboardPage } from "../pages/springboard/springboard";
import { Code404Page} from "../pages/wechat/code404/code404";
import { HttpConfig } from "../providers/HttpConfig";
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Console } from "@angular/core/src/console";

import {StatusBar} from "@ionic-native/status-bar";


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild('myNav') nav: Nav;
    springboardPag = SpringboardPage
    rootPage;
    defulRootPage='TabMenuPage';//默认登录页面
    backButtonPressed: boolean = false;//是否允许返回按钮

    constructor(private platform: Platform,
        private appCtrl: App,
        private keyboard: Keyboard,
        private ionicApp: IonicApp,
        private commonModel: CommonModel,
        private mainCtrl: MainCtrl,
        private toastCtrl: ToastController,
        private modalCtrl: ModalController,
        private nativeService: NativeService,
        private httpService: HttpService,
        private loadingCtrl: LoadingController,
        public actionSheetCtrl: ActionSheetController,

        public httpConfig: HttpConfig,public statusBar:StatusBar,

                public app:App) {
        platform.ready().then(() => {
            //设置公用信息平台信息配置
            this.mainCtrl.setPlatfrom();
            //获取平台启动必须项
            if ((this.mainCtrl.httpService.config.clientType == '2' && this.mainCtrl.httpService.config.storeId == null) ||
            (this.mainCtrl.httpService.config.clientType == '1' && this.mainCtrl.httpService.config.storeId != null)
        ) {
                this.rootPage = Code404Page;
                this.commonModel.APP_INIT_LOADING = true;
            } else { 
            this.appInit();
            }
            // this.nativeService.statusBarStyle();
            this.nativeService.splashScreenHide();
            //显示状态栏 by mwh
            // this.nativeService.showStatusBar();
            // statusBar.hide();
            // statusBar.show();  // The status bar plugin inserts their view correctly.
            statusBar.hide();

            setTimeout(()=>
            {
                statusBar.show();
            }, 1500);


                this.checkMode();//检测是否是页面模式

            this.registerBackButtonAction();//注册返回按键事件
            this.assertNetwork();//检测网络
        });
    }

    /**
     * 检测是否有网络
     */
    assertNetwork() {
        if (!this.nativeService.isConnecting()) {
            this.toastCtrl.create({
                message: '未检测到网络,请连接网络',
                showCloseButton: true,
                closeButtonText: '确定'
            }).present();
        }
    }

    /**
     * 监听安卓返回事件
     */
    registerBackButtonAction() {
        //是否是安卓
        if (!this.nativeService.isAndroid()) {
            return;
        }
        this.platform.registerBackButtonAction(() => {
            //如果键盘开启则隐藏键盘
            if (this.keyboard.isOpen()) {
                this.keyboard.close();
                return;
            }

            if (this.backButtonPressed) {
                return
            }

            //是否打开了modal  tost
            let activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._toastPortal.getActive() || this.ionicApp._overlayPortal.getActive();
            if (activePortal) {
                activePortal.dismiss();
                return;
            }
            if (this.appCtrl.getRootNav().getViews().length > 1) {
                this.appCtrl.getRootNav().pop()
            } else {
                if (this.nav.getActive().instance.tabs.getSelected().index != 0) {
                    this.nav.getActive().instance.tabs.select(0);
                    return;
                } else {
                    this.nativeService.minimize();
                }
            }
            // let activeVC = this.nav.getActive();
            // let tabs = activeVC.instance.tabs;
            // let activeNav = tabs.getSelected();
            // return activeNav.canGoBack() ? activeNav.pop() : this.nativeService.minimize();
        }, 1);

    }

    //双击退出提示框
    showExit() {
        if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
            this.platform.exitApp();
        } else {
            this.nativeService.showToast('再按一次退出应用');
            this.backButtonPressed = true;
            setTimeout(() => { //2秒内没有再次点击返回则将触发标志标记为false
                this.backButtonPressed = false;
            }, 2000)
        }
    }

    /**
     * 是否开启夜间模式
     */
    checkMode() {
        if (this.commonModel.mode != 'dark') {
            var light = document.createElement("div");
            light.className = 'light-mode';
            document.body.appendChild(light);
        }
    }

    /**
       * app项目初始化
       */
    appInit() {

        if (!this.commonModel.APP_INIT['checkUpdate']) {
            this.commonModel.APP_INIT['checkUpdate'] = {}
            this.commonModel.APP_INIT['getAppconfig'] = {}
        }
        if (this.mainCtrl.nativeService.isMobile()) {
            if (!this.commonModel.APP_INIT['localStorageUser']) {
                this.commonModel.APP_INIT['localStorageUser'] = {};
             }
            this.appSetup(this.defulRootPage)
        } else {
            if (this.mainCtrl.httpService.config.platform == 'wx') {
                if (!this.commonModel.APP_INIT['wechatInit']) {
                    this.commonModel.APP_INIT['wechatInit'] = {};
                    this.commonModel.APP_INIT['getWechatDomainName'] = {};
                    this.commonModel.APP_INIT['wechatUserInfo'] = {};
                }
            }
            this.appSetup();
        }

    }


    /**
       * 检测APP所需信息
       * @param rootPage 启动完毕设置根页面
       */
    appSetup(rootPage?) {
        this.commonModel.APP_INIT_LOADING = false;
        this.commonModel.APP_INIT_ERROR = false;

        /**公用加载数据start*/
        if ((this.commonModel.APP_INIT['checkUpdate'].loading && this.commonModel.APP_INIT['checkUpdate'].error) ||
            (!this.commonModel.APP_INIT['checkUpdate'].loading && !this.commonModel.APP_INIT['checkUpdate'].error)
        ) {
            this.checkVersion(rootPage);
        }
        if ((this.commonModel.APP_INIT['getAppconfig'].loading && this.commonModel.APP_INIT['getAppconfig'].error) ||
            (!this.commonModel.APP_INIT['getAppconfig'].loading && !this.commonModel.APP_INIT['getAppconfig'].error)
        ) {
            this.getAppconfig(rootPage);
        }
        /**公用加载数据end*/


        /**APP必须获取的用户信息*/
        if (this.mainCtrl.nativeService.isMobile()) {
            if ((this.commonModel.APP_INIT['localStorageUser'].loading && this.commonModel.APP_INIT['localStorageUser'].error) ||
            (!this.commonModel.APP_INIT['localStorageUser'].loading && !this.commonModel.APP_INIT['localStorageUser'].error)
        ) {
            this.checkUser(rootPage);
        }
    }

        /**微信必须加载的数据start*/
        if (this.mainCtrl.httpService.config.platform == 'wx') {
            if ((this.commonModel.APP_INIT['wechatInit'].loading && this.commonModel.APP_INIT['wechatInit'].error) ||
                (!this.commonModel.APP_INIT['wechatInit'].loading && !this.commonModel.APP_INIT['wechatInit'].error)
            ) {
                this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['wechatInit'])
                this.mainCtrl.thirdPartyApi.wechatInit().subscribe(data => {
                    if (data) {
                        this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['wechatInit'], true, false)
                    } else {
                        this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['wechatInit'], true, true)
                    }
                    this.checkEnd();
                });
            }
            
            if ((this.commonModel.APP_INIT['getWechatDomainName'].loading && this.commonModel.APP_INIT['getWechatDomainName'].error) ||
                (!this.commonModel.APP_INIT['getWechatDomainName'].loading && !this.commonModel.APP_INIT['getWechatDomainName'].error)
            ) {
                this.commonModel.APP_INIT['getWechatDomainName'] = {};
                this.mainCtrl.thirdPartyApi.getWechatDomainName().subscribe(
                    data => {
                        if (data.success) {
                            this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['getWechatDomainName'], true, false)
                        } else {
                            this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['getWechatDomainName'], true, true)
                        }
                        this.checkEnd();
                    });
            }



            if ((this.commonModel.APP_INIT['wechatUserInfo'].loading && this.commonModel.APP_INIT['wechatUserInfo'].error) ||
            (!this.commonModel.APP_INIT['wechatUserInfo'].loading && !this.commonModel.APP_INIT['wechatUserInfo'].error)
        ) {
            this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['wechatUserInfo'])
            this.mainCtrl.thirdPartyApi.getUserIdByOpenId().subscribe(data => {
                if (data) {
                    // 冉帅 因为微信授权后获取到userId，又被清空了
                    this.commonModel.userId = data.result.userId;
                    this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['wechatUserInfo'], true, false)
                } else {
                    this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['wechatUserInfo'], true, true)
                }
                this.checkEnd();
            });
        }
        }
         /**微信必须加载的数据end*/
    }

    /**
       * 获取APP配置信息
       */
    getAppconfig(rootPage?) {
        this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['getAppconfig'])
        console.log(this.commonModel.APP_INIT['getAppconfig'])
        this.mainCtrl.httpService.get(this.mainCtrl.httpService.config.host.bl + 'platformset/selectConfigInfo').subscribe(data => {
            if (data.success) {
                this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['getAppconfig'], true, false)
                this.commonModel.APP_INIT['getAppconfig'].data = data.result;
            } else {
                this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['getAppconfig'], true, true)
            }
            this.checkEnd(rootPage);
        })
    }

    /**
     * 检测版本升级 
     */
    checkVersion(rootPage?) {
        this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['checkUpdate'])
        if (this.nativeService.isMobile()) {
            this.nativeService.getVersionNumber().subscribe(res => {
                var version = {
                    type: 1,
                    uuid: this.httpConfig.uuid,
                    version: res
                }
                if (this.nativeService.isAndroid()) {
                    version.type = 1;
                } else if (this.nativeService.isIos()) {
                    version.type = 2;
                }
                this.mainCtrl.httpService.post(this.mainCtrl.httpService.config.host.bl + this.mainCtrl.httpService.config.version + 'app/queryIsUpdate', version
                ).subscribe(data => {
                    if (data.success) {
                        if (data.result) { 
                            this.backButtonPressed =  data.result.isForce == 0 ? false : true;
                            this.commonModel.APP_INIT['checkUpdate'].data = data.result;
                        }
                        this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['checkUpdate'], true, false)
                    } else {
                        this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['checkUpdate'], true, true)
                    }
                    this.checkEnd(rootPage);
                })
            })
        } else {
            this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['checkUpdate'], true, false);
            this.checkEnd(rootPage);
        }

    }

    /**
     * 打开modal下载
     * @param data 版本升级接口数据
     */
    downAPP() {
        if (this.commonModel.APP_INIT['checkUpdate'].data) { 
            let type = 1;
            if (this.nativeService.isAndroid()) {
                type = 1;
            } else if (this.nativeService.isIos()) {
                type = 2;
            }
            if (this.commonModel.APP_INIT['checkUpdate'].data) {
                // this.commonModel.APP_INIT['checkUpdate'].data.isForce = 1;
                this.mainCtrl.utils.openModal('PublicUpdateVersionPage', {
                    versionInfo:  this.commonModel.APP_INIT['checkUpdate'].data
                }, {}, false).subscribe(ok => {
                    if (ok) {
                        this.nativeService.downloadApp(type,  this.commonModel.APP_INIT['checkUpdate'].data.isForce,  this.commonModel.APP_INIT['checkUpdate'].data.fileName,  this.commonModel.APP_INIT['checkUpdate'].data.filePath);
                    }
                })
            }
        }
    }

    /**
     * 是否检测完毕
     */
    checkEnd(rootPage?) {
        var loading_count = 0;
        let listLength = 0;
        for (var item in this.commonModel.APP_INIT) {
            if (this.commonModel.APP_INIT[item].error) {
                this.commonModel.APP_INIT_ERROR = true;
            }

            if (this.commonModel.APP_INIT[item].loading && !this.commonModel.APP_INIT[item].error) {
                loading_count++;
            }
            listLength++
        }

        if (loading_count == listLength) {
            //如果是微信就rootPage 就没有值 
            if (rootPage)
            {
                let defulRootPage = this.defulRootPage;
                //如果是APP不需要记录浏览器地址
                window.localStorage.removeItem('hashUrl')
                //判断是否有启动页
                if (window.localStorage.getItem('guidePage')) {
                    if (this.mainCtrl.httpService.config.clientType == '1') {
                        this.rootPage = rootPage;
                    } else { 
                        this.rootPage =defulRootPage;
                    }
                    this.commonModel.APP_INIT_LOADING = true;
                    this.downAPP() //app需要
                } else {
                    this.httpService.get(this.httpConfig.host.bl + 'app/queryAppWelcomeUrl').subscribe(data => { 
                        if (data.success) {
                            this.app.getRootNav().setRoot('GuidePage', {
                                page:defulRootPage,
                                imgList:data.result.urls
                            })
                            this.commonModel.APP_INIT_LOADING = true;
                        } else { 
                            if (this.mainCtrl.httpService.config.clientType == '1') {
                                this.rootPage = rootPage;
                            } else { 
                                this.rootPage = defulRootPage;
                            }
                            this.commonModel.APP_INIT_LOADING = true;
                            this.downAPP() //app需要
                        }
                    })    
                }
            } else {
                //针对微信返回处理关闭浏览器
                window.addEventListener("popstate", e => {
                    e.stopPropagation();
                    console.log('浏览器返回事件'+ window.location.hash) 
                    // console.log('当前浏览器地址记录长度是'+document.title)
                }, false)
                //针对IOS 在微信端横屏处理
                window.addEventListener("orientationchange",()=>{              
                    setTimeout(() => {
                        document.getElementById('app').style.height = document.documentElement.clientHeight + 'px';
                        document.getElementById('app').style.width = document.documentElement.clientWidth + 'px';
                    }, 100);
                }, false);
                //所有页面返回都会触发此事件
                //      this.appCtrl.viewDidEnter.subscribe((app) => {
                //   }); 
                this.checkURL();
            }
        }
    }

    /**
    * 根据URL地址跳转到具体页面
    */
    checkURL() {
        window.history.pushState(null,null, "#/");
        // window.location.href="#/"
        //此处要根据window.localStorage.setItem('hashUrl')来进行页面跳转和设置跟页面  

        //此方法跳转不会修改浏览器地址 在微信直接返回就相当于根页面了
        // this.mainCtrl.goPage('BrainpowerTabsPage', {
        //     name: 'SpecialDetailPage',
        //     data: { id: 45, price: 8 }
        // })
        // let data=this.httpService.config.APP_PAGE_CONFIG
        if (!window.localStorage.getItem('hashUrl') || window.localStorage.getItem('hashUrl').indexOf('#') == -1) {
            this.rootPage = this.httpConfig.APP_PAGE_CONFIG['default'].ionicPage;
            this.commonModel.APP_INIT_LOADING = true;
        } else {
            let urlArray = window.localStorage.getItem('hashUrl').split('/');
            let urlPage = this.httpConfig.APP_PAGE_CONFIG[urlArray[1]];
            if (urlPage) {
                if (urlPage.isRoot) {
                    if (!urlPage.key){
                        this.rootPage = urlPage.ionicPage;
                        this.commonModel.APP_INIT_LOADING = true;
                    }else{
                        let param = {};
                        if (urlPage.key) {
                            for (let i in urlPage.key) {
                                (param as any)[urlPage.key[i]] = urlArray[parseInt(i) + 2];
                            }
                        }

                        this.rootPage = this.springboardPag;
                        setTimeout(() => {
                            this.app.getRootNav().setRoot(urlPage.ionicPage, param,
                                { animate: true }
                            ).then(() => {
                                this.app.getRootNav().popToRoot();
                                this.commonModel.APP_INIT_LOADING = true;
                            })
                        }, 1000);
                    }
                   
                } else {
                    if ((urlArray.length - 2) == urlPage.key.length) {
                        let param = {};
                        if (urlPage.key) {
                            for (let i in urlPage.key) {
                                (param as any)[urlPage.key[i]] = urlArray[parseInt(i) + 2];
                            }
                        }
                        this.rootPage = urlPage.root;
                        setTimeout(() => { 
                            this.app.getActiveNav().push(urlPage.ionicPage, param, { animate: false });
                            this.commonModel.APP_INIT_LOADING = true;
                        }, 1000)                        
                    } else { 
                        this.rootPage = Code404Page;
                        this.commonModel.APP_INIT_LOADING = true;
                    }
                }
            } else {
                this.rootPage = this.httpConfig.APP_PAGE_CONFIG['default'].ionicPage;
                this.commonModel.APP_INIT_LOADING = true;
            }
        }
    }

    /**
     * 检测用户信息 并设置到缓存
     */
    checkUser(rootPage?) {
        this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['localStorageUser'])
        if (window.localStorage.getItem('APP_USER_INFO')) {
            let APP_USER_INFO: any = JSON.parse(window.localStorage.getItem('APP_USER_INFO'));
            if (APP_USER_INFO.space == this.httpConfig.space && this.httpService.IS_DEBUG == APP_USER_INFO.IS_DEBUG && this.httpConfig.clientType == APP_USER_INFO.clientType) {
                this.commonModel.userId = APP_USER_INFO.userId;
                this.mainCtrl.getUserInfo().subscribe(data => {
                    if (this.mainCtrl.httpService.config.clientType == '1') {
                        if (!data.success) {
                            this.mainCtrl.clearUserInfo();
                        }
                        this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['localStorageUser'], true, false);
                        this.checkEnd(rootPage)
                    } else { 
                        this.getUserCard(rootPage);
                    }
                })
            } else {
                this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['localStorageUser'], true, false)
                window.localStorage.removeItem('APP_USER_INFO');
                this.checkEnd(rootPage);
            }
        } else { 
            this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['localStorageUser'], true, false);
            this.checkEnd(rootPage);
        }  
    }

    /**获取用户身份卡牌*/
    getUserCard(rootPage?) { 
        this.httpService.get(this.httpService.config.host.org + 'v2/user/queryUserLevelCardList').subscribe(data => {
            if (data.success) {
                data.result ? data.result : data.result = [{}];
                //物流人Id = 2
                let logisticsJson = {};
                //店铺 ID = 0；
                let storeJson = {};
                data.result.forEach((v, i) => {
                    if (v.roleid == 2) {
                        logisticsJson = v;
                    }
                    if (v.roleid == 0) {
                        storeJson = v;
                    }
                });
                let json = {
                    0: 'StorePage',
                    1: '招商合伙人',
                    2: 'LogisticsPage'
                }
                if ((logisticsJson as any).roleid == 2 && (logisticsJson as any).sourceType == 1) {
                    this.defulRootPage = 'logistics-tabs';
                } else if ((storeJson as any).roleid == 0 && (storeJson as any).sourceType == 1) {
                    this.defulRootPage = 'StorePage';
                }
            } else {
                    this.mainCtrl.clearUserInfo();
            } 
            this.mainCtrl.utils.setApiLoading(this.commonModel.APP_INIT['localStorageUser'], true, false);
            this.checkEnd(rootPage);
          })




    }









}
