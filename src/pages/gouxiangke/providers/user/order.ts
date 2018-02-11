import { Injectable } from '@angular/core';
import { App, ToastController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Api } from '../../providers/api/api';

/*
  Generated class for the GoToPageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class OrderProvider {
  alertData;
  constructor(private appCtrl: App, private toastCtrl: ToastController, public api: Api,
    public alertCtrl: AlertController) { }

  /***订单统一方法 */
  // 获取订单详情
  getOrderDetail(orderId) {
    return new Observable((observer: Subscriber<any>) => {
      this.api.get( this.api.config.host.bl + 'order/detail/' + orderId).subscribe(data => {
        observer.next(data);
      });
    });
  }
  //取消订单
  cancelOrderPop(_item) {
    return new Observable((observer: Subscriber<any>) => {
      this.api.delete(this.api.config.host.bl + 'order/cancel/' + _item.orderId, {
        timestamp:_item.updateTime
      }).subscribe(data => {
        observer.next(data);
      });
    });
  }

  //确认收货
  confirm_receiptPopup(_item) {
    return new Observable((observer: Subscriber<any>) => {
      this.api.get(this.api.config.host.bl + 'order/confim/take/' + _item.orderId).subscribe(data => {
        observer.next(data);
      });
    });
  }

  //删除订单
  deleteOrderPop(_item) {
     return new Observable((observer: Subscriber<any>) => {
     this.api.delete(this.api.config.host.bl + 'order/remove/' + _item.orderId).subscribe(data => {
        observer.next(data);
      });
    });
  }


}
