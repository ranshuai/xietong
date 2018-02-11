import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the CofirmModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'cofirm-modal',
  templateUrl: 'cofirm-modal.html',
})
export class CofirmModal {
  paramData;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private callNumber: CallNumber,
    private viewCtrl:ViewController
  ) {
    this.paramData=this.navParams.get('data')
  }

  //关闭窗口
  closeModal() { 
    this.viewCtrl.dismiss();
  }

  callPhone(number) {
    this.viewCtrl.dismiss();
    this.callNumber.callNumber('4000608168', true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
   }

}
