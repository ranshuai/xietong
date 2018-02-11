import { MainCtrl } from './../../../providers/MainCtrl';
import { HttpConfig } from './../../../providers/HttpConfig';
import { CommonModel } from './../../../providers/CommonModel';
import { GlobalDataProvider } from './../providers/global-data/global-data.model';
import { Api } from './../providers/api/api';
import { Config } from './../providers/api/config.model';
import {Component, ElementRef, ViewChild} from '@angular/core';
import { App, IonicPage, NavController, NavParams, Tabs, Events,ModalController } from 'ionic-angular';
import {HttpService} from "../../../providers/HttpService";
/**
 * Generated class for the TabMenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tab-menu',
  templateUrl: 'tab-menu.html',
})
export class TabMenuPage {
    @ViewChild('tabMenus') tabs: Tabs;
    @ViewChild('customeMsgTab') customeMsgTab: ElementRef;
    userHomePage;
    userTopicPage;//专题
    userCategoryPage; //分类
    userInfoPage;//个人
    snsUserInfoPage; //消息 
    userCartPage;// STOREAPP=》购物车 

    msgEle;
    badgeEle;
    isShowPoint: any = true;
    index; //tabs 的下标;
  constructor(public navCtrl: NavController, public navParams: NavParams,public app:App,
      private events: Events, public config: Config, public api: Api, public globalDataProvider: GlobalDataProvider, public commonModel: CommonModel, public httpConfig: HttpConfig,public mainCtrl:MainCtrl,public modalCtrl : ModalController,
              public httpService:HttpService) {
      //订阅新消息
      events.subscribe("recMsg",(msg)=>{
         window.localStorage.setItem("hasUnread",'true');
         this.isShowPoint=true;
      });
      if (this.httpConfig.clientType == '2') { 
        //获取模版信息
        this.api.post(this.api.config.host.bl + 'v2/homePage/selectStoreTemplet').subscribe(data => {
            if (data.success) {
                globalDataProvider.tabColor = data.result;
            }
        });
         //用户杀进程如果用户是这个app的管理员直接跳到店铺管理界面
        // let data = JSON.parse(window.localStorage.getItem('storeJson'));
        // if (data && data.roleid == 0 && data.sourceType == 1) {
        //     this.mainCtrl.setRootPage('StorePage');
        //   }  
        //如果是店铺app，保存ID
        window.localStorage.setItem('storeId', this.config.STOREID);  
      }
     

      this.index = navParams.get('index');
    
      //根据 PLATFORM: any = 'APP'; 判断是什么应用；
      if (this.config.PLATFORM == 'APP' || this.config.PLATFORM == 'WX') {
          this.userHomePage = "UserHomePage" //主页
          this.userTopicPage = "UserTopicPage" //专题
          this.userCategoryPage = "UserCategoryPage" //分类
          this.userInfoPage = "UserInfoPage" //个人
          this.snsUserInfoPage = "SnsUserInfoPage" //消息
      } else { 
          this.userHomePage = "UserStoreHomePage" //店铺主页
          this.userCartPage = 'UserShoppingCartDetailPage'; //购物车
          this.userCategoryPage = "UserCategoryPage" //分类  
          this.userInfoPage = "UserInfoPage" //个人
      }
      events.subscribe("recMsg",()=>{
          console.log("tabmenu页面收到recMsg事件");
      //    由于ionViewDidLoad不会每次生效，在这里刷新未读状态
          this.isShowPoint=window.localStorage.getItem("hasUnread");
          this.setBadge();
      });
      events.subscribe("refreshBadge",()=>{
          console.log("tabmenu页面收到refreshBadge事件");
          this.setBadge();
      });


  }
  ionViewWillLeave(){
      console.log("即将离开底部菜单TabMenu");
  }
    ionViewDidLoad() {
        let messageMenu=this.tabs.getNativeElement();
        // let customeMsgEle=this.customeMsgTab.nativeElement;

        this.msgEle =messageMenu.querySelectorAll("a.tab-button")[1];//消息菜单
        if( this.msgEle){
            this.badgeEle=this.msgEle.querySelector("ion-badge.tab-badge");//消息角标
            this.msgMenuClick(); // 给消息菜单设置点击事件
        }
        //查询是否有新消息
        this.getTotalUnreadCount();

        //微信只能的得到userId 通过userId获取用户信息
        if (this.httpConfig.clientType == '2') { 
            this.api.get(this.api.config.host.org + 'user/userinfo').subscribe(data => {
                if (data.success) {
                  data.result.headPic = data.result.headPic ? data.result.headPic : '../assets/img/deful_headerPic.jpg';
                  this.commonModel.TAB_INIT_USERINFO = data.result;
                } 
            });
        }

        /**
         * 提示用户 切换卡片的功能
         * 1.在localstore中查找是否有 toGuide 这个字段
        */
        if (this.httpConfig.clientType != '2') {
            if (window.localStorage.getItem('toGuide') != 'ture') {
                window.localStorage.setItem('toGuide', 'ture');
                let toGuideModal = this.modalCtrl.create(
                    'ToGuidePage',
                    {},
                    { cssClass: 'to_guide'}
                  );
                toGuideModal.present();
             }
         }

         //从缓存中获取是否有新消息
        this.isShowPoint=window.localStorage.getItem("hasUnread");
         //获取配置信息
      /**
       * is_allow 是否确认收货
       * is_allow_wholesale 是否批发
       * is_allow_groupon 是否拼团
       * is_allow_proxy 是否代售
       * is_allow_minbuynum 是否最小起批量
       */
      this.api.get(this.api.config.host.bl + '/platformset/selectConfigInfo', {
        nameStr:'is_allow,is_allow_proxy,is_allow_groupon,is_allow_wholesale,is_allow_minbuynum'
      }).subscribe(data => {
        if (data.success) { 
            data.result ? data.result : {};
            this.globalDataProvider.platformsetSelectConfigInfo = data.result;
        }
      })  

 
  }
  msgMenuClick(){
      this.msgEle.addEventListener("click",()=>{
      console.log("消息菜单被点击了...");
          this.events.publish('enterSnsPage');
      });
  }

    ngAfterViewInit() {

        setTimeout(() => { 
            if (this.index) { 
                this.tabs.select(this.index);
                this.index = '';
            }
        }, 30)
    }

    ionViewWillEnter(){
        window.localStorage.setItem("currentPage","tabMenu");

        //查询是否有新消息
        this.getTotalUnreadCount();


        if (this.tabs.getSelected()) { 
            if (this.httpConfig.clientType == '2') {
                if (this.tabs.getSelected().index == 3) {
                    if (this.commonModel.TAB_INIT_USERINFO) {
                    } else { 
                        this.tabs.select(0)
                    }
                }
                if (this.tabs.getSelected().index == 2) {
                    this.tabs.select(0)
                }
            }
            if (this.httpConfig.clientType == '1') {
                if (this.tabs.getSelected().index == 3) {
                    if (this.commonModel.TAB_INIT_USERINFO) {
                    } else { 
                        this.tabs.select(0)
                    }
                }
            }
          
        }
    }

    /**
     * 获取总未读消息数
     */
    getTotalUnreadCount() {
        this.httpService.get(this.httpService.config.host.org + "sns/history/unread/all")
            .subscribe((data) => {
                if (data.success) {
                    console.log("从服务器获取总未读消息数：", data.result);
                    if (data.result != null && data.result != undefined) {
                        this.isShowPoint = data.result > 0 ? 'true' : 'false';
                        window.localStorage.setItem("hasUnread", this.isShowPoint);
                        //判断是否显示角标
                        this.setBadge();
                    }

                }
            });
    }
        /**
         *  根据是否有未读消息判断是否显示角标
         */
        setBadge(){
        if(window.localStorage.getItem("hasUnread")=='true'){//有最新消息
        //    如果没有class则加上
            if(this.badgeEle){
                this.badgeEle.style.display='inline-block';
                let classStr=this.badgeEle.className;
                if(classStr.indexOf("msg-badge")==-1){
                    this.badgeEle.className+=' msg-badge';
                }

            }
        }else{//无最新消息
        //    如果有class则移除
            if(this.badgeEle){
                this.badgeEle.style.display='none';
                let classStr=this.badgeEle.className;
                if(classStr.indexOf("msg-badge")!=-1){
                    classStr=classStr.replace("msg-badge","");

                    this.badgeEle.className=classStr;
                }
            }
        }

    }
    ionViewCanEnter(): boolean{
      // here we can either return true or false
      // depending on if we want to leave this view
        if (this.tabs.getSelected()) { 

            if (this.httpConfig.clientType == '2') { 
                if (this.tabs.getSelected().index == 3) {
                    if (this.commonModel.TAB_INIT_USERINFO) {
                        return true;
                    } else { 
                        this.tabs.select(0)
                        return true;
                    }
                } else { 
                    return true;
                }
            }
            if (this.httpConfig.clientType == '1') { 
                if (this.tabs.getSelected().index == 3) {
                    if (this.commonModel.TAB_INIT_USERINFO) {
                        return true;
                    } else { 
                        this.tabs.select(0)
                        return true;
                    }
                } else { 
                    return true;
                }
            }
        }
    }
}
