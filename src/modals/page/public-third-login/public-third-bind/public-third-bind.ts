import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PublicThirdBindPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-public-third-bind',
  templateUrl: 'public-third-bind.html',
})
export class PublicThirdBindPage {
  source: any;//第三方登录

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.source = this.navParams.get('source');
    console.log(this.source);
  }

  //跳转到绑定手机
  binding(type) {
    this.navCtrl.push('PublicThirdMobilePage', { type: type,source: this.source });
  }
}
