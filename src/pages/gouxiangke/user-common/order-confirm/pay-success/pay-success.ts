import { MainCtrl } from './../../../../../providers/MainCtrl';
import { Component } from '@angular/core';
import { NavController, NavParams,App,IonicPage } from 'ionic-angular';
import { CommonProvider } from "../../../providers/common/common";

/**
 * Generated class for the PaySuccessPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-pay-success',
  templateUrl: 'pay-success.html',
})
export class PaySuccessPage {

  userInfoOrderPage = 'UserInfoOrderPage';

  constructor(public navCtrl: NavController, public navParams: NavParams, private common: CommonProvider,private appCtrl:App,public mainCtrl:MainCtrl) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaySuccessPage');
  }

  goToUserPage() {
    this.mainCtrl.setRootPage('TabMenuPage');
    // this.appCtrl.getRootNav().popTo(this.appCtrl.getRootNav().getViews()[0]);
  }

  goToOrderPage() {
    this.navCtrl.push(this.userInfoOrderPage, { type: 'all' })
  }

}
