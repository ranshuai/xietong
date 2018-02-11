import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Api } from '../../providers/api/api';
//
import { GoodsListBlockComponent } from '../../components/goods-list-block/goods-list-block';
import { CommonProvider } from "../../providers/common/common";
import { UserHomeTemplateProvider } from "../../providers/user/user-home-template";
import { UserInfoOrderPage } from "../../user-info/user-info-order/user-info-order";
import { UserInfoCollectionPage } from "../../user-info/user-info-collection/user-info-collection";
import { UserInfoCouponPage } from "../../user-info/user-info-coupon/user-info-coupon";

@Component({
  selector: 'page-user-home-home',
  templateUrl: 'user-home-home.html'
})
export class UserHomeHomePage {

  @ViewChild('leftList') leftList: GoodsListBlockComponent;
  @ViewChild('rightList') rightList: GoodsListBlockComponent;

  template: number;
  homeHomeData: any = {};
  userInfoCollection = UserInfoCollectionPage;
  userInfoCouponPage = UserInfoCouponPage;
  userInfoOrderPage = UserInfoOrderPage;
  advImgs = [];
  navImgs = [];
  adImg;
  //轮播图是否显示
  homeHomeDataAdvShow = false;
  //热门商品是否显示
  homeHomeDataHotGoodsShow = false;
  //店铺是否显示
  homeHomeDataShopsShow = false;
  //推荐商品
  homeHomeDataGoodsListShow = false;
  navData = {
    view: 'left',
    title: ['商品列表', '促销活动']
  };

  goodsListParams = {
    url: this.api.config.host.bl + 'goods/recommendlist',
    params: { type: 'is_recommend' },
    dataKey: 'data'
  };

  salesListParam = {
    url: this.api.config.host.bl + 'goods/list/groupsBuyPage',
    resultKey: 'goods',
    dataKey: 'data'
  };

  loading: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public common: CommonProvider,
    private userHomeTemplate: UserHomeTemplateProvider,
    private loadingCtrl: LoadingController,
  ) {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '获取中，请稍后...'
    });

    console.log('user-home-home')
  }

  getHomeHomeData(refresher?) {
    this.api.get(this.api.config.host.bl + 'v2/homePage/homeAdLoad', { pid: 1 }).subscribe((data: any) => { 
      if (data.success) { 
        this.homeHomeData.adv = data.result;
        this.homeHomeData.adv.length > 0 ? this.homeHomeDataAdvShow = true : this.homeHomeDataAdvShow = false;
      }
    })

    this.api.get( this.api.config.host.bl+ 'v2/homePage/homeHotGoodsList').subscribe((data: any) => { 
      if (data.success) { 
        this.homeHomeData.hot_goods = data.result || [];
        this.homeHomeData.hot_goods.length > 0 ? this.homeHomeDataHotGoodsShow = true : this.homeHomeDataHotGoodsShow = false;
      }
    })

    this.api.get( this.api.config.host.bl+ 'v2/homePage/homeHotStoreList').subscribe((data: any) => { 
      if (data.success) { 
        this.homeHomeData.shops = data.result||[] ;
        this.homeHomeData.shops.length > 0 ? this.homeHomeDataShopsShow = true : this.homeHomeDataShopsShow = false;
      }
    })

    this.api.get( this.api.config.host.bl+ 'v2/homePage/homeRecommendGoodsList').subscribe((data: any) => { 
      if (data.success) { 
        this.homeHomeData.bright_goods = data.result || [];
        this.homeHomeData.bright_goods.length > 0 ? this.homeHomeDataGoodsListShow = true : this.homeHomeDataGoodsListShow = false;
      }
    })
  }

  init(refresher?) {
    this.homeHomeData = {};
    this.template = 0;
    this.getHomeHomeData(refresher);
  }

  changeNav(view) {
    this.navData.view = view;
  }
  //初始化完组件视图及其子视图之后调用
  ngAfterViewInit() {
    setTimeout(_ => this.init());
  }

  goToGoodsListPage(type) {
    console.log(type);
    this.common.goToPage('GoodsListPage', { type: type });
  }

  goToSearchPage(value) {
    this.common.goToPage('SearchPage');
  }

  goToCategoryPage() {
    this.common.goToPage('UserCategoryPage');
  }

  goToHistoryOrderPage() {
    this.common.goToPage(this.userInfoOrderPage, { type: 'all' });
  }

  goToCollectPage() {
    this.common.goToPage(this.userInfoCollection);
  }

  goToUserInfoPage() {
    this.common.goToPage('UserInfoPage');
  }

  goToCouponPage() {
    this.common.goToPage(this.userInfoCouponPage);
  }

}
