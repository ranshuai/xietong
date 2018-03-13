import { MainCtrl } from './../../../../providers/MainCtrl';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the UserServicePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-service',
  templateUrl: 'user-service.html',
})
export class UserServicePage {
  //接收订单信息
  orderInfo;

  constructor(public navCtrl: NavController, public navParams: NavParams,public mainCtrl:MainCtrl) {
    this.orderInfo = navParams.get('orderInfo');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserServicePage');
  }

  gotoCustomerService(index?) {  
    //需要显示订单的状态，
    console.log(index);
    let arr = [];
    arr.push(this.orderInfo.orderGoodsSimpleVOS[index]);
    this.orderInfo.orderGoodsSimpleVOS = arr;
    this.navCtrl.push('UserCustomerServicePage', {orderData:this.orderInfo});
  }




}
