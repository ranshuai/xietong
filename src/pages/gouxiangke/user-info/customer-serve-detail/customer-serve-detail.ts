import { MainCtrl } from './../../../../providers/MainCtrl';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CustomerServeDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-serve-detail',
  templateUrl: 'customer-serve-detail.html',
})
export class CustomerServeDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public mainCtrl:MainCtrl) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerServeDetailPage');
  }

}
