import { HttpConfig } from './../../../../providers/HttpConfig';
import { MainCtrl } from './../../../../providers/MainCtrl';
import { CommonModel } from './../../../../providers/CommonModel';
import { Config } from './../../providers/api/config.model';
import { CommonData } from './../../providers/user/commonData.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ShoppingCart } from "../../providers/user/shopping-cart";
import { CommonProvider } from "../../providers/common/common";
import { GlobalDataProvider } from "../../providers/global-data/global-data.model";
/**
 * Generated class for the UserShopingCartDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-shopping-cart-detail',
  templateUrl: 'user-shopping-cart-detail.html',
})
export class UserShoppingCartDetailPage {
  shoppCartFlag:boolean;// 点击购物车图标进入 
  shoppingCartInfo: any;
  canClick: Boolean;
  view: string = 'selected';
  userSetMobilePage = 'UserSetMobilePage';

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private shoppingCart: ShoppingCart,
    private common: CommonProvider,
    private globalData: GlobalDataProvider,
    public events: Events,
    public commonData: CommonData,
    public config: Config,
    public commonModel: CommonModel,
    public mainCtrl: MainCtrl,
    public httpConfig:HttpConfig
  ) {

    this.shoppCartFlag = navParams.get('shoppCartFlag');

    //监听刷新事件
    events.subscribe('shoppingCart:refresh', () => {
      this.refresh();
    });
  }


  refresh() {

    if (this.shoppingCart.data) {
      this.shoppingCartInfo = this.shoppingCart.data;
      this.init();
    } else {
      this.shoppingCart.getShoppingCartInfo().subscribe(data => {
        this.shoppingCartInfo = data;
        if (data) {
          this.init();
        }
      });
    }
    console.log(this.shoppingCartInfo);
  }

  init() {
    //初始化选中状态
    let allSelected = true;//所有
    if (this.shoppingCartInfo) {
      let stores = this.shoppingCartInfo.stores;
      this.canClick = false;
      for (let i = 0; i < stores.length; i++) {
        let store = stores[i];
        let selected = true;//店铺所有
        for (var j = 0; j < store.goods.length; j++) {
          let goods = store.goods[j];
          if (!goods.selected) {
            selected = false;
            allSelected = false;
          } else {
            this.canClick = true; //可以点击下单按钮
          }
        }
        store.selected = selected;
      }
      this.shoppingCartInfo.selected = allSelected;
    }
  }

  checkAll() {
    // 选中所有
    let boolean = this.shoppingCartInfo[this.view] = !this.shoppingCartInfo[this.view];
    let stores = this.shoppingCartInfo.stores;
    let modifyCartVOs = [];
    for (let i = 0; i < stores.length; i++) {
      let store = stores[i];
      store[this.view] = boolean;
      for (var j = 0; j < store.goods.length; j++) {
        let goods = store.goods[j];
        if (!goods.onSale||goods.storeCount == 0) {
          goods[this.view] = false;
          this.shoppingCartInfo[this.view] = false;
          store[this.view] = false;
        } else { 
          goods[this.view] = boolean;
          modifyCartVOs.push({
            cartId: goods.id,
            goodsNum: goods.goodsNum,
            goodsSpec: goods.specKey,
            check: boolean
          });
        }
      }
    }
    if (boolean) {//底部按钮可用
      this.canClick = true;
    } else {//底部按钮不可用
      this.canClick = false;
    }
    if (this.view == 'selected') {
      
      this.shoppingCart.modifyBatch(modifyCartVOs).subscribe();
    }
  }

  //子组件有check事件
  clickCheck() {
    this.canClick = false;//底部按钮是否可以操作
    let allCheck = true; //是否全部选中
    let stores = this.shoppingCartInfo.stores;
    for (let i = 0; i < stores.length; i++) {
      let store = stores[i];
      for (var j = 0; j < store.goods.length; j++) {
        let goods = store.goods[j];
        if (!goods[this.view]) {
          //未全部选中
          allCheck = false;
        } else {
          //有选中的商品，底部按钮可以操作
          this.canClick = true;
        }
      }
    }
    //全部选中
    if (allCheck) {
      this.shoppingCartInfo[this.view] = true;
    } else {
      this.shoppingCartInfo[this.view] = false;
    }
  }

  changeView(view) {
    this.view = view;
    if (view == 'edit') {
      //重置标记
      this.shoppingCartInfo.edit = false;
      this.canClick=false;
      this.shoppingCartInfo.stores.forEach(store => {
        store.edit = false;
        store.goods.forEach(goods => {
          goods.edit = false;
        });
      });
    }else {
      //重置标记
      this.shoppingCartInfo.selected = false;
      this.canClick=false;
      this.shoppingCartInfo.stores.forEach(store => {
        store.selected = false;
        store.goods.forEach(goods => {
          goods.selected = false;
        });
      });
    }
  }

  delete() {
    if (!this.canClick) {
      return;
    }
    //确认弹窗
    this.common.comConfirm('确认要删除此商品吗？').subscribe(() => { 
      let cartIds = [];
      this.shoppingCartInfo.stores.forEach((store, index) => {
        store.goods.forEach((goods, index) => {
          if (goods.edit) {
            cartIds.push(goods.id);
          }
        });
      });
      this.shoppingCart.delete(cartIds).subscribe(data => {
        this.shoppingCartInfo = data;
        if (data == null) {
          this.view = 'selected';
          this.common.showToast('购物车已清空~');
          this.commonModel.shopCarNum = '';
        }
        this.init();
      });
    })
  }

  modifySpecs(tpSpecGoodsPrice) {
    let data = {
      cartId: tpSpecGoodsPrice.cartId,
      goodsSpec: tpSpecGoodsPrice.goodsSpec,
      goodsNum: tpSpecGoodsPrice.buyCount,
      check:tpSpecGoodsPrice.selected
    };
    this.shoppingCart.modify(data).subscribe(data => {
      this.shoppingCartInfo = data;
    });
  }

  //立即下单
  order() {
    if (!this.canClick) {
      return;
    }

    if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'STOREAPPWX') {
      if(!this.commonModel.TAB_INIT_USERINFO.mobile){
        this.common.count = true;
        this.common.openMobileModal().subscribe(() => {
          this.navCtrl.push(this.userSetMobilePage,{type:1})
        })
      } else {
        this.globalData.isNowBuy = false;
        this.shoppingCart.ready().subscribe(data => {
          this.navCtrl.push('OrderConfirmPage', { data: data });
        });
       }
      return 
     }
    if (this.config.PLATFORM == 'APP' ||this.config.PLATFORM == 'STOREAPP') {
      this.globalData.isNowBuy = false;
      this.shoppingCart.ready().subscribe(data => {
        this.navCtrl.push('OrderConfirmPage', { data: data })
      });
      return 
     }
  }

  ionViewDidEnter() {
    this.refresh();
  }

  /**
   * 回首页
   * */ 
  goToHome() { 
    if (this.httpConfig.clientType == '2') {
      this.navCtrl.parent.select(0);
    } else { 
      this.mainCtrl.setRootPage('TabMenuPage');
    }
  }

}
