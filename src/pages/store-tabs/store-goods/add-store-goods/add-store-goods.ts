import { Number } from './../../../gouxiangke/pipes/number';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

/**
 * Generated class for the AddStoreGoodsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-store-goods',
  templateUrl: 'add-store-goods.html',
})
export class AddStoreGoodsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddStoreGoodsPage');
  }

  closeModal(num?: number) { 
    console.log(num);
      this.viewCtrl.dismiss(num);
  }


}
