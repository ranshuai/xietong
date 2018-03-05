import { CommonModel } from './../../../../providers/CommonModel';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import {App,ModalController,NavController } from "ionic-angular";
import { RequestOptions, Headers } from '@angular/http';
import { Api } from "../../../gouxiangke/providers/api/api";
import { CommonProvider } from "../../../gouxiangke/providers/common/common";
import { StoreSendGoodsPage } from "../store-send-goods/store-send-goods";
import { StoreOrderPricePage } from "../store-order-price/store-order-price";
import { StoreOrderCancelPage } from '../store-order-cancel/store-order-cancel';

/**
 * Generated class for the StoreOrderBlockComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'store-order-block',
  templateUrl: 'store-order-block.html'
})
export class StoreOrderBlockComponent {

  storeSendGoodsPage = StoreSendGoodsPage;
  orderLogisticsInfoPage = 'OrderLogisticsInfoPage';
  storeOrderPricePage = StoreOrderPricePage;
  storeOrderCancelPage=StoreOrderCancelPage
  @Input() data;
  @Input() view;
  @Output() refreshEmit = new EventEmitter();

  constructor(
    private appCtrl: App,
    private api: Api,
    public navCtrl: NavController,
    private common: CommonProvider,
    private modalCtrl: ModalController,
    public commonModel:CommonModel
    
  ) {

    console.log(this.commonModel.APP_INIT['getAppconfig'].data);
  }

  takeOrder() {
    this.common.storeConfirm('确认接单吗?').subscribe(_ => {
      this.api.put(this.api.config.host.bl + 'admin/order/update/status?orderId=' + this.data.orderId).subscribe(data => {
        if (data.success) {
          this.common.showToast('接单成功，请发货~');
          this.refreshEmit.emit();
        }
      });
    });
  }

  sendOrder() {
    let modal = this.modalCtrl.create(this.storeSendGoodsPage, { order: this.data });
    modal.present({ animate: false });
    modal.onDidDismiss(data => {
      if (data) {
        this.refreshEmit.emit();
      }
    });
  }

  viewLogistics() {
    this.common.openChangeModal(this.orderLogisticsInfoPage, false, { orderId: this.data.orderId }).subscribe();
  }

  returnMoney() {
    this.common.storeConfirm('确认退款吗?').subscribe(_ => {
      let options = new RequestOptions({
        headers: new Headers({
          goodsId: this.data.orderGoods[0].goodsId,
          orderId: this.data.orderId
        })
      });
      this.api.post(this.api.config.host.bl + 'admin/order/returnMoney', null, options).subscribe(data => {
        if (data.success) {
          this.common.showToast('退款成功~');
          this.refreshEmit.emit();
        }
      });
    });
  }

  goOderPricePageCancel(item) { 
    this.appCtrl.getRootNav().push(this.storeOrderCancelPage,
      {
        orderId:item.orderId,
        updateTime:item.updateTime
      }
    )
  }
  goOderPricePage(item) {
    console.log(item.orderId)
    this.appCtrl.getRootNav().push(this.storeOrderPricePage, {
      orderId:item.orderId,
    })
  }

    
  viewSign() { 
    console.log(this.data);
    this.api.get(this.api.config.host.bl + 'platformset/selectConfigInfo', {
      nameStr : 'is_allow'
    }).subscribe(data => { 
      if (data.result && data.result.is_allow == '1') {
        this.common.storeConfirm('是否确认签收？').subscribe(data => { 
          this.api.get(this.api.config.host.bl + 'order/confim/take/' + this.data.orderId).subscribe(data => {
            if (data.success) {
              this.refreshEmit.emit();
            } else { 
              this.common.showToast(data.msg || "提示信息")
            }
          });
        })
      } else { 
        this.common.showToast('您无权确认该订单签收！')
      }
    }) 

  }

}
