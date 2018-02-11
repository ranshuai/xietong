import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController } from 'ionic-angular';
import { MainCtrl } from '../../../../providers/MainCtrl';
/**
 * Generated class for the ApplyLogisticsFailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-apply-logistics-fail',
  templateUrl: 'apply-logistics-fail.html',
})
export class ApplyLogisticsFailPage {
  cardType: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private mainCtrl:MainCtrl) {
    this.cardType = navParams.get('cardType');
    console.log(this.cardType)
  }

  goToCard() { 
    //返回员工选择加入店铺的列表页
    if (this.cardType == 3) { 
      this.navCtrl.push('SelectCompanyPage');
      return;
    }
    //返回招商人申请页面
    if (this.cardType == 1) { 
      this.navCtrl.push('ApplyLogisticsRolePage',{cardType:1})
      return 
    }
    this.mainCtrl.setRootPage('TabMenuPage');
  }

  //返回到根页面
  goToRoot(){
    this.mainCtrl.setRootPage('TabMenuPage');
  }
}
