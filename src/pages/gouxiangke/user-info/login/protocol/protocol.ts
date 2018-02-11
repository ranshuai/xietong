import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage } from 'ionic-angular';

/**
 * Generated class for the ProtocolPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  segment: 'protocol'
})
@Component({
  selector: 'protocol',
  templateUrl: 'protocol.html',
})
export class ProtocolPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProtocolPage');
  }

}
