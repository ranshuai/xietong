import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Slides,Events } from 'ionic-angular';
import { StoreOrderListComponent } from "./store-order-list/store-order-list";
import { GlobalDataProvider } from "../../gouxiangke/providers/global-data/global-data.model";

/**
 * Generated class for the StoreOrderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-order',
  templateUrl: 'store-order.html',
})
export class StoreOrderPage {
  @ViewChild(Slides) slides: Slides;
  @ViewChild('notPay') notPay: StoreOrderListComponent;
  @ViewChild('toSendGoods') toSendGoodsList: StoreOrderListComponent;
  @ViewChild('delivering') deliveringList: StoreOrderListComponent;
  @ViewChild('finish') finishList: StoreOrderListComponent;
  @ViewChild('aftersale') aftersaleList: StoreOrderListComponent;
  @ViewChild('cancel') cancelList: StoreOrderListComponent;

  view: string = 'notPay';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private globalData: GlobalDataProvider,
    private events:Events
  ) {
    this.events.subscribe('stor-order:init', () => {
      let active = this.view;
      if (active == 'notPay'||active=='toSendGoods') { 
        this.view = null;
        setTimeout(() => {
          this.view = active;
         }, 1)
      }
    });
  }

  ionViewDidLoad() {
    this.globalData.orderSn = null;
  }

  search(value) {
    this.globalData.orderSn = value;
    this[this.view + 'List'].refresh();
  }



}
