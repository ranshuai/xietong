import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserInfoOrderSharePage } from '../user-info-order-share/user-info-order-share';
import { CommonProvider } from '../../../providers/common/common';
import { Api} from '../../../providers/api/api';

/**
 * Generated class for the UserInfoOrderEvasuccessPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-info-order-evasuccess',
  templateUrl: 'user-info-order-evasuccess.html',
})
export class UserInfoOrderEvasuccessPage {
  userInfoOrderSharePage = UserInfoOrderSharePage;
  constructor(public navCtrl: NavController, public navParams: NavParams,public common:CommonProvider,public api:Api) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserInfoOrderEvasuccessPage');
  }

  goBack() { 
     this.common.popToPage('UserInfoOrderPage');
    // this.navCtrl.popTo(this.navCtrl.getByIndex(1))
  }
  
  goToPage() { 
    this.common.goToPage(this.userInfoOrderSharePage);
  }

    /**视图离开 */
  ionViewWillLeave() {
  }
}
