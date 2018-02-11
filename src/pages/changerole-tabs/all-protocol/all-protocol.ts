import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AllProtocolPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-protocol',
  templateUrl: 'all-protocol.html',
})
export class AllProtocolPage {
  applyRoleConfig = {
    1: '招商人',
    2: '物流人',
    3: '员工',
    4: '公司',
    5: '专家',
    58:'注册',
    59:'招商合伙人',
    60:'配送员'
  }

  conent:any;
  cardType:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.conent = this.navParams.get('data');
    this.cardType = this.navParams.get('cardType');
    console.log(this.cardType)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllProtocolPage');
  }

}
