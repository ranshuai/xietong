import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
/**
 * Generated class for the AlertConfirmModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alert-confirm-modal',
  templateUrl: 'alert-confirm-modal.html',
})
export class AlertConfirmModalPage {
  pageData;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl:ViewController) {
    this.pageData = this.navParams.data;
  }

  //确认
  subMit() { 
    this.viewCtrl.dismiss({sub:true});
  }
   //关闭窗口
  closeModal() { 
    this.viewCtrl.dismiss();
  }


}
