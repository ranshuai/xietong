import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CommonProvider} from '../../../../providers/common/common';
import { OrderProvider } from '../../../../providers/user/order';
import {CommonData } from '../../../../providers/user/commonData.model';

/**
 * Generated class for the OrderAlertModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-alert-modal',
  templateUrl: 'order-alert-modal.html',
})
export class OrderAlertModalPage {
  state;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public common:CommonProvider,public orderApi:OrderProvider,public commonData:CommonData) {
    this.state = this.navParams.get('state');
  
  }

  //关闭窗口
  closeModal() { 
    this.common.closeModal();
  }
  //取消订单
  cancelOrder() { 
    this.orderApi.cancelOrderPop(this.commonData.user_info_order).subscribe(data => { 
        this.common.closeModal(data)
    })
  }

  //确认收货
  confirm_receipt() { 
    this.orderApi.confirm_receiptPopup(this.commonData.user_info_order).subscribe(data => { 
        this.common.closeModal(data)
    })
  }
  //删除订单
  deleteOrderPop() { 
      this.orderApi.deleteOrderPop(this.commonData.user_info_order).subscribe(data => { 
        this.common.closeModal(data)
    })
  }
}
