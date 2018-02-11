import { CommonProvider } from './../gouxiangke/providers/common/common';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs,Events } from 'ionic-angular';

import { StoreOrderPage } from "./store-order/store-order";
import { StoreGoodsPage } from "./store-goods/store-goods";
import { StoreClientPage } from "./store-client/store-client";
import { StoreInfoPage } from "./store-info/store-info";

/**
 * Generated class for the StorePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage({
  segment: 'store'
})
@Component({
  selector: 'page-store',
  templateUrl: 'store.html',
})
export class StorePage {

  storeOrderPage = StoreOrderPage;
  storeGoodsPage = StoreGoodsPage;
  storeClientPage = StoreClientPage;
  storeInfoPage = StoreInfoPage;

  pageIndex = 0;

  @ViewChild('storeTab') tabs: Tabs;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public commonProvider: CommonProvider,
    private events:Events
  ) {
    this.pageIndex = this.navParams.get('pageIndex');
  }

  ionViewDidEnter() {
    //修正tabs页面
    if (this.pageIndex) {
      this.tabs.select(this.pageIndex);
    //同步独角鲸APP代码
    }
    if (this.tabs.getSelected()) { 
      if (this.tabs.getSelected().index == 0) { 
        this.events.publish('stor-order:init');
      }
    }

  }

}
