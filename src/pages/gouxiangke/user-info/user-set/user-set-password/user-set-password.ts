import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserSetPasswordLoginPage } from './user-set-password-login/user-set-password-login';
import { CommonProvider } from '../../../providers/common/common';
import {Api } from '../../../providers/api/api';

/**
 * Generated class for the UserSetPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-set-password',
  templateUrl: 'user-set-password.html',
})
export class UserSetPasswordPage {
  userSetPasswordLoginPage = UserSetPasswordLoginPage;
  userSetPasswordPayPage = 'UserSetPasswordPayPage'; //设置密码 | 修改密码
  constructor(public navCtrl: NavController, public navParams: NavParams, public commonProvider: CommonProvider,public api:Api) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserSetPasswordPage');
  }

  goTopageSetPasswordLogin() {
    this.commonProvider.goToPage(this.userSetPasswordLoginPage);
  }

  goTopageSetPasswordPay() {
    this.commonProvider.goToPage(this.userSetPasswordPayPage);
  }


}
