import { Component } from '@angular/core';
import { NavController, NavParams,App } from 'ionic-angular';
import { CommonProvider } from "../../../providers/common/common";
import { UserInfoOrderPage } from "../../../user-info/user-info-order/user-info-order";

/**
 * Generated class for the PaySuccessPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-pay-success',
  templateUrl: 'pay-success.html',
})
export class PaySuccessPage {

  userInfoOrderPage = UserInfoOrderPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, private common: CommonProvider,private appCtrl:App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaySuccessPage');
  }

  goToUserPage() {
    this.appCtrl.getRootNav().popTo(this.appCtrl.getRootNav().getViews()[0]);
  }

  goToOrderPage() {
    this.common.goToPage(this.userInfoOrderPage, { type: 'all' });
  }

}
