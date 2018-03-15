import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the UserCustomerServicePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-customer-service',
  templateUrl: 'user-customer-service.html',
})
export class UserCustomerServicePage {

  orderData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.orderData = navParams.get('orderData')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserCustomerServicePage');
  }

  goToUserApplyCustomerServicePage(orderInfo: any) {
    //orderInfo.orderData 订单数据
    //orderInfo.status 订单状态 0.仅退款 1.退货退款 2.换货
    this.navCtrl.push('UserApplyCustomerServicePage', orderInfo);
  }

}
