import { Component } from '@angular/core';
import {NavController, NavParams,IonicPage,ViewController} from 'ionic-angular';

/**
 * Generated class for the ModalFromRightPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'sex-select-modal',
  templateUrl: 'sex-select-modal.html',
})
export class SexSelectModal {
  pageData;
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private viewCtrl:ViewController
  ) {
      this.pageData=this.navParams.get('list');

  }
    selected(item, index) {
      this.viewCtrl.dismiss({item,index})
  }
    closeModal() {
        this.viewCtrl.dismiss()
  }



}
