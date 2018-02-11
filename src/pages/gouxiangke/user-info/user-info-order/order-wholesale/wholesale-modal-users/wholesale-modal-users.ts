import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CommonProvider } from '../../../../providers/common/common';
import {CommonData } from '../../../../providers/user/commonData.model';

/**
 * Generated class for the WholesaleModalUsersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-wholesale-modal-users',
  templateUrl: 'wholesale-modal-users.html',
})
export class WholesaleModalUsersPage {
  constructor(public navCtrl: NavController, public navParams: NavParams, public common: CommonProvider, public commonData: CommonData) {
    //如果这个wholesaleUser没有值 说明不是从列表页进来的
  // this.commonData.user_info_order.wholesaleUser
 this.commonData.user_info_order.wholesaleUser=this.commonData.user_info_order.wholesaleUser
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WholesaleModalUsersPage');
  }
 


}
