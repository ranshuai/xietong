import { CommonModel } from './../../../providers/CommonModel';
import { Config } from './../providers/api/config.model';
import { CommonData } from './../providers/user/commonData.model';
import { GlobalDataProvider } from './../providers/global-data/global-data.model';
import { UserHomeTemplateProvider } from './../providers/user/user-home-template';
import { CommonProvider } from './../providers/common/common';
import { Api } from './../providers/api/api';
import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import { GoodsListBlockComponent } from '../../gouxiangke/components/goods-list-block/goods-list-block';

// import { UserInfoCollectionPage } from "../user-info/user-info-collection/user-info-collection";
// import { UserInfoCouponPage } from "../user-info/user-info-coupon/user-info-coupon";
// import { UserInfoOrderPage } from "../user-info/user-info-order/user-info-order";
import { UserInfoPage } from "../user-info/user-info";
// import { UserSetMobilePage } from './../user-info/user-set/user-set-mobile/user-set-mobile';
/**
 * Generated class for the UserStoreHomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-store-home',
  templateUrl: 'user-store-home.html',
})
export class UserStoreHomePage {

  @ViewChild('leftList') leftList: GoodsListBlockComponent;
  @ViewChild('rightList') rightList: GoodsListBlockComponent;
  modal;
  template: number;
  advImgs = [];
  userInfoCollection = 'UserInfoCollectionPage';
  userInfoCouponPage = 'UserInfoCouponPage';
  userInfoOrderPage = 'UserInfoOrderPage';
  userInfoPage = UserInfoPage;
  userSetMobilePage = 'UserSetMobilePage';
  navImgs = [];
  adImg;
  hotGoodsList; //店铺模板为4时，用来放置数据的list
  navData = {
    view: 'left',
    title: ['商品列表', '促销活动']
  };

  goodsListParams = {
    url: this.api.config.host.bl + 'v2/homePage/selectStoreGoods',
    dataKey: 'data'
  };

  salesListParam = {
    url: this.api.config.host.bl + 'v2/homePage/selectStoreActiviGoods', //促销活动 专题
    dataKey: 'data'
  };

  loading: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public common: CommonProvider,
    private userHomeTemplate: UserHomeTemplateProvider,
    private globalData: GlobalDataProvider,
    public modalCtrl: ModalController,
    public commonData: CommonData,
    public config: Config,
    public commonModel:CommonModel
  ) {

  }
  init(refresher?) {
    this.userHomeTemplate.getHomeTemplate().subscribe(data => {
      if (this.config.PLATFORM == "STOREAPP") {
        //购享客店铺不能设置模版 默认是2
        this.template = data.result || 2;
        window.localStorage.setItem('getTemplate', data.result || 2)
      }
      if (this.config.PLATFORM == "STOREAPPWX") {
        this.template = data.result;
        window.localStorage.setItem('getTemplate', data.result)
      }
      
      setTimeout(_ => {
        this.leftList && this.leftList.init(refresher);
        this.rightList && this.rightList.init(refresher);
      }, 100);
      this.changeTabColor(this.template);
      if (this.template == 4) {
        this.getHotGoodsList();
      }
      if (this.config.PLATFORM == "STOREAPPWX") {
        this.api.get(this.api.config.host.bl + 'v2/CompanyInfo/get/index', {
          storeId: window.localStorage.storeId
      }).subscribe((data) => {
         if (data.success) {
           //this._selfTitle = data.result.storeIndexVO && data.result.storeIndexVO.companyName;
           document.title = data.result.storeIndexVO.companyName;
         }
      });
       }

    });
    this.userHomeTemplate.getHomeAd().subscribe(data => {
      let list = data.result;
      if (list.length > 0) {
        this.advImgs = [];
        this.navImgs = [];
        list.forEach(item => {
          if (item.pid == 4) {
            this.advImgs.push(item);
          }
          if (item.pid == 5) {
            this.navImgs.push(item);
          }
          if (item.pid == 6) {
            this.adImg = item.adCode;
          }
        });
        //判断没有banner的时候，载入默认的banner
        if (this.advImgs.length == 0) {
          if (this.template == 1) {
            this.advImgs = [{ adCode: '../../../assets/img/banner1.jpg' }];
          } else {
            this.advImgs = [{ adCode: '../../../assets/img/banner2.jpg' }];
          }
        }
      }
    });

    if (this.config.PLATFORM == "STOREAPPWX") {

      //给冉帅填坑,获取首页店铺的title信息
    this.api.get(this.api.config.host.bl + 'v2/CompanyInfo/get/index', {
            storeId: window.localStorage.storeId
        }).subscribe((data) => {
          console.log(data);
          if (data.success) {
            //this._selfTitle = data.result.storeIndexVO && data.result.storeIndexVO.companyName;
            document.title = data.result.storeIndexVO.companyName;
          }
        });
     }
  }

  ionViewDidEnter(){
    this.init();
  }

  //根据模板改变tab颜色
  changeTabColor(number) {
    switch (number) {
      case 1:
        this.globalData.tabColor = 1;
        break;
      case 2:
      case 3:
      case 4:
        this.globalData.tabColor = 2;
    }
  }
  //获取热门商品
  getHotGoodsList() {
    this.api.get(this.salesListParam.url).subscribe(data => {
      if (data.success) {
        this.hotGoodsList = data.result;
      }
    });
  }

  changeNav(view) {
    this.navData.view = view;
  }

  goToGoodsListPage(type) {
    this.common.goToPage('GoodsListPage', { type: type });
  }

  goToCategoryPage() {
    this.common.goToPage('TabMenuPage', { index: 1 }, { animate: false });
  }

  // 历史订单
  goToHistoryOrderPage() {
    if (this.config.PLATFORM == 'STOREAPP') {
      if (!this.commonModel.userId) {
        this.navCtrl.push('PublicLoginPage');
      } else {
      this.common.goToPage(this.userInfoOrderPage, { type: 'all' });
      }
    } 

    if (this.config.PLATFORM == 'STOREAPPWX') {
      if (!this.commonModel.TAB_INIT_USERINFO.mobile) {
        this.common.count = true;
        this.common.openMobileModal().subscribe(() => {
          this.common.goToPage(this.userSetMobilePage, { type: 1 });
        })
      } else {
        this.common.goToPage(this.userInfoOrderPage, { type: 'all' });
      }
    }  
  }

  // 我的收藏
  goToCollectPage() {
    if (this.config.PLATFORM == 'STOREAPP') {
      if (!this.commonModel.userId) {
        this.navCtrl.push('PublicLoginPage')
      } else {
        this.common.goToPage(this.userInfoCollection);
      }
    }
    if (this.config.PLATFORM == 'STOREAPPWX') {
      if (!this.commonModel.TAB_INIT_USERINFO.mobile) {
        this.common.count = true;
        this.common.openMobileModal().subscribe(() => {
          this.common.goToPage(this.userSetMobilePage, { type: 1 });
        })
      } else {
        this.common.goToPage(this.userInfoCollection);
      }
    }  
  }

  goToUserInfoPage() {
    this.common.goToPage('TabMenuPage', { index: 3 }, { animate: false });
  }

  // 优惠券
  goToCouponPage() {
    if (this.config.PLATFORM == 'STOREAPP') {
      if (!this.commonModel.userId) {
        this.navCtrl.push('PublicLoginPage')
      } else {
        this.common.goToPage(this.userInfoCouponPage);
      }
    }
    if (this.config.PLATFORM == 'STOREAPPWX') {
      if (!this.commonModel.TAB_INIT_USERINFO.mobile) {
        this.common.count = true;
        this.common.openMobileModal().subscribe(() => {
          this.common.goToPage(this.userSetMobilePage, { type: 1 });
        })
      } else {
        this.common.goToPage(this.userInfoCouponPage);
      }
    }  
  }
}
