import { MainCtrl } from './../../../../../providers/MainCtrl';
import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage,App } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common';
import { Api} from '../../../providers/api/api';
/**
 * Generated class for the UserInfoOrderEvasuccessPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-info-order-evasuccess',
  templateUrl: 'user-info-order-evasuccess.html',
})
export class UserInfoOrderEvasuccessPage {
  userInfoOrderSharePage = 'UserInfoOrderSharePage';//圈子
  constructor(public navCtrl: NavController, public navParams: NavParams,public common:CommonProvider,public api:Api,public mainCtrl:MainCtrl,public app:App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserInfoOrderEvasuccessPage');
  }

  goBack() { 
    setTimeout(() => {
     this.mainCtrl.setRootPage('TabMenuPage');
    }, 300);
  }
  
  goToPage() { 
    this.navCtrl.push(this.userInfoOrderSharePage)
  }

    /**视图离开 */
  ionViewWillLeave() {
  }
}
