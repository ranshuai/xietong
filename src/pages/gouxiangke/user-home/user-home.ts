import { UserCommon } from './../providers/user/user-common';
import { GlobalDataProvider } from './../providers/global-data/global-data.model';
import { Api } from './../providers/api/api';
import { Config } from './../providers/api/config.model';
import { Component, ViewChild } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
// import { UserHomeTopComponent } from './user-home-top/user-home-top';
import { UserHomeHomePage } from './user-home-home/user-home-home';
// import { UserHomeGroupPage } from './user-home-group/user-home-group';
import { UserHomeNearbyPage } from './user-home-nearby/user-home-nearby';
import { UserHomeHistoryPage } from './user-home-history/user-home-history';
import { UserHomeSharePage } from './user-home-share/user-home-share'
@IonicPage({
  segment: 'user_home'
})
@Component({
  selector: 'page-user-home',
  templateUrl: 'user-home.html'
})
export class UserHomePage {
   //知识共享是否显示
  getKnowledgeTab: boolean;
  @ViewChild(UserHomeHomePage) userhomePage: UserHomeHomePage;
  
  @ViewChild(Slides) slides: Slides;
  // @ViewChild(UserHomeTopComponent) userHomeTopComponent: UserHomeTopComponent;
  //商城首页
  userHomeHomePage = UserHomeHomePage;
  //商城拼团优惠
  // userHomeGroupPage = UserHomeGroupPage;
  //商城附近好货
  userHomeNearbyPage = UserHomeNearbyPage;
  //商城浏览历史
  userHomeHistoryPage = UserHomeHistoryPage;
  //商城知识共享
   userHomeShare = UserHomeSharePage;

  activeIndex: number = 0;
  view = 'home';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public config: Config,
    public api: Api,
    public globalDataProvider: GlobalDataProvider,
    public userCommon:UserCommon,public events:Events
  ) {
    this.events.subscribe('events:homePageRefresh', () => { 
      console.log('进入userHome');
      this.userhomePage.getHomeHomeData();
    })

          //清除店铺Id
          window.localStorage.removeItem('storeId');

      this.events.subscribe("enterSnsPage",()=>{
          console.log("购享客首页接收到菜单点击事件,即将进入snspage");
          if(this.navCtrl!=null){
          this.navCtrl.push("SnsPage");
          }
      });

    this.getKnowledgeTab = this.userCommon.getKnowledgeTab({ 'space': this.config.domain});
    console.log(window.localStorage.getItem('sacpe'))
    console.log(this.getKnowledgeTab)
  }
ionViewWillEnter(){
//    通知刷新消息角标
    this.events.publish("refreshBadge");
}
  changeNav(index) {
    // this.slides.slideTo(index);
    this.activeIndex = index;
    switch (index) {
      case 0:
        this.view = 'home';
        // this.navCtrl.push(this.userHomeHomePage);
        break;
      case 1:
        this.view = 'group';
        // this.navCtrl.push(this.userHomeGroupPage);
        break;
      case 2:
        this.view = 'nearby';
        // this.navCtrl.push(this.userHomeNearbyPage);
        break;
      case 3:
        this.view = 'history';
        // this.navCtrl.push(this.userHomeHistoryPage);
        break;
      case 4:
      this.view = 'share';
      // this.navCtrl.push(this.userHomeHistoryPage);
      break;
    }
  }

  changedNav() {
    this.activeIndex = this.slides.getActiveIndex();
    if (this.activeIndex >= 4) return;

    switch (this.activeIndex) {
      case 0:
        this.view = 'home';
        // this.navCtrl.push(this.userHomeHomePage);
        break;
      case 1:
        this.view = 'group';
        // this.navCtrl.push(this.userHomeGroupPage);
        break;
      case 2:
        this.view = 'nearby';
        // this.navCtrl.push(this.userHomeNearbyPage);
        break;
      case 3:
        this.view = 'history';
        // this.navCtrl.push(this.userHomeHistoryPage);
        break;
      case 4:
      this.view = 'share';
      // this.navCtrl.push(this.userHomeHistoryPage);
      break;
    }
    // this.slides.slideTo(activeIndex);
  }

  ionViewDidEnter() {
    this.userhomePage.getHomeHomeDataRefresher();
  }
}
